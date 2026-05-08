const ASSET_BASE = '/sapatamu-themes/aishwarya-peonny/original';
const picture = (name: string) => `${ASSET_BASE}/pictures/${name}`;
const music = (name: string) => `${ASSET_BASE}/musics/${name}`;
const video = (name: string) => `${ASSET_BASE}/videos/${name}`;

const FONT_BELGIANO = 'aishwarya-font-belgiano';
const FONT_NEUTICA = 'aishwarya-font-neutica';
const FONT_PINYON = 'aishwarya-font-pinyon';
const FONT_LORA = 'aishwarya-font-lora';
const FONT_POPPINS = 'aishwarya-font-poppins';

const sanitizeTextContent = (value: string) => value
  .replaceAll('â€œ', '&ldquo;')
  .replaceAll('â€', '&rdquo;')
  .replaceAll('â€¢', '&middot;')
  .replaceAll('�', '');

const backgroundDetails = {
  type: 'image',
  color: '#fef9f3',
  opacity: 0.08,
  gradient: {
    disabled: false,
    from: 'rgba(254, 249, 243, 0.08)',
    to: 'rgba(228, 206, 186, 0.18)',
  },
  blend: {
    disabled: true,
    mode: 'normal',
  },
};

const text = (
  content: string,
  options: Partial<{
    font: string;
    size: number;
    lineHeight: number;
    color: string;
    align: 'left' | 'center' | 'right';
    top: number;
    bottom: number;
    animationStyle: number;
    animationDuration: number;
  }> = {},
) => ({
  content: sanitizeTextContent(content),
  font: options.font ?? FONT_LORA,
  size: options.size ?? 15,
  lineHeight: options.lineHeight ?? 24,
  color: options.color ?? '#46402a',
  align: options.align ?? 'center',
  padding: { top: options.top ?? 4, bottom: options.bottom ?? 4 },
  disabled: false,
  animation: { style: options.animationStyle ?? 5, duration: options.animationDuration ?? 2.4 },
  box: {
    disabled: true,
    borderRadius: 0,
    gradientAngle: 0,
    backgroundColor: '#ffffff00',
    backgroundColor2: '#ffffff00',
  },
});

const button = (
  content: string,
  link: string,
  options: Partial<{ top: number; bottom: number; backgroundColor: string; color: string }> = {},
) => ({
  content,
  link,
  font: FONT_POPPINS,
  size: 12,
  align: 'center',
  color: options.color ?? '#fef9f3',
  padding: { top: options.top ?? 5, bottom: options.bottom ?? 5 },
  disabled: false,
  animation: { style: 5, duration: 2 },
  borderSize: 1,
  borderColor: '#c4a15d',
  borderRadius: 999,
  backgroundColor: options.backgroundColor ?? '#a54141',
  backgroundColor2: options.backgroundColor ?? '#7f3131',
  gradientAngle: 180,
  icon: { disabled: true, name: '', src: '' },
});

const image = (content: string, options: Partial<{ size: number; radius: string; top: number; bottom: number }> = {}) => ({
  content,
  size: options.size ?? 220,
  borderRadius: options.radius ?? '999px',
  borderSize: 0,
  borderColor: '#fef9f3',
  padding: { top: options.top ?? 4, bottom: options.bottom ?? 4 },
  disabled: false,
  animation: { style: 8, duration: 2.8 },
  frame: { disabled: true, content: '' },
});

const layers = (...items: Array<Record<string, unknown>>) => items;

const VINTAGE_MENU = {
  enabled: true,
  variant: 'sandhayu-side-menu',
  items: [
    { label: 'Gallery', target: '#gallery' },
    { label: 'RSVP', target: '#rsvp' },
    { label: 'Wedding Gift', target: '#gift' },
    { label: 'Souvenir Card', target: 'popup:souvenir-card' },
  ],
};

