import { MALAY_ETHNIC_RED_RUBY_SOURCE } from './theme-sources/malay-ethnic-red-ruby-source';
import { BATAK_ETHNIC_MAROON_MISTYROSE_SOURCE } from './theme-sources/batak-ethnic-maroon-mistyrose-source';
import {
  ADDITIONAL_SOURCE_THEME_DEFINITIONS,
  ADDITIONAL_SOURCE_THEME_FONTS,
  ADDITIONAL_SOURCE_THEME_PALETTES,
} from './theme-sources/source-theme-registry';

type JsonRecord = Record<string, any>;
type LayoutCatalogSeed = Omit<SapatamuEditorLayoutCatalogItem, 'previewImageUrl' | 'defaultPageData'>;

export type SapatamuEditorAnimation = {
  style: number;
  duration: number;
};

export type SapatamuEditorPadding = {
  top: number;
  bottom: number;
};

export type SapatamuEditorTextBox = {
  disabled: boolean;
  borderRadius: number;
  backgroundColor: string;
  backgroundColor2: string;
  gradientAngle: number;
};

export type SapatamuEditorTextElement = {
  type: 'text';
  disabled: boolean;
  content: string;
  color: string;
  font: string;
  size: number;
  align: 'left' | 'center' | 'right';
  lineHeight: number;
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
  box: SapatamuEditorTextBox;
};

export type SapatamuEditorButtonElement = {
  type: 'button' | 'url';
  disabled: boolean;
  content: string;
  color: string;
  font: string;
  size: number;
  align: 'left' | 'center' | 'right';
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
  borderSize: number;
  borderColor: string;
  borderRadius: number;
  backgroundColor: string;
  backgroundColor2: string;
  gradientAngle: number;
  link: string;
  icon: {
    disabled: boolean;
    name: string;
    src: string;
  };
};

export type SapatamuEditorImageElement = {
  type: 'image';
  disabled: boolean;
  content: string;
  size: number;
  borderRadius: string;
  borderSize: number;
  borderColor: string;
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
  frame: {
    disabled: boolean;
    content: string;
  };
};

export type SapatamuEditorTimerElement = {
  type: 'timer';
  disabled: boolean;
  content: string;
  size1: number;
  size2: number;
  color1: string;
  color2: string;
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
  borderSize: number;
  borderColor: string;
  borderRadius: number;
  backgroundColor: string;
  backgroundColor2: string;
  gradientAngle: number;
  english: boolean;
};

export type SapatamuEditorMapElement = {
  type: 'map';
  disabled: boolean;
  content: string;
  url: string;
  size: number;
  color: string;
  backgroundColor: string;
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
};

export type SapatamuEditorLineElement = {
  type: 'line';
  disabled: boolean;
  content: string;
  size: number;
  color: string;
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
};

export type SapatamuEditorGalleryElement = {
  type: 'gallery';
  disabled: boolean;
  title: string;
  items: string[];
  columns: number;
  variant:
    | 'gallery-stack'
    | 'gallery-duo'
    | 'gallery-hero-trio'
    | 'gallery-quad-offset'
    | 'gallery-quad-grid'
    | 'gallery-mosaic-six';
  frameSettings: {
    columns?: number;
    rowHeight?: number;
    gap?: number;
    slots?: Array<{
      colStart?: number;
      rowStart?: number;
      colSpan?: number;
      rowSpan?: number;
    }>;
  };
  frameSettingsByVariant?: Partial<Record<SapatamuEditorGalleryElement['variant'], SapatamuEditorGalleryElement['frameSettings']>>;
  imageAdjustments: Array<{
    x?: number;
    y?: number;
    zoom?: number;
  }>;
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
};

export type SapatamuEditorVideoElement = {
  type: 'video';
  disabled: boolean;
  title: string;
  url: string;
  provider: 'youtube' | 'file';
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
};

export type SapatamuEditorRsvpElement = {
  type: 'rsvp';
  disabled: boolean;
  title: string;
  description: string;
  buttonLabel: string;
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
};

export type SapatamuEditorGiftElement = {
  type: 'gift';
  disabled: boolean;
  title: string;
  description: string;
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
};

export type SapatamuEditorStoryElement = {
  type: 'story';
  disabled: boolean;
  title: string;
  description?: string;
  buttonLabel?: string;
  items: Array<{
    title: string;
    date: string;
    description: string;
    image?: string;
  }>;
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
};

export type SapatamuEditorSponsorElement = {
  type: 'sponsor' | 'credit';
  disabled: boolean;
  title: string;
  description: string;
  padding: SapatamuEditorPadding;
  animation: SapatamuEditorAnimation;
};

export type SapatamuEditorBackgroundDetails = {
  type: 'color' | 'image' | 'video';
  color: string;
  opacity: number;
  gradient: {
    disabled: boolean;
    from: string;
    to: string;
  };
  blend: {
    disabled: boolean;
    mode: string;
  };
};

export type SapatamuEditorCornerElement = {
  type:
    | 'top_left'
    | 'top_right'
    | 'middle_left'
    | 'middle_right'
    | 'bottom_left'
    | 'bottom_right';
  disabled: boolean;
  url: string;
  animation: SapatamuEditorAnimation;
};

export type SapatamuEditorCornerElements = {
  list: SapatamuEditorCornerElement[];
  style: {
    opacity: number;
    gradient: {
      disabled: boolean;
      from: string;
      to: string;
    };
    blend: {
      disabled: boolean;
      mode: string;
    };
  };
};

export type SapatamuEditorElement =
  | SapatamuEditorTextElement
  | SapatamuEditorButtonElement
  | SapatamuEditorImageElement
  | SapatamuEditorTimerElement
  | SapatamuEditorMapElement
  | SapatamuEditorLineElement
  | SapatamuEditorGalleryElement
  | SapatamuEditorVideoElement
  | SapatamuEditorRsvpElement
  | SapatamuEditorGiftElement
  | SapatamuEditorStoryElement
  | SapatamuEditorSponsorElement;

export type SapatamuEditorPage = {
  id: string;
  uniqueId: number;
  title: string;
  slug: string;
  layoutCode: string;
  family: string;
  isActive: boolean;
  isLocked: boolean;
  source: 'base' | 'addon';
  data: Record<string, unknown> & {
    background: string | null;
    backgroundDetails: SapatamuEditorBackgroundDetails;
    cornerElements: SapatamuEditorCornerElements;
  };
};

export type SapatamuEditorFontCatalogItem = {
  id: string;
  name: string;
  fontUrl: string;
  category: 'display' | 'serif' | 'sans' | 'script';
};

export type SapatamuEditorLayoutCatalogItem = {
  layoutCode: string;
  family: string;
  title: string;
  previewImageUrl: string;
  defaultPageData: Record<string, unknown>;
  requiredTier: 'basic' | 'premium' | 'vintage';
  requiredFeatureCode: string | null;
  maxInstances: number;
  sortOrder: number;
  supportsPreviewSelection: boolean;
  mediaRequirements: 'none' | 'image' | 'video' | 'mixed';
  defaultVisible: boolean;
};

export type SapatamuEditorFeatureGate = {
  code: string;
  enabled: boolean;
  label: string;
  reason: string | null;
};

export type SapatamuEditorPackageFeatures = {
  tierCategory: 'basic' | 'premium' | 'vintage';
  canUseImageBackground: boolean;
  canUseVideoBackground: boolean;
  canUseGallery: boolean;
  canUseVideoSection: boolean;
  canUseGift: boolean;
  canUseContact: boolean;
  canUseLoveStory: boolean;
  canUseSponsor: boolean;
  canUseExtraLink: boolean;
  canUseLiveStreaming: boolean;
};

export type SapatamuEditorState = {
  pages: SapatamuEditorPage[];
  globalBackground: string | null;
  globalBackgroundDetails: SapatamuEditorBackgroundDetails;
  cornerElements: SapatamuEditorCornerElements;
  navMenu: {
    enabled: boolean;
    activeColor: string;
    inactiveColor: string;
  };
  fullScreen: {
    enabled: boolean;
  };
  colorPalette: {
    themeId: string;
    canvas: string;
    surface: string;
    accent: string;
    accentSoft: string;
    text: string;
    muted: string;
    overlay: string;
  };
  packageFeatures: SapatamuEditorPackageFeatures;
  layoutCatalogSnapshot: Array<Pick<
    SapatamuEditorLayoutCatalogItem,
    'layoutCode' | 'family' | 'title' | 'previewImageUrl' | 'requiredTier' | 'requiredFeatureCode'
  >>;
};

export type SapatamuEditorPatchOperation =
  | {
      type: 'set_global_field';
      path: string;
      value: unknown;
    }
  | {
      type: 'set_page_field';
      uniqueId: number;
      path: string;
      value: unknown;
    }
  | {
      type: 'replace_page';
      uniqueId: number;
      page: SapatamuEditorPage;
    }
  | {
      type: 'reorder_pages';
      orderedUniqueIds: number[];
    }
  | {
      type: 'add_page';
      page: SapatamuEditorPage;
      afterUniqueId?: number;
    }
  | {
      type: 'remove_page';
      uniqueId: number;
    };

const DEFAULT_FONT_SANSSERIF = 'font-poppins';
const DEFAULT_FONT_DISPLAY = 'font-great-vibes';
const DEFAULT_FONT_SERIF = 'font-cormorant';
const DEFAULT_FONT_SCRIPT = 'font-sacramento';
const MALAY_ETHNIC_RED_RUBY_THEME_ID = 'malay-ethnic-red-ruby';
const MALAY_ETHNIC_RED_RUBY_ASSET_BASE = '/sapatamu-themes/malay-ethnic-red-ruby';
const MALAY_ETHNIC_RED_RUBY_FONT_FAHKWANG = 'font-malay-fahkwang';
const MALAY_ETHNIC_RED_RUBY_FONT_GAUTREAUX = 'font-malay-gautreaux';
const MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH = 'font-malay-katibeh';
const MALAY_ETHNIC_RED_RUBY_FONT_ARIMA = 'font-malay-arima';
const MALAY_ETHNIC_RED_RUBY_FONT_TANGIER = 'font-malay-tangier';
const BATAK_THEME_ID = 'batak-ethnic-maroon-mistyrose';
const BATAK_ASSET_BASE = '/sapatamu-themes/batak-ethnic-maroon-mistyrose';
const BATAK_FONT_FAHKWANG = 'font-batak-fahkwang';
const BATAK_FONT_GAUTREAUX = 'font-batak-gautreaux';
const BATAK_FONT_ANNABELLE = 'font-batak-annabelle';
const BATAK_FONT_KATIBEH = 'font-batak-katibeh';
const BATAK_FONT_ARIMA = 'font-batak-arima';

const CORNER_TYPES: SapatamuEditorCornerElement['type'][] = [
  'top_left',
  'top_right',
  'middle_left',
  'middle_right',
  'bottom_left',
  'bottom_right',
];

const THEME_PALETTES: Record<
  string,
  {
    canvas: string;
    surface: string;
    accent: string;
    accentSoft: string;
    text: string;
    muted: string;
    overlay: string;
  }
> = {
  floral: {
    canvas: '#45201f',
    surface: '#5d2e2b',
    accent: '#e2c495',
    accentSoft: '#f5e9d6',
    text: '#f6e8d4',
    muted: '#d3b385',
    overlay: 'rgba(20, 12, 13, 0.38)',
  },
  minimalist: {
    canvas: '#f6f0ea',
    surface: '#ffffff',
    accent: '#8f6d52',
    accentSoft: '#efe2d4',
    text: '#2e211a',
    muted: '#8f7a6c',
    overlay: 'rgba(255, 255, 255, 0.2)',
  },
  gallery: {
    canvas: '#1c1f24',
    surface: '#262b33',
    accent: '#f1c67b',
    accentSoft: '#fde7bf',
    text: '#f4ede1',
    muted: '#bdb3a5',
    overlay: 'rgba(5, 8, 12, 0.35)',
  },
  modern: {
    canvas: '#101827',
    surface: '#182437',
    accent: '#61dafb',
    accentSoft: '#d5f5fe',
    text: '#f7fbff',
    muted: '#a7c2d8',
    overlay: 'rgba(5, 10, 18, 0.44)',
  },
  tradisional: {
    canvas: '#342015',
    surface: '#593726',
    accent: '#d9b16f',
    accentSoft: '#f8ecd0',
    text: '#faeed9',
    muted: '#c99f61',
    overlay: 'rgba(26, 12, 6, 0.42)',
  },
  bnw: {
    canvas: '#111111',
    surface: '#222222',
    accent: '#f2f2f2',
    accentSoft: '#d9d9d9',
    text: '#f8f8f8',
    muted: '#b5b5b5',
    overlay: 'rgba(0, 0, 0, 0.45)',
  },
  retro: {
    canvas: '#6f4e37',
    surface: '#8e6b4a',
    accent: '#f5d2a2',
    accentSoft: '#f8ead1',
    text: '#fff0db',
    muted: '#dec19c',
    overlay: 'rgba(61, 34, 18, 0.36)',
  },
  anime: {
    canvas: '#f6d9e8',
    surface: '#fff3f8',
    accent: '#ff5f9b',
    accentSoft: '#ffe1ef',
    text: '#4a2653',
    muted: '#9f5d88',
    overlay: 'rgba(255, 255, 255, 0.26)',
  },
  'malay-ethnic-red-ruby': {
    canvas: '#4a1a1f',
    surface: '#341215',
    accent: '#a97f71',
    accentSoft: '#feffe1',
    text: '#fffef0',
    muted: '#b8727c',
    overlay: 'rgba(52, 18, 21, 0.5)',
  },
  'batak-ethnic-maroon-mistyrose': {
    canvas: '#7b0f24',
    surface: '#230c10',
    accent: '#b55963',
    accentSoft: '#f1e9d3',
    text: '#fdfcd9',
    muted: '#b8727c',
    overlay: 'rgba(35, 12, 16, 0.5)',
  },
  ...ADDITIONAL_SOURCE_THEME_PALETTES,
};

