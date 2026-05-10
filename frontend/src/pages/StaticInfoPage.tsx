import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type LinkCta = {
  label: string
  href: string
}

type AboutPageConfig = {
  layout: 'about'
  hero: {
    title: string
    lead: string
  }
  visionMission: {
    vision: string
    mission: string
  }
  cta: {
    title: string
    body: string
    primary: LinkCta
    secondary?: LinkCta
  }
}

type HelpPageConfig = {
  layout: 'help'
  hero: {
    title: string
    lead: string
    searchPlaceholder: string
  }
  categories: Array<{
    title: string
    description: string
    href: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
  support: {
    title: string
    body: string
    primary: LinkCta
    secondary?: LinkCta
  }
}

type DocBreadcrumb = {
  label: string
  href?: string
}

type DocTocGroup = {
  title: string
  items: Array<{
    id: string
    label: string
  }>
}

type DocSection = {
  id: string
  title: string
  body: string[]
  steps?: string[]
  mediaLabel?: string
  code?: string
  note?: string
}

type DocsPageConfig = {
  layout: 'docs'
  hero: {
    title: string
    lead: string
  }
  breadcrumb: DocBreadcrumb[]
  toc: DocTocGroup[]
  sections: DocSection[]
  prevNext: {
    prev?: LinkCta
    next?: LinkCta
  }
}

type LegalSubsection = {
  title: string
  paragraphs: string[]
  list?: string[]
}

type LegalSection = {
  id: string
  title: string
  paragraphs: string[]
  list?: string[]
  subsections?: LegalSubsection[]
}

type LegalPageConfig = {
  layout: 'legal'
  hero: {
    title: string
    lead: string
    lastUpdated: string
  }
  toc: Array<{
    id: string
    label: string
  }>
  sections: LegalSection[]
}

type PrivacyPageConfig = {
  layout: 'privacy'
  hero: {
    title: string
    lead: string
    lastUpdated: string
  }
  summary: string[]
  toc: Array<{
    id: string
    label: string
  }>
  sections: LegalSection[]
  contact: {
    title: string
    body: string
    email: string
  }
}

type ContactCard = {
  title: string
  value: string
  description: string
  href?: string
}

type ContactPageConfig = {
  layout: 'contact'
  hero: {
    title: string
    lead: string
    note: string
  }
  cards: ContactCard[]
  admin: {
    title: string
    description: string
    name: string
    role: string
    email: string
    phone: string
    phoneHref: string
    hours: string
    responseTime: string
  }
  form: {
    title: string
    description: string
    primary: LinkCta
    secondary: LinkCta
  }
}

type PageConfig =
  | AboutPageConfig
  | HelpPageConfig
  | DocsPageConfig
  | LegalPageConfig
  | PrivacyPageConfig
  | ContactPageConfig

const PAGES: Record<string, PageConfig> = {
  tentang: {
    layout: 'about',
    hero: {
      title: 'Tentang Rekavia',
      lead: 'Rekavia adalah studio produk digital yang membantu pasangan menyiapkan undangan pernikahan yang rapi, personal, dan mudah dibagikan melalui SapaTamu.',
    },
    visionMission: {
      vision: 'Menjadikan undangan digital terasa hangat, jelas, dan mudah diakses oleh semua tamu.',
      mission: 'Menghadirkan editor yang sederhana, tema yang terkurasi, serta alur pembayaran yang transparan agar pasangan fokus pada momen penting.',
    },
    cta: {
      title: 'Siap membuat undangan digital yang rapi?',
      body: 'Mulai dari draft, pilih tema, atur isi undangan, lalu aktifkan dan bagikan dengan percaya diri.',
      primary: { label: 'Coba SapaTamu', href: '/produk/sapatamu' },
      secondary: { label: 'Hubungi Kami', href: 'mailto:hello@rekavia.com' },
    },
  },
  'pusat-bantuan': {
    layout: 'help',
    hero: {
      title: 'Apa yang bisa kami bantu?',
      lead: 'Temukan jawaban cepat seputar pembuatan undangan, tema, pembayaran, dan pengiriman ke tamu.',
      searchPlaceholder: 'Cari topik bantuan, contoh: pembayaran, tema, RSVP',
    },
    categories: [
      {
        title: 'Akun dan Akses',
        description: 'Login, pengelolaan profil, dan keamanan akun.',
        href: '/panduan-penggunaan#akun-dan-akses',
      },
      {
        title: 'Membuat Undangan',
        description: 'Buat draft, isi data pasangan, dan atur acara.',
        href: '/panduan-penggunaan#mulai-dari-dashboard',
      },
      {
        title: 'Tema dan Layout',
        description: 'Preview tema, atur layout, dan gunakan add-on.',
        href: '/panduan-penggunaan#tema-dan-layout',
      },
      {
        title: 'Pembayaran',
        description: 'Aktivasi tema utama, add-on, dan status pembayaran.',
        href: '/panduan-penggunaan#pembayaran-dan-aktivasi',
      },
      {
        title: 'Daftar Tamu dan RSVP',
        description: 'Link personal, pesan WhatsApp, dan konfirmasi tamu.',
        href: '/panduan-penggunaan#kelola-daftar-tamu',
      },
      {
        title: 'Masalah Teknis',
        description: 'Kendala akses, error editor, atau laporan bug.',
        href: '/pusat-bantuan#support',
      },
    ],
    faqs: [
      {
        question: 'Apakah saya bisa menyiapkan undangan sebelum membayar?',
        answer: 'Bisa. Anda dapat membuat draft lengkap, menyiapkan semua data, lalu membayar ketika siap untuk go live.',
      },
      {
        question: 'Apa bedanya tema utama dan tema add-on?',
        answer: 'Tema utama menentukan struktur layout default dan perlu dibayar untuk mengaktifkan undangan. Tema add-on adalah tema tambahan yang dapat dipreview dan dibeli jika ingin tampilan lain.',
      },
      {
        question: 'Apakah link undangan berubah setelah diedit?',
        answer: 'Tidak. Link undangan tetap sama. Anda bisa memperbarui konten tanpa mengganti link yang sudah dibagikan.',
      },
      {
        question: 'Bagaimana cara mengirim undangan ke banyak tamu?',
        answer: 'Gunakan halaman Send untuk menambahkan daftar tamu, membuat pesan pengantar, lalu salin atau kirim link personal.',
      },
      {
        question: 'Apakah tamu harus login untuk membuka undangan?',
        answer: 'Tidak. Tamu cukup membuka link undangan yang Anda bagikan.',
      },
      {
        question: 'Bagaimana jika pembayaran gagal atau tertunda?',
        answer: 'Coba ulangi transaksi atau hubungi tim support agar kami dapat membantu pengecekan.',
      },
    ],
    support: {
      title: 'Masih butuh bantuan?',
      body: 'Jika belum menemukan jawaban, hubungi tim support agar kami bantu menelusuri kasus Anda.',
      primary: { label: 'Hubungi Tim Support', href: 'mailto:support@rekavia.com' },
      secondary: { label: 'Buat Tiket', href: 'mailto:support@rekavia.com?subject=Bantuan%20SapaTamu' },
    },
  },
  'panduan-penggunaan': {
    layout: 'docs',
    hero: {
      title: 'Panduan Penggunaan SapaTamu',
      lead: 'Ikuti langkah berikut untuk menyiapkan undangan sampai siap dibagikan.',
    },
    breadcrumb: [
      { label: 'Beranda', href: '/' },
      { label: 'Panduan Penggunaan', href: '/panduan-penggunaan' },
      { label: 'Menyiapkan Undangan' },
    ],
    toc: [
      {
        title: 'Mulai',
        items: [
          { id: 'mulai-dari-dashboard', label: 'Mulai dari dashboard' },
          { id: 'akun-dan-akses', label: 'Akun dan akses' },
          { id: 'data-pasangan-dan-acara', label: 'Isi data pasangan dan acara' },
        ],
      },
      {
        title: 'Editor',
        items: [
          { id: 'tema-dan-layout', label: 'Tema dan layout' },
          { id: 'galeri-dan-media', label: 'Galeri dan media' },
        ],
      },
      {
        title: 'Publikasi',
        items: [
          { id: 'kelola-daftar-tamu', label: 'Kelola daftar tamu' },
          { id: 'pembayaran-dan-aktivasi', label: 'Pembayaran dan aktivasi' },
          { id: 'bagikan-undangan', label: 'Bagikan undangan' },
        ],
      },
    ],
    sections: [
      {
        id: 'mulai-dari-dashboard',
        title: 'Mulai dari dashboard',
        body: [
          'Masuk ke dashboard SapaTamu dan buat undangan baru untuk mendapatkan draft yang bisa diubah kapan saja.',
          'Draft ini menjadi dasar untuk mengisi data pasangan, acara, galeri, dan pesan pengantar.',
        ],
        steps: [
          'Klik tombol Buat Undangan.',
          'Isi nama undangan dan slug yang mudah diingat.',
          'Pilih tema awal sebagai starting point.',
        ],
      },
      {
        id: 'akun-dan-akses',
        title: 'Akun dan akses',
        body: [
          'Gunakan satu akun untuk mengelola semua undangan dan pastikan data kontak selalu terbaru.',
          'Akun yang aman membantu Anda memantau pembayaran dan status undangan tanpa kendala.',
        ],
        steps: [
          'Masuk menggunakan email yang terverifikasi.',
          'Perbarui profil kontak agar notifikasi selalu terkirim.',
          'Ganti kata sandi jika ada aktivitas tidak dikenal.',
        ],
      },
      {
        id: 'data-pasangan-dan-acara',
        title: 'Isi data pasangan dan acara',
        body: [
          'Lengkapi nama mempelai, tanggal, waktu, lokasi, dan narasi singkat agar undangan tampil jelas.',
          'Gunakan preview untuk memastikan urutan acara dan detail lokasi sudah benar.',
        ],
        steps: [
          'Isi data mempelai dan keluarga inti.',
          'Tambahkan rangkaian acara beserta waktu dan tempat.',
          'Tinjau tampilan pada preview sebelum lanjut.',
        ],
        note: 'Tip: Anda dapat menyimpan draft kapan saja tanpa mengubah link publik.',
      },
      {
        id: 'tema-dan-layout',
        title: 'Tema dan layout',
        body: [
          'Tema utama menentukan struktur layout dasar undangan. Tema add-on bisa dipreview sebelum dibeli.',
          'Gunakan panel Theme untuk membandingkan tampilan dan memilih yang paling sesuai.',
        ],
        steps: [
          'Buka panel Theme di editor.',
          'Preview tema yang terkunci untuk melihat hasilnya.',
          'Apply tema utama saat siap mengaktifkan undangan.',
        ],
      },
      {
        id: 'galeri-dan-media',
        title: 'Galeri dan media',
        body: [
          'Unggah foto terbaik dan atur urutannya agar alur cerita terasa rapi.',
          'Sesuaikan posisi gambar di setiap slot menggunakan fitur adjustment.',
        ],
        steps: [
          'Pilih Media Library untuk mengunggah foto.',
          'Atur urutan foto sesuai cerita yang diinginkan.',
          'Gunakan pengaturan crop agar komposisi lebih rapi.',
        ],
        mediaLabel: 'Gambar: contoh panel galeri dan adjustment.',
      },
      {
        id: 'kelola-daftar-tamu',
        title: 'Kelola daftar tamu',
        body: [
          'Gunakan halaman Send untuk menyusun daftar tamu dan membuat link personal.',
          'Link personal membantu Anda melacak RSVP dan menyusun pesan yang lebih rapi.',
        ],
        steps: [
          'Tambahkan tamu satu per satu atau impor dari file.',
          'Susun pesan pengantar yang sopan dan jelas.',
          'Generate link personal untuk setiap tamu.',
        ],
        mediaLabel: 'Gambar: contoh halaman Send dan daftar tamu.',
      },
      {
        id: 'pembayaran-dan-aktivasi',
        title: 'Pembayaran dan aktivasi',
        body: [
          'Undangan menjadi live setelah tema utama dibayar melalui checkout.',
          'Setelah pembayaran berhasil, link publik siap dibuka oleh tamu.',
        ],
        steps: [
          'Buka menu Checkout di dashboard.',
          'Selesaikan pembayaran sesuai instruksi.',
          'Cek status aktivasi pada halaman undangan.',
        ],
      },
      {
        id: 'bagikan-undangan',
        title: 'Bagikan undangan',
        body: [
          'Setelah aktif, bagikan undangan melalui WhatsApp atau media lain.',
          'Pastikan thumbnail metadata dan pesan pengantar sudah rapi.',
        ],
        steps: [
          'Pilih thumbnail metadata dari galeri.',
          'Salin pesan yang sudah disiapkan.',
          'Bagikan link undangan ke tamu.',
        ],
        code: 'Halo {{nama_tamu}},\nKami mengundang Anda untuk hadir di acara kami.\nLink undangan: {{link_undangan}}',
      },
    ],
    prevNext: {
      prev: { label: 'Kembali ke Pusat Bantuan', href: '/pusat-bantuan' },
      next: { label: 'Syarat dan Ketentuan', href: '/syarat-ketentuan' },
    },
  },
  'syarat-ketentuan': {
    layout: 'legal',
    hero: {
      title: 'Syarat dan Ketentuan',
      lead: 'Syarat ini menjelaskan penggunaan layanan Rekavia dan SapaTamu agar pengguna memahami hak dan kewajiban.',
      lastUpdated: '8 Mei 2026',
    },
    toc: [
      { id: 'ruang-lingkup', label: 'Ruang lingkup layanan' },
      { id: 'akun-dan-keamanan', label: 'Akun dan keamanan' },
      { id: 'konten-pengguna', label: 'Konten pengguna' },
      { id: 'pembayaran-dan-addon', label: 'Pembayaran dan add-on' },
      { id: 'ketersediaan-layanan', label: 'Ketersediaan layanan' },
      { id: 'batasan-tanggung-jawab', label: 'Batasan tanggung jawab' },
      { id: 'perubahan-syarat', label: 'Perubahan syarat' },
      { id: 'hubungi-kami', label: 'Hubungi kami' },
    ],
    sections: [
      {
        id: 'ruang-lingkup',
        title: 'Ruang lingkup layanan',
        paragraphs: [
          'Rekavia menyediakan platform pembuatan undangan digital melalui SapaTamu beserta fitur pendukung seperti editor, galeri, RSVP, dan pengiriman pesan.',
          'Layanan ini ditujukan untuk kebutuhan komunikasi acara pribadi dan tidak untuk aktivitas yang melanggar hukum.',
        ],
      },
      {
        id: 'akun-dan-keamanan',
        title: 'Akun dan keamanan',
        paragraphs: [
          'Pengguna bertanggung jawab menjaga kredensial akun dan memastikan informasi yang diberikan akurat.',
        ],
        subsections: [
          {
            title: 'Kepemilikan akun',
            paragraphs: [
              'Akun dibuat menggunakan email yang valid dan seluruh aktivitas di dalam akun menjadi tanggung jawab pengguna.',
              'Jika akses diberikan kepada pihak lain, pengguna memahami risiko atas perubahan yang terjadi.',
            ],
          },
          {
            title: 'Keamanan akses',
            paragraphs: [
              'Segera ganti kata sandi jika ada indikasi akses tidak sah dan hubungi tim support untuk bantuan lebih lanjut.',
            ],
          },
        ],
      },
      {
        id: 'konten-pengguna',
        title: 'Konten pengguna',
        paragraphs: [
          'Pengguna bertanggung jawab atas konten undangan, termasuk nama, foto, lokasi, dan data tamu.',
        ],
        list: [
          'Dilarang menggunakan konten yang melanggar hak cipta atau hak pihak lain.',
          'Dilarang memasukkan data tamu tanpa izin.',
          'Konten yang menyesatkan, melanggar hukum, atau merugikan pihak lain dapat ditolak.',
        ],
      },
      {
        id: 'pembayaran-dan-addon',
        title: 'Pembayaran dan add-on',
        paragraphs: [
          'Pembayaran tema utama mengaktifkan undangan yang dipilih dan memungkinkan link publik dibuka oleh tamu.',
          'Tema add-on adalah tema tambahan yang bisa dibeli sesuai ketentuan akses yang berlaku di produk.',
        ],
      },
      {
        id: 'ketersediaan-layanan',
        title: 'Ketersediaan layanan',
        paragraphs: [
          'Kami berupaya menjaga layanan tetap tersedia, namun pemeliharaan terjadwal dapat menyebabkan gangguan sementara.',
          'Rekavia berhak melakukan pembaruan fitur untuk meningkatkan kualitas layanan.',
        ],
      },
      {
        id: 'batasan-tanggung-jawab',
        title: 'Batasan tanggung jawab',
        paragraphs: [
          'Rekavia tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan layanan.',
          'Pengguna bertanggung jawab memastikan undangan yang dibagikan sesuai dengan kebutuhan acara.',
        ],
      },
      {
        id: 'perubahan-syarat',
        title: 'Perubahan syarat',
        paragraphs: [
          'Syarat dan ketentuan dapat diperbarui dari waktu ke waktu untuk menyesuaikan layanan.',
          'Penggunaan layanan secara berkelanjutan berarti menyetujui perubahan yang berlaku.',
        ],
      },
      {
        id: 'hubungi-kami',
        title: 'Hubungi kami',
        paragraphs: [
          'Pertanyaan terkait syarat dan ketentuan dapat dikirim ke support@rekavia.com.',
        ],
      },
    ],
  },
  'kebijakan-privasi': {
    layout: 'privacy',
    hero: {
      title: 'Kebijakan Privasi',
      lead: 'Kami hanya mengumpulkan data yang dibutuhkan untuk menjalankan undangan, pembayaran, pengiriman pesan, dan peningkatan layanan.',
      lastUpdated: '8 Mei 2026',
    },
    summary: [
      'Kami mengumpulkan data akun, isi undangan, dan daftar tamu yang Anda masukkan.',
      'Data digunakan untuk menampilkan undangan, memproses pembayaran, dan dukungan.',
      'Cookies dipakai untuk menjaga sesi dan analitik dasar.',
      'Anda dapat meminta akses, koreksi, atau penghapusan data.',
    ],
    toc: [
      { id: 'data-yang-dikumpulkan', label: 'Data yang kami kumpulkan' },
      { id: 'penggunaan-data', label: 'Bagaimana kami menggunakan data Anda' },
      { id: 'cookies', label: 'Penggunaan cookies' },
      { id: 'pembagian-data', label: 'Pembagian data ke pihak ketiga' },
      { id: 'hak-pengguna', label: 'Hak-hak pengguna' },
      { id: 'kontak-privasi', label: 'Kontak privasi' },
    ],
    sections: [
      {
        id: 'data-yang-dikumpulkan',
        title: 'Data yang kami kumpulkan',
        paragraphs: [
          'Kami mengumpulkan data yang diperlukan untuk mengoperasikan undangan dan layanan pendukungnya.',
        ],
        list: [
          'Informasi akun seperti nama, email, dan nomor kontak.',
          'Konten undangan seperti teks, foto, musik, dan lokasi acara.',
          'Daftar tamu, RSVP, serta pesan yang dikirimkan.',
          'Riwayat pembayaran dan transaksi terkait layanan.',
        ],
      },
      {
        id: 'penggunaan-data',
        title: 'Bagaimana kami menggunakan data Anda',
        paragraphs: [
          'Data digunakan untuk menampilkan undangan, memproses pembayaran, dan membantu Anda saat membutuhkan dukungan.',
          'Kami juga menggunakan data secara agregat untuk peningkatan fitur dan pengalaman pengguna.',
        ],
      },
      {
        id: 'cookies',
        title: 'Penggunaan cookies',
        paragraphs: [
          'Cookies digunakan untuk menjaga sesi login, preferensi tampilan, dan analitik dasar layanan.',
          'Anda dapat menonaktifkan cookies melalui pengaturan browser, namun beberapa fitur mungkin terbatas.',
        ],
      },
      {
        id: 'pembagian-data',
        title: 'Pembagian data ke pihak ketiga',
        paragraphs: [
          'Kami hanya membagikan data kepada mitra yang diperlukan untuk menjalankan layanan, seperti penyedia pembayaran dan penyimpanan.',
          'Kami tidak menjual data pribadi kepada pihak ketiga.',
        ],
      },
      {
        id: 'hak-pengguna',
        title: 'Hak-hak pengguna',
        paragraphs: [
          'Anda berhak mengetahui, memperbaiki, atau menghapus data pribadi yang tersimpan di layanan kami.',
        ],
        list: [
          'Meminta salinan data yang kami simpan.',
          'Memperbarui atau memperbaiki data yang tidak akurat.',
          'Meminta penghapusan data tertentu sesuai ketentuan.',
        ],
      },
    ],
    contact: {
      title: 'Kontak privasi',
      body: 'Untuk permintaan akses, koreksi, atau penghapusan data, hubungi tim privasi kami melalui email.',
      email: 'privacy@rekavia.com',
    },
  },
  'hubungi-kami': {
    layout: 'contact',
    hero: {
      title: 'Hubungi Kami',
      lead: 'Butuh bantuan admin atau ingin menanyakan layanan SapaTamu? Tim kami siap membantu.',
      note: 'Respon tercepat tersedia pada jam kerja.',
    },
    cards: [
      {
        title: 'Email Admin',
        value: 'support@rekavia.com',
        description: 'Untuk bantuan teknis, akun, dan pembayaran.',
        href: 'mailto:support@rekavia.com',
      },
      {
        title: 'WhatsApp',
        value: '+62 812-1234-5678',
        description: 'Konsultasi singkat dan bantuan cepat.',
        href: 'https://wa.me/6281212345678',
      },
      {
        title: 'Jam Operasional',
        value: 'Senin-Jumat, 09.00-18.00 WIB',
        description: 'Balasan paling cepat di jam kerja.',
      },
    ],
    admin: {
      title: 'Kontak Admin',
      description: 'Admin SapaTamu menangani pertanyaan akun, aktivasi tema, dan kendala penggunaan.',
      name: 'Admin SapaTamu',
      role: 'Customer Support',
      email: 'support@rekavia.com',
      phone: '+62 812-1234-5678',
      phoneHref: 'https://wa.me/6281212345678',
      hours: 'Senin-Jumat, 09.00-18.00 WIB',
      responseTime: 'Estimasi respon: kurang dari 1 hari kerja.',
    },
    form: {
      title: 'Kirim pesan',
      description: 'Isi formulir singkat ini. Admin akan menghubungi Anda melalui email atau WhatsApp.',
      primary: { label: 'Kirim via Email', href: 'mailto:support@rekavia.com' },
      secondary: { label: 'Chat WhatsApp', href: 'https://wa.me/6281212345678' },
    },
  },
}

type StaticSlug = keyof typeof PAGES

function isExternalHref(href: string) {
  return href.startsWith('http') || href.startsWith('mailto:')
}

function ButtonLink({ href, label, variant }: { href: string; label: string; variant?: 'default' | 'outline' }) {
  const button = (
    <Button type="button" variant={variant}>
      {label}
    </Button>
  )

  if (isExternalHref(href)) {
    return <a href={href}>{button}</a>
  }

  return <Link to={href}>{button}</Link>
}

function LegalSections({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="divide-y divide-border">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24 py-6 first:pt-0 last:pb-0">
          <h2 className="text-xl font-semibold">{section.title}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={`${section.id}-p-${index}`} className="mt-3 leading-7">
              {paragraph}
            </p>
          ))}
          {section.list ? (
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {section.list.map((item) => (
                <li key={`${section.id}-item-${item}`}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.subsections?.map((subsection) => (
            <div key={`${section.id}-${subsection.title}`} className="mt-6 space-y-3">
              <h3 className="text-base font-semibold">{subsection.title}</h3>
              {subsection.paragraphs.map((paragraph, index) => (
                <p key={`${section.id}-${subsection.title}-${index}`} className="leading-7">
                  {paragraph}
                </p>
              ))}
              {subsection.list ? (
                <ul className="list-disc space-y-2 pl-5">
                  {subsection.list.map((item) => (
                    <li key={`${section.id}-${subsection.title}-${item}`}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

function AboutLayout({ page }: { page: AboutPageConfig }) {
  return (
    <>
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="container-wide max-w-5xl">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <p className="label-text text-accent">Rekavia</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{page.hero.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8">{page.hero.lead}</p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-wide max-w-5xl">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-semibold">Visi dan Misi</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <article className="space-y-3 rounded-2xl border border-border/60 p-5">
                <h3 className="text-lg font-semibold">Visi</h3>
                <p className="leading-7">{page.visionMission.vision}</p>
              </article>
              <article className="space-y-3 rounded-2xl border border-border/60 p-5">
                <h3 className="text-lg font-semibold">Misi</h3>
                <p className="leading-7">{page.visionMission.mission}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-wide max-w-4xl">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{page.cta.title}</h2>
              <p className="leading-7">{page.cta.body}</p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={page.cta.primary.href} label={page.cta.primary.label} />
                {page.cta.secondary ? (
                  <ButtonLink href={page.cta.secondary.href} label={page.cta.secondary.label} variant="outline" />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function HelpLayout({ page }: { page: HelpPageConfig }) {
  return (
    <>
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-16">
        <div className="container-wide max-w-5xl">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <p className="label-text text-accent">Pusat Bantuan</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{page.hero.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8">{page.hero.lead}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-background px-3 py-2">
                <Input
                  type="search"
                  placeholder={page.hero.searchPlaceholder}
                  aria-label="Cari topik bantuan"
                  className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="button" className="h-11">Cari</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-wide max-w-5xl">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-semibold">Kategori topik</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.categories.map((category) => (
                <article key={category.title} className="flex h-full flex-col gap-3 rounded-2xl border border-border/60 p-4">
                  <h3 className="text-base font-semibold">{category.title}</h3>
                  <p className="leading-7">{category.description}</p>
                  <Link to={category.href} className="mt-auto text-sm font-medium">
                    Lihat panduan
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-wide max-w-5xl">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-semibold">Pertanyaan populer</h2>
            <div className="mt-6 space-y-3">
              {page.faqs.map((item, index) => (
                <details key={item.question} open={index === 0} className="rounded-2xl border border-border/60 p-4">
                  <summary className="cursor-pointer text-base font-semibold">{item.question}</summary>
                  <p className="mt-3 leading-7">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="pb-24">
        <div className="container-wide max-w-5xl">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{page.support.title}</h2>
              <p className="leading-7">{page.support.body}</p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={page.support.primary.href} label={page.support.primary.label} />
                {page.support.secondary ? (
                  <ButtonLink href={page.support.secondary.href} label={page.support.secondary.label} variant="outline" />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function DocsLayout({ page }: { page: DocsPageConfig }) {
  return (
    <section className="pt-28 pb-24 lg:pt-36">
      <div className="container-wide max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <nav aria-label="Daftar isi panduan" className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold">Daftar isi</h2>
              <div className="mt-4 space-y-4">
                {page.toc.map((group) => (
                  <details key={group.title} open>
                    <summary className="cursor-pointer text-sm font-semibold">{group.title}</summary>
                    <ul className="mt-3 space-y-2 pl-4">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <a href={`#${item.id}`} className="text-sm text-muted-foreground">
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </nav>
          </aside>

          <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="space-y-10">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {page.breadcrumb.map((crumb, index) => (
                    <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                      {crumb.href ? <Link to={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                      {index < page.breadcrumb.length - 1 ? <span aria-hidden="true">/</span> : null}
                    </li>
                  ))}
                </ol>
              </nav>

              <header className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{page.hero.title}</h1>
                <p className="max-w-3xl text-lg leading-8">{page.hero.lead}</p>
              </header>

              <div className="space-y-8">
                {page.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 space-y-4 rounded-2xl border border-border/60 p-5"
                  >
                    <h2 className="text-2xl font-semibold">{section.title}</h2>
                    {section.body.map((paragraph, index) => (
                      <p key={`${section.id}-body-${index}`} className="leading-7">
                        {paragraph}
                      </p>
                    ))}
                    {section.steps ? (
                      <ol className="list-decimal space-y-2 pl-5">
                        {section.steps.map((step) => (
                          <li key={`${section.id}-${step}`} className="leading-7">
                            {step}
                          </li>
                        ))}
                      </ol>
                    ) : null}
                    {section.note ? <p className="leading-7 text-muted-foreground">{section.note}</p> : null}
                    {section.mediaLabel ? (
                      <figure className="space-y-2">
                        <div
                          role="img"
                          aria-label={section.mediaLabel}
                          className="min-h-[160px] rounded-2xl border border-dashed border-border bg-muted/20"
                        />
                        <figcaption className="text-sm text-muted-foreground">{section.mediaLabel}</figcaption>
                      </figure>
                    ) : null}
                    {section.code ? (
                      <pre className="overflow-x-auto rounded-2xl border border-border bg-muted/20 p-4 text-sm">
                        <code>{section.code}</code>
                      </pre>
                    ) : null}
                  </section>
                ))}
              </div>

              <nav aria-label="Navigasi dokumen" className="flex flex-wrap gap-3 border-t border-border/60 pt-6">
                {page.prevNext.prev ? (
                  <ButtonLink href={page.prevNext.prev.href} label={page.prevNext.prev.label} variant="outline" />
                ) : null}
                {page.prevNext.next ? <ButtonLink href={page.prevNext.next.href} label={page.prevNext.next.label} /> : null}
              </nav>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function ContactLayout({ page }: { page: ContactPageConfig }) {
  return (
    <>
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-16">
        <div className="container-wide max-w-5xl">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <p className="label-text text-accent">Hubungi Kami</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{page.hero.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8">{page.hero.lead}</p>
            <p className="mt-2 text-sm text-muted-foreground">{page.hero.note}</p>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-wide max-w-5xl">
          <div className="grid gap-4 md:grid-cols-3">
            {page.cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-base font-semibold">{card.title}</h2>
                <p className="mt-3 text-lg font-semibold">
                  {card.href ? (
                    <a href={card.href} className="underline underline-offset-4">
                      {card.value}
                    </a>
                  ) : (
                    card.value
                  )}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-wide max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">{page.admin.title}</h2>
              <p className="mt-3 leading-7">{page.admin.description}</p>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">{page.admin.name}</span> - {page.admin.role}
                </p>
                <p>
                  Email: <a href={`mailto:${page.admin.email}`} className="underline underline-offset-4">{page.admin.email}</a>
                </p>
                <p>
                  WhatsApp: <a href={page.admin.phoneHref} className="underline underline-offset-4">{page.admin.phone}</a>
                </p>
                <p>{page.admin.hours}</p>
                <p>{page.admin.responseTime}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">{page.form.title}</h2>
              <p className="mt-3 leading-7">{page.form.description}</p>
              <form className="mt-5 space-y-3" onSubmit={(event) => event.preventDefault()}>
                <Input
                  placeholder="Nama lengkap"
                  className="h-11 rounded-2xl border-border bg-background"
                  aria-label="Nama lengkap"
                />
                <Input
                  type="email"
                  placeholder="Email aktif"
                  className="h-11 rounded-2xl border-border bg-background"
                  aria-label="Email"
                />
                <Input
                  type="tel"
                  placeholder="Nomor WhatsApp"
                  className="h-11 rounded-2xl border-border bg-background"
                  aria-label="Nomor WhatsApp"
                />
                <Textarea
                  placeholder="Ceritakan kebutuhan Anda..."
                  className="min-h-[140px] rounded-2xl border-border bg-background"
                  aria-label="Pesan"
                />
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href={page.form.primary.href} label={page.form.primary.label} />
                  <ButtonLink href={page.form.secondary.href} label={page.form.secondary.label} variant="outline" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function LegalLayout({ page }: { page: LegalPageConfig }) {
  return (
    <section className="pt-28 pb-24 lg:pt-36">
      <div className="container-wide max-w-4xl space-y-8">
        <header className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <p className="label-text text-accent">Dokumen Legal</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{page.hero.title}</h1>
          <p className="mt-4 text-lg leading-8">{page.hero.lead}</p>
          <p className="mt-2 text-sm text-muted-foreground">Terakhir diperbarui: {page.hero.lastUpdated}</p>
        </header>

        <nav aria-label="Daftar isi" className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Daftar isi</h2>
          <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
            {page.toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <LegalSections sections={page.sections} />
        </div>
      </div>
    </section>
  )
}

function PrivacyLayout({ page }: { page: PrivacyPageConfig }) {
  return (
    <section className="pt-28 pb-24 lg:pt-36">
      <div className="container-wide max-w-4xl space-y-8">
        <header className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <p className="label-text text-accent">Kebijakan Privasi</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{page.hero.title}</h1>
          <p className="mt-4 text-lg leading-8">{page.hero.lead}</p>
          <p className="mt-2 text-sm text-muted-foreground">Terakhir diperbarui: {page.hero.lastUpdated}</p>
        </header>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Ringkasan</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            {page.summary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <nav aria-label="Daftar isi" className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Daftar isi</h2>
          <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
            {page.toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-8">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <LegalSections sections={page.sections} />
          </div>
          <section id="kontak-privasi" className="scroll-mt-24 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-xl font-semibold">{page.contact.title}</h2>
            <p className="mt-3 leading-7">{page.contact.body}</p>
            <p className="mt-2 leading-7">{page.contact.email}</p>
          </section>
        </div>
      </div>
    </section>
  )
}

export function StaticInfoPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const location = useLocation()
  const routeSlug = slug || location.pathname.replace(/^\//, '')
  const page = PAGES[routeSlug as StaticSlug]

  if (!page) return <Navigate to="/" replace />

  return (
    <>
      <Navbar />
      <main className="bg-background">
        {page.layout === 'about' ? <AboutLayout page={page} /> : null}
        {page.layout === 'help' ? <HelpLayout page={page} /> : null}
        {page.layout === 'docs' ? <DocsLayout page={page} /> : null}
        {page.layout === 'contact' ? <ContactLayout page={page} /> : null}
        {page.layout === 'legal' ? <LegalLayout page={page} /> : null}
        {page.layout === 'privacy' ? <PrivacyLayout page={page} /> : null}
      </main>
      <Footer />
    </>
  )
}