const VINTAGE_POPUPS = {
  qrCheckin: {
    title: 'QR Check-in',
    image: picture('Heritage-Stamp-2-1024x1024.webp'),
    description: 'Silahkan tunjukan QR Code ini kepada penerima tamu undangan di lokasi acara.',
    downloadLabel: 'Download Kartu Akses',
    downloadMode: 'card',
    sourceElement: 'qr-boundary',
  },
  souvenirCard: {
    title: 'Souvenir Card',
    image: picture('Heritage-Wedding-Souvenir-e1770784014924-1364x2048.webp'),
    description: 'Kartu souvenir digital untuk tamu undangan.',
    downloadLabel: 'Download',
    downloadMode: 'image-card',
  },
  weddingFrame: {
    title: 'Wedding Frame',
    image: picture('Heritage-Frame-scaled-1-1006x1536.webp'),
    description: 'Unggah dan abadikan momen kamu saat menghadiri pernikahan kami dengan menggunakan Instagram Frame.',
    downloadLabel: 'Open Frame',
    downloadMode: 'image-card',
  },
};

const pageBase = (background: string, extraLayers: Array<Record<string, unknown>> = []) => ({
  vintageRenderer: 'aishwarya-peonny',
  vintageMenu: VINTAGE_MENU,
  vintagePopups: VINTAGE_POPUPS,
  background,
  backgroundDetails,
  cornerElements: {
    style: {
      opacity: 1,
      gradient: { disabled: true, from: '#ffffff', to: '#ffffff' },
      blend: { disabled: true, mode: 'normal' },
    },
    data: [
      { type: 'top_left', url: picture('Heritage-Bunga-1.webp'), disabled: false, animation: { style: 17, duration: 5 } },
      { type: 'top_right', url: picture('Heritage-Bunga-2.webp'), disabled: false, animation: { style: 17, duration: 5 } },
      { type: 'bottom_left', url: picture('Heritage-Bunga-3.webp'), disabled: false, animation: { style: 17, duration: 5 } },
      { type: 'bottom_right', url: picture('Heritage-Bunga-4.webp'), disabled: false, animation: { style: 17, duration: 5 } },
    ],
  },
  vintageLayers: layers(
    { id: 'sky', src: picture('Heritage-Langit-1024x677.webp'), className: 'vintage-layer-sky' },
    { id: 'butterfly', src: picture('Heritage-Kupu.webp'), className: 'vintage-layer-butterfly', animation: 'float' },
    ...extraLayers,
  ),
});

const galleryItems = [
  'Heritage-Sandhayu-IMG_6427.webp',
  'Heritage-Sandhayu-IMG_6428.webp',
  'Heritage-Sandhayu-IMG_6429.webp',
  'Heritage-Sandhayu-IMG_6430.webp',
  'Heritage-Sandhayu-IMG_6434.webp',
  'Heritage-Sandhayu-IMG_6435.webp',
  'Heritage-Sandhayu-IMG_6438.webp',
  'Heritage-Sandhayu-IMG_6440.webp',
].map(picture);

