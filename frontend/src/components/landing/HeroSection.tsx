import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center overflow-hidden pt-24 pb-16"
      id="hero"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(27,42,74,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(27,42,74,0.06)_1px,transparent_1px)] [background-size:60px_60px]" />
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(197,93,62,0.12)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-24 right-[-10%] h-[380px] w-[380px] rounded-full bg-terracotta/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[320px] w-[320px] rounded-full bg-navy/10 blur-[120px]" />
      </div>

      <motion.div style={{ y, opacity }} className="container-wide relative z-10">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="mt-6 text-balance font-heading text-[clamp(2.8rem,8.5vw,6.5rem)] font-semibold leading-[0.95] tracking-tight text-foreground">
              Merekayasa Visi 
              <br className="hidden sm:block" />
              Digital {' '}
              <span className="relative inline-block">
                Anda
                <span className="pointer-events-none absolute -bottom-2 left-0 h-[6px] w-full rounded-full bg-terracotta/30" />
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Mitra teknologi Anda untuk pengembangan platform web premium. Solusi desain visual dan arsitektur software terpadu dalam satu atap.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/daftar?product=sapatamu&tier=pro" id="hero-cta-primary">
                <Button
                  size="lg"
                  className="h-12 rounded-xl bg-accent px-8 text-base text-white hover:bg-terracotta-hover"
                >
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#produk" id="hero-cta-secondary">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-border px-8 text-base hover:bg-muted"
                >
                  Lihat Produk
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
