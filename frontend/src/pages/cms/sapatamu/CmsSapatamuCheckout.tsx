import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, Landmark, Loader2, TicketPercent } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { CmsLayout } from '@/components/layout/CmsLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ErrorNotice } from '@/components/feedback/ErrorNotice'
import { CMS_SIDEBAR_LINKS, formatRupiah } from '@/lib/constants'
import { sapatamuApplyVoucher, sapatamuCreatePayment, sapatamuGetCart } from '@/lib/api'
import type { SapatamuCartData } from '@/types/sapatamu'

const PAYMENT_METHODS = [
  { id: 'qris', label: 'QRIS', description: 'Scan QR dari aplikasi pembayaran pilihan Anda.', logo: '/payment-logos/QRIS LOGO.png' },
  { id: 'bni_va', label: 'BNI Virtual Account', description: 'Transfer ke nomor virtual account BNI.', logo: '/payment-logos/BNI LOGO.png' },
  { id: 'bri_va', label: 'BRI Virtual Account', description: 'Transfer ke nomor virtual account BRI.', logo: '/payment-logos/BRI LOGO.png' },
  { id: 'cimb_niaga_va', label: 'CIMB Niaga Virtual Account', description: 'Transfer ke nomor virtual account CIMB Niaga.' },
  { id: 'sampoerna_va', label: 'Bank Sampoerna Virtual Account', description: 'Transfer ke nomor virtual account Bank Sampoerna.' },
  { id: 'bnc_va', label: 'BNC Virtual Account', description: 'Transfer ke nomor virtual account BNC.' },
  { id: 'maybank_va', label: 'Maybank Virtual Account', description: 'Transfer ke nomor virtual account Maybank.' },
  { id: 'permata_va', label: 'Permata Virtual Account', description: 'Transfer ke nomor virtual account Permata.' },
  { id: 'atm_bersama_va', label: 'ATM Bersama Virtual Account', description: 'Transfer via jaringan ATM Bersama.' },
  { id: 'artha_graha_va', label: 'Artha Graha Virtual Account', description: 'Transfer ke nomor virtual account Artha Graha.' },
] as const

