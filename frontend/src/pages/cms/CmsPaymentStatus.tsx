import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Copy, CreditCard, ExternalLink, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { CmsLayout } from '@/components/layout/CmsLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ErrorNotice } from '@/components/feedback/ErrorNotice'
import { CMS_SIDEBAR_LINKS, formatRupiah } from '@/lib/constants'
import { paymentDetail, paymentMockComplete } from '@/lib/api'
import type { SapatamuPaymentDetail } from '@/types/sapatamu'
import { cn } from '@/lib/utils'

// Polling interval: 5 detik saat pending, berhenti saat paid/expired/failed
const POLL_INTERVAL_MS = 5000
// Maksimum polling: 24 menit (288 kali × 5 detik)
const MAX_POLL_COUNT = 288

function formatCountdown(expiredAt: string | null) {
  if (!expiredAt) return '--:--:--'
  const diff = new Date(expiredAt).getTime() - Date.now()
  if (diff <= 0) return '00:00:00'
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function isTerminalStatus(detail: SapatamuPaymentDetail | null): boolean {
  if (!detail) return false
  const paymentStatus = detail.payment?.status
  const orderStatus = (detail as any).orderStatus
  return (
    paymentStatus === 'paid' ||
    paymentStatus === 'failed' ||
    paymentStatus === 'refunded' ||
    orderStatus === 'paid' ||
    orderStatus === 'expired' ||
    orderStatus === 'failed' ||
    orderStatus === 'cancelled' ||
    (detail as any).isExpired === true
  )
}

const IS_DEV = import.meta.env.DEV

export function CmsPaymentStatus() {
  const navigate = useNavigate()
  const { orderId = '' } = useParams<{ orderId: string }>()
  const [detail, setDetail] = useState<SapatamuPaymentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(Date.now())
  const [copied, setCopied] = useState(false)
  const pollCountRef = useRef(0)
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Fetch payment detail ──────────────────────────────────────────────────
  const fetchDetail = async (showLoading = false) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const response = await paymentDetail<SapatamuPaymentDetail>(orderId)
      const data = response.data ?? null
      setDetail(data)
      return data
    } catch {
      setError('Status pembayaran belum bisa dimuat.')
      return null
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    void fetchDetail(true)
  }, [orderId])

  // ── Polling — berhenti saat terminal state ────────────────────────────────
  useEffect(() => {
    if (isTerminalStatus(detail)) {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
      return
    }

    if (pollCountRef.current >= MAX_POLL_COUNT) return

    pollTimerRef.current = setTimeout(async () => {
      pollCountRef.current += 1
      await fetchDetail(false)
    }, POLL_INTERVAL_MS)

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
    }
  }, [detail, orderId])

  // ── Countdown ticker ──────────────────────────────────────────────────────
  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const countdown = useMemo(
    () => formatCountdown(detail?.payment?.expiredAt ?? null),
    [detail?.payment?.expiredAt, tick],
  )

  const isPaid = detail?.payment?.status === 'paid'
  const isExpired =
    (detail as any)?.isExpired === true ||
    (detail as any)?.orderStatus === 'expired' ||
    countdown === '00:00:00'
  const isFailed =
    detail?.payment?.status === 'failed' ||
    (detail as any)?.orderStatus === 'failed' ||
    (detail as any)?.orderStatus === 'cancelled'
  const isMock = (detail?.payment as any)?.isMock === true

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Payment method labels ─────────────────────────────────────────────────
  const methodLabels: Record<string, string> = {
    qris: 'QRIS',
    bni_va: 'BNI Virtual Account',
    bri_va: 'BRI Virtual Account',
    mandiri_va: 'Mandiri Virtual Account',
    bca_va: 'BCA Virtual Account',
    bsi_va: 'BSI Virtual Account',
  }
  const methodLabel = methodLabels[detail?.payment?.method ?? ''] ?? detail?.payment?.method?.toUpperCase() ?? 'PAYMENT'

  return (
    <CmsLayout
      sidebarLinks={CMS_SIDEBAR_LINKS.general}
      title="Status Pembayaran"
      subtitle="Pantau dan kelola pembayaran Anda"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <Button
          variant="ghost"
          className="px-0 text-muted-foreground hover:bg-transparent"
          onClick={() => navigate('/cms/langganan')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Langganan
        </Button>

        {error && <ErrorNotice message={error} />}

        {isLoading ? (
          <div className="rounded-[1.6rem] border border-border bg-card p-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Memuat status pembayaran...
          </div>
        ) : detail ? (
          <div className="space-y-6">
            {/* ── Hero Status Card ──────────────────────────────────────── */}
            <div
              className={cn(
                'rounded-[2rem] border p-8 lg:p-10 relative overflow-hidden',
                isPaid && 'border-success/30 bg-gradient-to-br from-success/5 to-success/10',
                isExpired && 'border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10',
                isFailed && 'border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10',
                !isPaid && !isExpired && !isFailed && 'border-warning/30 bg-gradient-to-br from-warning/5 to-warning/10',
              )}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl -z-10" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {isPaid && <CheckCircle2 className="w-12 h-12 text-success" />}
                    {isExpired && <Clock className="w-12 h-12 text-destructive" />}
                    {isFailed && <XCircle className="w-12 h-12 text-destructive" />}
                    {!isPaid && !isExpired && !isFailed && <Clock className="w-12 h-12 text-warning animate-pulse" />}
                    <div>
                      <p className="text-sm text-muted-foreground">Status Pembayaran</p>
                      <h1 className="text-3xl lg:text-4xl font-bold text-foreground mt-1">
                        {isPaid && 'Pembayaran Berhasil'}
                        {isExpired && 'Pembayaran Kedaluwarsa'}
                        {isFailed && 'Pembayaran Gagal'}
                        {!isPaid && !isExpired && !isFailed && 'Menunggu Pembayaran'}
                      </h1>
                    </div>
                  </div>
                  
                  <p className="text-base text-muted-foreground max-w-2xl">
                    {isPaid && 'Pembayaran Anda telah berhasil diproses. Undangan sudah aktif dan siap dikelola.'}
                    {isExpired && 'Waktu pembayaran telah habis. Silakan buat pesanan baru untuk melanjutkan.'}
                    {isFailed && 'Pembayaran tidak berhasil diproses. Silakan coba lagi dengan metode pembayaran lain.'}
                    {!isPaid && !isExpired && !isFailed && 'Selesaikan pembayaran Anda sebelum waktu habis untuk mengaktifkan undangan.'}
                  </p>

                  <div className="flex items-center gap-4 mt-6 flex-wrap">
                    <Badge variant="outline" className="text-xs px-3 py-1">
                      <CreditCard className="w-3 h-3 mr-1.5" />
                      {methodLabel}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Invoice: <span className="font-mono text-foreground">{detail.orderId.slice(0, 12)}...</span>
                    </div>
                  </div>
                </div>

                {/* Amount & Countdown */}
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl bg-background/80 backdrop-blur border border-border p-6 text-center min-w-[200px]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Total Pembayaran
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {formatRupiah(detail.payment?.total ?? detail.amount)}
                    </p>
                  </div>

                  {!isPaid && !isExpired && !isFailed && (
                    <div className="rounded-2xl bg-warning/10 backdrop-blur border border-warning/30 p-6 text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-warning mb-2">
                        Sisa Waktu
                      </p>
                      <p className="text-2xl font-mono font-bold text-warning">
                        {countdown}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Polling indicator */}
              {!isTerminalStatus(detail) && (
                <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border/50 text-xs text-muted-foreground">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Status diperbarui otomatis setiap {POLL_INTERVAL_MS / 1000} detik
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
              {/* ── Left Column: Payment Details ────────────────────────── */}
              <div className="space-y-6">
                {/* Package Info */}
                <div className="rounded-[1.6rem] border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Detail Paket</h3>
                  <div className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-foreground">{detail.package.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">Kode: {detail.package.code}</p>
                        {detail.voucherCode && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              Voucher: {detail.voucherCode}
                            </Badge>
                            <span className="text-xs text-success">-{formatRupiah(detail.discountAmount ?? 0)}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-lg font-bold text-foreground">{formatRupiah(detail.originalAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                {detail.payment?.paymentNumber && !isPaid && !isExpired && !isFailed && (
                  <div className="rounded-[1.6rem] border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      {detail.payment.method === 'qris' ? 'Kode QRIS' : 'Nomor Virtual Account'}
                    </h3>
                    
                    <div className="rounded-xl bg-muted/50 p-4 relative group">
                      <p className="text-sm font-mono text-foreground break-all pr-10">
                        {detail.payment.paymentNumber}
                      </p>
                      <button
                        onClick={() => copyToClipboard(detail.payment?.paymentNumber ?? '')}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-background hover:bg-accent/10 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                      {copied && (
                        <div className="absolute -top-8 right-4 bg-foreground text-background text-xs px-2 py-1 rounded">
                          Tersalin!
                        </div>
                      )}
                    </div>

                    {detail.payment.instructions && detail.payment.instructions.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <p className="text-sm font-semibold text-foreground">Cara Pembayaran:</p>
                        <ol className="space-y-2">
                          {detail.payment.instructions.map((instruction, index) => (
                            <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-semibold shrink-0">
                                {index + 1}
                              </span>
                              <span className="flex-1">{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                {/* Error/Warning Messages */}
                {(isExpired || isFailed) && (
                  <div className="rounded-[1.6rem] border border-destructive/30 bg-destructive/5 p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-destructive mb-2">
                          {isExpired ? 'Pembayaran Kedaluwarsa' : 'Pembayaran Gagal'}
                        </p>
                        <p className="text-sm text-destructive/80">
                          {isExpired
                            ? 'Waktu pembayaran telah habis. Kembali ke halaman checkout untuk membuat pesanan baru dengan metode pembayaran yang sama atau berbeda.'
                            : 'Pembayaran tidak berhasil diproses oleh sistem. Silakan coba lagi dengan metode pembayaran lain atau hubungi customer support jika masalah berlanjut.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right Column: Actions ───────────────────────────────── */}
              <div className="space-y-4">
                <div className="rounded-[1.6rem] border border-border bg-card p-6 space-y-3 sticky top-6">
                  <h3 className="text-base font-semibold text-foreground">Aksi Cepat</h3>

                  {isPaid && (
                    <>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => navigate(`/cms/sapatamu/${detail.invitationId}/editor`)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Buka Editor
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/cms/sapatamu/${detail.invitationId}/send`)}
                      >
                        Kelola Undangan
                      </Button>
                    </>
                  )}

                  {(isExpired || isFailed) && (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => navigate(`/cms/sapatamu/${detail.invitationId}/cart`)}
                    >
                      Coba Lagi
                    </Button>
                  )}

                  {!isPaid && !isExpired && !isFailed && (
                    <>
                      <Button
                        className="w-full"
                        size="lg"
                        variant="outline"
                        onClick={() => void fetchDetail(false)}
                        disabled={isSubmitting}
                      >
                        <RefreshCw className={cn('w-4 h-4 mr-2', isSubmitting && 'animate-spin')} />
                        Refresh Status
                      </Button>

                      {/* Mock complete — hanya tampil di development */}
                      {IS_DEV && isMock && (
                        <Button
                          className="w-full"
                          variant="secondary"
                          disabled={isSubmitting}
                          onClick={() => {
                            setIsSubmitting(true)
                            void paymentMockComplete<SapatamuPaymentDetail>(orderId)
                              .then((response) => setDetail(response.data ?? null))
                              .catch(() => setError('Pembayaran mock belum bisa diselesaikan.'))
                              .finally(() => setIsSubmitting(false))
                          }}
                        >
                          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          [DEV] Simulasi Berhasil
                        </Button>
                      )}
                    </>
                  )}

                  <div className="pt-3 border-t border-border">
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground"
                      onClick={() => navigate('/cms')}
                    >
                      Kembali ke Dashboard
                    </Button>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="rounded-[1.6rem] border border-border bg-card p-6 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Informasi Pembayaran</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Metode</span>
                      <span className="text-foreground font-medium">{methodLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          isPaid && 'border-success text-success',
                          isExpired && 'border-destructive text-destructive',
                          isFailed && 'border-destructive text-destructive',
                          !isPaid && !isExpired && !isFailed && 'border-warning text-warning',
                        )}
                      >
                        {isPaid && 'Berhasil'}
                        {isExpired && 'Kedaluwarsa'}
                        {isFailed && 'Gagal'}
                        {!isPaid && !isExpired && !isFailed && 'Pending'}
                      </Badge>
                    </div>
                    {isPaid && detail.payment?.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dibayar</span>
                        <span className="text-foreground text-xs">
                          {new Date(detail.payment.paidAt).toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </CmsLayout>
  )
}
