import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CreditCard, Calendar, ArrowUpRight, Zap, Heart, Loader2 } from 'lucide-react'
import { CmsLayout } from '@/components/layout/CmsLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CMS_SIDEBAR_LINKS, PRODUCTS, formatRupiah } from '@/lib/constants'
import { cmsLangganan } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

type LicenseRow = {
  id: string
  user_id: string
  template_id: string
  package_id: string
  order_item_id: string | null
  status: 'active' | 'revoked'
  activated_at: string
  created_at: string
}

type TemplateRow = {
  id: string
  code: string
  name: string
  category: 'sapatamu' | 'etalasepro' | 'citrakorpora' | 'edugerbang' | null
}

type PackageRow = {
  id: string
  code: string
  name: string
  price: number | string
  package_type: string | null
}

type OrderRow = {
  id: string
  user_id: string
  status: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'
  total_amount: number | string
  checkout_token: string | null
  expired_at: string | null
  created_at: string
}

type PaymentRow = {
  id: string
  order_id: string
  method: string | null
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  amount: number | string
  metadata: Record<string, unknown> | null
  created_at: string
  paid_at: string | null
}

type OrderItemRow = {
  id: string
  order_id: string
  template_id: string
  package_id: string
  subtotal: number | string
  metadata: Record<string, unknown> | null
}

type InvitationRow = {
  id: string
  title: string | null
  bride_name: string | null
  groom_name: string | null
  template_id: string | null
}

type ActiveSubscription = {
  id: string
  templateName: string
  packageName: string
  packageCode: string
  price: number
  status: 'active' | 'revoked'
  activatedAt: string
  expiresAt: string
  invitationTitle: string
  color: string
}

type PaymentHistoryItem = {
  id: string
  orderId: string
  orderStatus: string
  checkoutToken: string
  invitationTitle: string
  amount: number
  status: string
  statusColor: string
  date: string
  paymentMethod: string
  templateName: string
  packageName: string
}

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  return 0
}

