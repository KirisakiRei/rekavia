import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// ─── Pakasir method yang didukung ────────────────────────────────────────────
export const PAKASIR_METHODS = [
  'qris',
  'bni_va',
  'bri_va',
  'cimb_niaga_va',
  'sampoerna_va',
  'bnc_va',
  'maybank_va',
  'permata_va',
  'atm_bersama_va',
  'artha_graha_va',
] as const;

export type PakasirMethod = (typeof PAKASIR_METHODS)[number];

export function isPakasirMethod(value: unknown): value is PakasirMethod {
  return PAKASIR_METHODS.includes(value as PakasirMethod);
}

// ─── Response types ───────────────────────────────────────────────────────────
export type PakasirCreateResponse = {
  payment: {
    project: string;
    order_id: string;
    amount: number;
    fee: number;
    total_payment: number;
    payment_method: string;
    payment_number: string;
    expired_at: string;
  };
};

export type PakasirTransactionDetail = {
  transaction: {
    amount: number;
    order_id: string;
    project: string;
    status: 'pending' | 'completed' | 'failed' | 'expired';
    payment_method: string;
    completed_at: string | null;
  };
};

export type PakasirWebhookPayload = {
  amount: number;
  order_id: string;
  project: string;
  status: string;
  payment_method: string;
  completed_at: string;
};

// ─── Hasil create payment yang dinormalisasi ──────────────────────────────────
export type PakasirPaymentResult = {
  paymentNumber: string;
  paymentMethod: string;
  amount: number;
  fee: number;
  totalPayment: number;
  expiredAt: string;
  isMock: boolean;
};

@Injectable()
export class PakasirService {
  private readonly logger = new Logger(PakasirService.name);
  private readonly baseUrl = 'https://app.pakasir.com/api';

  constructor(private readonly config: ConfigService) {}

  private get apiKey(): string {
    return this.config.get<string>('PAKASIR_API_KEY') ?? '';
  }

