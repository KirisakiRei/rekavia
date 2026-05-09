import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Clock3, CreditCard, Loader2, XCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { CmsLayout } from '@/components/layout/CmsLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ErrorNotice } from '@/components/feedback/ErrorNotice'
import { CMS_SIDEBAR_LINKS, formatRupiah } from '@/lib/constants'
import { paymentDetail, paymentMockComplete } from '@/lib/api'
import type { SapatamuPaymentDetail } from '@/types/sapatamu'

// Polling interval: 5 detik saat pending, berhenti saat paid/expired/failed
const POLL_INTERVAL_MS = 5000
// Maksimum polling: 24 menit (288 kali × 5 detik)
const MAX_POLL_COUNT = 288

function formatCountdown(expiredAt: string | null) {
  if (!expiredAt) return '--:--'
  const diff = new Date(expiredAt).getTime() - Date.now()
  if (diff <= 0) return '00:00'
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
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
    countdown === '00:00'
  const isFailed =
    detail?.payment?.status === 'failed' ||
    (detail as any)?.orderStatus === 'failed' ||
    (detail as any)?.orderStatus === 'cancelled'
  const isMock = (detail?.payment as any)?.isMock === true

  // ── Status config ─────────────────────────────────────────────────────────
  const statusConfig = isPaid
    ? {
        icon: <CheckCircle2 className="w-10 h-10 text-accent" />,
        title: 'Pembayaran Berhasil',
        subtitle: 'Undangan kamu sudah aktif dan siap dikelola.',
        cardClass: 'border-accent/20 bg-accent/5',
        badgeClass: 'border-0 bg-accent/10 text-accent',
      }
    : isExpired
      ? {
          icon: <Clock3 className="w-10 h-10 text-destructive" />,
          title: 'Pembayaran Kedaluwarsa',
          subtitle: 'Waktu pembayaran sudah habis. Silakan buat pesanan baru.',
          cardClass: 'border-destructive/20 bg-destructive/5',
          badgeClass: 'border-0 bg-destructive/10 text-destructive',
        }
      : isFailed
        ? {
            icon: <XCircle className="w-10 h-10 text-destructive" />,
            title: 'Pembayaran Gagal',
            subtitle: 'Pembayaran tidak berhasil diproses. Silakan coba lagi.',
            cardClass: 'border-destructive/20 bg-destructive/5',
            badgeClass: 'border-0 bg-destructive/10 text-destructive',
          }
        : {
            icon: <Clock3 className="w-10 h-10 text-warning" />,
            title: 'Menunggu Pembayaran',
            subtitle: 'Selesaikan pembayaran sebelum waktu habis.',
            cardClass: 'border-border bg-card',
            badgeClass: 'border-0 bg-warning/10 text-warning',
          }

  return (
    <CmsLayout
      sidebarLinks={CMS_SIDEBAR_LINKS.general}
      title="Status Pembayaran"
      subtitle="Pantau status aktivasi undangan Anda."
    >
      <div className="max-w-4xl space-y-6">
        {error && <ErrorNotice message={error} />}

        {isLoading ? (
          <div className="rounded-[1.6rem] border border-border bg-card p-6 flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Memuat status pembayaran...
          </div>
        ) : detail ? (
          <>
            {/* ── Status card ─────────────────────────────────────────────── */}
            <div className={`rounded-[2rem] border p-8 ${statusConfig.cardClass}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3">
                    {statusConfig.icon}
                    <div>
                      <p className="text-sm text-muted-foreground">Status pembayaran</p>
                      <h2 className="text-3xl font-semibold text-foreground mt-1">
                        {statusConfig.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{statusConfig.subtitle}</p>
                  <p className="text-sm text-muted-foreground mt-3">
                    Order ID: <span className="text-foreground font-mono text-xs">{detail.orderId}</span>
                  </p>
                </div>
                <Badge className={statusConfig.badgeClass}>
                  {detail.payment?.method?.toUpperCase() ?? 'PAYMENT'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <InfoTile label="Total Bayar" value={formatRupiah(detail.payment?.total ?? detail.amount)} />
                <InfoTile
                  label={isPaid ? 'Dibayar' : isExpired ? 'Kedaluwarsa' : 'Sisa Waktu'}
                  value={
                    isPaid
                      ? detail.payment?.paidAt
                        ? new Date(detail.payment.paidAt).toLocaleString('id-ID')
                        : 'Lunas'
                      : isExpired
                        ? 'Kedaluwarsa'
                        : countdown
                  }
                />
                <InfoTile label="Voucher" value={detail.voucherCode || '-'} />
              </div>

              {/* Polling indicator */}
              {!isTerminalStatus(detail) && (
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Memperbarui status otomatis setiap {POLL_INTERVAL_MS / 1000} detik...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6">
              {/* ── Payment detail ─────────────────────────────────────────── */}
              <div className="rounded-[1.6rem] border border-border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-accent" />
                  <p className="font-semibold text-foreground">Detail Pembayaran</p>
                </div>

                <div className="rounded-2xl bg-muted/35 p-4">
                  <p className="text-sm font-medium text-foreground">{detail.package.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{detail.package.code}</p>
                </div>

                {detail.payment?.paymentNumber && !isPaid && !isExpired && !isFailed && (
                  <div className="rounded-2xl border border-border p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {detail.payment.method === 'qris' ? 'QRIS String' : 'Nomor Virtual Account'}
                    </p>
                    <p className="text-sm text-foreground break-all mt-3 font-mono">
                      {detail.payment.paymentNumber}
                    </p>
                  </div>
                )}

                {detail.payment?.instructions && detail.payment.instructions.length > 0 && !isPaid && !isExpired && !isFailed && (
                  <div className="rounded-2xl border border-border p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Petunjuk Pembayaran
                    </p>
                    {detail.payment.instructions.map((item, index) => (
                      <p key={index} className="text-sm text-foreground">
                        {index + 1}. {item}
                      </p>
                    ))}
                  </div>
                )}

                {(isExpired || isFailed) && (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">
                      {isExpired
                        ? 'Waktu pembayaran sudah habis. Kembali ke halaman checkout untuk membuat pesanan baru.'
                        : 'Pembayaran gagal diproses. Silakan coba dengan metode pembayaran lain.'}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Actions ────────────────────────────────────────────────── */}
              <div className="rounded-[1.6rem] border border-border bg-card p-6 space-y-3 h-fit">
                <p className="font-semibold text-foreground">Aksi</p>

                {isPaid && (
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/cms/sapatamu/${detail.invitationId}/send`)}
                  >
                    Kelola Undangan
                  </Button>
                )}

                {(isExpired || isFailed) && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/cms/sapatamu/${detail.invitationId}/checkout`)}
                  >
                    Coba Lagi
                  </Button>
                )}

                {!isPaid && !isExpired && !isFailed && (
                  <>
                    {/* Mock complete — hanya tampil di development */}
                    {IS_DEV && isMock && (
                      <Button
                        className="w-full"
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
                        Simulasikan Pembayaran Berhasil
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => void fetchDetail(false)}
                      disabled={isSubmitting}
                    >
                      Refresh Status
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => navigate('/cms')}
                >
                  Kembali ke Dashboard
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </CmsLayout>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background/70 border border-border px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground mt-3">{value}</p>
    </div>
  )
}