export const AISHWARYA_PEONNY_SOURCE = {
  id: 'aishwarya-peonny',
  name: 'Aishwarya Peonny',
  slug: 'aishwarya-peonny',
  cover: picture('Heritage-Background-Home.webp'),
  background: picture('Heritage-Background-Home.webp'),
  music: music('SANDHAYU-SONG-Donkgedank-KASWOSIH-Backsound-Nusantara-Relaxing-Music.mp3'),
  frames: pageBase(picture('Heritage-Background-Home.webp')).cornerElements,
  layouts: [
    {
      id: 'aishwarya-opening',
      isActive: true,
      name: 'Opening',
      data: {
        ...pageBase(picture('Heritage-Background-Home.webp'), [
          { id: 'home-skyline', src: picture('Heritage-Homepage-Langit-1024x696.webp'), className: 'vintage-layer-home-skyline' },
          { id: 'home-mountain', src: picture('Heritage-Homepage-Gunung-1024x587.webp'), className: 'vintage-layer-home-mountain' },
          { id: 'home-building', src: picture('Heritage-Homepage-Bangunan-931x1024.webp'), className: 'vintage-layer-home-building' },
          { id: 'home-bush', src: picture('Heritage-Homepage-Semak-1024x440.webp'), className: 'vintage-layer-home-bush' },
          { id: 'home-flower', src: picture('Heritage-Flower.webp'), className: 'vintage-layer-home-flower', animation: 'slow-rotate' },
          { id: 'stamp', src: picture('Heritage-Stamp-1024x1024.webp'), className: 'vintage-layer-stamp' },
        ]),
        vintageGate: {
          enabled: true,
          lockScrollUntilOpen: true,
          hideLayerCoverAfterOpen: true,
          secondOpenButtonLabel: 'the story begins...',
        },
        text1: text('<p>THE WEDDING OF</p>', { font: FONT_POPPINS, size: 12, lineHeight: 18, color: '#a54141', top: 26 }),
        text2: text('<p>{{nick-name-1}} &amp; {{nick-name-2}}</p>', { font: FONT_PINYON, size: 54, lineHeight: 58, color: '#a54141', animationStyle: 15 }),
        text3: text('<p>“A great marriage is not when the perfect couple comes together. It is when an imperfect couple learns to enjoy their differences.”</p>', { font: FONT_LORA, size: 13, lineHeight: 22, color: '#46402a' }),
        text4: text('<p>Yth. Bapak/Ibu/Saudara/i</p><p><strong>Tamu Undangan</strong></p>', { font: FONT_POPPINS, size: 13, lineHeight: 22, color: '#46402a', top: 36 }),
        button: button('BUKA UNDANGAN', '#open', { top: 8, bottom: 1 }),
        button2: button('QR CHECK-IN', 'popup:qr-checkin', { top: 1, backgroundColor: '#46402a' }),
      },
    },
    {
      id: 'aishwarya-quote',
      isActive: true,
      name: 'Quote',
      data: {
        ...pageBase(picture('Heritage-BG.webp'), [
          { id: 'tree', src: picture('Heritage-Tree.webp'), className: 'vintage-layer-tree' },
          { id: 'wax', src: picture('Heritage-Stamp-2-1024x1024.webp'), className: 'vintage-layer-wax' },
          { id: 'quote-flower', src: picture('Heritage-Flower-2.webp'), className: 'vintage-layer-quote-flower' },
        ]),
        text1: text('<p>“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan diantaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”</p>', { font: FONT_LORA, size: 15, lineHeight: 22, color: '#777064', top: 44 }),
        text2: text('<p><strong>Q.S. Ar-Rum : 21</strong></p>', { font: FONT_LORA, size: 14, lineHeight: 20, color: '#46402a', top: 12 }),
      },
    },
    {
      id: 'aishwarya-mempelai',
      isActive: true,
      name: 'Bride & Groom',
      data: {
        ...pageBase(picture('Heritage-BG-3.webp'), [
          { id: 'couple-engraving-left', src: picture('Heritage-Engraving-2.webp'), className: 'vintage-layer-couple-engraving-left' },
          { id: 'couple-engraving-right', src: picture('Heritage-Engraving-3.webp'), className: 'vintage-layer-couple-engraving-right' },
          { id: 'couple-flower', src: picture('Heritage-Flower-5.webp'), className: 'vintage-layer-couple-flower' },
        ]),
        text1: text('<p>Bride &amp; Groom</p>', { font: FONT_PINYON, size: 44, lineHeight: 48, color: '#a54141' }),
        text2: text('<p>With joyful hearts, we invite you to celebrate our wedding day.</p>', { size: 14, lineHeight: 23 }),
        image1: image(picture('Heritage-Sandhayu-IMG_6049.webp'), { size: 210 }),
        text3: text('<p>{{full-name-1}}</p><p>{{desc-1}}</p>', { font: FONT_BELGIANO, size: 22, lineHeight: 30, color: '#a54141' }),
        url1: button('@{{nick-name-1}}', 'https://instagram.com', { backgroundColor: '#46402a' }),
        image2: image(picture('Bagas-Naila-LIBLOP-PICTURE-2630245.webp'), { size: 210 }),
        text4: text('<p>{{full-name-2}}</p><p>{{desc-2}}</p>', { font: FONT_BELGIANO, size: 22, lineHeight: 30, color: '#a54141' }),
        url2: button('@{{nick-name-2}}', 'https://instagram.com', { backgroundColor: '#46402a' }),
      },
    },
    {
      id: 'aishwarya-love-story',
      isActive: true,
      name: 'Journey of Love',
      data: {
        ...pageBase(picture('Heritage-Background-Event.webp'), [
          { id: 'story-frame-strip', src: picture('Heritage-Frame-Event-Crop-1024x193.webp'), className: 'vintage-layer-story-strip' },
          { id: 'story-flower', src: picture('Heritage-Flower-6.webp'), className: 'vintage-layer-story-flower' },
        ]),
        text1: text('<p>Journey of Love</p>', { font: FONT_PINYON, size: 44, lineHeight: 50, color: '#a54141' }),
        story: {
          title: 'Journey of Love',
          description: 'Cerita perjalanan cinta kami dari awal bertemu hingga hari bahagia ini.',
          buttonLabel: 'Lihat Perjalanan Cinta Kami',
          content: [
            { title: 'First Meet', date: '2019', description: 'Kami dipertemukan dalam momen sederhana yang tumbuh menjadi awal cerita panjang.', image: picture('Heritage-Sandhayu-IMG_6435-1-e1771656736942.webp') },
            { title: 'Engagement', date: '2025', description: 'Kami memantapkan hati dan keluarga untuk melangkah menuju pernikahan.', image: picture('Heritage-Sandhayu-IMG_6441-1-e1771656179893-1536x1021.webp') },
            { title: 'Wedding Day', date: '{{event-date-1}}', description: 'Hari ketika doa dan restu keluarga menyatukan kami.', image: picture('Heritage-Sandhayu-IMG_6438.webp') },
          ],
          padding: { top: 4, bottom: 4 },
          animation: { style: 8, duration: 2.4 },
          disabled: false,
          backgroundColor: '#fef9f3cc',
          backgroundColor2: '#e4cebaaa',
        },
      },
    },
    {
      id: 'aishwarya-save-date',
      isActive: true,
      name: 'Save the Date',
      data: {
        ...pageBase(picture('Heritage-BG-1-1024x443.webp'), [
          { id: 'save-tree', src: picture('Heritage-Tree.webp'), className: 'vintage-layer-save-tree' },
          { id: 'save-butterfly', src: picture('Heritage-Kupu.webp'), className: 'vintage-layer-save-butterfly', animation: 'float' },
        ]),
        text1: text('<p>Save the Date</p>', { font: FONT_PINYON, size: 48, lineHeight: 54, color: '#a54141', top: 40 }),
        text2: text('<p>We found love in each other. And we are ready to begin forever.</p>', { size: 14, lineHeight: 24 }),
        timer: {
          content: '{{event-date-1}}T{{time-start-1}}:00',
          size1: 28,
          size2: 10,
          color1: '#a54141',
          color2: '#46402a',
          padding: { top: 8, bottom: 8 },
          animation: { style: 5, duration: 2 },
          borderSize: 1,
          borderColor: '#e4ceba',
          borderRadius: 14,
          backgroundColor: '#fef9f3dd',
          backgroundColor2: '#fef9f3bb',
          gradientAngle: 180,
          english: true,
          disabled: false,
        },
        button: button('ADD TO CALENDAR', '#calendar'),
      },
    },
    {
      id: 'aishwarya-events',
      isActive: true,
      name: 'Date & Place',
      data: {
        ...pageBase(picture('Heritage-Background-Event.webp'), [
          { id: 'event-strip-top', src: picture('Heritage-Frame-Event-Crop-1024x193.webp'), className: 'vintage-layer-event-strip-top' },
          { id: 'event-strip-bottom', src: picture('Heritage-Frame-Event-Crop-1024x193.webp'), className: 'vintage-layer-event-strip-bottom' },
        ]),
        text1: text('<p>Date &amp; Place</p>', { font: FONT_PINYON, size: 46, lineHeight: 52, color: '#a54141' }),
        text2: text('<p><strong>{{event-name-1}}</strong></p><p>{{event-date-1}}</p><p>{{time-start-1}} - {{time-end-1}} {{zone-time-1}}</p><p>{{event-location-1}}</p>', { font: FONT_BELGIANO, size: 19, lineHeight: 28, color: '#46402a' }),
        url1: button('GOOGLE MAPS', '{{map-url-1}}', { backgroundColor: '#a54141' }),
        text3: text('<p><strong>{{event-name-2}}</strong></p><p>{{event-date-2}}</p><p>{{time-start-2}} - {{time-end-2}} {{zone-time-2}}</p><p>{{event-location-2}}</p>', { font: FONT_BELGIANO, size: 19, lineHeight: 28, color: '#46402a' }),
        url2: button('GOOGLE MAPS', '{{map-url-2}}', { backgroundColor: '#a54141' }),
      },
    },
    {
      id: 'aishwarya-attire',
      isActive: true,
      name: 'Guide to Attire',
      data: {
        ...pageBase(picture('Heritage-BG.webp')),
        text1: text('<p>a Guide to Attire</p>', { font: FONT_PINYON, size: 42, lineHeight: 50, color: '#a54141' }),
        text2: text('<p>We kindly encourage our guests to wear these colors on our special day.</p>', { size: 14, lineHeight: 24 }),
        vintageDressCode: {
          swatches: ['#a54141', '#46402a', '#fef9f3', '#e4ceba', '#c4a15d'],
          description: 'Earth tone, cream, terracotta, olive, or muted gold.',
        },
      },
    },
    {
      id: 'aishwarya-live-streaming',
      isActive: true,
      name: 'Live Streaming',
      data: {
        ...pageBase(picture('Heritage-BG-3.webp')),
        text1: text('<p>Live Streaming</p>', { font: FONT_PINYON, size: 44, lineHeight: 50, color: '#a54141' }),
        text2: text('<p>For family and friends who cannot attend, please join us through our live stream.</p><p>{{event-date-1}} • {{time-start-1}} {{zone-time-1}}</p>', { size: 15, lineHeight: 26 }),
        url1: button('WATCH LIVE STREAMING', '#live-streaming', { backgroundColor: '#46402a' }),
      },
    },
    {
      id: 'aishwarya-wedding-frame',
      isActive: true,
      name: 'Wedding Frame',
      data: {
        ...pageBase(picture('Heritage-BG.webp')),
        image1: image(picture('Heritage-Frame-2-scaled-1-1382x1536.webp'), { size: 230, radius: '0px' }),
        text1: text('<p>Wedding Frame</p>', { font: FONT_PINYON, size: 44, lineHeight: 50, color: '#a54141' }),
        text2: text('<p>Celebrate with us by uploading your photo into our wedding frame.</p>', { size: 14, lineHeight: 24 }),
        button: button('OPEN FRAME GUIDE', 'popup:wedding-frame'),
        url1: button('UPLOAD PHOTO', '#wedding-frame-upload', { backgroundColor: '#46402a' }),
      },
    },
    {
      id: 'aishwarya-gallery',
      isActive: true,
      name: 'Gallery',
      data: {
        ...pageBase(picture('Heritage-Background-Event.webp'), [
          { id: 'gallery-flower', src: picture('Heritage-Flower-3.webp'), className: 'vintage-layer-gallery-flower' },
        ]),
        text1: text('<p>Our Moment</p>', { font: FONT_PINYON, size: 48, lineHeight: 54, color: '#a54141' }),
        video: {
          title: 'Wedding Motion',
          url: video('MOTION-SANDHAYU-CUT.mp4'),
          provider: 'file',
          padding: { top: 4, bottom: 8 },
          animation: { style: 5, duration: 2 },
          disabled: false,
        },
        gallery: {
          title: 'Our Moment',
          items: galleryItems,
          columns: 2,
          variant: 'gallery-mosaic-six',
          padding: { top: 8, bottom: 4 },
          animation: { style: 8, duration: 2.4 },
          disabled: false,
        },
      },
    },
    {
      id: 'aishwarya-rsvp',
      isActive: true,
      name: 'RSVP',
      data: {
        ...pageBase(picture('Heritage-BG.webp')),
        text1: text('<p>RSVP</p>', { font: FONT_PINYON, size: 48, lineHeight: 54, color: '#a54141' }),
        rsvp: {
          title: 'RSVP',
          description: 'Please confirm your attendance and send your wishes.',
          buttonLabel: 'Kirim Ucapan + RSVP',
          padding: { top: 4, bottom: 4 },
          animation: { style: 5, duration: 2 },
          disabled: false,
        },
      },
    },
    {
      id: 'aishwarya-gift',
      isActive: true,
      name: 'Wedding Gift',
      data: {
        ...pageBase(picture('Heritage-Background-Event.webp')),
        text1: text('<p>Wedding Gift</p>', { font: FONT_PINYON, size: 48, lineHeight: 54, color: '#a54141' }),
        gift: {
          title: 'Wedding Gift',
          description: 'Your prayers and presence are the greatest gifts. For those who wish to send a gift, please use the options below.',
          padding: { top: 4, bottom: 4 },
          animation: { style: 5, duration: 2 },
          disabled: false,
        },
        button: button('KIRIM ANGPAO', 'gift:angpao'),
        button2: button('KIRIM KADO', 'gift:kado', { backgroundColor: '#46402a' }),
        vintageGiftRegistry: {
          defaultVisiblePanel: 'none',
          panels: ['gift-list', 'confirmation-form'],
          confirmation: {
            title: 'Gift Confirmation',
            mode: 'whatsapp',
            whatsappLabel: 'Konfirmasi via WhatsApp',
            fields: ['Nama', 'Nominal / Hadiah', 'Pesan'],
          },
          recommendations: [
            { title: 'Gift Card', image: picture('UW-25FEB-0152-Imanuel-Vita-id-11134207-7r98s-lvlk4lxr0t0ef5.webp') },
            { title: 'Souvenir Card', image: picture('Heritage-Wedding-Souvenir-e1770784014924-1364x2048.webp') },
          ],
        },
      },
    },
    {
      id: 'aishwarya-thanks',
      isActive: true,
      name: 'Thank You',
      data: {
        ...pageBase(picture('Heritage-Background-Home.webp'), [
          { id: 'closing-stamp', src: picture('Heritage-Stamp-2-1024x1024.webp'), className: 'vintage-layer-closing-stamp' },
        ]),
        text1: text('<p>Thank You</p>', { font: FONT_PINYON, size: 48, lineHeight: 54, color: '#a54141', top: 56 }),
        text2: text('<p>It is an honor and happiness for us if you are willing to attend and give your blessing.</p>', { size: 15, lineHeight: 26 }),
        text3: text('<p>{{nick-name-1}} &amp; {{nick-name-2}}</p>', { font: FONT_PINYON, size: 44, lineHeight: 50, color: '#a54141' }),
        credit: {
          title: 'Sapatamu by Rekavia',
          description: '',
          padding: { top: 14, bottom: 4 },
          animation: { style: 5, duration: 2 },
          disabled: false,
        },
      },
    },
  ],
} as const;

export const AISHWARYA_PEONNY_FONT_IDS = {
  belgiano: FONT_BELGIANO,
  neutica: FONT_NEUTICA,
  pinyon: FONT_PINYON,
  lora: FONT_LORA,
  poppins: FONT_POPPINS,
} as const;