  private get project(): string {
    return this.config.get<string>('PAKASIR_PROJECT_SLUG') ?? '';
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey && this.project);
  }

  // ─── Create Transaction ─────────────────────────────────────────────────────
  async createTransaction(
    method: PakasirMethod,
    orderId: string,
    amount: number,
  ): Promise<PakasirPaymentResult> {
    if (!this.isConfigured) {
      this.logger.warn(
        'PAKASIR_API_KEY atau PAKASIR_PROJECT_SLUG belum dikonfigurasi. Menggunakan mock payment.',
      );
      return this.buildMockResult(method, amount);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/transactioncreate/${method}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project: this.project,
            order_id: orderId,
            amount,
            api_key: this.apiKey,
          }),
        },
      );

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        this.logger.error(
          `Pakasir API error ${response.status}: ${text}`,
          undefined,
          'PakasirService.createTransaction',
        );
        throw new Error(`Pakasir API error: ${response.status}`);
      }

      const data = (await response.json()) as PakasirCreateResponse;
      const p = data.payment;

      return {
        paymentNumber: p.payment_number,
        paymentMethod: p.payment_method,
        amount: p.amount,
        fee: p.fee,
        totalPayment: p.total_payment,
        expiredAt: p.expired_at,
        isMock: false,
      };
    } catch (error) {
      this.logger.error(
        `Gagal menghubungi Pakasir: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        'PakasirService.createTransaction',
      );
      throw error;
    }
  }

  // ─── Get Transaction Detail ─────────────────────────────────────────────────
  async getTransactionDetail(
    orderId: string,
    amount: number,
  ): Promise<PakasirTransactionDetail['transaction'] | null> {
    if (!this.isConfigured) return null;

    try {
      const params = new URLSearchParams({
        project: this.project,
        amount: String(amount),
        order_id: orderId,
        api_key: this.apiKey,
      });

      const response = await fetch(
        `${this.baseUrl}/transactiondetail?${params.toString()}`,
      );

      if (!response.ok) return null;

      const data = (await response.json()) as PakasirTransactionDetail;
      return data.transaction ?? null;
    } catch {
      return null;
    }
  }

  // ─── Cancel Transaction ─────────────────────────────────────────────────────
  async cancelTransaction(orderId: string, amount: number): Promise<boolean> {
    if (!this.isConfigured) return false;

    try {
      const response = await fetch(`${this.baseUrl}/transactioncancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: this.project,
          order_id: orderId,
          amount,
          api_key: this.apiKey,
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  // ─── Verify Webhook ─────────────────────────────────────────────────────────
  /**
   * Verifikasi webhook dari Pakasir.
   * Pakasir tidak menggunakan signature — verifikasi dilakukan dengan
   * mengecek project slug dan mengkonfirmasi ke Transaction Detail API.
   */
  async verifyWebhook(
    payload: PakasirWebhookPayload,
  ): Promise<{ valid: boolean; reason?: string }> {
    // Cek project slug
    if (this.isConfigured && payload.project !== this.project) {
      return { valid: false, reason: 'Project slug tidak cocok' };
    }

    // Cek status
    if (payload.status !== 'completed') {
      return { valid: false, reason: `Status bukan completed: ${payload.status}` };
    }

    // Konfirmasi ke Pakasir API untuk validasi lebih kuat
    if (this.isConfigured) {
      const detail = await this.getTransactionDetail(
        payload.order_id,
        payload.amount,
      );

      if (!detail) {
        // Jika tidak bisa konfirmasi, tetap proses tapi log warning
        this.logger.warn(
          `Tidak bisa konfirmasi webhook ke Pakasir API untuk order ${payload.order_id}`,
          'PakasirService.verifyWebhook',
        );
        return { valid: true };
      }

      if (detail.status !== 'completed') {
        return {
          valid: false,
          reason: `Status di Pakasir API: ${detail.status}`,
        };
      }

      if (detail.amount !== payload.amount) {
        return {
          valid: false,
          reason: `Amount tidak cocok: webhook=${payload.amount}, api=${detail.amount}`,
        };
      }
    }

    return { valid: true };
  }

  // ─── Mock (fallback jika tidak ada API key) ──────────────────────────────────
  private buildMockResult(method: PakasirMethod, amount: number): PakasirPaymentResult {
    const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    if (method === 'qris') {
      return {
        paymentNumber: `00020101021226610016ID.CO.PAKASIR.MOCK0215MOCK${Date.now()}0303UME51440014ID.CO.QRIS.WWW0215ID10243228429300303UME5204792953033605409${amount}5802ID5907Pakasir6012KAB. KEBUMEN61055439262230519MOCK${Date.now()}6304ABCD`,
        paymentMethod: method,
        amount,
        fee: 0,
        totalPayment: amount,
        expiredAt,
        isMock: true,
      };
    }

    const vaPrefixes: Record<string, string> = {
      bni_va: '9888',
      bri_va: '7777',
      cimb_niaga_va: '8001',
      sampoerna_va: '8002',
      bnc_va: '8003',
      maybank_va: '8004',
      permata_va: '8005',
      atm_bersama_va: '8006',
      artha_graha_va: '8007',
    };

    return {
      paymentNumber: `${vaPrefixes[method] ?? '9999'}${Date.now().toString().slice(-10)}`,
      paymentMethod: method,
      amount,
      fee: 0,
      totalPayment: amount,
      expiredAt,
      isMock: true,
    };
  }

  // ─── Build instructions per method ──────────────────────────────────────────
  static buildInstructions(method: PakasirMethod): string[] {
    if (method === 'qris') {
      return [
        'Buka aplikasi mobile banking atau e-wallet yang mendukung QRIS.',
        'Pilih menu Scan QR atau bayar dengan QRIS.',
        'Scan kode QR yang ditampilkan atau salin QR string.',
        'Pastikan nominal pembayaran sesuai sebelum konfirmasi.',
        'Pembayaran akan dikonfirmasi otomatis dalam beberapa detik.',
      ];
    }

    const bankNames: Record<string, string> = {
      bni_va: 'BNI',
      bri_va: 'BRI',
      cimb_niaga_va: 'CIMB Niaga',
      sampoerna_va: 'Bank Sampoerna',
      bnc_va: 'BNC',
      maybank_va: 'Maybank',
      permata_va: 'Bank Permata',
      atm_bersama_va: 'ATM Bersama',
      artha_graha_va: 'Bank Artha Graha',
    };

    const bankName = bankNames[method] ?? 'Bank';

    return [
      `Buka aplikasi mobile banking ${bankName} atau kunjungi ATM terdekat.`,
      'Pilih menu Transfer atau Pembayaran → Virtual Account.',
      'Masukkan nomor Virtual Account yang tertera.',
      'Pastikan nama merchant dan nominal sesuai sebelum konfirmasi.',
      'Simpan bukti pembayaran sebagai referensi.',
    ];
  }
}
