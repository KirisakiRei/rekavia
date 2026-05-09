import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CreditCard, Calendar, ArrowUpRight, Zap, Check, Heart, ShoppingBag, Building2, GraduationCap } from 'lucide-react'
import { CmsLayout } from '@/components/layout/CmsLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CMS_SIDEBAR_LINKS, PRODUCTS, formatRupiah } from '@/lib/constants'
import { dataList } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  ShoppingBag,
  Building2,
  GraduationCap,
}

type LicenseRow = {
  id: string
  user_id: string
  template_id: string
  package_id: string
  status: 'active' | 'revoked'
  activated_at: string
  created_at: string
}

type TemplateRow = {
  id: string
  name: string
  category: 'sapatamu' | 'etalasepro' | 'citrakorpora' | 'edugerbang' | null
}

type PackageRow = {
  id: string
  code: string
  name: string
  price: number | string
}

type OrderRow = {
  id: string
  user_id: string
  status: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'
  total_amount: number | string
  checkout_token?: string
  created_at: string
}

type PaymentRow = {
  id: string
  order_id: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  amount: number | string
  metadata?: unknown
  created_at: string
  paid_at: string | null
}

type OrderItemRow = {
  id: string
  order_id: string
  template_id: string
  package_id: string
}

type ActiveSubscription = {
  id: string
  product: string
  productIcon: string
  tier: string
  price: number
  status: 'active' | 'revoked'
  activatedAt: string
  expiresAt: string
  color: string
  cmsLink: string
  features: string[]
  templateName: string
  packageCode: string
}

type PaymentHistory = {
  id: string
  orderId: string
  checkoutToken: string
  product: string
  amount: number
  status: string
  statusColor: string
  date: string
  paymentMethod: string
  items: Array<{
    name: string
    price: number
  }>
}

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  return 0
}

function resolveCmsLink(category: string | null | undefined): string {
  switch (category) {
    case 'etalasepro':
      return '/cms/etalasepro'
    case 'citrakorpora':
      return '/cms/citrakorpora'
    case 'edugerbang':
      return '/cms/edugerbang'
    default:
      return '/cms'
  }
}

