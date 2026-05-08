import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { PlayCircle, Check } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { BRAND, PRODUCTS, WEDDING_THEMES, formatRupiah } from '@/lib/constants'
import { buildSapatamuPublicPreviewUrl, isSignatureThemeId } from '@/lib/sapatamu-public-preview'
import { cn } from '@/lib/utils'

const PREMIUM_THEME_CARDS = WEDDING_THEMES.map((theme) => ({
  id: theme.id,
  name: theme.name,
  description: theme.description,
  image: theme.previewImage,
}))

const isSignatureTheme = (theme: { id: string }) => isSignatureThemeId(theme.id)

const CATALOG_TIERS = [
  {
    id: 'luxury',
    label: 'Luxury',
    templates: PREMIUM_THEME_CARDS.filter((theme) => !isSignatureTheme(theme)),
    comingSoon: false,
  },
  {
    id: 'signature',
    label: 'Signature',
    templates: PREMIUM_THEME_CARDS.filter(isSignatureTheme),
    comingSoon: true,
  },
] as const

// Pricing tiers data
const PRICING_TIERS = [
  {
    id: 'pro',
    name: 'Luxury',
    price: 279000,
    badge: 'Paling Diminati',
    comingSoon: false,
    description: 'Aktivasi satu tema Luxury pilihan untuk satu undangan, dengan harga spesial peluncuran.',
    features: [
      { text: 'Aktivasi satu tema Luxury', included: true },
      { text: 'Formulir RSVP & Buku Tamu', included: true },
      { text: 'Album hingga 50 foto', included: true },
      { text: 'Video Background (Motion)', included: true },
      { text: 'Background Music Kustom', included: true },
    ]
  },
  {
    id: 'signature',
    name: 'Signature',
    price: null,
    badge: 'Coming Soon',
    comingSoon: true,
    description: 'Tier eksklusif untuk tema Aishwarya yang sedang kami siapkan.',
    features: [
      { text: 'Akses Template Signature Aishwarya', included: true },
      { text: 'Arahan visual lebih personal', included: true },
      { text: 'Detail pengalaman tamu premium', included: true },
      { text: 'Harga menyusul saat rilis', included: true },
    ]
  }
]

// FAQ Data
const FAQS = [
  { 
    q: 'Bagaimana cara order?', 
    a: 'Buat akun, pilih tema dari katalog, lalu siapkan draft undangan. Undangan dapat diisi terlebih dahulu, dan akan aktif setelah tema utama yang dipilih selesai dibayar.' 
  },
  { 
    q: 'Berapa lama proses pembuatan undangan?', 
    a: 'Normalnya, undangan akan selesai dalam waktu 1x24 jam setelah data form lengkap dan pembayaran terkonfirmasi. Proses bisa lebih cepat tergantung pada kelengkapan data yang Anda berikan.' 
  },
  { 
    q: 'Apakah bisa mengganti tema?', 
    a: 'Bisa. Tema lain dapat dipreview di editor. Jika ingin tema tersebut menjadi live, Anda dapat membelinya sebagai tema add-on dari dashboard.' 
  },
  { 
    q: 'Apakah bisa ganti musik sesuai request?', 
    a: 'Ya, Anda bisa mengganti musik latar belakang (background music) sesuai dengan lagu pilihan Anda sendiri untuk tier Luxury. Anda cukup melampirkan file musik atau membagikan link YouTube lagunya pada form pemesanan.' 
  },
  { 
    q: 'Apakah saya akan dibantu selama proses pembuatan undangan?', 
    a: `Tentu saja. Jika Anda mengalami kesulitan dalam mengunggah foto, mengatur peta lokasi, atau memiliki pertanyaan seputar fitur, tim support/asisten visual ${BRAND.name} siap mendampingi Anda hingga undangan siap digunakan.` 
  },
  { 
    q: `Kapan saya bisa menghubungi ${BRAND.name}?`, 
    a: 'Layanan pelanggan dan tim support kami aktif pada hari Senin - Sabtu pukul 09.00 - 17.00 WIB. Pertanyaan di luar jam operasional akan dijawab secepatnya keesokan harinya.' 
  }
]

