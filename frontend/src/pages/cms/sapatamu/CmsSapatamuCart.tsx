import { useEffect, useState } from 'react'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { CmsLayout } from '@/components/layout/CmsLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ErrorNotice } from '@/components/feedback/ErrorNotice'
import { CMS_SIDEBAR_LINKS, formatRupiah } from '@/lib/constants'
import { sapatamuGetCart } from '@/lib/api'
import type { SapatamuCartData } from '@/types/sapatamu'

export function CmsSapatamuCart() {
  const navigate = useNavigate()
  const { invitationId = '' } = useParams<{ invitationId: string }>()
  const [cart, setCart] = useState<SapatamuCartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cartItems = cart?.items?.length ? cart.items : cart?.item ? [cart.item] : []

  useEffect(() => {
    const run = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await sapatamuGetCart<SapatamuCartData>(invitationId)
        setCart(response.data ?? null)
      } catch {
        setError('Keranjang belum bisa dimuat.')
      } finally {
        setIsLoading(false)
      }
    }

    void run()
  }, [invitationId])

  return (
    <CmsLayout
      sidebarLinks={CMS_SIDEBAR_LINKS.general}
      title="Keranjang"
      subtitle="Tinjau tema yang dipilih lalu lanjutkan ke checkout."
    >
      <div className="space-y-6">
        <Button variant="ghost" className="px-0 text-muted-foreground hover:bg-transparent" onClick={() => navigate(`/cms/sapatamu/${invitationId}/activate`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke pilihan paket
        </Button>

        {error && <ErrorNotice message={error} />}

        {isLoading ? (
          <div className="rounded-[1.6rem] border border-border bg-card p-6 text-sm text-muted-foreground">
            Memuat keranjang...
          </div>
        ) : cart && cartItems.length ? (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
            <div className="rounded-[1.7rem] border border-border bg-card p-6 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Item terpilih</p>
                  <h2 className="text-2xl font-semibold text-foreground mt-1">
                    {cartItems.some((item) => item.kind === 'theme_add_on') ? 'Tema Add-on' : 'Aktivasi Tema'}
                  </h2>
                </div>
                <Badge className="border-0 bg-muted text-foreground">{cartItems.length} item</Badge>
              </div>

              {cartItems.map((item, index) => {
                // Cek diskon dari selisih originalAmount vs totalAmount
                const hasDiscount = cart.originalAmount > cart.totalAmount
                const discountPercent = hasDiscount
                  ? Math.round(((cart.originalAmount - cart.totalAmount) / cart.originalAmount) * 100)
                  : 0

                return (
                  <div key={`${item.packageId}-${index}`} className="rounded-2xl bg-muted/35 p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.kind === 'activation'
                          ? `Aktivasi ${item.themeName ?? item.packageName}`
                          : `Tema add-on ${item.addonSlot ?? index + 1}${item.themeName ? ` - ${item.themeName}` : ''}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{item.packageCode}</p>
                      {hasDiscount ? (
                        <p className="text-xs mt-1">
                          <span className="text-muted-foreground line-through">{formatRupiah(cart.originalAmount)}</span>
                          <span className="ml-2 text-accent">Diskon {discountPercent}%</span>
                        </p>
                      ) : null}
                    </div>
                    <p className="text-xl font-semibold text-foreground">{formatRupiah(cart.totalAmount)}</p>
                  </div>
                )
              })}
            </div>

            <div className="rounded-[1.7rem] border border-border bg-card p-6 space-y-4 h-fit">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-accent" />
                <p className="font-semibold text-foreground">Ringkasan Belanja</p>
              </div>
              {cart.originalAmount !== cart.totalAmount ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">Harga Normal</p>
                    <p className="text-sm text-muted-foreground">{formatRupiah(cart.originalAmount)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">Diskon Spesial</p>
                    <p className="text-sm text-accent font-medium">- {formatRupiah(cart.originalAmount - cart.totalAmount)}</p>
                  </div>
                </>
              ) : (
                <SummaryRow label="Subtotal" value={formatRupiah(cart.totalAmount)} />
              )}
              <div className="pt-2 border-t border-border flex items-center justify-between gap-4">
                <p className="font-semibold text-foreground">Total</p>
                <p className="text-xl font-semibold text-foreground">{formatRupiah(cart.totalAmount)}</p>
              </div>
              <Button className="w-full" onClick={() => navigate(`/cms/sapatamu/${invitationId}/checkout`)}>
                Bayar Sekarang
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.6rem] border border-dashed border-border bg-card p-8">
            <p className="text-base font-semibold text-foreground">Keranjang masih kosong.</p>
            <p className="text-sm text-muted-foreground mt-2">Pilih tema aktivasi atau tema add-on terlebih dahulu.</p>
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