export function CmsSapatamuCheckout() {
  const navigate = useNavigate()
  const { invitationId = '' } = useParams<{ invitationId: string }>()
  const [cart, setCart] = useState<SapatamuCartData | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<(typeof PAYMENT_METHODS)[number]['id']>('qris')
  const [voucherCode, setVoucherCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cartItems = cart?.items?.length ? cart.items : cart?.item ? [cart.item] : []
  const isActivationCheckout = cartItems.some((item) => item.kind === 'activation')

  useEffect(() => {
    const run = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await sapatamuGetCart<SapatamuCartData>(invitationId)
        const nextCart = response.data ?? null
        setCart(nextCart)
        setVoucherCode(nextCart?.voucher?.code ?? '')
      } catch {
        setError('Data checkout belum bisa dimuat.')
      } finally {
        setIsLoading(false)
      }
    }

    void run()
  }, [invitationId])

  return (
    <CmsLayout
      sidebarLinks={CMS_SIDEBAR_LINKS.general}
      title="Checkout"
      subtitle="Pilih metode pembayaran dan tinjau ringkasan sebelum lanjut."
    >
      <div className="space-y-6">
        <Button variant="ghost" className="px-0 text-muted-foreground hover:bg-transparent" onClick={() => navigate(`/cms/sapatamu/${invitationId}/cart`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke keranjang
        </Button>

        {error && <ErrorNotice message={error} />}

        {isLoading ? (
          <div className="rounded-[1.6rem] border border-border bg-card p-6 text-sm text-muted-foreground">
            Memuat checkout...
          </div>
        ) : cart && cartItems.length ? (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
            <div className="rounded-[1.7rem] border border-border bg-card p-6 space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Pilih metode pembayaran</p>
                <h2 className="text-2xl font-semibold text-foreground mt-1">
                  {isActivationCheckout ? 'Selesaikan aktivasi tema' : 'Selesaikan pembelian tema add-on'}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full rounded-[1.4rem] border p-4 text-left transition-colors ${
                      selectedMethod === method.id ? 'border-accent bg-accent/5' : 'border-border bg-background'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        {method.logo ? (
                          <img src={method.logo} alt={method.label} className="h-10 w-20 shrink-0 rounded-xl border border-border bg-white object-contain p-1.5" />
                        ) : (
                          <div className="flex h-10 w-20 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                            <Landmark className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{method.label}</p>
                          <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                        </div>
                      </div>
                      {selectedMethod === method.id ? <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" /> : null}
                    </div>
                  </button>
                ))}
              </div>

            </div>

            <div className="h-fit space-y-4 rounded-[1.7rem] border border-border bg-card p-6 xl:sticky xl:top-6">
              <p className="font-semibold text-foreground">Ringkasan Pembayaran</p>
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div key={`${item.packageId}-${index}`} className="rounded-2xl bg-muted/35 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.kind === 'activation'
                            ? `Aktivasi ${item.themeName ?? item.packageName}`
                            : `Tema add-on ${item.addonSlot ?? index + 1}${item.themeName ? ` - ${item.themeName}` : ''}`}
                        </p>
                        {item.kind === 'activation' && item.priceMode === 'special' ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            <span className="line-through">{formatRupiah(item.basePrice ?? cart.originalAmount)}</span>
                            <span className="ml-2 text-accent">Diskon {item.specialDiscountPercent ?? 20}%</span>
                          </p>
                        ) : null}
                        {item.kind === 'theme_add_on' && item.addonSlot === 2 ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            <span className="line-through">{formatRupiah(item.normalPrice ?? 150000)}</span>
                            <span className="ml-2 text-accent">Harga tema kedua</span>
                          </p>
                        ) : null}
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-foreground">{formatRupiah(item.subtotal ?? item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <SummaryRow label="Subtotal" value={formatRupiah(cart.originalAmount)} />
              <SummaryRow label="Metode" value={PAYMENT_METHODS.find((item) => item.id === selectedMethod)?.label ?? '-'} />
              {isActivationCheckout ? (
                <div className="rounded-2xl border border-border p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <TicketPercent className="w-4 h-4 text-accent" />
                    <p className="font-medium text-foreground">Voucher</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input value={voucherCode} onChange={(event) => setVoucherCode(event.target.value.toUpperCase())} placeholder="Contoh: REKAVIA10" className="h-11 rounded-xl" />
                    <Button
                      variant="outline"
                      disabled={!voucherCode || isSubmitting}
                      onClick={() => {
                        setIsSubmitting(true)
                        setError(null)
                        void sapatamuApplyVoucher<SapatamuCartData>(invitationId, voucherCode)
                          .then((response) => {
                            const nextCart = response.data ?? null
                            setCart(nextCart)
                            setVoucherCode(nextCart?.voucher?.code ?? '')
                          })
                          .catch(() => setError('Voucher hanya berlaku untuk aktivasi tema utama.'))
                          .finally(() => setIsSubmitting(false))
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Voucher dihitung dari harga normal aktivasi, sehingga harga spesial tidak digabung dengan voucher.</p>
                </div>
              ) : null}
              <SummaryRow label="Voucher" value={cart.discountAmount ? `- ${formatRupiah(cart.discountAmount)}` : '-'} />
              <div className="pt-2 border-t border-border flex items-center justify-between gap-4">
                <p className="font-semibold text-foreground">Total</p>
                <p className="text-xl font-semibold text-foreground">{formatRupiah(cart.totalAmount)}</p>
              </div>
              <Button
                className="w-full"
                disabled={isSubmitting}
                onClick={() => {
                  setIsSubmitting(true)
                  void sapatamuCreatePayment<{ orderId: string; nextPath: string }>(invitationId, selectedMethod)
                    .then((response) => navigate(response.data?.nextPath ?? `/cms/payments/${response.data?.orderId}`))
                    .catch(() => setError('Pembayaran belum bisa dibuat.'))
                    .finally(() => setIsSubmitting(false))
                }}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Selesaikan Pembayaran
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.6rem] border border-dashed border-border bg-card p-8">
            <p className="text-base font-semibold text-foreground">Belum ada item di checkout.</p>
            <p className="text-sm text-muted-foreground mt-2">Pilih paket terlebih dahulu dari halaman aktivasi atau keranjang.</p>
          </div>
        )}
      </div>
    </CmsLayout>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  )
}