export function CmsLangganan() {
  const { user } = useAuthStore()
  const [licenses, setLicenses] = useState<LicenseRow[]>([])
  const [templates, setTemplates] = useState<TemplateRow[]>([])
  const [packages, setPackages] = useState<PackageRow[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [orderItems, setOrderItems] = useState<OrderItemRow[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    const loadSubscriptionData = async () => {
      setIsLoading(true)

      try {
        const [licenseRes, templateRes, packageRes, orderRes, paymentRes, orderItemRes] = await Promise.all([
          dataList<LicenseRow>('user-template-licenses', {
            where: { user_id: user.id },
            orderBy: { activated_at: 'desc' },
            limit: 100,
          }),
          dataList<TemplateRow>('invitation-templates', {
            orderBy: { created_at: 'desc' },
            limit: 100,
          }),
          dataList<PackageRow>('packages', {
            orderBy: { price: 'asc' },
            limit: 100,
          }),
          dataList<OrderRow>('orders', {
            where: { user_id: user.id },
            orderBy: { created_at: 'desc' },
            limit: 100,
          }),
          dataList<PaymentRow>('payments', {
            orderBy: { created_at: 'desc' },
            limit: 100,
          }),
          dataList<OrderItemRow>('order-items', {
            orderBy: { created_at: 'desc' },
            limit: 100,
          }),
        ])

        setLicenses(licenseRes.data?.items ?? [])
        setTemplates(templateRes.data?.items ?? [])
        setPackages(packageRes.data?.items ?? [])
        setOrders(orderRes.data?.items ?? [])
        setPayments(paymentRes.data?.items ?? [])
        setOrderItems(orderItemRes.data?.items ?? [])
      } catch {
        setLicenses([])
        setTemplates([])
        setPackages([])
        setOrders([])
        setPayments([])
        setOrderItems([])
      } finally {
        setIsLoading(false)
      }
    }

    void loadSubscriptionData()
  }, [user?.id])

  const activeSubscriptions = useMemo<ActiveSubscription[]>(() => {
    return licenses.map((license) => {
      const template = templates.find((item) => item.id === license.template_id)
      const currentPackage = packages.find((item) => item.id === license.package_id)
      const productMeta = PRODUCTS.find((item) => item.id === (template?.category ?? 'sapatamu')) ?? PRODUCTS[0]
      const activatedAt = license.activated_at || license.created_at
      const expiresAt = new Date(activatedAt)
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)

      // Build features based on package
      const features: string[] = []
      const packageCode = currentPackage?.code?.toLowerCase() ?? ''
      
      if (packageCode.includes('basic')) {
        features.push('Undangan digital aktif 1 tahun')
        features.push('Galeri foto hingga 50 foto')
        features.push('RSVP & ucapan tamu')
        features.push('Musik latar belakang')
      } else if (packageCode.includes('premium')) {
        features.push('Undangan digital aktif 1 tahun')
        features.push('Galeri foto hingga 100 foto')
        features.push('Video background')
        features.push('RSVP & ucapan tamu')
        features.push('Musik latar belakang')
        features.push('Custom domain')
      } else {
        features.push('Undangan digital aktif 1 tahun')
        features.push('Fitur lengkap sesuai paket')
        features.push('RSVP & ucapan tamu')
      }

      return {
        id: license.id,
        product: template?.name ?? productMeta.name,
        productIcon: productMeta.icon,
        tier: currentPackage?.name ?? 'Paket Aktif',
        price: toNumber(currentPackage?.price),
        status: license.status,
        activatedAt,
        expiresAt: expiresAt.toISOString(),
        color: productMeta.color,
        cmsLink: resolveCmsLink(template?.category),
        features,
        templateName: template?.name ?? 'Template',
        packageCode: currentPackage?.code ?? '',
      }
    })
  }, [licenses, packages, templates])

  const paymentHistory = useMemo<PaymentHistory[]>(() => {
    return payments
      .filter((payment) => orders.some((order) => order.id === payment.order_id && order.user_id === user?.id))
      .map((payment) => {
        const order = orders.find((item) => item.id === payment.order_id)
        const relatedOrderItems = orderItems.filter((item) => item.order_id === payment.order_id)
        
        // Build items detail
        const items = relatedOrderItems.map((orderItem) => {
          const template = templates.find((t) => t.id === orderItem.template_id)
          const pkg = packages.find((p) => p.id === orderItem.package_id)
          return {
            name: [template?.name, pkg?.name].filter(Boolean).join(' - ') || 'Item',
            price: toNumber(pkg?.price),
          }
        })

        // Get payment method from metadata
        const paymentMetadata = payment.metadata as Record<string, unknown> | null
        const paymentMethod = typeof paymentMetadata?.paymentMethod === 'string' 
          ? paymentMetadata.paymentMethod 
          : 'N/A'
        
        // Format payment method label
        const methodLabels: Record<string, string> = {
          qris: 'QRIS',
          bni_va: 'BNI Virtual Account',
          bri_va: 'BRI Virtual Account',
          cimb_niaga_va: 'CIMB Niaga Virtual Account',
          sampoerna_va: 'Bank Sampoerna Virtual Account',
          bnc_va: 'BNC Virtual Account',
          maybank_va: 'Maybank Virtual Account',
          permata_va: 'Permata Virtual Account',
          atm_bersama_va: 'ATM Bersama Virtual Account',
          artha_graha_va: 'Artha Graha Virtual Account',
          mandiri_va: 'Mandiri Virtual Account',
          bca_va: 'BCA Virtual Account',
          bsi_va: 'BSI Virtual Account',
        }
        const methodLabel = methodLabels[paymentMethod] ?? paymentMethod.toUpperCase()

        // Status color
        const statusColor = payment.status === 'paid' 
          ? 'text-success' 
          : payment.status === 'pending' 
          ? 'text-warning' 
          : 'text-destructive'

        return {
          id: payment.id,
          orderId: order?.id ?? '',
          checkoutToken: (order?.checkout_token as string) ?? '',
          product: items.length > 0 ? items[0].name : 'Pembayaran Paket',
          amount: toNumber(payment.amount || order?.total_amount),
          status: payment.status === 'paid' ? 'Berhasil' : payment.status === 'pending' ? 'Pending' : 'Gagal',
          statusColor,
          date: payment.paid_at || payment.created_at,
          paymentMethod: methodLabel,
          items,
        }
      })
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
  }, [orders, orderItems, packages, payments, templates, user?.id])

  return (
    <CmsLayout sidebarLinks={CMS_SIDEBAR_LINKS.general} title="Langganan" subtitle="Kelola paket dan pembayaran">
      <div className="max-w-3xl space-y-8">
        <div>
          <h3 className="text-base font-medium text-foreground mb-4">Paket Aktif</h3>
          <div className="space-y-4">
            {activeSubscriptions.map((subscription, index) => {
              const Icon = iconMap[subscription.productIcon] || Heart

              return (
                <motion.div
                  key={subscription.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-5 lg:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${subscription.color}12`, color: subscription.color }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-heading text-foreground">{subscription.product}</h4>
                          <Badge className="text-[10px] border-0" style={{ backgroundColor: `${subscription.color}15`, color: subscription.color }}>
                            <Zap className="w-3 h-3 mr-0.5" />
                            {subscription.tier}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-sm font-medium text-foreground">{formatRupiah(subscription.price)}/tahun</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            Kode: {subscription.packageCode.toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Features */}
                        <div className="mt-3 space-y-1.5">
                          {subscription.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Check className="w-3 h-3 text-success shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Dates */}
                        <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Diaktifkan:{' '}
                              {new Date(subscription.activatedAt).toLocaleDateString('id-ID', {
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
                              {new Date(subscription.expiresAt).toLocaleDateString('id-ID', {
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
                      <Link to={subscription.cmsLink}>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                          <ArrowUpRight className="w-3.5 h-3.5" /> Buka CMS
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${subscription.status === 'active' ? 'bg-success' : 'bg-destructive'}`} />
                    <span className={`text-xs font-medium ${subscription.status === 'active' ? 'text-success' : 'text-destructive'}`}>
                      {subscription.status === 'active' ? 'Aktif' : 'Dinonaktifkan'}
                    </span>
                  </div>
                </motion.div>
              )
            })}

            {!isLoading && activeSubscriptions.length === 0 && (
              <div className="bg-card border border-border rounded-xl p-6 text-sm text-muted-foreground">
                Belum ada paket aktif. Silakan buat undangan baru untuk mulai berlangganan.
              </div>
            )}
          </div>
        </div>

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
            {paymentHistory.map((transaction) => (
              <div key={transaction.id} className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{transaction.product}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {transaction.paymentMethod}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Invoice: {transaction.checkoutToken || transaction.orderId.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(transaction.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    
                    {/* Items detail */}
                    {transaction.items.length > 1 && (
                      <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                        {transaction.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{item.name}</span>
                            <span className="text-foreground font-medium">{formatRupiah(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{formatRupiah(transaction.amount)}</p>
                      <p className={`text-[10px] font-medium mt-1 ${transaction.statusColor}`}>
                        {transaction.status}
                      </p>
                    </div>
                    {transaction.orderId && (
                      <Link to={`/cms/payments/${transaction.orderId}`}>
                        <Button variant="outline" size="sm" className="text-xs h-7">
                          Lihat Detail
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!isLoading && paymentHistory.length === 0 && (
              <div className="p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                Belum ada riwayat pembayaran.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </CmsLayout>
  )
}
