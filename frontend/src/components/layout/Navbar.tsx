import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NAV_LINKS, PUBLIC_PRODUCTS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { BrandLogo } from '@/components/branding/BrandLogo'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  return (
    <>
      <div className="relative z-[60] h-0">
        <div className="pointer-events-none absolute left-0 right-0 top-3 px-3 sm:top-4 sm:px-5">
          <div className="mx-auto flex h-14 max-w-[1180px] items-center lg:h-16">
            <Link to="/" className="pointer-events-auto flex items-center gap-2 group" id="nav-logo">
              <BrandLogo compact />
            </Link>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'pointer-events-none fixed left-0 right-0 top-3 z-50 px-3 transition-all duration-300 sm:top-4 sm:px-5',
          isScrolled ? 'translate-y-0' : 'translate-y-0',
        )}
      >
        <nav
          className={cn(
            'pointer-events-auto mx-auto flex h-14 max-w-[1180px] items-center justify-between px-2 transition-all duration-300 lg:h-16 lg:px-4',
          )}
        >
          <div className="hidden lg:flex items-center gap-2 opacity-0 pointer-events-none" aria-hidden="true">
            <BrandLogo compact />
          </div>

          <div
            className={cn(
              'hidden lg:flex items-center gap-1 rounded-full px-1 py-1 transition-all duration-300',
              isScrolled
                ? 'border border-border/70 bg-background/90 shadow-[0_10px_24px_rgba(27,42,74,0.10)] backdrop-blur-xl'
                : 'border border-white/60 bg-white/70 shadow-[0_8px_20px_rgba(27,42,74,0.08)] backdrop-blur-xl',
            )}
          >
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.label === 'Produk' && setIsProductDropdownOpen(true)}
                onMouseLeave={() => link.label === 'Produk' && setIsProductDropdownOpen(false)}
              >
                <a
                  href={link.href}
                  className="nav-link flex items-center gap-1 rounded-full px-4 py-2 text-foreground/70 transition-colors duration-280 hover:bg-background/80 hover:text-foreground"
                  id={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  {link.label === 'Produk' && (
                    <ChevronDown className={cn('w-3 h-3 transition-transform duration-280', isProductDropdownOpen && 'rotate-180')} />
                  )}
                </a>

                {link.label === 'Produk' && (
                  <AnimatePresence>
                    {isProductDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full pt-4"
                      >
                        <div className="w-[280px] rounded-2xl border border-border/80 bg-card/95 p-2 shadow-[0_20px_55px_rgba(27,42,74,0.16)] backdrop-blur-xl">
                          {PUBLIC_PRODUCTS.map((product) => (
                            <Link
                              key={product.id}
                              to={product.href}
                              className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-280 hover:bg-muted"
                              id={`nav-product-${product.id}`}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 shrink-0"
                                style={{ backgroundColor: `${product.color}15`, color: product.color }}
                              >
                                <div className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{product.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{product.tagline}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/masuk" id="nav-login">
              <Button
                className="rounded-full bg-white px-5 text-foreground shadow-[0_10px_24px_rgba(27,42,74,0.12)] hover:bg-white/90"
              >
                Masuk
              </Button>
            </Link>
            <Link to="/daftar" id="nav-register">
              <Button className="rounded-full bg-accent px-5 text-white shadow-[0_10px_24px_rgba(197,93,62,0.22)] hover:bg-terracotta-hover">
                Mulai Sekarang
              </Button>
            </Link>
          </div>

          <button
            className="rounded-full p-2 text-foreground transition-colors hover:bg-muted lg:hidden"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Buka menu navigasi"
            id="nav-mobile-toggle"
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative h-full flex flex-col"
            >
              <div className="flex items-center justify-between px-6 h-16">
                <BrandLogo compact />
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-foreground"
                  aria-label="Tutup menu"
                  id="nav-mobile-close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-6 gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-3xl font-heading text-foreground py-3 border-b border-border/50"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}

                <div className="mt-8 flex flex-col gap-3">
                  <Link to="/masuk" onClick={() => setIsMobileOpen(false)}>
                    <Button variant="outline" className="w-full h-12 text-base">
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/daftar" onClick={() => setIsMobileOpen(false)}>
                    <Button className="w-full h-12 text-base bg-accent hover:bg-terracotta-hover text-white">
                      Mulai Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