export function CmsLangganan() {
  const { user } = useAuthStore()
  const [licenses, setLicenses] = useState<LicenseRow[]>([])
  const [templates, setTemplates] = useState<TemplateRow[]>([])
  const [packages, setPackages] = useState<PackageRow[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [orderItems, setOrderItems] = useState<OrderItemRow[]>([])
  const [invitations, setInvitations] = useState<InvitationRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const loadData = async () => {
      setIsLoading(true)

      try {
        const response = await cmsLangganan<{
          orders: OrderRow[]
          licenses: LicenseRow[]
          templates: TemplateRow[]
          packages: PackageRow[]
          payments: PaymentRow[]
          orderItems: OrderItemRow[]
          invitations: InvitationRow[]
        }>()

        const payload = response.data
        setOrders(payload?.orders ?? [])
        setLicenses(payload?.licenses ?? [])
        setTemplates(payload?.templates ?? [])
        setPackages(payload?.packages ?? [])
        setPayments(payload?.payments ?? [])
        setOrderItems(payload?.orderItems ?? [])
        setInvitations(payload?.invitations ?? [])
      } catch {
        // Silent fail
      } finally {
        setIsLoading(false)
      }
    }

    void loadData()
  }, [user?.id])

  // ── Paket Aktif ─────────────────────────────────────────────────────────────
  const activeSubscriptions = useMemo<ActiveSubscription[]>(() => {
    return licenses.map((license) => {
      const template = templates.find((t) => t.id === license.template_id)
      const pkg = packages.find((p) => p.id === license.package_id)
      const activatedAt = license.activated_at || license.created_at
      const expiresAt = new Date(activatedAt)
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)

      // Find invitation yang menggunakan license ini
      const invitation = invitations.find((inv) => inv.template_id === license.template_id)
      const invitationTitle = invitation?.title
        || [invitation?.groom_name, invitation?.bride_name].filter(Boolean).join(' & ')
        || 'Undangan'

      const productMeta = PRODUCTS.find((item) => item.id === (template?.category ?? 'sapatamu')) ?? PRODUCTS[0]

      return {
        id: license.id,
        templateName: template?.name ?? 'Tema',
        packageName: pkg?.name ?? 'Paket',
        packageCode: pkg?.code ?? '',
        price: toNumber(pkg?.price),
        status: license.status,
        activatedAt,
        expiresAt: expiresAt.toISOString(),
        invitationTitle,
        color: productMeta.color,
      }
    })
  }, [licenses, templates, packages, invitations])

  // ── Riwayat Pembayaran ──────────────────────────────────────────────────────
  const paymentHistory = useMemo<PaymentHistoryItem[]>(() => {
    // Jika tidak ada orders, tampilkan dari orders langsung (termasuk pending tanpa payment)
    const items: PaymentHistoryItem[] = []

    for (const order of orders) {
      const payment = payments.find((p) => p.order_id === order.id)
      const relatedItems = orderItems.filter((oi) => oi.order_id === order.id)
      const firstItem = relatedItems[0]
      const template = firstItem ? templates.find((t) => t.id === firstItem.template_id) : null
      const pkg = firstItem ? packages.find((p) => p.id === firstItem.package_id) : null

      // Find invitation from order item metadata
      const itemMetadata = firstItem?.metadata as Record<string, unknown> | null
      const invitationId = typeof itemMetadata?.invitationId === 'string' ? itemMetadata.invitationId : null
      const invitation = invitationId ? invitations.find((inv) => inv.id === invitationId) : null
      const invitationTitle = invitation?.title
        || [invitation?.groom_name, invitation?.bride_name].filter(Boolean).join(' & ')
        || template?.name
        || 'Undangan'

      // Payment method
      const paymentMetadata = payment?.metadata as Record<string, unknown> | null
      const method = payment?.method
        || (typeof paymentMetadata?.paymentMethod === 'string' ? paymentMetadata.paymentMethod : '')
      const methodLabels: Record<string, string> = {
        qris: 'QRIS',
        bni_va: 'BNI VA',
        bri_va: 'BRI VA',
        mandiri_va: 'Mandiri VA',
        bca_va: 'BCA VA',
        bsi_va: 'BSI VA',
      }
      const methodLabel = methodLabels[method ?? ''] ?? method?.toUpperCase() ?? '-'

      // Status
      const status = payment?.status ?? order.status
      const statusLabel = status === 'paid' ? 'Berhasil' : status === 'pending' ? 'Pending' : status === 'expired' ? 'Kedaluwarsa' : 'Gagal'
      const statusColor = status === 'paid'
        ? 'text-success'
        : status === 'pending'
        ? 'text-warning'
        : 'text-destructive'

      items.push({
        id: payment?.id ?? order.id,
        orderId: order.id,
        orderStatus: order.status,
        checkoutToken: order.checkout_token ?? '',
        invitationTitle,
        amount: toNumber(payment?.amount || order.total_amount),
        status: statusLabel,
        statusColor,
        date: payment?.paid_at || payment?.created_at || order.created_at,
        paymentMethod: methodLabel,
        templateName: template?.name ?? '',
        packageName: pkg?.name ?? '',
      })
    }

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [orders, payments, orderItems, templates, packages, invitations])

  return (
    <CmsLayout sidebarLinks={CMS_SIDEBAR_LINKS.general} title="Langganan" subtitle="Kelola paket dan pembayaran">
      <div className="max-w-3xl space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Memuat data langganan...
          </div>
        ) : (
          <>
            {/* ── Paket Aktif ──────────────────────────────────────────── */}
            <div>
              <h3 className="text-base font-medium text-foreground mb-4">Paket Aktif</h3>
              <div className="space-y-4">
                {activeSubscriptions.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-card border border-border rounded-xl p-5 lg:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${sub.color}12`, color: sub.color }}
                        >
                          <Heart className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-heading text-foreground">{sub.invitationTitle}</h4>
                            <Badge className="text-[10px] border-0" style={{ backgroundColor: `${sub.color}15`, color: sub.color }}>
                              <Zap className="w-3 h-3 mr-0.5" />
                              {sub.packageName}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Tema: {sub.templateName}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="text-sm font-medium text-foreground">{formatRupiah(sub.price)}</span>
                            {sub.packageCode && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  Kode: {sub.packageCode.toUpperCase()}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Dates */}
                          <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Diaktifkan:{' '}
                                {new Date(sub.activatedAt).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Berakhir:{' '}
                                {new Date(sub.expiresAt).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:flex-col sm:items-end">
                        <Link to="/cms/sapatamu">
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Kelola
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${sub.status === 'active' ? 'bg-success' : 'bg-destructive'}`} />
                      <span className={`text-xs font-medium ${sub.status === 'active' ? 'text-success' : 'text-destructive'}`}>
                        {sub.status === 'active' ? 'Aktif' : 'Dinonaktifkan'}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {activeSubscriptions.length === 0 && (
                  <div className="bg-card border border-border rounded-xl p-6 text-sm text-muted-foreground">
                    Belum ada paket aktif. Silakan buat undangan dan aktivasi untuk mulai.
                  </div>
                )}
              </div>
            </div>

            {/* ── Riwayat Pembayaran ───────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-accent" />
                <h3 className="text-base font-medium text-foreground">Riwayat Pembayaran</h3>
              </div>
              <div className="space-y-3">
                {paymentHistory.map((tx) => (
                  <div key={tx.id} className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground truncate">{tx.invitationTitle}</p>
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {tx.paymentMethod}
                          </Badge>
                        </div>
                        {tx.templateName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {[tx.templateName, tx.packageName].filter(Boolean).join(' — ')}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(tx.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {tx.checkoutToken && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                            #{tx.checkoutToken.slice(0, 16)}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex flex-col items-end gap-2 shrink-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{formatRupiah(tx.amount)}</p>
                          <p className={`text-[10px] font-medium mt-1 ${tx.statusColor}`}>
                            {tx.status}
                          </p>
                        </div>
                        <Link to={`/cms/payments/${tx.orderId}`}>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            {tx.orderStatus === 'pending' ? 'Bayar' : 'Detail'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {paymentHistory.length === 0 && (
                  <div className="p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                    Belum ada riwayat pembayaran.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </CmsLayout>
  )
}
