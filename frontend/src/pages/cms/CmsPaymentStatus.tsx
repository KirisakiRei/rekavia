import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock, Copy, CreditCard, Download, ExternalLink, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
const MAX_POLL_COUNT = 288
const REDIRECT_DELAY_SECONDS = 7

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

// ─── Success Overlay ──────────────────────────────────────────────────────────
function PaymentSuccessOverlay({
  detail,
  onNavigate,
}: {
  detail: SapatamuPaymentDetail
  onNavigate: () => void
}) {
  const [countdown, setCountdown] = useState(REDIRECT_DELAY_SECONDS)

  useEffect(() => {
    if (countdown <= 0) {
      onNavigate()
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, onNavigate])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto w-24 h-24 rounded-full bg-success/10 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
          >
            <CheckCircle2 className="w-14 h-14 text-success" />
          </motion.div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Pembayaran Berhasil!</h1>
          <p className="text-sm text-muted-foreground">
            Undangan Anda sudah aktif dan siap dikelola.
          </p>
        </div>

        <div className="rounded-xl bg-muted/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold text-foreground">{formatRupiah(detail.payment?.total ?? detail.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Metode</span>
            <span className="text-foreground">{detail.payment?.method?.toUpperCase() ?? '-'}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={onNavigate}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Kelola Undangan
          </Button>
          <p className="text-xs text-muted-foreground">
            Redirect otomatis dalam {countdown} detik...
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Failed/Expired Overlay ───────────────────────────────────────────────────
function PaymentFailedOverlay({
  isExpired,
  detail,
  onRetry,
  onDashboard,
}: {
  isExpired: boolean
  detail: SapatamuPaymentDetail
  onRetry: () => void
  onDashboard: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Animated X mark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
          >
            <XCircle className="w-14 h-14 text-destructive" />
          </motion.div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {isExpired ? 'Pembayaran Kedaluwarsa' : 'Pembayaran Gagal'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isExpired
              ? 'Waktu pembayaran telah habis. Silakan buat pesanan baru.'
              : 'Pembayaran tidak berhasil diproses. Silakan coba lagi.'}
          </p>
        </div>

        <div className="rounded-xl bg-muted/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold text-foreground">{formatRupiah(detail.payment?.total ?? detail.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Metode</span>
            <span className="text-foreground">{detail.payment?.method?.toUpperCase() ?? '-'}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={onRetry}>
            Coba Lagi
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={onDashboard}>
            Kembali ke Dashboard
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CmsPaymentStatus() {
  const navigate = useNavigate()
  const { orderId = '' } = useParams<{ orderId: string }>()
  const [detail, setDetail] = useState<SapatamuPaymentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(Date.now())
  const [copied, setCopied] = useState(false)
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false)
  const [showFailedOverlay, setShowFailedOverlay] = useState(false)
  const prevStatusRef = useRef<string | null>(null)
  const pollCountRef = useRef(0)
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  useEffect(() => {
    void fetchDetail(true)
  }, [orderId])

  // ── Detect status change → show overlay ───────────────────────────────────
  useEffect(() => {
    if (!detail) return
    const currentStatus = detail.payment?.status ?? (detail as any).orderStatus ?? 'pending'
    const prev = prevStatusRef.current

    // Jika status berubah dari pending ke paid → show success
    if (prev && prev !== 'paid' && currentStatus === 'paid') {
      setShowSuccessOverlay(true)
    }
    // Jika status berubah dari pending ke failed/expired → show failed
    if (prev && prev === 'pending' && (currentStatus === 'failed' || (detail as any).isExpired)) {
      setShowFailedOverlay(true)
    }

    prevStatusRef.current = currentStatus

    // Jika initial load sudah paid, langsung show success
    if (!prev && currentStatus === 'paid') {
      setShowSuccessOverlay(true)
    }
  }, [detail])

  // ── Polling ───────────────────────────────────────────────────────────────
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

  const methodLabels: Record<string, string> = {
    qris: 'QRIS',
    cimb_niaga_va: 'CIMB Niaga VA',
    bni_va: 'BNI VA',
    bri_va: 'BRI VA',
  }
  const methodLabel = methodLabels[detail?.payment?.method ?? ''] ?? detail?.payment?.method?.toUpperCase() ?? 'PAYMENT'

  // ── Detect expired via countdown ──────────────────────────────────────────
  useEffect(() => {
    if (countdown === '00:00:00' && detail && !isPaid && !isFailed && !showFailedOverlay) {
      setShowFailedOverlay(true)
    }
  }, [countdown, detail, isPaid, isFailed, showFailedOverlay])

  return (
    <>
      {/* ── Success Overlay ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showSuccessOverlay && detail && (
          <PaymentSuccessOverlay
            detail={detail}
            onNavigate={() => navigate(`/cms/sapatamu/${detail.invitationId}/editor`)}
          />
        )}
      </AnimatePresence>

      {/* ── Failed Overlay ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showFailedOverlay && detail && !showSuccessOverlay && (
          <PaymentFailedOverlay
            isExpired={isExpired}
            detail={detail}
            onRetry={() => navigate(`/cms/sapatamu/${detail.invitationId}/cart`)}
            onDashboard={() => navigate('/cms')}
          />
        )}
      </AnimatePresence>

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
              {/* ── Hero Status Card ──────────────────────────────────── */}
              <div
                className={cn(
                  'rounded-[2rem] border p-8 lg:p-10 relative overflow-hidden',
                  isPaid && 'border-success/30 bg-gradient-to-br from-success/5 to-success/10',
                  isExpired && 'border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10',
                  isFailed && 'border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10',
                  !isPaid && !isExpired && !isFailed && 'border-warning/30 bg-gradient-to-br from-warning/5 to-warning/10',
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {isPaid && <CheckCircle2 className="w-10 h-10 text-success" />}
                      {isExpired && <Clock className="w-10 h-10 text-destructive" />}
                      {isFailed && <XCircle className="w-10 h-10 text-destructive" />}
                      {!isPaid && !isExpired && !isFailed && <Clock className="w-10 h-10 text-warning animate-pulse" />}
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                          {isPaid && 'Pembayaran Berhasil'}
                          {isExpired && 'Kedaluwarsa'}
                          {isFailed && 'Gagal'}
                          {!isPaid && !isExpired && !isFailed && 'Menunggu Pembayaran'}
                        </h1>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge variant="outline" className="text-xs px-3 py-1">
                        <CreditCard className="w-3 h-3 mr-1.5" />
                        {methodLabel}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="rounded-2xl bg-background/80 border border-border p-5 text-center min-w-[180px]">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Total</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatRupiah(detail.payment?.total ?? detail.amount)}
                      </p>
                    </div>

                    {!isPaid && !isExpired && !isFailed && (
                      <div className="rounded-2xl bg-warning/10 border border-warning/30 p-5 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wider text-warning mb-1">Sisa Waktu</p>
                        <p className="text-xl font-mono font-bold text-warning">{countdown}</p>
                      </div>
                    )}
                  </div>
                </div>

                {!isTerminalStatus(detail) && (
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Status diperbarui otomatis
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                {/* ── Left: Payment Info ────────────────────────────────── */}
                <div className="space-y-6">
                  {/* QRIS / VA */}
                  {detail.payment?.paymentNumber && !isPaid && !isExpired && !isFailed && (
                    <div className="rounded-[1.6rem] border border-border bg-card p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        {detail.payment.method === 'qris' ? 'Scan QRIS' : 'Nomor Virtual Account'}
                      </h3>

                      {detail.payment.method === 'qris' ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-full max-w-[280px] aspect-square rounded-2xl bg-white p-4 border border-border shadow-sm mx-auto">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(detail.payment.paymentNumber)}`}
                              alt="QRIS QR Code"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground text-center">
                            Scan menggunakan GoPay, OVO, DANA, ShopeePay, LinkAja, atau mobile banking
                          </p>
                          <Button
                            variant="outline"
                            className="w-full max-w-[280px]"
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&format=png&data=${encodeURIComponent(detail.payment?.paymentNumber ?? '')}`
                              link.download = `qris-${detail.orderId.slice(0, 8)}.png`
                              link.target = '_blank'
                              link.click()
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download QR Code
                          </Button>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-muted/50 p-4 relative">
                          <p className="text-lg font-mono font-semibold text-foreground tracking-wider pr-10">
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
                      )}

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

                  {/* Package detail */}
                  <div className="rounded-[1.6rem] border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground mb-3">Detail Paket</h3>
                    <div className="rounded-xl bg-muted/50 p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{detail.package.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{detail.package.code}</p>
                        {detail.voucherCode && (
                          <p className="text-xs text-success mt-1">Voucher: {detail.voucherCode} (-{formatRupiah(detail.discountAmount ?? 0)})</p>
                        )}
                      </div>
                      <p className="text-sm font-bold text-foreground">{formatRupiah(detail.originalAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* ── Right: Actions ───────────────────────────────────── */}
                <div className="space-y-4">
                  <div className="rounded-[1.6rem] border border-border bg-card p-6 space-y-3 sticky top-6">
                    <h3 className="text-base font-semibold text-foreground">Aksi</h3>

                    {isPaid && (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => navigate(`/cms/sapatamu/${detail.invitationId}/editor`)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Buka Editor
                      </Button>
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
                          variant="outline"
                          onClick={() => void fetchDetail(false)}
                          disabled={isSubmitting}
                        >
                          <RefreshCw className={cn('w-4 h-4 mr-2', isSubmitting && 'animate-spin')} />
                          Refresh Status
                        </Button>

                        {IS_DEV && isMock && (
                          <Button
                            className="w-full"
                            variant="secondary"
                            disabled={isSubmitting}
                            onClick={() => {
                              setIsSubmitting(true)
                              void paymentMockComplete<SapatamuPaymentDetail>(orderId)
                                .then((response) => setDetail(response.data ?? null))
                                .catch(() => setError('Mock gagal.'))
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
                      <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate('/cms')}>
                        Kembali ke Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </CmsLayout>
    </>
  )
}