export const SAPATAMU_EDITOR_FONT_CATALOG: SapatamuEditorFontCatalogItem[] = [
  {
    id: DEFAULT_FONT_SANSSERIF,
    name: 'Poppins',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
    category: 'sans',
  },
  {
    id: DEFAULT_FONT_SERIF,
    name: 'Cormorant Garamond',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap',
    category: 'serif',
  },
  {
    id: 'font-playfair-display',
    name: 'Playfair Display',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
    category: 'display',
  },
  {
    id: DEFAULT_FONT_DISPLAY,
    name: 'Great Vibes',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
    category: 'script',
  },
  {
    id: DEFAULT_FONT_SCRIPT,
    name: 'Sacramento',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Sacramento&display=swap',
    category: 'script',
  },
  {
    id: 'font-dm-serif-display',
    name: 'DM Serif Display',
    fontUrl: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap',
    category: 'display',
  },
  {
    id: 'font-cinzel',
    name: 'Cinzel',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap',
    category: 'display',
  },
  {
    id: 'font-questa-grande',
    name: 'Questa-Grande',
    fontUrl: 'https://use.typekit.net/czu0nkl.css',
    category: 'display',
  },
  {
    id: MALAY_ETHNIC_RED_RUBY_FONT_FAHKWANG,
    name: 'Fahkwang',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Fahkwang:wght@400;500;600;700&display=swap',
    category: 'sans',
  },
  {
    id: MALAY_ETHNIC_RED_RUBY_FONT_GAUTREAUX,
    name: 'Gautreaux',
    fontUrl: 'https://use.typekit.net/czu0nkl.css',
    category: 'script',
  },
  {
    id: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
    name: 'Katibeh',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Katibeh&display=swap',
    category: 'display',
  },
  {
    id: MALAY_ETHNIC_RED_RUBY_FONT_ARIMA,
    name: 'Arima',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Arima:wght@300;400;500;600;700&display=swap',
    category: 'serif',
  },
  {
    id: MALAY_ETHNIC_RED_RUBY_FONT_TANGIER,
    name: 'Tangier',
    fontUrl: 'https://use.typekit.net/czu0nkl.css',
    category: 'script',
  },
  {
    id: BATAK_FONT_FAHKWANG,
    name: 'Fahkwang',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Fahkwang:wght@400;500;600;700&display=swap',
    category: 'sans',
  },
  {
    id: BATAK_FONT_GAUTREAUX,
    name: 'Gautreaux',
    fontUrl: 'https://use.typekit.net/czu0nkl.css',
    category: 'script',
  },
  {
    id: BATAK_FONT_ANNABELLE,
    name: 'Annabelle-JF',
    fontUrl: 'https://use.typekit.net/czu0nkl.css',
    category: 'script',
  },
  {
    id: BATAK_FONT_KATIBEH,
    name: 'Katibeh',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Katibeh&display=swap',
    category: 'display',
  },
  {
    id: BATAK_FONT_ARIMA,
    name: 'Arima',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Arima:wght@300;400;500;600;700&display=swap',
    category: 'serif',
  },
  ...ADDITIONAL_SOURCE_THEME_FONTS.map((font) => ({ ...font } as SapatamuEditorFontCatalogItem)),
];

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeHex(value: string, fallback: string): string {
  const trimmed = cleanString(value);
  return trimmed || fallback;
}