export function ProductSapaTamu() {
  const navigate = useNavigate()
  const product = PRODUCTS.find((p) => p.id === 'sapatamu')!

  const handlePreviewClick = (templateId: string) => {
    const previewUrl = buildSapatamuPublicPreviewUrl(templateId)
    if (previewUrl) navigate(previewUrl)
  }

  return (
    <>
      <Navbar />
      <main>
        {/* HERO SECTION */}
        <section className="relative flex min-h-[94svh] items-end overflow-hidden bg-[#161b14] pb-14 pt-32 text-white sm:pb-16 lg:min-h-[96svh] lg:items-center lg:pt-36">
          <img
            src="/images/sapatamu-hero-couple.jpg"
            alt={`${product.name} wedding invitation`}
            className="absolute inset-0 h-full w-full object-cover object-[58%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,16,12,0.78)_0%,rgba(12,16,12,0.50)_38%,rgba(12,16,12,0.16)_72%,rgba(12,16,12,0.34)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#11150f]/85 via-[#11150f]/32 to-transparent" />

          <div className="container-wide relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.32em] text-white/72">
                SapaTamu Wedding Invitation
              </p>
              <h1 className="max-w-2xl font-heading text-[clamp(3.2rem,8vw,7.6rem)] leading-[0.9] text-white">
                Undangan yang terasa personal.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/78 sm:text-lg">
                Rancang momen pertama yang dilihat tamu dengan visual anggun, tautan rapi, dan pengalaman yang tenang.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/daftar?product=sapatamu&tier=pro" id="sapatamu-hero-cta" className="w-full sm:w-auto">
                  <Button size="lg" className="h-[52px] w-full rounded-full bg-white px-7 text-sm font-semibold text-[#1f281a] shadow-[0_16px_38px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:bg-white/90">
                    Mulai Undangan
                  </Button>
                </Link>
                <a href="#katalog" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="h-[52px] w-full rounded-full border-white/40 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/15 hover:text-white">
                    Lihat Tema
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CATALOG TABS SECTION */}
        <section className="section-padding bg-muted/10 border-y" id="katalog">
          <div className="container-wide">
             <div className="text-center mb-12">
              <span className="label-text text-accent text-xs block mb-3">Katalog Desain</span>
              <h2 className="text-foreground mx-auto max-w-lg mb-4">
                Pilih Undangan Anda
              </h2>
             <p className="text-muted-foreground max-w-xl mx-auto">
                Calla Lily dan Honeysuckle tersedia di Luxury. Signature disiapkan khusus untuk Aishwarya.
              </p>
            </div>

            <Tabs defaultValue="luxury" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-background border shadow-sm h-12 p-1 rounded-xl">
                  {CATALOG_TIERS.map((tier) => (
                    <TabsTrigger key={tier.id} value={tier.id} className="rounded-lg px-8 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium transition-all">
                      {tier.label}
                      {tier.comingSoon ? (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                          Soon
                        </span>
                      ) : null}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {CATALOG_TIERS.map((tier) => (
                <TabsContent key={tier.id} value={tier.id} className="mt-0">
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {tier.templates.map((tpl) => (
                      <div key={tpl.id} className={cn(
                        'group overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300',
                        tier.comingSoon ? 'opacity-75' : 'hover:-translate-y-1 hover:border-accent/35 hover:shadow-xl',
                      )}>
                        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                           <img src={tpl.image} alt={tpl.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80" />

                           <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
                             <Badge className={cn(
                               'border-0 bg-white/90 text-foreground shadow-sm',
                               tier.comingSoon && 'bg-amber-100 text-amber-800',
                             )}>
                               {tier.comingSoon ? 'Coming Soon' : tier.label}
                             </Badge>
                           </div>

                           <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                             <Button 
                               onClick={() => handlePreviewClick(tpl.id)}
                               disabled={tier.comingSoon}
                               className="rounded-full bg-white text-black shadow-2xl transition-all hover:bg-white"
                             >
                               <PlayCircle className="w-4 h-4 mr-2" /> {tier.comingSoon ? 'Coming Soon' : 'Preview'}
                             </Button>
                           </div>
                        </div>

                        <div className="flex min-h-[156px] flex-col p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">{tier.label}</p>
                              <h4 className="mt-2 font-heading text-xl font-semibold leading-tight text-foreground">{tpl.name}</h4>
                            </div>
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                          </div>
                          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{tpl.description}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* PRICING TIERS */}
        <section className="section-padding" id="harga">
          <div className="container-narrow">
            <div className="text-center mb-16">
              <span className="label-text text-accent text-xs block mb-3">Harga & Paket</span>
              <h2 className="text-foreground mx-auto max-w-lg">
                Pilih paket sesuai impian Anda
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {PRICING_TIERS.map((tier, i) => (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                  >
                    <div className={cn(
                      'rounded-2xl border p-6 flex flex-col h-full relative overflow-hidden transition-all',
                      tier.comingSoon
                        ? 'bg-muted/25 border-border'
                        : 'bg-accent/5 border-accent shadow-xl shadow-accent/10'
                    )}>
                      {tier.badge && (
                        <div className="absolute top-0 right-0">
                          <div className={cn(
                            "text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-lg text-white",
                            tier.comingSoon ? "bg-amber-600" : "bg-accent"
                          )}>
                            {tier.badge}
                          </div>
                        </div>
                      )}

                      <h3 className="font-heading text-xl font-semibold mt-4">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">{tier.description}</p>
                      
                      <div className="my-6">
                        {tier.price ? (
                          <span className="text-3xl font-heading font-bold">{formatRupiah(tier.price)}</span>
                        ) : (
                          <span className="text-3xl font-heading font-bold text-muted-foreground">Coming Soon</span>
                        )}
                      </div>

                      <div className="space-y-3 mb-8 flex-1">
                        {tier.features.map((feature, idx) => (
                           <div key={idx} className="flex gap-3 text-sm items-start">
                            {feature.included ? (
                               <div className="bg-success/10 p-1 rounded-full text-success mt-0.5 shrink-0">
                                 <Check className="w-3 h-3" />
                               </div>
                             ) : null}
                             <span className={cn(feature.included ? "text-foreground" : "text-muted-foreground line-through opacity-70")}>
                               {feature.text}
                             </span>
                           </div>
                        ))}
                      </div>

                      <Button 
                        onClick={() => navigate(`/daftar?product=sapatamu&tier=${tier.id}`)}
                        disabled={tier.comingSoon}
                        className={cn(
                          "w-full rounded-xl h-12 font-medium",
                          tier.comingSoon
                            ? "bg-muted text-muted-foreground shadow-none"
                            : "bg-accent hover:bg-terracotta-hover text-white shadow-lg"
                        )}
                      >
                        {tier.comingSoon ? 'Coming Soon' : `Pilih ${tier.name}`}
                      </Button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20 bg-muted/30 border-t" id="faq">
          <div className="container-narrow">
            <div className="text-center mb-10">
              <span className="label-text text-accent text-xs block mb-3">FAQ</span>
              <h2 className="text-foreground">Pertanyaan yang Sering Diajukan</h2>
            </div>
            
            <div className="max-w-2xl mx-auto bg-card border rounded-2xl p-6 shadow-sm">
              {/* @ts-ignore */}
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-b last:border-0">
                    <AccordionTrigger className="text-left font-medium text-[15px] hover:text-accent transition-colors">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