function kebabCase(source: string): string {
  return source
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function parseJsonObject(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function getThemePalette(themeId: string) {
  return THEME_PALETTES[themeId] ?? THEME_PALETTES[MALAY_ETHNIC_RED_RUBY_THEME_ID];
}

function tierRank(value: 'basic' | 'premium' | 'vintage'): number {
  return value === 'vintage' ? 2 : value === 'premium' ? 1 : 0;
}

function buildAnimation(style: number, duration = 3): SapatamuEditorAnimation {
  return { style, duration };
}

function buildPadding(top = 4, bottom = 4): SapatamuEditorPadding {
  return { top, bottom };
}

function buildText(
  content: string,
  themeId: string,
  overrides?: Partial<SapatamuEditorTextElement>,
): SapatamuEditorTextElement {
  const palette = getThemePalette(themeId);
  return {
    type: 'text',
    disabled: false,
    content,
    color: palette.text,
    font: DEFAULT_FONT_SANSSERIF,
    size: 16,
    align: 'center',
    lineHeight: 22,
    padding: buildPadding(),
    animation: buildAnimation(5, 3),
    box: {
      disabled: true,
      borderRadius: 0,
      backgroundColor: '#ffffffff',
      backgroundColor2: '#ffffffff',
      gradientAngle: 0,
    },
    ...overrides,
  };
}

function buildButton(
  content: string,
  themeId: string,
  link = '#',
  overrides?: Partial<SapatamuEditorButtonElement>,
): SapatamuEditorButtonElement {
  const palette = getThemePalette(themeId);
  return {
    type: 'button',
    disabled: false,
    content,
    color: palette.accentSoft,
    font: DEFAULT_FONT_SANSSERIF,
    size: 14,
    align: 'center',
    padding: buildPadding(6, 6),
    animation: buildAnimation(5, 3),
    borderSize: 2,
    borderColor: palette.accent,
    borderRadius: 999,
    backgroundColor: palette.surface,
    backgroundColor2: palette.surface,
    gradientAngle: 0,
    link,
    icon: {
      disabled: true,
      name: '',
      src: '',
    },
    ...overrides,
  };
}

function buildUrl(
  content: string,
  themeId: string,
  link = '',
  overrides?: Partial<SapatamuEditorButtonElement>,
): SapatamuEditorButtonElement {
  return {
    ...buildButton(content, themeId, link, overrides),
    type: 'url',
  };
}

function buildImage(
  themeId: string,
  overrides?: Partial<SapatamuEditorImageElement>,
): SapatamuEditorImageElement {
  return {
    type: 'image',
    disabled: false,
    content: '',
    size: 156,
    borderRadius: '999px',
    borderSize: 0,
    borderColor: '#ffffff',
    padding: buildPadding(),
    animation: buildAnimation(8, 3),
    frame: {
      disabled: true,
      content: '',
    },
    ...overrides,
  };
}

function buildTimer(themeId: string, content: string): SapatamuEditorTimerElement {
  const palette = getThemePalette(themeId);
  return {
    type: 'timer',
    disabled: false,
    content,
    size1: 34,
    size2: 14,
    color1: palette.accent,
    color2: palette.accentSoft,
    padding: buildPadding(8, 8),
    animation: buildAnimation(5, 3),
    borderSize: 1,
    borderColor: palette.accent,
    borderRadius: 20,
    backgroundColor: palette.surface,
    backgroundColor2: palette.surface,
    gradientAngle: 0,
    english: false,
  };
}

function buildMap(themeId: string): SapatamuEditorMapElement {
  const palette = getThemePalette(themeId);
  return {
    type: 'map',
    disabled: false,
    content: 'Lihat Lokasi',
    url: '',
    size: 14,
    color: palette.accentSoft,
    backgroundColor: palette.surface,
    padding: buildPadding(6, 6),
    animation: buildAnimation(5, 3),
  };
}

function buildGallery(
  themeId: string,
  variant: SapatamuEditorGalleryElement['variant'] = 'gallery-mosaic-six',
): SapatamuEditorGalleryElement {
  return {
    type: 'gallery',
    disabled: false,
    title: 'Galeri Bahagia',
    items: [],
    columns: 3,
    variant,
    frameSettings: {},
    imageAdjustments: [],
    padding: buildPadding(12, 12),
    animation: buildAnimation(9, 3),
  };
}

function buildVideo(themeId: string): SapatamuEditorVideoElement {
  return {
    type: 'video',
    disabled: false,
    title: 'Video Perjalanan Kami',
    url: '',
    provider: 'youtube',
    padding: buildPadding(12, 12),
    animation: buildAnimation(9, 3),
  };
}

function buildRsvp(): SapatamuEditorRsvpElement {
  return {
    type: 'rsvp',
    disabled: false,
    title: 'Konfirmasi Kehadiran',
    description: 'Mohon bantu kami mempersiapkan momen terbaik dengan mengisi RSVP.',
    buttonLabel: 'Isi RSVP',
    padding: buildPadding(12, 12),
    animation: buildAnimation(5, 3),
  };
}

function buildGift(): SapatamuEditorGiftElement {
  return {
    type: 'gift',
    disabled: false,
    title: 'Wedding Gift',
    description: 'Doa restu Anda sudah menjadi hadiah terbaik. Jika berkenan, Anda juga dapat mengirimkan tanda kasih.',
    padding: buildPadding(12, 12),
    animation: buildAnimation(5, 3),
  };
}

function buildStory(): SapatamuEditorStoryElement {
  return {
    type: 'story',
    disabled: false,
    title: 'Love Story',
    description: 'Lihat perjalanan cinta kami dari awal bertemu hingga hari bahagia ini.',
    buttonLabel: 'Lihat Perjalanan Cinta Kami',
    items: [
      {
        title: 'Pertemuan Pertama',
        date: '',
        description: 'Ceritakan bagaimana kisah ini dimulai.',
      },
      {
        title: 'Lamaran',
        date: '',
        description: 'Ceritakan langkah besar menuju hari bahagia.',
      },
    ],
    padding: buildPadding(12, 12),
    animation: buildAnimation(5, 3),
  };
}

function buildSponsor(title: string): SapatamuEditorSponsorElement {
  return {
    type: 'sponsor',
    disabled: false,
    title,
    description: 'Tambahkan kredit, vendor, atau ucapan terima kasih khusus di sini.',
    padding: buildPadding(12, 12),
    animation: buildAnimation(5, 3),
  };
}

function buildCredit(title: string): SapatamuEditorSponsorElement {
  return {
    type: 'credit',
    disabled: false,
    title,
    description: 'Tambahkan catatan atau kredit penutup.',
    padding: buildPadding(12, 12),
    animation: buildAnimation(5, 3),
  };
}

function buildLine(themeId: string): SapatamuEditorLineElement {
  const palette = getThemePalette(themeId);
  return {
    type: 'line',
    disabled: false,
    content: '',
    size: 220,
    color: palette.accent,
    padding: buildPadding(8, 8),
    animation: buildAnimation(8, 3),
  };
}

function buildBackgroundDetails(themeId: string): SapatamuEditorBackgroundDetails {
  const palette = getThemePalette(themeId);
  return {
    type: 'color',
    color: palette.canvas,
    opacity: 1,
    gradient: {
      disabled: false,
      from: palette.canvas,
      to: palette.surface,
    },
    blend: {
      disabled: true,
      mode: 'normal',
    },
  };
}

function buildCornerElements(): SapatamuEditorCornerElements {
  return {
    list: CORNER_TYPES.map((type) => ({
      type,
      disabled: true,
      url: '',
      animation: buildAnimation(1, 1.5),
    })),
    style: {
      opacity: 1,
      gradient: {
        disabled: true,
        from: 'rgba(255,255,255,1)',
        to: 'rgba(255,255,255,1)',
      },
      blend: {
        disabled: true,
        mode: 'normal',
      },
    },
  };
}

type SourceThemeDefinition = {
  themeId: string;
  assetBase: string;
  source: JsonRecord;
  defaultFont: string;
  fontMap: Record<string, string>;
  layoutCodeBySourceName: Record<string, string>;
  layoutCatalogSeeds: Array<Omit<SapatamuEditorLayoutCatalogItem, 'previewImageUrl' | 'defaultPageData'>>;
};

function sourceThemeAsset(definition: SourceThemeDefinition, path: string): string {
  return `${definition.assetBase}/${path}`;
}

function malayEthnicRedRubyAsset(path: string): string {
  return sourceThemeAsset(SOURCE_THEME_DEFINITIONS[MALAY_ETHNIC_RED_RUBY_THEME_ID], path);
}

function sourceThemeOriginalAsset(definition: SourceThemeDefinition, source: unknown): string {
  const url = cleanString(source);
  if (!url) return '';
  if (!url.startsWith('https://be.satu.love/')) return url;

  try {
    const parsed = new URL(url);
    return `${definition.assetBase}/original${parsed.pathname}`;
  } catch {
    return url;
  }
}

function sourceThemeCoverAsset(definition: SourceThemeDefinition): string {
  return sourceThemeOriginalAsset(definition, definition.source.cover);
}

function sourceThemeBackgroundAsset(definition: SourceThemeDefinition, source: unknown): string {
  const value = cleanString(source);
  if (!value) return sourceThemeCoverAsset(definition);
  const normalized = value.toLowerCase();
  if (
    normalized.startsWith('#') ||
    normalized.startsWith('rgb') ||
    normalized.startsWith('hsl') ||
    normalized.startsWith('linear-gradient') ||
    normalized.startsWith('radial-gradient')
  ) {
    return sourceThemeCoverAsset(definition);
  }
  return sourceThemeOriginalAsset(definition, value);
}

function stripLegacyBrand(value: unknown): string {
  return cleanString(value)
    .replace(/satu\s*\.?\s*love/gi, '')
    .replace(/satulove/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function malayEthnicRedRubyOriginalAsset(source: unknown): string {
  return sourceThemeOriginalAsset(SOURCE_THEME_DEFINITIONS[MALAY_ETHNIC_RED_RUBY_THEME_ID], source);
}

function isSignatureSourceAsset(value: unknown): boolean {
  const text = cleanString(value);
  return text.startsWith(`${MALAY_ETHNIC_RED_RUBY_ASSET_BASE}/`) && !text.startsWith(`${MALAY_ETHNIC_RED_RUBY_ASSET_BASE}/original/`);
}

function containsSignatureSourceAsset(value: unknown): boolean {
  if (typeof value === 'string') {
    return isSignatureSourceAsset(value);
  }

  if (Array.isArray(value)) {
    return value.some((item) => containsSignatureSourceAsset(item));
  }

  if (value && typeof value === 'object') {
    return Object.values(value as JsonRecord).some((item) => containsSignatureSourceAsset(item));
  }

  return false;
}

function localizeSignatureSourceSourceValue<T>(value: T): T {
  return localizeSourceThemeValue(SOURCE_THEME_DEFINITIONS[MALAY_ETHNIC_RED_RUBY_THEME_ID], value);
}

function localizeSourceThemeValue<T>(definition: SourceThemeDefinition, value: T): T {
  if (typeof value === 'string') {
    return sourceThemeOriginalAsset(definition, value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => localizeSourceThemeValue(definition, item)) as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as JsonRecord).map(([key, item]) => [key, localizeSourceThemeValue(definition, item)]),
    ) as T;
  }
  return value;
}

const MALAY_ETHNIC_RED_RUBY_SOURCE_FONT_MAP: Record<string, string> = {
  '0194f58e-1c26-7711-8646-9c60bf38a9b0': MALAY_ETHNIC_RED_RUBY_FONT_FAHKWANG,
  '0194f58e-1c25-71d3-bf1c-5f8c9246c1dc': MALAY_ETHNIC_RED_RUBY_FONT_GAUTREAUX,
  '0194f58e-1c24-7201-85c0-06d116707e35': MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
  '0194f58e-1c24-7201-85c0-06c8f2a0aa0a': MALAY_ETHNIC_RED_RUBY_FONT_ARIMA,
  '0194f58e-1c25-71d3-bf1c-5f577354a00b': MALAY_ETHNIC_RED_RUBY_FONT_TANGIER,
};

const BATAK_SOURCE_FONT_MAP: Record<string, string> = {
  '0194f58e-1c26-7711-8646-9c60bf38a9b0': BATAK_FONT_FAHKWANG,
  '0194f58e-1c25-71d3-bf1c-5f8c9246c1dc': BATAK_FONT_GAUTREAUX,
  '0194f58e-1c25-71d3-bf1c-5eef6785351b': BATAK_FONT_ANNABELLE,
  '0194f58e-1c24-7201-85c0-06d116707e35': BATAK_FONT_KATIBEH,
  '0194f58e-1c24-7201-85c0-06c8f2a0aa0a': BATAK_FONT_ARIMA,
};

const MALAY_ETHNIC_RED_RUBY_LAYOUT_CODE_BY_SOURCE_NAME: Record<string, string> = {
  Opening: 'malay-ethnic-red-ruby-opening',
  Salam: 'malay-ethnic-red-ruby-salam',
  Quote: 'malay-ethnic-red-ruby-quote',
  'Mempelai 4': 'malay-ethnic-red-ruby-mempelai4',
  'Acara 2': 'malay-ethnic-red-ruby-acara2',
  'Acara 5': 'malay-ethnic-red-ruby-acara5',
  'Map 2': 'malay-ethnic-red-ruby-map2',
  Video: 'malay-ethnic-red-ruby-video',
  Galeri: 'malay-ethnic-red-ruby-galeri',
  'Live Streaming': 'malay-ethnic-red-ruby-live-streaming',
  'Love Story': 'malay-ethnic-red-ruby-love-story',
  'Extra Link': 'malay-ethnic-red-ruby-extra-link',
  'Rundown Acara': 'malay-ethnic-red-ruby-rundown',
  Doa: 'malay-ethnic-red-ruby-doa',
  'RSVP 2': 'malay-ethnic-red-ruby-rsvp2',
  'Gift 1': 'malay-ethnic-red-ruby-gift1',
  'Contact Person': 'malay-ethnic-red-ruby-contact',
  'Terima Kasih': 'malay-ethnic-red-ruby-thanks',
};

const BATAK_LAYOUT_CODE_BY_SOURCE_NAME: Record<string, string> = {
  Opening: 'batak-opening',
  Salam: 'batak-salam',
  Quote: 'batak-quote',
  'Mempelai 4': 'batak-mempelai4',
  'Acara 2': 'batak-acara2',
  'Acara 5': 'batak-acara5',
  'Map 2': 'batak-map2',
  Video: 'batak-video',
  Galeri: 'batak-galeri',
  'Live Streaming': 'batak-live-streaming',
  'Love Story': 'batak-love-story',
  'Extra Link': 'batak-extra-link',
  'Rundown Acara': 'batak-rundown',
  'RSVP 2': 'batak-rsvp2',
  Doa: 'batak-doa',
  'Gift 1': 'batak-gift1',
  'Contact Person': 'batak-contact',
  'Terima Kasih': 'batak-thanks',
};

function getSignatureSourceSourceLayout(layoutCode: string): JsonRecord | null {
  return getSourceThemeLayout(SOURCE_THEME_DEFINITIONS[MALAY_ETHNIC_RED_RUBY_THEME_ID], layoutCode);
}

function getSourceThemeLayout(definition: SourceThemeDefinition, layoutCode: string): JsonRecord | null {
  const layouts = definition.source.layouts as readonly JsonRecord[];
  const normalizedLayoutCode = normalizeSourceGalleryLayoutCode(layoutCode);
  return layouts.find((layout) => definition.layoutCodeBySourceName[cleanString(layout.name)] === normalizedLayoutCode) ?? null;
}

function mapSignatureSourceFont(font: unknown, fallback = MALAY_ETHNIC_RED_RUBY_FONT_FAHKWANG): string {
  return mapSourceThemeFont(SOURCE_THEME_DEFINITIONS[MALAY_ETHNIC_RED_RUBY_THEME_ID], font, fallback);
}

function mapSourceThemeFont(definition: SourceThemeDefinition, font: unknown, fallback = definition.defaultFont): string {
  return definition.fontMap[cleanString(font)] ?? fallback;
}

function mapSignatureSourceBackgroundType(value: unknown): SapatamuEditorBackgroundDetails['type'] {
  if (value === 3 || value === '3' || value === 'video') return 'video';
  if (value === 2 || value === '2' || value === 'image') return 'image';
  return 'color';
}

function mapSignatureSourcePadding(source: JsonRecord | undefined): SapatamuEditorPadding {
  return {
    top: toFiniteNumber(source?.top, 4),
    bottom: toFiniteNumber(source?.bottom, 4),
  };
}

function toFiniteNumber(value: unknown, fallback: number): number {
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function mapSignatureSourceAnimation(source: JsonRecord | undefined): SapatamuEditorAnimation {
  return {
    style: toFiniteNumber(source?.style, 5),
    duration: toFiniteNumber(source?.duration, 3),
  };
}

function mapSignatureSourceTextBox(source: JsonRecord | undefined): SapatamuEditorTextBox {
  return {
    disabled: source?.disabled !== false,
    borderRadius: toFiniteNumber(source?.borderRadius, 0),
    backgroundColor: cleanString(source?.backgroundColor) || '#a97f71ff',
    backgroundColor2: cleanString(source?.backgroundColor2) || cleanString(source?.backgroundColor) || '#a97f71ff',
    gradientAngle: toFiniteNumber(source?.gradientAngle, 0),
  };
}

function normalizeSignatureSourceAlign(value: unknown): 'left' | 'center' | 'right' {
  return value === 'left' || value === 'right' || value === 'center' ? value : 'center';
}

function normalizeSignatureSourceImageRadius(value: unknown): string {
  const text = cleanString(value);
  if (text === 'rounded-full' || text === '100%' || text === '999px') return '999px';
  if (text) return text;
  const numberValue = toFiniteNumber(value, 0);
  return numberValue > 0 ? `${numberValue}px` : '0px';
}

function mapSignatureSourceBackgroundDetails(source: JsonRecord | undefined): SapatamuEditorBackgroundDetails {
  const gradient = parseJsonObject(source?.gradient);
  const type = mapSignatureSourceBackgroundType(source?.type);
  const gradientDisabled = gradient.disabled !== false;
  return {
    type,
    color: 'transparent',
    opacity: gradientDisabled ? 0 : toFiniteNumber(source?.opacity, 1),
    gradient: {
      disabled: gradientDisabled,
      from: cleanString(gradient.from) || 'transparent',
      to: cleanString(gradient.to) || 'transparent',
    },
    blend: {
      disabled: true,
      mode: 'normal',
    },
  };
}

function mapSignatureSourceCornerElements(source: JsonRecord | undefined): SapatamuEditorCornerElements {
  return mapSourceThemeCornerElements(SOURCE_THEME_DEFINITIONS[MALAY_ETHNIC_RED_RUBY_THEME_ID], source);
}

function mapSourceThemeCornerElements(
  definition: SourceThemeDefinition,
  source: JsonRecord | undefined,
): SapatamuEditorCornerElements {
  const sourceStyle = parseJsonObject(source?.style);
  const sourceGradient = parseJsonObject(sourceStyle.gradient);
  const sourceBlend = parseJsonObject(sourceStyle.blend);
  const sourceList = Array.isArray(source?.data)
    ? (source?.data as JsonRecord[])
    : Array.isArray(source?.list)
      ? (source?.list as JsonRecord[])
      : [];
  const byType = new Map(sourceList.map((item) => [cleanString(item.type), item]));

  return {
    list: CORNER_TYPES.map((type) => {
      const item = byType.get(type);
      const url = sourceThemeOriginalAsset(definition, item?.url);
      return {
        type,
        disabled: item?.disabled === true || !url,
        url,
        animation: mapSignatureSourceAnimation(parseJsonObject(item?.animation)),
      };
    }),
    style: {
      opacity: toFiniteNumber(sourceStyle.opacity, 1),
      gradient: {
        disabled: sourceGradient.disabled !== false,
        from: cleanString(sourceGradient.from) || 'rgb(255 255 255 / 100%)',
        to: cleanString(sourceGradient.to) || 'rgb(255 255 255 / 100%)',
      },
      blend: {
        disabled: sourceBlend.disabled !== false,
        mode: cleanString(sourceBlend.mode) || 'normal',
      },
    },
  };
}

function sourceBaseText(source: JsonRecord, definition: SourceThemeDefinition): SapatamuEditorTextElement {
  return {
    type: 'text',
    disabled: source.disabled === true,
    content: stripLegacyBrand(source.content),
    color: cleanString(source.color) || '#fffef0',
    font: mapSourceThemeFont(definition, source.font),
    size: toFiniteNumber(source.size, 15),
    align: normalizeSignatureSourceAlign(source.align),
    lineHeight: toFiniteNumber(source.lineHeight, toFiniteNumber(source.size, 15)),
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
    box: mapSignatureSourceTextBox(parseJsonObject(source.box)),
  };
}

function sourceBaseButton(
  source: JsonRecord,
  type: 'button' | 'url',
  definition: SourceThemeDefinition,
): SapatamuEditorButtonElement {
  const icon = parseJsonObject(source.icon);
  return {
    type,
    disabled: source.disabled === true,
    content: stripLegacyBrand(source.content),
    color: cleanString(source.color) || '#ffffff',
    font: mapSourceThemeFont(definition, source.font),
    size: toFiniteNumber(source.size, 11),
    align: normalizeSignatureSourceAlign(source.align),
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
    borderSize: toFiniteNumber(source.borderSize, 0),
    borderColor: cleanString(source.borderColor) || '#ffffff',
    borderRadius: toFiniteNumber(source.borderRadius, 5),
    backgroundColor: cleanString(source.backgroundColor) || '#4a1a1fb2',
    backgroundColor2: cleanString(source.backgroundColor2) || cleanString(source.backgroundColor) || '#4a1a1fb2',
    gradientAngle: toFiniteNumber(source.gradientAngle, 0),
    link: cleanString(source.link),
    icon: {
      disabled: icon.disabled !== false,
      name: cleanString(icon.name),
      src: cleanString(icon.src).startsWith('https://be.satu.love/') ? sourceThemeOriginalAsset(definition, icon.src) : '',
    },
  };
}

function sourceBaseImage(source: JsonRecord, definition: SourceThemeDefinition): SapatamuEditorImageElement {
  const frame = parseJsonObject(source.frame);
  return {
    type: 'image',
    disabled: source.disabled === true,
    content: sourceThemeOriginalAsset(definition, source.content),
    size: toFiniteNumber(source.size, 160),
    borderRadius: normalizeSignatureSourceImageRadius(source.borderRadius ?? source.rounded),
    borderSize: toFiniteNumber(source.borderSize, 0),
    borderColor: cleanString(source.borderColor) || '#ffffff',
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
    frame: {
      disabled: frame.disabled !== false || !cleanString(frame.content),
      content: sourceThemeOriginalAsset(definition, frame.content),
    },
  };
}

function sourceBaseTimer(source: JsonRecord): SapatamuEditorTimerElement {
  return {
    type: 'timer',
    disabled: source.disabled === true,
    content: stripLegacyBrand(source.content),
    size1: toFiniteNumber(source.size1, 22),
    size2: toFiniteNumber(source.size2, 10),
    color1: cleanString(source.color1) || '#341215',
    color2: cleanString(source.color2) || '#341215',
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
    borderSize: toFiniteNumber(source.borderSize, 0),
    borderColor: cleanString(source.borderColor) || '#ffffff',
    borderRadius: toFiniteNumber(source.borderRadius, 5),
    backgroundColor: cleanString(source.backgroundColor) || '#ffffffb2',
    backgroundColor2: cleanString(source.backgroundColor2) || cleanString(source.backgroundColor) || '#ffffffb2',
    gradientAngle: toFiniteNumber(source.gradientAngle, 0),
    english: Boolean(source.english),
  };
}

function sourceBaseMap(source: JsonRecord): SapatamuEditorMapElement {
  return {
    type: 'map',
    disabled: source.disabled === true,
    content: stripLegacyBrand(source.content),
    url: cleanString(source.url),
    size: toFiniteNumber(source.size, 14),
    color: cleanString(source.color) || '#ffffff',
    backgroundColor: cleanString(source.backgroundColor) || 'rgba(255,255,255,0.16)',
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
  };
}

function sourceBaseLine(source: JsonRecord, definition: SourceThemeDefinition): SapatamuEditorLineElement {
  return {
    type: 'line',
    disabled: source.disabled === true,
    content: sourceThemeOriginalAsset(definition, source.content),
    size: toFiniteNumber(source.size, 90),
    color: cleanString(source.color) || '#ffffff',
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
  };
}

function sourceBaseGallery(source: JsonRecord, definition: SourceThemeDefinition): SapatamuEditorGalleryElement {
  const items = Array.isArray(source.items)
    ? source.items
    : Array.isArray(source.content)
      ? source.content
      : Array.isArray(source.data)
        ? source.data
        : [];
  return {
    type: 'gallery',
    disabled: source.disabled === true,
    title: stripLegacyBrand(source.title) || 'Galeri Foto',
    items: items
      .map((item) => (typeof item === 'string' ? item : (item as JsonRecord)?.url ?? (item as JsonRecord)?.image))
      .map((item) => sourceThemeOriginalAsset(definition, item))
      .filter(Boolean),
    columns: toFiniteNumber(source.columns, 2),
    variant: 'gallery-mosaic-six',
    frameSettings: {},
    imageAdjustments: [],
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
  };
}

function sourceBaseVideo(source: JsonRecord, definition: SourceThemeDefinition): SapatamuEditorVideoElement {
  return {
    type: 'video',
    disabled: source.disabled === true,
    title: stripLegacyBrand(source.title) || 'Video',
    url: sourceThemeOriginalAsset(definition, source.url || source.content),
    provider: cleanString(source.provider) === 'file' ? 'file' : 'youtube',
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
  };
}

function sourceBaseRsvp(source: JsonRecord, definition: SourceThemeDefinition): SapatamuEditorRsvpElement {
  return {
    ...localizeSourceThemeValue(definition, source),
    type: 'rsvp',
    disabled: source.disabled === true,
    title: stripLegacyBrand(source.title) || 'RSVP',
    description: stripLegacyBrand(source.description),
    buttonLabel: stripLegacyBrand(source.buttonLabel) || 'Kirim',
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
  } as SapatamuEditorRsvpElement;
}

function sourceBaseGift(source: JsonRecord, definition: SourceThemeDefinition): SapatamuEditorGiftElement {
  return {
    ...localizeSourceThemeValue(definition, source),
    type: 'gift',
    disabled: source.disabled === true,
    title: stripLegacyBrand(source.title) || 'Kirim Hadiah',
    description: stripLegacyBrand(source.description),
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
  } as SapatamuEditorGiftElement;
}

function sourceBaseStory(source: JsonRecord, definition: SourceThemeDefinition): SapatamuEditorStoryElement {
  const content = Array.isArray(source.content) ? (source.content as JsonRecord[]) : [];
  return {
    ...localizeSourceThemeValue(definition, source),
    type: 'story',
    disabled: source.disabled === true,
    title: stripLegacyBrand(source.title) || 'Kisah Cinta',
    description:
      stripLegacyBrand(source.description) ||
      'Lihat perjalanan cinta kami dari awal bertemu hingga hari bahagia ini.',
    buttonLabel: stripLegacyBrand(source.buttonLabel) || 'Lihat Perjalanan Cinta Kami',
    items: content.map((item) => ({
      ...item,
      image: sourceThemeOriginalAsset(definition, item.image),
      title: stripLegacyBrand(item.title),
      date: stripLegacyBrand(item.date),
      description: stripLegacyBrand(item.description),
    })),
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
    backgroundColor: cleanString(source.backgroundColor),
    backgroundColor2: cleanString(source.backgroundColor2),
  } as SapatamuEditorStoryElement;
}

function sourceBaseCredit(source: JsonRecord, definition: SourceThemeDefinition): SapatamuEditorSponsorElement {
  return {
    ...localizeSourceThemeValue(definition, source),
    type: 'credit',
    disabled: source.disabled === true,
    title: 'Sapatamu by Rekavia',
    description: '',
    padding: mapSignatureSourcePadding(parseJsonObject(source.padding)),
    animation: mapSignatureSourceAnimation(parseJsonObject(source.animation)),
  } as SapatamuEditorSponsorElement;
}

function mapSignatureSourceSourceElement(key: string, source: JsonRecord): SapatamuEditorElement | null {
  return mapSourceThemeElement(SOURCE_THEME_DEFINITIONS[MALAY_ETHNIC_RED_RUBY_THEME_ID], key, source);
}

function mapSourceThemeElement(
  definition: SourceThemeDefinition,
  key: string,
  source: JsonRecord,
): SapatamuEditorElement | null {
  if (!source || typeof source !== 'object') return null;
  if (key.startsWith('text')) return sourceBaseText(source, definition);
  if (key === 'button' || key.startsWith('button')) return sourceBaseButton(source, 'button', definition);
  if (key.startsWith('url')) return sourceBaseButton(source, 'url', definition);
  if (key.startsWith('image')) return sourceBaseImage(source, definition);
  if (key === 'timer') return sourceBaseTimer(source);
  if (key === 'map') return sourceBaseMap(source);
  if (key === 'line') return sourceBaseLine(source, definition);
  if (key === 'gallery') return sourceBaseGallery(source, definition);
  if (key === 'video') return sourceBaseVideo(source, definition);
  if (key === 'rsvp') return sourceBaseRsvp(source, definition);
  if (key === 'gift') return sourceBaseGift(source, definition);
  if (key === 'story') return sourceBaseStory(source, definition);
  if (key === 'credit') return sourceBaseCredit(source, definition);
  return null;
}

function buildSignatureSourceSourcePageData(sourceLayout: JsonRecord): Record<string, unknown> & {
  background: string | null;
  backgroundDetails: SapatamuEditorBackgroundDetails;
  cornerElements: SapatamuEditorCornerElements;
} {
  return buildSourceThemePageData(SOURCE_THEME_DEFINITIONS[MALAY_ETHNIC_RED_RUBY_THEME_ID], sourceLayout);
}

function buildSourceThemePageData(
  definition: SourceThemeDefinition,
  sourceLayout: JsonRecord,
): Record<string, unknown> & {
  background: string | null;
  backgroundDetails: SapatamuEditorBackgroundDetails;
  cornerElements: SapatamuEditorCornerElements;
} {
  const sourceData = parseJsonObject(sourceLayout.data);
  const data: Record<string, unknown> & {
    background: string | null;
    backgroundDetails: SapatamuEditorBackgroundDetails;
    cornerElements: SapatamuEditorCornerElements;
  } = {
    background: sourceThemeBackgroundAsset(definition, sourceData.background),
    backgroundDetails: mapSignatureSourceBackgroundDetails(parseJsonObject(sourceData.backgroundDetails)),
    cornerElements: mapSourceThemeCornerElements(definition, parseJsonObject(sourceData.cornerElements)),
  };

  Object.entries(sourceData).forEach(([key, value]) => {
    if (key === 'background' || key === 'backgroundDetails' || key === 'cornerElements') return;
    if (key.startsWith('vintage')) {
      data[key] = localizeSourceThemeValue(definition, value);
      return;
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;
    const element = mapSourceThemeElement(definition, key, value as JsonRecord);
    if (element) data[key] = element;
  });

  return data;
}

function buildSignatureSourceBackgroundDetails(
  type: SapatamuEditorBackgroundDetails['type'] = 'image',
): SapatamuEditorBackgroundDetails {
  return {
    type,
    color: '#4a1a1f',
    opacity: type === 'color' ? 1 : 0.9,
    gradient: {
      disabled: false,
      from: 'rgba(74, 26, 31, 0.28)',
      to: 'rgba(52, 18, 21, 0.78)',
    },
    blend: {
      disabled: false,
      mode: 'multiply',
    },
  };
}

function buildSignatureSourceCornerElements(): SapatamuEditorCornerElements {
  return buildSourceThemeCornerElements(SOURCE_THEME_DEFINITIONS[MALAY_ETHNIC_RED_RUBY_THEME_ID]);
}

function buildSourceThemeCornerElements(definition: SourceThemeDefinition): SapatamuEditorCornerElements {
  return mapSourceThemeCornerElements(definition, definition.source.frames as JsonRecord);
}

function buildSignatureSourceText(
  content: string,
  overrides?: Partial<SapatamuEditorTextElement>,
): SapatamuEditorTextElement {
  return buildText(content, MALAY_ETHNIC_RED_RUBY_THEME_ID, {
    font: MALAY_ETHNIC_RED_RUBY_FONT_FAHKWANG,
    color: '#fffef0',
    lineHeight: 24,
    ...overrides,
  });
}

function buildSignatureSourceButton(
  content: string,
  link = '#',
  overrides?: Partial<SapatamuEditorButtonElement>,
): SapatamuEditorButtonElement {
  return buildButton(content, MALAY_ETHNIC_RED_RUBY_THEME_ID, link, {
    font: MALAY_ETHNIC_RED_RUBY_FONT_FAHKWANG,
    color: '#feffe1',
    borderColor: '#d3a9af',
    backgroundColor: '#4a1a1f',
    backgroundColor2: '#341215',
    ...overrides,
  });
}

function buildSignatureSourceUrl(
  content: string,
  link = '',
  overrides?: Partial<SapatamuEditorButtonElement>,
): SapatamuEditorButtonElement {
  return {
    ...buildSignatureSourceButton(content, link, overrides),
    type: 'url',
  };
}

function buildSignatureSourceBasePageData(
  background: string,
  backgroundType: SapatamuEditorBackgroundDetails['type'] = 'image',
): Record<string, unknown> & {
  background: string | null;
  backgroundDetails: SapatamuEditorBackgroundDetails;
  cornerElements: SapatamuEditorCornerElements;
} {
  return {
    background,
    backgroundDetails: buildSignatureSourceBackgroundDetails(backgroundType),
    cornerElements: buildSignatureSourceCornerElements(),
  };
}

function buildSignatureSourcePageData(params: {
  layoutCode: string;
  family: string;
  title: string;
  profiles: Array<{ fullName?: string; nickName?: string; description?: string }>;
  events: Array<{
    name?: string;
    date?: string;
    timeStart?: string;
    timeEnd?: string;
    address?: string;
    mapLocation?: string;
  }>;
}): Record<string, unknown> & {
  background: string | null;
  backgroundDetails: SapatamuEditorBackgroundDetails;
  cornerElements: SapatamuEditorCornerElements;
} {
  const sourceLayout = getSignatureSourceSourceLayout(params.layoutCode);
  if (sourceLayout) {
    return buildSignatureSourceSourcePageData(sourceLayout);
  }

  const primaryEvent = params.events[0] ?? {};
  const secondaryEvent = params.events[1] ?? {};
  const data = buildSignatureSourceBasePageData(malayEthnicRedRubyAsset(`backgrounds/${params.family}.webp`));

  switch (params.layoutCode) {
    case 'malay-ethnic-red-ruby-opening':
      data.background = malayEthnicRedRubyAsset('backgrounds/opening.webp');
      data.image1 = buildImage(MALAY_ETHNIC_RED_RUBY_THEME_ID, {
        content: malayEthnicRedRubyAsset('cover/preview.webp'),
        size: 188,
        borderRadius: '999px',
        borderSize: 2,
        borderColor: '#d3a9af',
        frame: { disabled: false, content: malayEthnicRedRubyAsset('frames/profile-frame.png') },
      });
      data.text1 = buildSignatureSourceText('THE WEDDING OF', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_FAHKWANG,
        size: 13,
        lineHeight: 18,
        color: '#d3a9af',
      });
      data.text2 = buildSignatureSourceText('{{nick-name-1}}\n&\n{{nick-name-2}}', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_GAUTREAUX,
        size: 58,
        lineHeight: 54,
        animation: buildAnimation(8, 3),
      });
      data.text3 = buildSignatureSourceText('Kepada Yth.', {
        size: 13,
        lineHeight: 18,
        color: '#d3a9af',
      });
      data.text4 = buildSignatureSourceText('Bapak/Ibu/Saudara/i', {
        size: 16,
        lineHeight: 24,
        color: '#feffe1',
      });
      data.button = buildSignatureSourceButton('Buka Undangan', '#open', {
        icon: {
          disabled: false,
          name: 'envelope',
          src: malayEthnicRedRubyAsset('icons/invitation.svg'),
        },
      });
      break;
    case 'malay-ethnic-red-ruby-salam':
      data.background = malayEthnicRedRubyAsset('video/salam.mp4');
      data.backgroundDetails = buildSignatureSourceBackgroundDetails('video');
      data.text1 = buildSignatureSourceText("Assalamu'alaikum Warahmatullahi Wabarakatuh", {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 34,
        lineHeight: 36,
        color: '#feffe1',
      });
      data.text2 = buildSignatureSourceText(
        'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.',
        { size: 15, lineHeight: 25 },
      );
      break;
    case 'malay-ethnic-red-ruby-quote':
      data.background = malayEthnicRedRubyAsset('video/quote.mp4');
      data.backgroundDetails = buildSignatureSourceBackgroundDetails('video');
      data.text1 = buildSignatureSourceText(
        'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.',
        { font: MALAY_ETHNIC_RED_RUBY_FONT_ARIMA, size: 17, lineHeight: 28, color: '#feffe1' },
      );
      data.text2 = buildSignatureSourceText('Q.S. Ar Rum: 21', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 28,
        lineHeight: 30,
        color: '#d3a9af',
      });
      break;
    case 'malay-ethnic-red-ruby-mempelai4':
      data.background = malayEthnicRedRubyAsset('backgrounds/mempelai.webp');
      data.image1 = buildImage(MALAY_ETHNIC_RED_RUBY_THEME_ID, {
        content: malayEthnicRedRubyAsset('gallery/couple-1.webp'),
        size: 156,
        borderRadius: '999px',
        borderSize: 2,
        borderColor: '#d3a9af',
      });
      data.image2 = buildImage(MALAY_ETHNIC_RED_RUBY_THEME_ID, {
        content: malayEthnicRedRubyAsset('gallery/couple-2.webp'),
        size: 156,
        borderRadius: '999px',
        borderSize: 2,
        borderColor: '#d3a9af',
        animation: buildAnimation(6, 3),
      });
      data.text1 = buildSignatureSourceText('{{full-name-1}}', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_GAUTREAUX,
        size: 42,
        lineHeight: 42,
      });
      data.text2 = buildSignatureSourceText('{{desc-1}}', { size: 14, lineHeight: 23 });
      data.text3 = buildSignatureSourceText('{{full-name-2}}', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_GAUTREAUX,
        size: 42,
        lineHeight: 42,
        animation: buildAnimation(6, 3),
      });
      data.text4 = buildSignatureSourceText('{{desc-2}}', {
        size: 14,
        lineHeight: 23,
        animation: buildAnimation(6, 3),
      });
      data.url1 = buildSignatureSourceUrl(cleanString(params.profiles[0]?.nickName) || 'Instagram', 'https://instagram.com');
      data.url2 = buildSignatureSourceUrl(cleanString(params.profiles[1]?.nickName) || 'Instagram', 'https://instagram.com', {
        animation: buildAnimation(6, 3),
      });
      break;
    case 'malay-ethnic-red-ruby-acara2':
    case 'malay-ethnic-red-ruby-acara5':
      data.background = malayEthnicRedRubyAsset(`backgrounds/${params.layoutCode === 'malay-ethnic-red-ruby-acara2' ? 'acara-2' : 'acara-5'}.webp`);
      data.text1 = buildSignatureSourceText(params.layoutCode === 'malay-ethnic-red-ruby-acara2' ? '{{event-name-1}}' : '{{event-name-2}}', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
        color: '#feffe1',
      });
      data.text2 = buildSignatureSourceText(
        params.layoutCode === 'malay-ethnic-red-ruby-acara2'
          ? '{{event-date-1}}\n{{time-start-1}} - {{time-end-1}} {{zone-time-1}}\n{{event-location-1}}'
          : '{{event-date-2}}\n{{time-start-2}} - {{time-end-2}} {{zone-time-2}}\n{{event-location-2}}',
        { size: 15, lineHeight: 25 },
      );
      data.timer = buildTimer(
        MALAY_ETHNIC_RED_RUBY_THEME_ID,
        primaryEvent.date ? `${primaryEvent.date}T${primaryEvent.timeStart || '00:00'}:00` : '',
      );
      data.button = buildSignatureSourceButton('Simpan Tanggal', '#calendar');
      data.line = buildLine(MALAY_ETHNIC_RED_RUBY_THEME_ID);
      break;
    case 'malay-ethnic-red-ruby-map2':
      data.background = malayEthnicRedRubyAsset('backgrounds/map.webp');
      data.text1 = buildSignatureSourceText('Lokasi Acara', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      data.text2 = buildSignatureSourceText('{{event-location-1}}', { size: 15, lineHeight: 24 });
      data.map = {
        ...buildMap(MALAY_ETHNIC_RED_RUBY_THEME_ID),
        url: cleanString(primaryEvent.mapLocation),
      };
      data.button = buildSignatureSourceButton('Petunjuk ke Lokasi', cleanString(primaryEvent.mapLocation));
      break;
    case 'malay-ethnic-red-ruby-video':
      data.background = malayEthnicRedRubyAsset('backgrounds/video.webp');
      data.text1 = buildSignatureSourceText('Video', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      data.video = buildVideo(MALAY_ETHNIC_RED_RUBY_THEME_ID);
      break;
    case 'malay-ethnic-red-ruby-galeri':
      data.background = malayEthnicRedRubyAsset('backgrounds/galeri.webp');
      data.text1 = buildSignatureSourceText('Galeri', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      data.gallery = {
        ...buildGallery(MALAY_ETHNIC_RED_RUBY_THEME_ID),
        items: [
          malayEthnicRedRubyAsset('gallery/gallery-1.webp'),
          malayEthnicRedRubyAsset('gallery/gallery-2.webp'),
          malayEthnicRedRubyAsset('gallery/gallery-3.webp'),
          malayEthnicRedRubyAsset('gallery/gallery-4.webp'),
        ],
      };
      break;
    case 'malay-ethnic-red-ruby-live-streaming':
      data.background = malayEthnicRedRubyAsset('backgrounds/live-streaming.webp');
      data.text1 = buildSignatureSourceText('Live Streaming', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      data.text2 = buildSignatureSourceText('Saksikan momen bahagia kami secara langsung melalui tautan berikut.', {
        size: 15,
        lineHeight: 24,
      });
      data.url1 = buildSignatureSourceUrl('Buka Streaming', cleanString(secondaryEvent.mapLocation));
      break;
    case 'malay-ethnic-red-ruby-love-story':
      data.background = malayEthnicRedRubyAsset('backgrounds/love-story.webp');
      data.text1 = buildSignatureSourceText('Love Story', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      data.story = buildStory();
      break;
    case 'malay-ethnic-red-ruby-extra-link':
      data.background = malayEthnicRedRubyAsset('backgrounds/extra-link.webp');
      data.text1 = buildSignatureSourceText('Extra Link', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      data.text2 = buildSignatureSourceText('Tambahkan tautan penting untuk tamu undangan.', { size: 15, lineHeight: 24 });
      data.url1 = buildSignatureSourceUrl('Buka Link', '{{link}}');
      break;
    case 'malay-ethnic-red-ruby-rundown':
      data.background = malayEthnicRedRubyAsset('backgrounds/rundown.webp');
      data.text1 = buildSignatureSourceText('Rundown Acara', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      data.line = buildLine(MALAY_ETHNIC_RED_RUBY_THEME_ID);
      data.text2 = buildSignatureSourceText('08.00 - Akad\n11.00 - Resepsi\n13.00 - Selesai', {
        size: 15,
        lineHeight: 25,
      });
      break;
    case 'malay-ethnic-red-ruby-doa':
      data.background = malayEthnicRedRubyAsset('backgrounds/doa.webp');
      data.text1 = buildSignatureSourceText('Doa & Ucapan', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      data.text2 = buildSignatureSourceText(
        'Semoga Allah SWT memberkahi pernikahan kami dan menjadikan keluarga yang sakinah, mawaddah, warahmah.',
        { size: 15, lineHeight: 25 },
      );
      data.rsvp = buildRsvp();
      break;
    case 'malay-ethnic-red-ruby-rsvp2':
      data.background = malayEthnicRedRubyAsset('backgrounds/rsvp.webp');
      data.text1 = buildSignatureSourceText('RSVP', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      data.rsvp = buildRsvp();
      break;
    case 'malay-ethnic-red-ruby-gift1':
      data.background = malayEthnicRedRubyAsset('backgrounds/gift.webp');
      data.text1 = buildSignatureSourceText('Wedding Gift', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      data.gift = buildGift();
      break;
    case 'malay-ethnic-red-ruby-contact':
      data.background = malayEthnicRedRubyAsset('backgrounds/contact.webp');
      data.text1 = buildSignatureSourceText('Contact Person', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      data.url1 = buildSignatureSourceUrl('Hubungi Keluarga Mempelai', 'https://wa.me/');
      data.url2 = buildSignatureSourceUrl('Hubungi Wedding Organizer', 'https://wa.me/', {
        animation: buildAnimation(6, 3),
      });
      break;
    case 'malay-ethnic-red-ruby-thanks':
      data.background = malayEthnicRedRubyAsset('video/thanks.mp4');
      data.backgroundDetails = buildSignatureSourceBackgroundDetails('video');
      data.text1 = buildSignatureSourceText('Terima Kasih', {
        font: MALAY_ETHNIC_RED_RUBY_FONT_GAUTREAUX,
        size: 48,
        lineHeight: 46,
      });
      data.text2 = buildSignatureSourceText(
        'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.',
        { size: 15, lineHeight: 25 },
      );
      data.credit = buildCredit('Sampai Jumpa di Hari Bahagia');
      break;
    default:
      data.text1 = buildSignatureSourceText(params.title, {
        font: MALAY_ETHNIC_RED_RUBY_FONT_KATIBEH,
        size: 38,
        lineHeight: 40,
      });
      break;
  }

  return data;
}

function buildDefaultPageData(params: {
  layoutCode: string;
  family: string;
  title: string;
  themeId: string;
  profiles: Array<{ fullName?: string; nickName?: string; description?: string }>;
  events: Array<{
    name?: string;
    date?: string;
    timeStart?: string;
    timeEnd?: string;
    address?: string;
    mapLocation?: string;
  }>;
}): Record<string, unknown> & {
  background: string | null;
  backgroundDetails: SapatamuEditorBackgroundDetails;
  cornerElements: SapatamuEditorCornerElements;
} {
  if (params.themeId === MALAY_ETHNIC_RED_RUBY_THEME_ID) {
    return buildSignatureSourcePageData(params);
  }

  const sourceDefinition = getSourceThemeDefinition(params.themeId);
  if (sourceDefinition) {
    const sourceLayout = getSourceThemeLayout(sourceDefinition, params.layoutCode);
    if (sourceLayout) {
      return buildSourceThemePageData(sourceDefinition, sourceLayout);
    }
  }

  const palette = getThemePalette(params.themeId);
  const primaryEvent = params.events[0] ?? {};
  const secondaryEvent = params.events[1] ?? {};
  const pageData: Record<string, unknown> & {
    background: string | null;
    backgroundDetails: SapatamuEditorBackgroundDetails;
    cornerElements: SapatamuEditorCornerElements;
  } = {
    background: null,
    backgroundDetails: buildBackgroundDetails(params.themeId),
    cornerElements: buildCornerElements(),
  };

  switch (params.family) {
    case 'opening':
      pageData.text1 = buildText('THE WEDDING OF', params.themeId, {
        font: 'font-questa-grande',
        size: 14,
        lineHeight: 20,
        color: palette.accent,
      });
      pageData.text2 = buildText('{{nick-name-1}}\n{{nick-name-2}}', params.themeId, {
        font: DEFAULT_FONT_DISPLAY,
        size: 56,
        lineHeight: 60,
        color: palette.text,
        animation: buildAnimation(8, 3),
      });
      pageData.text3 = buildText('Kepada Yth.', params.themeId, {
        font: DEFAULT_FONT_SANSSERIF,
        size: 13,
        lineHeight: 18,
        color: palette.accent,
      });
      pageData.text4 = buildText('Bapak/Ibu Tamu Undangan', params.themeId, {
        font: DEFAULT_FONT_SANSSERIF,
        size: 16,
        lineHeight: 22,
        color: palette.accentSoft,
      });
      pageData.button = buildButton('Buka Undangan', params.themeId, '#open', {
        font: 'font-questa-grande',
      });
      break;
    case 'salam':
      pageData.text1 = buildText('Assalamu’alaikum Warahmatullahi Wabarakatuh', params.themeId, {
        font: 'font-playfair-display',
        size: 24,
        lineHeight: 32,
      });
      pageData.text2 = buildText(
        'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.',
        params.themeId,
        {
          size: 16,
          lineHeight: 26,
        },
      );
      break;
    case 'quote':
      pageData.text1 = buildText(
        'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.',
        params.themeId,
        {
          size: 16,
          lineHeight: 26,
          color: palette.accentSoft,
        },
      );
      pageData.text2 = buildText('Q.S. Ar Rum: 21', params.themeId, {
        font: 'font-playfair-display',
        size: 22,
        lineHeight: 28,
        color: palette.accent,
      });
      break;
    case 'mempelai':
    case 'profile':
      pageData.image1 = buildImage(params.themeId);
      pageData.image2 = buildImage(params.themeId, {
        animation: buildAnimation(6, 3),
      });
      pageData.text1 = buildText('{{full-name-1}}', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 34,
      });
      pageData.text2 = buildText('{{desc-1}}', params.themeId, {
        size: 15,
        lineHeight: 22,
      });
      pageData.text3 = buildText('{{full-name-2}}', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 34,
        animation: buildAnimation(6, 3),
      });
      pageData.text4 = buildText('{{desc-2}}', params.themeId, {
        size: 15,
        lineHeight: 22,
        animation: buildAnimation(6, 3),
      });
      pageData.url1 = buildUrl(
        cleanString(params.profiles[0]?.nickName) || 'Instagram',
        params.themeId,
        'https://instagram.com',
      );
      pageData.url2 = buildUrl(
        cleanString(params.profiles[1]?.nickName) || 'Instagram',
        params.themeId,
        'https://instagram.com',
        {
          animation: buildAnimation(6, 3),
        },
      );
      break;
    case 'acara':
      pageData.text1 = buildText('{{event-name-1}}', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 28,
        lineHeight: 32,
      });
      pageData.text2 = buildText('{{event-date-1}}\n{{time-start-1}} - {{time-end-1}} {{zone-time-1}}', params.themeId, {
        size: 15,
        lineHeight: 24,
      });
      pageData.text3 = buildText('{{event-name-2}}', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 28,
        lineHeight: 32,
        animation: buildAnimation(6, 3),
      });
      pageData.text4 = buildText('{{event-date-2}}\n{{time-start-2}} - {{time-end-2}} {{zone-time-2}}\n{{event-location-2}}', params.themeId, {
        size: 15,
        lineHeight: 24,
        animation: buildAnimation(6, 3),
      });
      pageData.timer = buildTimer(params.themeId, primaryEvent.date ? `${primaryEvent.date}T${primaryEvent.timeStart || '00:00'}:00` : '');
      pageData.button = buildButton('Add to Calendar', params.themeId, '#calendar');
      break;
    case 'map':
      pageData.text1 = buildText('Lokasi Acara', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 28,
        lineHeight: 32,
      });
      pageData.text2 = buildText('{{event-location-1}}', params.themeId, {
        size: 15,
        lineHeight: 24,
      });
      pageData.map = {
        ...buildMap(params.themeId),
        url: cleanString(primaryEvent.mapLocation),
      };
      break;
    case 'galeri':
      pageData.text1 = buildText('Gallery', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.gallery = buildGallery(
        params.themeId,
        params.layoutCode === 'galeri2'
          ? 'gallery-quad-offset'
          : params.layoutCode === 'galeri3'
            ? 'gallery-hero-trio'
            : 'gallery-mosaic-six',
      );
      break;
    case 'video':
      pageData.text1 = buildText('Video', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.video = buildVideo(params.themeId);
      break;
    case 'rsvp':
      pageData.text1 = buildText('RSVP', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.rsvp = buildRsvp();
      break;
    case 'doa':
      pageData.text1 = buildText('Doa & Ucapan', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.text2 = buildText(
        'Semoga Allah SWT memberkahi pernikahan kami dan menjadikan keluarga yang sakinah, mawaddah, warahmah.',
        params.themeId,
        {
          size: 16,
          lineHeight: 24,
        },
      );
      break;
    case 'gift':
      pageData.text1 = buildText('Wedding Gift', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.gift = buildGift();
      break;
    case 'contact':
      pageData.text1 = buildText('Contact Person', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.url1 = buildUrl('Hubungi Kami', params.themeId, 'https://wa.me/', {
        content: 'Hubungi Kami',
      });
      break;
    case 'thanks':
      pageData.text1 = buildText('Terima Kasih', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 32,
        lineHeight: 36,
      });
      pageData.text2 = buildText(
        'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.',
        params.themeId,
        {
          size: 16,
          lineHeight: 24,
        },
      );
      pageData.credit = buildCredit('Sampai Jumpa di Hari Bahagia');
      break;
    case 'love-story':
      pageData.text1 = buildText('Love Story', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.story = buildStory();
      break;
    case 'rundown':
      pageData.text1 = buildText('Rundown Acara', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.line = buildLine(params.themeId);
      pageData.text2 = buildText('08.00 - Akad\n11.00 - Resepsi\n13.00 - Selesai', params.themeId, {
        size: 15,
        lineHeight: 25,
      });
      break;
    case 'live-streaming':
      pageData.text1 = buildText('Live Streaming', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.url1 = buildUrl('Buka Streaming', params.themeId, cleanString(params.events[0]?.mapLocation), {
        content: 'Buka Streaming',
      });
      break;
    case 'extra-link':
      pageData.text1 = buildText(params.title, params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.url1 = buildUrl('Buka Link', params.themeId, '');
      break;
    case 'dress-code':
      pageData.text1 = buildText('Dress Code', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.text2 = buildText('Earth tone, beige, atau warna lembut lainnya.', params.themeId, {
        size: 15,
        lineHeight: 24,
      });
      break;
    case 'sponsor':
      pageData.text1 = buildText('Special Thanks', params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.sponsor = buildSponsor('Vendor Partner');
      break;
    default:
      pageData.text1 = buildText(params.title, params.themeId, {
        font: DEFAULT_FONT_SERIF,
        size: 30,
        lineHeight: 36,
      });
      pageData.text2 = buildText('Sesuaikan section ini melalui panel editor di sebelah kiri.', params.themeId, {
        size: 15,
        lineHeight: 24,
      });
      break;
  }

  return pageData;
}

const LAYOUT_CATALOG_SEEDS: Array<
  Pick<
    SapatamuEditorLayoutCatalogItem,
    | 'layoutCode'
    | 'family'
    | 'title'
    | 'requiredTier'
    | 'requiredFeatureCode'
    | 'maxInstances'
    | 'sortOrder'
    | 'supportsPreviewSelection'
    | 'mediaRequirements'
    | 'defaultVisible'
  >
> = [
  { layoutCode: 'opening1', family: 'opening', title: 'Opening', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 1, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: true },
  { layoutCode: 'opening2', family: 'opening', title: 'Opening 2', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 2, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: false },
  { layoutCode: 'opening3', family: 'opening', title: 'Opening 3', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 3, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: false },
  { layoutCode: 'opening4', family: 'opening', title: 'Opening 4', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 4, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: false },
  { layoutCode: 'opening5', family: 'opening', title: 'Opening 5', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 5, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: false },
  { layoutCode: 'salam', family: 'salam', title: 'Salam', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 10, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: true },
  { layoutCode: 'quote', family: 'quote', title: 'Quote', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 20, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: true },
  { layoutCode: 'mempelai1', family: 'mempelai', title: 'Mempelai 1', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 2, sortOrder: 30, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: false },
  { layoutCode: 'mempelai2', family: 'mempelai', title: 'Mempelai 2', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 2, sortOrder: 31, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: false },
  { layoutCode: 'mempelai3', family: 'mempelai', title: 'Mempelai 3', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 2, sortOrder: 32, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: false },
  { layoutCode: 'mempelai4', family: 'mempelai', title: 'Mempelai 4', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 2, sortOrder: 33, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
  { layoutCode: 'mempelai5', family: 'mempelai', title: 'Mempelai 5', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 2, sortOrder: 34, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: false },
  { layoutCode: 'profile', family: 'profile', title: 'Profile', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 40, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: false },
  { layoutCode: 'profile2', family: 'profile', title: 'Profile 2', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 41, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: false },
  { layoutCode: 'acara1', family: 'acara', title: 'Acara 1', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 2, sortOrder: 50, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'acara2', family: 'acara', title: 'Acara 2', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 2, sortOrder: 51, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'acara3', family: 'acara', title: 'Acara 3', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 2, sortOrder: 52, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'acara4', family: 'acara', title: 'Acara 4', requiredTier: 'premium', requiredFeatureCode: 'tier:premium', maxInstances: 2, sortOrder: 53, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'acara5', family: 'acara', title: 'Acara 5', requiredTier: 'premium', requiredFeatureCode: 'tier:premium', maxInstances: 2, sortOrder: 54, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'acara6', family: 'acara', title: 'Acara 6', requiredTier: 'vintage', requiredFeatureCode: 'tier:vintage', maxInstances: 2, sortOrder: 55, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'map1', family: 'map', title: 'Map 1', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 60, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'map2', family: 'map', title: 'Map 2', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 61, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'galeri1', family: 'galeri', title: 'Galeri 1', requiredTier: 'premium', requiredFeatureCode: 'tier:premium', maxInstances: 1, sortOrder: 70, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
  { layoutCode: 'galeri2', family: 'galeri', title: 'Galeri 2', requiredTier: 'premium', requiredFeatureCode: 'tier:premium', maxInstances: 1, sortOrder: 71, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
  { layoutCode: 'galeri3', family: 'galeri', title: 'Galeri 3', requiredTier: 'premium', requiredFeatureCode: 'tier:premium', maxInstances: 1, sortOrder: 72, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
  { layoutCode: 'video', family: 'video', title: 'Video', requiredTier: 'premium', requiredFeatureCode: 'feature:video-section', maxInstances: 1, sortOrder: 80, supportsPreviewSelection: true, mediaRequirements: 'video', defaultVisible: false },
  { layoutCode: 'video2', family: 'video', title: 'Video 2', requiredTier: 'premium', requiredFeatureCode: 'feature:video-section', maxInstances: 1, sortOrder: 81, supportsPreviewSelection: true, mediaRequirements: 'video', defaultVisible: true },
  { layoutCode: 'rsvp', family: 'rsvp', title: 'RSVP', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 90, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'rundown', family: 'rundown', title: 'Rundown Acara', requiredTier: 'vintage', requiredFeatureCode: 'feature:rundown', maxInstances: 1, sortOrder: 100, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'doa', family: 'doa', title: 'Doa', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 110, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'doa2', family: 'doa', title: 'Doa 2', requiredTier: 'basic', requiredFeatureCode: null, maxInstances: 1, sortOrder: 111, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'gift1', family: 'gift', title: 'Gift 1', requiredTier: 'premium', requiredFeatureCode: 'feature:gift', maxInstances: 1, sortOrder: 120, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'gift2', family: 'gift', title: 'Gift 2', requiredTier: 'premium', requiredFeatureCode: 'feature:gift', maxInstances: 1, sortOrder: 121, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'live1', family: 'live-streaming', title: 'Live Streaming 1', requiredTier: 'premium', requiredFeatureCode: 'feature:live-streaming', maxInstances: 1, sortOrder: 130, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'live2', family: 'live-streaming', title: 'Live Streaming 2', requiredTier: 'premium', requiredFeatureCode: 'feature:live-streaming', maxInstances: 1, sortOrder: 131, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'love-story', family: 'love-story', title: 'Love Story', requiredTier: 'vintage', requiredFeatureCode: 'feature:love-story', maxInstances: 1, sortOrder: 140, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: true },
  { layoutCode: 'contact1', family: 'contact', title: 'Contact Person 1', requiredTier: 'premium', requiredFeatureCode: 'feature:contact', maxInstances: 1, sortOrder: 150, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'contact2', family: 'contact', title: 'Contact Person 2', requiredTier: 'premium', requiredFeatureCode: 'feature:contact', maxInstances: 1, sortOrder: 151, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'dresscode', family: 'dress-code', title: 'Dress Code', requiredTier: 'vintage', requiredFeatureCode: 'feature:dress-code', maxInstances: 1, sortOrder: 160, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'extra_link', family: 'extra-link', title: 'Extra Link', requiredTier: 'vintage', requiredFeatureCode: 'feature:extra-link', maxInstances: 1, sortOrder: 170, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'sponsor', family: 'sponsor', title: 'Sponsor', requiredTier: 'vintage', requiredFeatureCode: 'feature:sponsor', maxInstances: 1, sortOrder: 180, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'thanks', family: 'thanks', title: 'Terima Kasih', requiredTier: 'premium', requiredFeatureCode: 'feature:thanks', maxInstances: 1, sortOrder: 190, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: false },
  { layoutCode: 'thanks2', family: 'thanks', title: 'Terima Kasih 2', requiredTier: 'premium', requiredFeatureCode: 'feature:thanks', maxInstances: 1, sortOrder: 191, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
];

const MALAY_ETHNIC_RED_RUBY_LAYOUT_CATALOG_SEEDS: typeof LAYOUT_CATALOG_SEEDS = [
  { layoutCode: 'malay-ethnic-red-ruby-opening', family: 'opening', title: 'Opening', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 1, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-salam', family: 'salam', title: 'Salam', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 2, supportsPreviewSelection: true, mediaRequirements: 'video', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-quote', family: 'quote', title: 'Quote', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 3, supportsPreviewSelection: true, mediaRequirements: 'video', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-mempelai4', family: 'mempelai', title: 'Mempelai 4', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 4, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-acara2', family: 'acara', title: 'Acara 2', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 5, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-acara5', family: 'acara', title: 'Acara 5', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 6, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-map2', family: 'map', title: 'Map 2', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 7, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-video', family: 'video', title: 'Video', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 8, supportsPreviewSelection: true, mediaRequirements: 'video', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-galeri', family: 'galeri', title: 'Galeri', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 9, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-live-streaming', family: 'live-streaming', title: 'Live Streaming', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 10, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-love-story', family: 'love-story', title: 'Love Story', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 11, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-extra-link', family: 'extra-link', title: 'Extra Link', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 12, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-rundown', family: 'rundown', title: 'Rundown Acara', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 13, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-doa', family: 'doa', title: 'Doa', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 14, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-rsvp2', family: 'rsvp', title: 'RSVP 2', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 15, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-gift1', family: 'gift', title: 'Gift 1', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 16, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-contact', family: 'contact', title: 'Contact Person', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 17, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'malay-ethnic-red-ruby-thanks', family: 'thanks', title: 'Terima Kasih', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 18, supportsPreviewSelection: true, mediaRequirements: 'video', defaultVisible: true },
];

const BATAK_LAYOUT_CATALOG_SEEDS: typeof LAYOUT_CATALOG_SEEDS = [
  { layoutCode: 'batak-opening', family: 'opening', title: 'Opening', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 1, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: true },
  { layoutCode: 'batak-salam', family: 'salam', title: 'Salam', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 2, supportsPreviewSelection: true, mediaRequirements: 'video', defaultVisible: true },
  { layoutCode: 'batak-quote', family: 'quote', title: 'Quote', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 3, supportsPreviewSelection: true, mediaRequirements: 'video', defaultVisible: true },
  { layoutCode: 'batak-mempelai4', family: 'mempelai', title: 'Mempelai 4', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 4, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
  { layoutCode: 'batak-acara2', family: 'acara', title: 'Acara 2', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 5, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'batak-acara5', family: 'acara', title: 'Acara 5', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 6, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'batak-map2', family: 'map', title: 'Map 2', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 7, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'batak-video', family: 'video', title: 'Video', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 8, supportsPreviewSelection: true, mediaRequirements: 'video', defaultVisible: true },
  { layoutCode: 'batak-galeri', family: 'galeri', title: 'Galeri', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 9, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
  { layoutCode: 'batak-live-streaming', family: 'live-streaming', title: 'Live Streaming', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 10, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'batak-love-story', family: 'love-story', title: 'Love Story', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 11, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: true },
  { layoutCode: 'batak-extra-link', family: 'extra-link', title: 'Extra Link', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 12, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'batak-rundown', family: 'rundown', title: 'Rundown Acara', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 13, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'batak-rsvp2', family: 'rsvp', title: 'RSVP 2', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 14, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'batak-doa', family: 'doa', title: 'Doa', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 15, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'batak-gift1', family: 'gift', title: 'Gift 1', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 16, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'batak-contact', family: 'contact', title: 'Contact Person', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 17, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'batak-thanks', family: 'thanks', title: 'Terima Kasih', requiredTier: 'premium', requiredFeatureCode: null, maxInstances: 1, sortOrder: 18, supportsPreviewSelection: true, mediaRequirements: 'video', defaultVisible: true },
];

const SOURCE_THEME_DEFINITIONS: Record<string, SourceThemeDefinition> = {
  [MALAY_ETHNIC_RED_RUBY_THEME_ID]: {
    themeId: MALAY_ETHNIC_RED_RUBY_THEME_ID,
    assetBase: MALAY_ETHNIC_RED_RUBY_ASSET_BASE,
    source: MALAY_ETHNIC_RED_RUBY_SOURCE as JsonRecord,
    defaultFont: MALAY_ETHNIC_RED_RUBY_FONT_FAHKWANG,
    fontMap: MALAY_ETHNIC_RED_RUBY_SOURCE_FONT_MAP,
    layoutCodeBySourceName: MALAY_ETHNIC_RED_RUBY_LAYOUT_CODE_BY_SOURCE_NAME,
    layoutCatalogSeeds: MALAY_ETHNIC_RED_RUBY_LAYOUT_CATALOG_SEEDS,
  },
  [BATAK_THEME_ID]: {
    themeId: BATAK_THEME_ID,
    assetBase: BATAK_ASSET_BASE,
    source: BATAK_ETHNIC_MAROON_MISTYROSE_SOURCE as JsonRecord,
    defaultFont: BATAK_FONT_FAHKWANG,
    fontMap: BATAK_SOURCE_FONT_MAP,
    layoutCodeBySourceName: BATAK_LAYOUT_CODE_BY_SOURCE_NAME,
    layoutCatalogSeeds: BATAK_LAYOUT_CATALOG_SEEDS,
  },
  ...(ADDITIONAL_SOURCE_THEME_DEFINITIONS as unknown as Record<string, SourceThemeDefinition>),
};

function getSourceThemeDefinition(themeId: string): SourceThemeDefinition | null {
  return SOURCE_THEME_DEFINITIONS[themeId] ?? null;
}

function normalizePreviewFile(layoutCode: string): string {
  if (layoutCode === 'gift1') return 'gift1';
  if (layoutCode === 'gift2') return 'gift2';
  if (layoutCode === 'contact1') return 'contact1';
  if (layoutCode === 'contact2') return 'contact2';
  return layoutCode;
}

function normalizeSourceGalleryLayoutCode(layoutCode: string): string {
  return layoutCode.replace(/(galeri|gallery)[123]$/i, '$1');
}

function getGalleryLayoutIndex(layoutCode: string): 1 | 2 | 3 | null {
  const match = layoutCode.match(/(?:galeri|gallery)([123])$/i);
  if (!match) return null;
  return Number(match[1]) as 1 | 2 | 3;
}

function getGalleryLayoutVariant(layoutCode: string): SapatamuEditorGalleryElement['variant'] {
  const layoutIndex = getGalleryLayoutIndex(layoutCode);
  if (layoutIndex === 2) return 'gallery-quad-offset';
  if (layoutIndex === 3) return 'gallery-hero-trio';
  return 'gallery-mosaic-six';
}

function applyGalleryVariantForLayoutCode(defaultPageData: Record<string, unknown>, layoutCode: string): void {
  const gallery = defaultPageData.gallery as Partial<SapatamuEditorGalleryElement> | undefined;
  if (gallery?.type !== 'gallery') return;
  gallery.variant = getGalleryLayoutVariant(layoutCode);
}

function expandPremiumSourceGallerySeeds(seeds: LayoutCatalogSeed[]): LayoutCatalogSeed[] {
  return seeds.flatMap((seed) => {
    if (seed.family !== 'galeri' || seed.requiredTier !== 'premium') return [seed];

    return ([1, 2, 3] as const).map((layoutIndex) => ({
      ...seed,
      layoutCode: `${normalizeSourceGalleryLayoutCode(seed.layoutCode)}${layoutIndex}`,
      title: `Galeri ${layoutIndex}`,
      sortOrder: seed.sortOrder + (layoutIndex - 1) * 0.01,
      defaultVisible: true,
    }));
  });
}

function normalizeLayoutDisplayTitle(
  layout: Pick<SapatamuEditorLayoutCatalogItem, 'family' | 'title'>,
  familyIndex: number,
): string {
  switch (layout.family) {
    case 'opening':
      return 'Opening';
    case 'salam':
      return 'Salam';
    case 'quote':
      return 'Quote';
    case 'mempelai':
    case 'profile':
      return 'Mempelai';
    case 'acara':
      return `Acara ${familyIndex}`;
    case 'map':
      return 'Lokasi';
    case 'video':
      return 'Video';
    case 'galeri':
      return 'Galeri';
    case 'live-streaming':
      return 'Live Streaming';
    case 'love-story':
      return 'Kisah Cinta';
    case 'extra-link':
      return 'Link Tambahan';
    case 'rundown':
      return 'Rundown Acara';
    case 'rsvp':
      return 'RSVP';
    case 'doa':
      return 'Doa';
    case 'gift':
      return 'Gift';
    case 'contact':
      return 'Contact Person';
    case 'dress-code':
      return 'Dress Code';
    case 'sponsor':
      return 'Sponsor';
    case 'thanks':
      return 'Terima Kasih';
    default:
      return stripLegacyBrand(layout.title) || 'Layout';
  }
}

export function buildLayoutCatalog(params: {
  themeId: string;
  profiles: Array<{ fullName?: string; nickName?: string; description?: string }>;
  events: Array<{
    name?: string;
    date?: string;
    timeStart?: string;
    timeEnd?: string;
    address?: string;
    mapLocation?: string;
  }>;
}): SapatamuEditorLayoutCatalogItem[] {
  const sourceDefinition = getSourceThemeDefinition(params.themeId);
  const seeds = sourceDefinition
    ? expandPremiumSourceGallerySeeds(sourceDefinition.layoutCatalogSeeds)
    : LAYOUT_CATALOG_SEEDS;
  const familyCounts = new Map<string, number>();

  return seeds.map((seed) => {
    const nextFamilyIndex = (familyCounts.get(seed.family) ?? 0) + 1;
    familyCounts.set(seed.family, nextFamilyIndex);
    const title = sourceDefinition && seed.family === 'galeri' && getGalleryLayoutIndex(seed.layoutCode)
      ? `Galeri ${getGalleryLayoutIndex(seed.layoutCode)}`
      : sourceDefinition
        ? normalizeLayoutDisplayTitle(seed, nextFamilyIndex)
        : stripLegacyBrand(seed.title) || seed.title;
    const previewLayoutCode = sourceDefinition
      ? normalizeSourceGalleryLayoutCode(seed.layoutCode)
      : seed.layoutCode;
    const defaultPageData = buildDefaultPageData({
      layoutCode: seed.layoutCode,
      family: seed.family,
      title,
      themeId: params.themeId,
      profiles: params.profiles,
      events: params.events,
    });
    applyGalleryVariantForLayoutCode(defaultPageData, seed.layoutCode);

    return {
      ...seed,
      title,
      previewImageUrl:
        sourceDefinition
          ? sourceThemeAsset(sourceDefinition, `layouts/${previewLayoutCode.replace(`${sourceDefinition.themeId.split('-')[0]}-`, '')}.webp`)
          : `/sapatamu-layouts/${normalizePreviewFile(seed.layoutCode)}.webp`,
      defaultPageData,
    };
  });
}

export function buildEditorPackageFeatures(
  requiredTierCategory: 'basic' | 'premium' | 'vintage',
): SapatamuEditorPackageFeatures {
  const premiumOrHigher = tierRank(requiredTierCategory) >= 1;
  const vintage = tierRank(requiredTierCategory) >= 2;

  return {
    tierCategory: requiredTierCategory,
    canUseImageBackground: premiumOrHigher,
    canUseVideoBackground: vintage,
    canUseGallery: true,
    canUseVideoSection: premiumOrHigher,
    canUseGift: premiumOrHigher,
    canUseContact: premiumOrHigher,
    canUseLoveStory: vintage,
    canUseSponsor: vintage,
    canUseExtraLink: vintage,
    canUseLiveStreaming: premiumOrHigher,
  };
}

function isLayoutLocked(
  layout: Pick<SapatamuEditorLayoutCatalogItem, 'requiredTier'>,
  packageFeatures: SapatamuEditorPackageFeatures,
): boolean {
  return tierRank(layout.requiredTier) > tierRank(packageFeatures.tierCategory);
}

function buildPageSlug(uniqueId: number, title: string): string {
  return `${uniqueId}-${kebabCase(title) || 'layout'}`;
}

export function createEditorPageFromCatalog(params: {
  layout: SapatamuEditorLayoutCatalogItem;
  uniqueId: number;
  source: 'base' | 'addon';
  packageFeatures: SapatamuEditorPackageFeatures;
}): SapatamuEditorPage {
  return {
    id: params.layout.layoutCode,
    uniqueId: params.uniqueId,
    title: params.layout.title,
    slug: buildPageSlug(params.uniqueId, params.layout.title),
    layoutCode: params.layout.layoutCode,
    family: params.layout.family,
    isActive: true,
    isLocked: isLayoutLocked(params.layout, params.packageFeatures),
    source: params.source,
    data: deepClone(params.layout.defaultPageData) as SapatamuEditorPage['data'],
  };
}

export function buildDefaultEditorState(params: {
  themeId: string;
  requiredTierCategory: 'basic' | 'premium' | 'vintage';
  profiles: Array<{ fullName?: string; nickName?: string; description?: string }>;
  events: Array<{
    name?: string;
    date?: string;
    timeStart?: string;
    timeEnd?: string;
    address?: string;
    mapLocation?: string;
  }>;
}): SapatamuEditorState {
  const palette = getThemePalette(params.themeId);
  const sourceDefinition = getSourceThemeDefinition(params.themeId);
  const packageFeatures = buildEditorPackageFeatures(params.requiredTierCategory);
  const catalog = buildLayoutCatalog({
    themeId: params.themeId,
    profiles: params.profiles,
    events: params.events,
  });

  const pages = catalog
    .filter((layout) => layout.defaultVisible)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((layout, index) =>
      createEditorPageFromCatalog({
        layout,
        uniqueId: index + 1,
        source: 'base',
        packageFeatures,
      }),
    );

  return {
    pages,
    globalBackground:
      sourceDefinition ? sourceThemeBackgroundAsset(sourceDefinition, sourceDefinition.source.background) : null,
    globalBackgroundDetails:
      sourceDefinition
        ? mapSignatureSourceBackgroundDetails(sourceDefinition.source.background_details as JsonRecord)
        : buildBackgroundDetails(params.themeId),
    cornerElements:
      sourceDefinition ? buildSourceThemeCornerElements(sourceDefinition) : buildCornerElements(),
    navMenu: {
      enabled: Boolean(sourceDefinition),
      activeColor: sourceDefinition ? palette.accent : palette.accent,
      inactiveColor: sourceDefinition ? palette.accentSoft : palette.muted,
    },
    fullScreen: {
      enabled: true,
    },
    colorPalette: {
      themeId: params.themeId,
      canvas: palette.canvas,
      surface: palette.surface,
      accent: palette.accent,
      accentSoft: palette.accentSoft,
      text: palette.text,
      muted: palette.muted,
      overlay: palette.overlay,
    },
    packageFeatures,
    layoutCatalogSnapshot: catalog.map((layout) => ({
      layoutCode: layout.layoutCode,
      family: layout.family,
      title: layout.title,
      previewImageUrl: layout.previewImageUrl,
      requiredTier: layout.requiredTier,
      requiredFeatureCode: layout.requiredFeatureCode,
    })),
  };
}

function normalizePageData(
  raw: unknown,
  fallback: SapatamuEditorPage['data'],
  options: { pruneUnknownKeys?: boolean; resetSignatureSourceAssets?: boolean } = {},
): SapatamuEditorPage['data'] {
  if (!raw || typeof raw !== 'object') {
    return deepClone(fallback);
  }

  const source = raw as JsonRecord;
  const allowedKeys = new Set(Object.keys(fallback));
  const cleanSource = options.pruneUnknownKeys
    ? Object.fromEntries(Object.entries(source).filter(([key]) => allowedKeys.has(key)))
    : source;
  const shouldResetPageAssets =
    options.resetSignatureSourceAssets &&
    (isSignatureSourceAsset(source.background) || containsSignatureSourceAsset(source.cornerElements));
  return {
    ...deepClone(fallback),
    ...cleanSource,
    background:
      typeof source.background === 'string' &&
      !(options.resetSignatureSourceAssets && isSignatureSourceAsset(source.background))
        ? source.background
        : fallback.background,
    backgroundDetails:
      source.backgroundDetails && typeof source.backgroundDetails === 'object' && !shouldResetPageAssets
        ? {
            ...fallback.backgroundDetails,
            ...(source.backgroundDetails as JsonRecord),
            gradient: {
              ...fallback.backgroundDetails.gradient,
              ...((source.backgroundDetails as JsonRecord).gradient as JsonRecord | undefined),
            },
            blend: {
              ...fallback.backgroundDetails.blend,
              ...((source.backgroundDetails as JsonRecord).blend as JsonRecord | undefined),
            },
          }
        : fallback.backgroundDetails,
    cornerElements:
      source.cornerElements &&
      typeof source.cornerElements === 'object' &&
      !(options.resetSignatureSourceAssets && containsSignatureSourceAsset(source.cornerElements))
        ? {
            ...fallback.cornerElements,
            ...(source.cornerElements as JsonRecord),
            style: {
              ...fallback.cornerElements.style,
              ...((source.cornerElements as JsonRecord).style as JsonRecord | undefined),
              gradient: {
                ...fallback.cornerElements.style.gradient,
                ...(((source.cornerElements as JsonRecord).style as JsonRecord | undefined)?.gradient as
                  | JsonRecord
                  | undefined),
              },
              blend: {
                ...fallback.cornerElements.style.blend,
                ...(((source.cornerElements as JsonRecord).style as JsonRecord | undefined)?.blend as
                  | JsonRecord
                  | undefined),
              },
            },
          }
        : fallback.cornerElements,
  };
}

export function normalizeEditorState(params: {
  themeId: string;
  requiredTierCategory: 'basic' | 'premium' | 'vintage';
  profiles: Array<{ fullName?: string; nickName?: string; description?: string }>;
  events: Array<{
    name?: string;
    date?: string;
    timeStart?: string;
    timeEnd?: string;
    address?: string;
    mapLocation?: string;
  }>;
  raw?: Partial<SapatamuEditorState> | null;
}): SapatamuEditorState {
  const fallback = buildDefaultEditorState({
    themeId: params.themeId,
    requiredTierCategory: params.requiredTierCategory,
    profiles: params.profiles,
    events: params.events,
  });

  const raw = params.raw ?? {};
  const isMalayEthnicRedRuby = params.themeId === MALAY_ETHNIC_RED_RUBY_THEME_ID;
  const isSourceTheme = Boolean(getSourceThemeDefinition(params.themeId));
  const catalog = buildLayoutCatalog({
    themeId: params.themeId,
    profiles: params.profiles,
    events: params.events,
  });
  const packageFeatures = buildEditorPackageFeatures(params.requiredTierCategory);
  const normalizedPages = Array.isArray(raw.pages)
    ? raw.pages
        .filter((item): item is SapatamuEditorPage => Boolean(item && typeof item === 'object'))
        .map((item, index) => {
          const layout = catalog.find((candidate) => candidate.layoutCode === cleanString(item.layoutCode)) ??
            catalog.find((candidate) => candidate.family === cleanString(item.family)) ??
            catalog[0];
          const uniqueId = typeof item.uniqueId === 'number' ? item.uniqueId : index + 1;
          const title = isSourceTheme ? layout.title : cleanString(item.title) || layout.title;
          return {
            id: cleanString(item.id) || layout.layoutCode,
            uniqueId,
            title,
            slug: cleanString(item.slug) || buildPageSlug(uniqueId, title),
            layoutCode: layout.layoutCode,
            family: layout.family,
            isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
            isLocked: isLayoutLocked(layout, packageFeatures),
            source: item.source === 'addon' ? 'addon' : 'base',
            data: normalizePageData(item.data, layout.defaultPageData as SapatamuEditorPage['data'], {
              pruneUnknownKeys: isSourceTheme,
              resetSignatureSourceAssets: isMalayEthnicRedRuby,
            }),
          } satisfies SapatamuEditorPage;
        })
    : fallback.pages;
  const pages = isSourceTheme && hasLegacyUnnumberedSourceGalleryPage(raw.pages, catalog)
    ? expandLegacySourceGalleryPages({
        pages: normalizedPages,
        catalog,
        packageFeatures,
      })
    : normalizedPages;
  const rawGlobalBackground = typeof raw.globalBackground === 'string' ? raw.globalBackground : '';
  const resetGlobalSignatureSourceAssets = isMalayEthnicRedRuby && isSignatureSourceAsset(rawGlobalBackground);

  return {
    pages,
    globalBackground: rawGlobalBackground && !resetGlobalSignatureSourceAssets ? rawGlobalBackground : fallback.globalBackground,
    globalBackgroundDetails:
      raw.globalBackgroundDetails && typeof raw.globalBackgroundDetails === 'object' && !resetGlobalSignatureSourceAssets
        ? {
            ...fallback.globalBackgroundDetails,
            ...(raw.globalBackgroundDetails as JsonRecord),
            gradient: {
              ...fallback.globalBackgroundDetails.gradient,
              ...((raw.globalBackgroundDetails as JsonRecord).gradient as JsonRecord | undefined),
            },
            blend: {
              ...fallback.globalBackgroundDetails.blend,
              ...((raw.globalBackgroundDetails as JsonRecord).blend as JsonRecord | undefined),
            },
          }
        : fallback.globalBackgroundDetails,
    cornerElements:
      raw.cornerElements &&
      typeof raw.cornerElements === 'object' &&
      !(isMalayEthnicRedRuby && containsSignatureSourceAsset(raw.cornerElements))
        ? {
            ...fallback.cornerElements,
            ...(raw.cornerElements as JsonRecord),
            style: {
              ...fallback.cornerElements.style,
              ...((raw.cornerElements as JsonRecord).style as JsonRecord | undefined),
              gradient: {
                ...fallback.cornerElements.style.gradient,
                ...(((raw.cornerElements as JsonRecord).style as JsonRecord | undefined)?.gradient as
                  | JsonRecord
                  | undefined),
              },
              blend: {
                ...fallback.cornerElements.style.blend,
                ...(((raw.cornerElements as JsonRecord).style as JsonRecord | undefined)?.blend as
                  | JsonRecord
                  | undefined),
              },
            },
          }
        : fallback.cornerElements,
    navMenu: {
      ...fallback.navMenu,
      ...(raw.navMenu ?? {}),
    },
    fullScreen: {
      ...fallback.fullScreen,
      ...(raw.fullScreen ?? {}),
    },
    colorPalette: {
      ...fallback.colorPalette,
      ...(raw.colorPalette ?? {}),
      themeId: params.themeId,
    },
    packageFeatures,
    layoutCatalogSnapshot: catalog.map((layout) => ({
      layoutCode: layout.layoutCode,
      family: layout.family,
      title: layout.title,
      previewImageUrl: layout.previewImageUrl,
      requiredTier: layout.requiredTier,
      requiredFeatureCode: layout.requiredFeatureCode,
    })),
  };
}

function setByPath(target: JsonRecord, path: string, value: unknown) {
  const segments = path.split('.').filter(Boolean);
  if (segments.length === 0) {
    return;
  }

  let cursor: JsonRecord = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (!cursor[segment] || typeof cursor[segment] !== 'object' || Array.isArray(cursor[segment])) {
      cursor[segment] = {};
    }
    cursor = cursor[segment] as JsonRecord;
  }

  cursor[segments[segments.length - 1]] = value;
}

export function applyEditorPatchOperations<TDocument extends { editor: SapatamuEditorState }>(
  document: TDocument,
  operations: SapatamuEditorPatchOperation[],
): TDocument {
  const nextDocument = deepClone(document);

  for (const operation of operations) {
    switch (operation.type) {
      case 'set_global_field':
        setByPath(nextDocument as JsonRecord, operation.path, operation.value);
        break;
      case 'set_page_field': {
        const page = nextDocument.editor.pages.find((item) => item.uniqueId === operation.uniqueId);
        if (!page) {
          break;
        }
        setByPath(page as unknown as JsonRecord, operation.path, operation.value);
        if (!cleanString(page.slug)) {
          page.slug = buildPageSlug(page.uniqueId, page.title);
        }
        break;
      }
      case 'replace_page': {
        const pageIndex = nextDocument.editor.pages.findIndex((item) => item.uniqueId === operation.uniqueId);
        if (pageIndex < 0) {
          break;
        }
        nextDocument.editor.pages[pageIndex] = deepClone(operation.page);
        break;
      }
      case 'reorder_pages': {
        const orderMap = new Map<number, number>();
        operation.orderedUniqueIds.forEach((uniqueId, index) => orderMap.set(uniqueId, index));
        nextDocument.editor.pages = [...nextDocument.editor.pages]
          .sort((left, right) => {
            const leftIndex = orderMap.get(left.uniqueId);
            const rightIndex = orderMap.get(right.uniqueId);
            if (leftIndex === undefined && rightIndex === undefined) return left.uniqueId - right.uniqueId;
            if (leftIndex === undefined) return 1;
            if (rightIndex === undefined) return -1;
            return leftIndex - rightIndex;
          })
          .map((page, index) => ({
            ...page,
            uniqueId: index + 1,
            slug: buildPageSlug(index + 1, page.title),
          }));
        break;
      }
      case 'add_page': {
        const page = deepClone(operation.page);
        if (!page.uniqueId || nextDocument.editor.pages.some((item) => item.uniqueId === page.uniqueId)) {
          const uniqueId = nextDocument.editor.pages.reduce((max, item) => Math.max(max, item.uniqueId), 0) + 1;
          page.uniqueId = uniqueId;
        }
        page.slug = buildPageSlug(page.uniqueId, page.title);
        if (operation.afterUniqueId) {
          const targetIndex = nextDocument.editor.pages.findIndex((item) => item.uniqueId === operation.afterUniqueId);
          if (targetIndex >= 0) {
            nextDocument.editor.pages.splice(targetIndex + 1, 0, page);
            break;
          }
        }
        nextDocument.editor.pages.push(page);
        break;
      }
      case 'remove_page':
        nextDocument.editor.pages = nextDocument.editor.pages.filter((item) => item.uniqueId !== operation.uniqueId);
        break;
    }
  }

  nextDocument.editor.pages = nextDocument.editor.pages.map((page, index) => ({
    ...page,
    uniqueId: index + 1,
    slug: buildPageSlug(index + 1, page.title),
  }));

  return nextDocument;
}

export function buildEditorFeatureGates(
  packageFeatures: SapatamuEditorPackageFeatures,
  catalog: SapatamuEditorLayoutCatalogItem[],
): SapatamuEditorFeatureGate[] {
  return catalog.map((layout) => ({
    code: layout.layoutCode,
    enabled: !isLayoutLocked(layout, packageFeatures),
    label: layout.title,
    reason: isLayoutLocked(layout, packageFeatures)
      ? `Tersedia mulai paket ${layout.requiredTier}.`
      : null,
  }));
}

export function findLayoutByCode(
  catalog: SapatamuEditorLayoutCatalogItem[],
  layoutCode: string,
): SapatamuEditorLayoutCatalogItem | undefined {
  return catalog.find((item) => item.layoutCode === layoutCode);
}

export function createPageFromLayoutCode(params: {
  catalog: SapatamuEditorLayoutCatalogItem[];
  layoutCode: string;
  uniqueId: number;
  source: 'base' | 'addon';
  packageFeatures: SapatamuEditorPackageFeatures;
}): SapatamuEditorPage | null {
  const layout = findLayoutByCode(params.catalog, params.layoutCode);
  if (!layout) {
    return null;
  }

  return createEditorPageFromCatalog({
    layout,
    uniqueId: params.uniqueId,
    source: params.source,
    packageFeatures: params.packageFeatures,
  });
}

export function normalizeEditorPageSlug(title: string, uniqueId: number): string {
  return buildPageSlug(uniqueId, title);
}

function hasLegacyUnnumberedSourceGalleryPage(
  rawPages: unknown,
  catalog: SapatamuEditorLayoutCatalogItem[],
): boolean {
  if (!Array.isArray(rawPages)) return false;
  const numberedGalleryBaseCodes = new Set(
    catalog
      .filter((layout) => layout.family === 'galeri' && getGalleryLayoutIndex(layout.layoutCode))
      .map((layout) => normalizeSourceGalleryLayoutCode(layout.layoutCode)),
  );

  return rawPages.some((page) => {
    if (!page || typeof page !== 'object') return false;
    const layoutCode = cleanString((page as Partial<SapatamuEditorPage>).layoutCode);
    return Boolean(layoutCode && layoutCode === normalizeSourceGalleryLayoutCode(layoutCode) && numberedGalleryBaseCodes.has(layoutCode));
  });
}

function expandLegacySourceGalleryPages(params: {
  pages: SapatamuEditorPage[];
  catalog: SapatamuEditorLayoutCatalogItem[];
  packageFeatures: SapatamuEditorPackageFeatures;
}): SapatamuEditorPage[] {
  const galleryLayouts = params.catalog.filter((layout) => layout.family === 'galeri' && layout.defaultVisible);
  if (galleryLayouts.length <= 1) return params.pages;

  const existingLayoutCodes = new Set(params.pages.map((page) => page.layoutCode));
  const missingGalleryLayouts = galleryLayouts.filter((layout) => !existingLayoutCodes.has(layout.layoutCode));
  if (missingGalleryLayouts.length === 0) return params.pages;

  const firstGalleryIndex = params.pages.findIndex((page) => page.family === 'galeri');
  if (firstGalleryIndex < 0) return params.pages;

  const insertedPages = missingGalleryLayouts.map((layout, index) => createEditorPageFromCatalog({
    layout,
    uniqueId: params.pages.length + index + 1,
    source: 'base',
    packageFeatures: params.packageFeatures,
  }));
  const nextPages = [...params.pages];
  nextPages.splice(firstGalleryIndex + 1, 0, ...insertedPages);

  return nextPages.map((page, index) => ({
    ...page,
    uniqueId: index + 1,
    slug: buildPageSlug(index + 1, page.title),
  }));
}

export function buildEditorMediaTypeFromMime(mime: string): 'image' | 'video' {
  return mime.startsWith('video/') ? 'video' : 'image';
}

export function normalizeEditorColor(input: unknown, fallback: string): string {
  return normalizeHex(typeof input === 'string' ? input : '', fallback);
}
