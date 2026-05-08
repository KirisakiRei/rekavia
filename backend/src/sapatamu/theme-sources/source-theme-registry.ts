import { CALLA_LILY_PLUM_RED_LEAD_SOURCE } from './calla-lily-plum-red-lead-source';
import { KABAGYAN_LINNEA_SWAN_WHITE_SOURCE } from './kabagyan-linnea-swan-white-source';
import { HONEYSUCKLE_SEASHELL_SOURCE } from './honeysuckle-seashell-source';
import { HOLLYHOCK_NAULI_SIENNA_IVORY_SOURCE } from './hollyhock-nauli-sienna-ivory-source';
import { CHEERFULNESS_FLORALWHITE_SOURCE } from './cheerfulness-floralwhite-source';
import { JAVANESE_MAGNOLIA_TAN_MAHOGANY_SOURCE } from './javanese-magnolia-tan-mahogany-source';
import { POLYANTHUS_LINNEA_LIGHT_CORAL_SOURCE } from './polyanthus-linnea-light-coral-source';
import { JAVANESE_LINNEA_GREENISH_WHITE_SOURCE } from './javanese-linnea-greenish-white-source';
import { AISHWARYA_PEONNY_FONT_IDS, AISHWARYA_PEONNY_SOURCE } from './aishwarya-peonny-source';

type AdditionalSourceThemeDefinition = {
  themeId: string;
  assetBase: string;
  source: Record<string, any>;
  defaultFont: string;
  fontMap: Record<string, string>;
  layoutCodeBySourceName: Record<string, string>;
  layoutCatalogSeeds: Array<{
    layoutCode: string;
    family: string;
    title: string;
    requiredTier: 'basic' | 'premium' | 'vintage';
    requiredFeatureCode: string | null;
    maxInstances: number;
    sortOrder: number;
    supportsPreviewSelection: boolean;
    mediaRequirements: 'none' | 'image' | 'video' | 'mixed';
    defaultVisible: boolean;
  }>;
};

export const ADDITIONAL_SOURCE_THEME_IDS = [
  "calla-lily-plum-red-lead",
  "kabagyan-linnea-swan-white",
  "honeysuckle-seashell",
  "hollyhock-nauli-sienna-ivory",
  "cheerfulness-floralwhite",
  "javanese-magnolia-tan-mahogany",
  "polyanthus-linnea-light-coral",
  "javanese-linnea-greenish-white",
  "aishwarya-peonny"
] as const;

export const ADDITIONAL_SOURCE_THEME_PALETTES = {
  "calla-lily-plum-red-lead": {
    "canvas": "#852222",
    "surface": "#4f1212",
    "accent": "#876824",
    "accentSoft": "#f5d98d",
    "text": "#fff7e8",
    "muted": "#d7b56d",
    "overlay": "rgba(35, 12, 16, 0.5)"
  },
  "kabagyan-linnea-swan-white": {
    "canvas": "#646123",
    "surface": "#646123",
    "accent": "#c7c380",
    "accentSoft": "#646123",
    "text": "#646123",
    "muted": "#c7c380",
    "overlay": "rgba(35, 12, 16, 0.5)"
  },
  "honeysuckle-seashell": {
    "canvas": "#994f5b",
    "surface": "#7e414b",
    "accent": "#bf848c",
    "accentSoft": "#ad5f6c",
    "text": "#ad5f6c",
    "muted": "#bf848c",
    "overlay": "rgba(35, 12, 16, 0.5)"
  },
  "hollyhock-nauli-sienna-ivory": {
    "canvas": "#491103",
    "surface": "#491103",
    "accent": "#f1d9cd",
    "accentSoft": "#491103",
    "text": "#491103",
    "muted": "#f1d9cd",
    "overlay": "rgba(35, 12, 16, 0.5)"
  },
  "cheerfulness-floralwhite": {
    "canvas": "#634932",
    "surface": "#634932",
    "accent": "#cdb49c",
    "accentSoft": "#8e6948",
    "text": "#8e6948",
    "muted": "#cdb49c",
    "overlay": "rgba(35, 12, 16, 0.5)"
  },
  "javanese-magnolia-tan-mahogany": {
    "canvas": "#ab8345",
    "surface": "#ab8345",
    "accent": "#ba9556",
    "accentSoft": "#cdaf83",
    "text": "#cdaf83",
    "muted": "#ba9556",
    "overlay": "rgba(35, 12, 16, 0.5)"
  },
  "polyanthus-linnea-light-coral": {
    "canvas": "#a4424f",
    "surface": "#a4424f",
    "accent": "#d18d96",
    "accentSoft": "#a4424f",
    "text": "#a4424f",
    "muted": "#d18d96",
    "overlay": "rgba(35, 12, 16, 0.5)"
  },
  "javanese-linnea-greenish-white": {
    "canvas": "#ada849",
    "surface": "#485e46",
    "accent": "#a7cfb0",
    "accentSoft": "#436958",
    "text": "#436958",
    "muted": "#a7cfb0",
    "overlay": "rgba(35, 12, 16, 0.5)"
  },
  "aishwarya-peonny": {
    "canvas": "#a54141",
    "surface": "#46402a",
    "accent": "#c4a15d",
    "accentSoft": "#e4ceba",
    "text": "#46402a",
    "muted": "#a54141",
    "overlay": "rgba(70, 64, 42, 0.18)"
  }
} as const;

export const ADDITIONAL_SOURCE_THEME_FONTS = [
  {
    "id": "font-aishwarya-belgiano",
    "name": "Belgiano Serif",
    "fontUrl": "/sapatamu-themes/aishwarya-peonny/original/fonts/8543Belgiano-Serif.woff2",
    "category": "serif"
  },
  {
    "id": "font-aishwarya-neutica",
    "name": "Neutica",
    "fontUrl": "/sapatamu-themes/aishwarya-peonny/original/fonts/3858Neutica.woff2",
    "category": "display"
  },
  {
    "id": "font-aishwarya-pinyon",
    "name": "Pinyon Script",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap",
    "category": "script"
  },
  {
    "id": "font-aishwarya-lora",
    "name": "Lora",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&display=swap",
    "category": "serif"
  },
  {
    "id": "font-aishwarya-poppins",
    "name": "Poppins",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap",
    "category": "sans"
  },
  {
    "id": "font-calla-lily-plum-open-sans",
    "name": "Open Sans",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap",
    "category": "display"
  },
  {
    "id": "font-calla-lily-plum-poppins",
    "name": "Poppins",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
    "category": "sans"
  },
  {
    "id": "font-calla-lily-plum-arima",
    "name": "Arima",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "serif"
  },
  {
    "id": "font-calla-lily-plum-katibeh",
    "name": "Katibeh",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "display"
  },
  {
    "id": "font-calla-lily-plum-al-fresco",
    "name": "Al-Fresco",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "display"
  },
  {
    "id": "font-calla-lily-plum-tangier",
    "name": "Tangier",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-kabagyan-arima",
    "name": "Arima",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "serif"
  },
  {
    "id": "font-kabagyan-katibeh",
    "name": "Katibeh",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "display"
  },
  {
    "id": "font-kabagyan-tangier",
    "name": "Tangier",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-kabagyan-abhaya-libre",
    "name": "Abhaya Libre",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Abhaya+Libre&display=swap",
    "category": "serif"
  },
  {
    "id": "font-kabagyan-aclonica",
    "name": "Aclonica",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Aclonica&display=swap",
    "category": "display"
  },
  {
    "id": "font-kabagyan-fahkwang",
    "name": "Fahkwang",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Fahkwang&display=swap",
    "category": "sans"
  },
  {
    "id": "font-honeysuckle-arima",
    "name": "Arima",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "serif"
  },
  {
    "id": "font-honeysuckle-katibeh",
    "name": "Katibeh",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "display"
  },
  {
    "id": "font-honeysuckle-questa-grande",
    "name": "Questa-Grande",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "display"
  },
  {
    "id": "font-honeysuckle-gautreaux",
    "name": "Gautreaux",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-honeysuckle-abhaya-libre",
    "name": "Abhaya Libre",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Abhaya+Libre&display=swap",
    "category": "serif"
  },
  {
    "id": "font-honeysuckle-fahkwang",
    "name": "Fahkwang",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Fahkwang&display=swap",
    "category": "sans"
  },
  {
    "id": "font-hollyhock-arima",
    "name": "Arima",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "serif"
  },
  {
    "id": "font-hollyhock-katibeh",
    "name": "Katibeh",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "display"
  },
  {
    "id": "font-hollyhock-bickham-script-pro-3",
    "name": "Bickham-Script-Pro-3",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-hollyhock-annabelle-jf",
    "name": "Annabelle-JF",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-hollyhock-abhaya-libre",
    "name": "Abhaya Libre",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Abhaya+Libre&display=swap",
    "category": "serif"
  },
  {
    "id": "font-hollyhock-fahkwang",
    "name": "Fahkwang",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Fahkwang&display=swap",
    "category": "sans"
  },
  {
    "id": "font-cheerfulness-arima",
    "name": "Arima",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "serif"
  },
  {
    "id": "font-cheerfulness-katibeh",
    "name": "Katibeh",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "display"
  },
  {
    "id": "font-cheerfulness-annabelle-jf",
    "name": "Annabelle-JF",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-cheerfulness-tangier",
    "name": "Tangier",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-cheerfulness-gautreaux",
    "name": "Gautreaux",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-cheerfulness-fahkwang",
    "name": "Fahkwang",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Fahkwang&display=swap",
    "category": "sans"
  },
  {
    "id": "font-javanese-magnolia-arima",
    "name": "Arima",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "serif"
  },
  {
    "id": "font-javanese-magnolia-katibeh",
    "name": "Katibeh",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "display"
  },
  {
    "id": "font-javanese-magnolia-tangier",
    "name": "Tangier",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-javanese-magnolia-dulcinea",
    "name": "Dulcinea",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "display"
  },
  {
    "id": "font-javanese-magnolia-aclonica",
    "name": "Aclonica",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Aclonica&display=swap",
    "category": "display"
  },
  {
    "id": "font-javanese-magnolia-fahkwang",
    "name": "Fahkwang",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Fahkwang&display=swap",
    "category": "sans"
  },
  {
    "id": "font-polyanthus-poppins",
    "name": "Poppins",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
    "category": "sans"
  },
  {
    "id": "font-polyanthus-arima",
    "name": "Arima",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "serif"
  },
  {
    "id": "font-polyanthus-katibeh",
    "name": "Katibeh",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "display"
  },
  {
    "id": "font-polyanthus-annabelle-jf",
    "name": "Annabelle-JF",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-polyanthus-tangier",
    "name": "Tangier",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-polyanthus-gautreaux",
    "name": "Gautreaux",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-polyanthus-abhaya-libre",
    "name": "Abhaya Libre",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Abhaya+Libre&display=swap",
    "category": "serif"
  },
  {
    "id": "font-polyanthus-fahkwang",
    "name": "Fahkwang",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Fahkwang&display=swap",
    "category": "sans"
  },
  {
    "id": "font-javanese-linnea-poppins",
    "name": "Poppins",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
    "category": "sans"
  },
  {
    "id": "font-javanese-linnea-arima",
    "name": "Arima",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "serif"
  },
  {
    "id": "font-javanese-linnea-katibeh",
    "name": "Katibeh",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Alexandria&family=Amita:wght@400;700&family=Arima:wght@300;500&family=Katibeh&family=Ms+Madi&family=Poppins:wght@400;500&family=Sacramento&family=Sofia&display=swap",
    "category": "display"
  },
  {
    "id": "font-javanese-linnea-craw-modern-urw",
    "name": "Craw-Modern-URW",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "display"
  },
  {
    "id": "font-javanese-linnea-annabelle-jf",
    "name": "Annabelle-JF",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-javanese-linnea-tangier",
    "name": "Tangier",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-javanese-linnea-questa-grande",
    "name": "Questa-Grande",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "display"
  },
  {
    "id": "font-javanese-linnea-gautreaux",
    "name": "Gautreaux",
    "fontUrl": "https://use.typekit.net/czu0nkl.css",
    "category": "script"
  },
  {
    "id": "font-javanese-linnea-fahkwang",
    "name": "Fahkwang",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Fahkwang&display=swap",
    "category": "sans"
  }
] as const;

const AISHWARYA_PEONNY_LAYOUT_CODE_BY_SOURCE_NAME: Record<string, string> = {
  Opening: 'aishwarya-peonny-opening',
  Quote: 'aishwarya-peonny-quote',
  'Bride & Groom': 'aishwarya-peonny-mempelai',
  'Journey of Love': 'aishwarya-peonny-love-story',
  'Save the Date': 'aishwarya-peonny-save-date',
  'Date & Place': 'aishwarya-peonny-events',
  'Guide to Attire': 'aishwarya-peonny-attire',
  'Live Streaming': 'aishwarya-peonny-live-streaming',
  'Wedding Frame': 'aishwarya-peonny-wedding-frame',
  Gallery: 'aishwarya-peonny-gallery',
  RSVP: 'aishwarya-peonny-rsvp',
  'Wedding Gift': 'aishwarya-peonny-gift',
  'Thank You': 'aishwarya-peonny-thanks',
};

const AISHWARYA_PEONNY_LAYOUT_CATALOG_SEEDS: AdditionalSourceThemeDefinition['layoutCatalogSeeds'] = [
  { layoutCode: 'aishwarya-peonny-opening', family: 'opening', title: 'Opening', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 1, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-quote', family: 'quote', title: 'Quote', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 2, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-mempelai', family: 'mempelai', title: 'Bride & Groom', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 3, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-love-story', family: 'love-story', title: 'Journey of Love', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 4, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-save-date', family: 'acara', title: 'Save the Date', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 5, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-events', family: 'acara', title: 'Date & Place', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 6, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-attire', family: 'dress-code', title: 'Guide to Attire', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 7, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-live-streaming', family: 'live-streaming', title: 'Live Streaming', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 8, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-wedding-frame', family: 'extra-link', title: 'Wedding Frame', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 9, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-gallery', family: 'galeri', title: 'Gallery', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 10, supportsPreviewSelection: true, mediaRequirements: 'mixed', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-rsvp', family: 'rsvp', title: 'RSVP', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 11, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-gift', family: 'gift', title: 'Wedding Gift', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 12, supportsPreviewSelection: true, mediaRequirements: 'none', defaultVisible: true },
  { layoutCode: 'aishwarya-peonny-thanks', family: 'thanks', title: 'Thank You', requiredTier: 'vintage', requiredFeatureCode: null, maxInstances: 1, sortOrder: 13, supportsPreviewSelection: true, mediaRequirements: 'image', defaultVisible: true },
];

export const ADDITIONAL_SOURCE_THEME_DEFINITIONS: Record<string, AdditionalSourceThemeDefinition> = {
  "aishwarya-peonny": {
    themeId: "aishwarya-peonny",
    assetBase: "/sapatamu-themes/aishwarya-peonny",
    source: AISHWARYA_PEONNY_SOURCE,
    defaultFont: "font-aishwarya-lora",
    fontMap: {
      [AISHWARYA_PEONNY_FONT_IDS.belgiano]: "font-aishwarya-belgiano",
      [AISHWARYA_PEONNY_FONT_IDS.neutica]: "font-aishwarya-neutica",
      [AISHWARYA_PEONNY_FONT_IDS.pinyon]: "font-aishwarya-pinyon",
      [AISHWARYA_PEONNY_FONT_IDS.lora]: "font-aishwarya-lora",
      [AISHWARYA_PEONNY_FONT_IDS.poppins]: "font-aishwarya-poppins",
    },
    layoutCodeBySourceName: AISHWARYA_PEONNY_LAYOUT_CODE_BY_SOURCE_NAME,
    layoutCatalogSeeds: AISHWARYA_PEONNY_LAYOUT_CATALOG_SEEDS,
  },
  "calla-lily-plum-red-lead": {
    themeId: "calla-lily-plum-red-lead",
    assetBase: "/sapatamu-themes/calla-lily-plum-red-lead",
    source: CALLA_LILY_PLUM_RED_LEAD_SOURCE,
    defaultFont: "font-calla-lily-plum-poppins",
    fontMap: {
      "0194f58e-1c24-7201-85c0-065b0d3fce8a": "font-calla-lily-plum-open-sans",
      "0194f58e-1c24-7201-85c0-06681e86ecd7": "font-calla-lily-plum-poppins",
      "0194f58e-1c24-7201-85c0-06c8f2a0aa0a": "font-calla-lily-plum-arima",
      "0194f58e-1c24-7201-85c0-06d116707e35": "font-calla-lily-plum-katibeh",
      "0194f58e-1c25-71d3-bf1c-5ea79f961cd6": "font-calla-lily-plum-al-fresco",
      "0194f58e-1c25-71d3-bf1c-5f577354a00b": "font-calla-lily-plum-tangier"
},
    layoutCodeBySourceName: {
      "Opening": "calla-lily-plum-opening",
      "Salam": "calla-lily-plum-salam",
      "Quote": "calla-lily-plum-quote",
      "Mempelai 4": "calla-lily-plum-mempelai4",
      "Acara 2": "calla-lily-plum-acara2",
      "Acara 5": "calla-lily-plum-acara5",
      "Map 2": "calla-lily-plum-map2",
      "Galeri": "calla-lily-plum-galeri",
      "Video": "calla-lily-plum-video",
      "Live Streaming": "calla-lily-plum-live-streaming",
      "Love Story": "calla-lily-plum-love-story",
      "Extra Link": "calla-lily-plum-extra-link",
      "Rundown Acara": "calla-lily-plum-rundown",
      "RSVP 2": "calla-lily-plum-rsvp2",
      "Doa": "calla-lily-plum-doa",
      "Gift 1": "calla-lily-plum-gift1",
      "Contact Person": "calla-lily-plum-contact",
      "Terima Kasih": "calla-lily-plum-thanks"
},
    layoutCatalogSeeds: [
      {
            "layoutCode": "calla-lily-plum-opening",
            "family": "opening",
            "title": "Opening",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 1,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-salam",
            "family": "salam",
            "title": "Salam",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 2,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-quote",
            "family": "quote",
            "title": "Quote",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 3,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-mempelai4",
            "family": "mempelai",
            "title": "Mempelai 4",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 4,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-acara2",
            "family": "acara",
            "title": "Acara 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 5,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-acara5",
            "family": "acara",
            "title": "Acara 5",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 6,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-map2",
            "family": "map",
            "title": "Map 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 7,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-galeri",
            "family": "galeri",
            "title": "Galeri",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 8,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-video",
            "family": "video",
            "title": "Video",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 9,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-live-streaming",
            "family": "live-streaming",
            "title": "Live Streaming",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 10,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-love-story",
            "family": "love-story",
            "title": "Love Story",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 11,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-extra-link",
            "family": "extra-link",
            "title": "Extra Link",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 12,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-rundown",
            "family": "rundown",
            "title": "Rundown Acara",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 13,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-rsvp2",
            "family": "rsvp",
            "title": "RSVP 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 14,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-doa",
            "family": "doa",
            "title": "Doa",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 15,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-gift1",
            "family": "gift",
            "title": "Gift 1",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 16,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-contact",
            "family": "contact",
            "title": "Contact Person",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 17,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "calla-lily-plum-thanks",
            "family": "thanks",
            "title": "Terima Kasih",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 18,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      }
],
  },
  "kabagyan-linnea-swan-white": {
    themeId: "kabagyan-linnea-swan-white",
    assetBase: "/sapatamu-themes/kabagyan-linnea-swan-white",
    source: KABAGYAN_LINNEA_SWAN_WHITE_SOURCE,
    defaultFont: "font-kabagyan-fahkwang",
    fontMap: {
      "0194f58e-1c24-7201-85c0-06c8f2a0aa0a": "font-kabagyan-arima",
      "0194f58e-1c24-7201-85c0-06d116707e35": "font-kabagyan-katibeh",
      "0194f58e-1c25-71d3-bf1c-5f577354a00b": "font-kabagyan-tangier",
      "0194f58e-1c25-71d3-bf1c-6195791407ac": "font-kabagyan-abhaya-libre",
      "0194f58e-1c25-71d3-bf1c-61c68ca5bd9f": "font-kabagyan-aclonica",
      "0194f58e-1c26-7711-8646-9c60bf38a9b0": "font-kabagyan-fahkwang"
},
    layoutCodeBySourceName: {
      "Opening": "kabagyan-opening",
      "Salam": "kabagyan-salam",
      "Quote": "kabagyan-quote",
      "Mempelai 4": "kabagyan-mempelai4",
      "Acara 2": "kabagyan-acara2",
      "Acara 5": "kabagyan-acara5",
      "Map 2": "kabagyan-map2",
      "Live Streaming": "kabagyan-live-streaming",
      "Love Story": "kabagyan-love-story",
      "Extra Link": "kabagyan-extra-link",
      "Rundown Acara": "kabagyan-rundown",
      "RSVP 2": "kabagyan-rsvp2",
      "Doa": "kabagyan-doa",
      "Gift 1": "kabagyan-gift1",
      "Contact Person": "kabagyan-contact",
      "Terima Kasih": "kabagyan-thanks"
},
    layoutCatalogSeeds: [
      {
            "layoutCode": "kabagyan-opening",
            "family": "opening",
            "title": "Opening",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 1,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-salam",
            "family": "salam",
            "title": "Salam",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 2,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-quote",
            "family": "quote",
            "title": "Quote",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 3,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-mempelai4",
            "family": "mempelai",
            "title": "Mempelai 4",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 4,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-acara2",
            "family": "acara",
            "title": "Acara 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 5,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-acara5",
            "family": "acara",
            "title": "Acara 5",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 6,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-map2",
            "family": "map",
            "title": "Map 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 7,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-live-streaming",
            "family": "live-streaming",
            "title": "Live Streaming",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 8,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-love-story",
            "family": "love-story",
            "title": "Love Story",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 9,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-extra-link",
            "family": "extra-link",
            "title": "Extra Link",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 10,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-rundown",
            "family": "rundown",
            "title": "Rundown Acara",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 11,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-rsvp2",
            "family": "rsvp",
            "title": "RSVP 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 12,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-doa",
            "family": "doa",
            "title": "Doa",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 13,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-gift1",
            "family": "gift",
            "title": "Gift 1",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 14,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-contact",
            "family": "contact",
            "title": "Contact Person",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 15,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "kabagyan-thanks",
            "family": "thanks",
            "title": "Terima Kasih",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 16,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      }
],
  },
  "honeysuckle-seashell": {
    themeId: "honeysuckle-seashell",
    assetBase: "/sapatamu-themes/honeysuckle-seashell",
    source: HONEYSUCKLE_SEASHELL_SOURCE,
    defaultFont: "font-honeysuckle-fahkwang",
    fontMap: {
      "0194f58e-1c24-7201-85c0-06c8f2a0aa0a": "font-honeysuckle-arima",
      "0194f58e-1c24-7201-85c0-06d116707e35": "font-honeysuckle-katibeh",
      "0194f58e-1c25-71d3-bf1c-5f7279aabb58": "font-honeysuckle-questa-grande",
      "0194f58e-1c25-71d3-bf1c-5f8c9246c1dc": "font-honeysuckle-gautreaux",
      "0194f58e-1c25-71d3-bf1c-6195791407ac": "font-honeysuckle-abhaya-libre",
      "0194f58e-1c26-7711-8646-9c60bf38a9b0": "font-honeysuckle-fahkwang"
},
    layoutCodeBySourceName: {
      "Opening": "honeysuckle-opening",
      "Salam": "honeysuckle-salam",
      "Quote": "honeysuckle-quote",
      "Mempelai 4": "honeysuckle-mempelai4",
      "Acara 2": "honeysuckle-acara2",
      "Acara 5": "honeysuckle-acara5",
      "Map 2": "honeysuckle-map2",
      "Galeri": "honeysuckle-galeri",
      "Video": "honeysuckle-video",
      "Live Streaming": "honeysuckle-live-streaming",
      "Love Story": "honeysuckle-love-story",
      "Extra Link": "honeysuckle-extra-link",
      "Rundown Acara": "honeysuckle-rundown",
      "RSVP 2": "honeysuckle-rsvp2",
      "Doa": "honeysuckle-doa",
      "Gift 1": "honeysuckle-gift1",
      "Contact Person": "honeysuckle-contact",
      "Terima Kasih": "honeysuckle-thanks"
},
    layoutCatalogSeeds: [
      {
            "layoutCode": "honeysuckle-opening",
            "family": "opening",
            "title": "Opening",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 1,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-salam",
            "family": "salam",
            "title": "Salam",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 2,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-quote",
            "family": "quote",
            "title": "Quote",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 3,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-mempelai4",
            "family": "mempelai",
            "title": "Mempelai 4",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 4,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-acara2",
            "family": "acara",
            "title": "Acara 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 5,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-acara5",
            "family": "acara",
            "title": "Acara 5",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 6,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-map2",
            "family": "map",
            "title": "Map 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 7,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-galeri",
            "family": "galeri",
            "title": "Galeri",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 8,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-video",
            "family": "video",
            "title": "Video",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 9,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-live-streaming",
            "family": "live-streaming",
            "title": "Live Streaming",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 10,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-love-story",
            "family": "love-story",
            "title": "Love Story",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 11,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-extra-link",
            "family": "extra-link",
            "title": "Extra Link",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 12,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-rundown",
            "family": "rundown",
            "title": "Rundown Acara",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 13,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-rsvp2",
            "family": "rsvp",
            "title": "RSVP 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 14,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-doa",
            "family": "doa",
            "title": "Doa",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 15,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-gift1",
            "family": "gift",
            "title": "Gift 1",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 16,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-contact",
            "family": "contact",
            "title": "Contact Person",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 17,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "honeysuckle-thanks",
            "family": "thanks",
            "title": "Terima Kasih",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 18,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      }
],
  },
  "hollyhock-nauli-sienna-ivory": {
    themeId: "hollyhock-nauli-sienna-ivory",
    assetBase: "/sapatamu-themes/hollyhock-nauli-sienna-ivory",
    source: HOLLYHOCK_NAULI_SIENNA_IVORY_SOURCE,
    defaultFont: "font-hollyhock-fahkwang",
    fontMap: {
      "0194f58e-1c24-7201-85c0-06c8f2a0aa0a": "font-hollyhock-arima",
      "0194f58e-1c24-7201-85c0-06d116707e35": "font-hollyhock-katibeh",
      "0194f58e-1c25-71d3-bf1c-5e55cd498b50": "font-hollyhock-bickham-script-pro-3",
      "0194f58e-1c25-71d3-bf1c-5eef6785351b": "font-hollyhock-annabelle-jf",
      "0194f58e-1c25-71d3-bf1c-6195791407ac": "font-hollyhock-abhaya-libre",
      "0194f58e-1c26-7711-8646-9c60bf38a9b0": "font-hollyhock-fahkwang"
},
    layoutCodeBySourceName: {
      "Opening": "hollyhock-opening",
      "Profile": "hollyhock-profile",
      "Salam": "hollyhock-salam",
      "Quote": "hollyhock-quote",
      "Mempelai 4": "hollyhock-mempelai4",
      "Acara 2": "hollyhock-acara2",
      "Acara 5": "hollyhock-acara5",
      "Map 2": "hollyhock-map2",
      "Galeri": "hollyhock-galeri",
      "Video": "hollyhock-video",
      "Live Streaming": "hollyhock-live-streaming",
      "Love Story": "hollyhock-love-story",
      "Extra Link": "hollyhock-extra-link",
      "Rundown Acara": "hollyhock-rundown",
      "RSVP 2": "hollyhock-rsvp2",
      "Doa": "hollyhock-doa",
      "Gift 1": "hollyhock-gift1",
      "Contact Person": "hollyhock-contact",
      "Terima Kasih": "hollyhock-thanks"
},
    layoutCatalogSeeds: [
      {
            "layoutCode": "hollyhock-opening",
            "family": "opening",
            "title": "Opening",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 1,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-profile",
            "family": "profile",
            "title": "Profile",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 2,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-salam",
            "family": "salam",
            "title": "Salam",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 3,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-quote",
            "family": "quote",
            "title": "Quote",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 4,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-mempelai4",
            "family": "mempelai",
            "title": "Mempelai 4",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 5,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-acara2",
            "family": "acara",
            "title": "Acara 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 6,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-acara5",
            "family": "acara",
            "title": "Acara 5",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 7,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-map2",
            "family": "map",
            "title": "Map 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 8,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-galeri",
            "family": "galeri",
            "title": "Galeri",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 9,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-video",
            "family": "video",
            "title": "Video",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 10,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-live-streaming",
            "family": "live-streaming",
            "title": "Live Streaming",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 11,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-love-story",
            "family": "love-story",
            "title": "Love Story",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 12,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-extra-link",
            "family": "extra-link",
            "title": "Extra Link",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 13,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-rundown",
            "family": "rundown",
            "title": "Rundown Acara",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 14,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-rsvp2",
            "family": "rsvp",
            "title": "RSVP 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 15,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-doa",
            "family": "doa",
            "title": "Doa",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 16,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-gift1",
            "family": "gift",
            "title": "Gift 1",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 17,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-contact",
            "family": "contact",
            "title": "Contact Person",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 18,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "hollyhock-thanks",
            "family": "thanks",
            "title": "Terima Kasih",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 19,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      }
],
  },
  "cheerfulness-floralwhite": {
    themeId: "cheerfulness-floralwhite",
    assetBase: "/sapatamu-themes/cheerfulness-floralwhite",
    source: CHEERFULNESS_FLORALWHITE_SOURCE,
    defaultFont: "font-cheerfulness-fahkwang",
    fontMap: {
      "0194f58e-1c24-7201-85c0-06c8f2a0aa0a": "font-cheerfulness-arima",
      "0194f58e-1c24-7201-85c0-06d116707e35": "font-cheerfulness-katibeh",
      "0194f58e-1c25-71d3-bf1c-5eef6785351b": "font-cheerfulness-annabelle-jf",
      "0194f58e-1c25-71d3-bf1c-5f577354a00b": "font-cheerfulness-tangier",
      "0194f58e-1c25-71d3-bf1c-5f8c9246c1dc": "font-cheerfulness-gautreaux",
      "0194f58e-1c26-7711-8646-9c60bf38a9b0": "font-cheerfulness-fahkwang"
},
    layoutCodeBySourceName: {
      "Opening": "cheerfulness-opening",
      "Salam": "cheerfulness-salam",
      "Quote": "cheerfulness-quote",
      "Mempelai 4": "cheerfulness-mempelai4",
      "Acara 2": "cheerfulness-acara2",
      "Acara 5": "cheerfulness-acara5",
      "Map 2": "cheerfulness-map2",
      "Galeri": "cheerfulness-galeri",
      "Video": "cheerfulness-video",
      "Live Streaming": "cheerfulness-live-streaming",
      "Love Story": "cheerfulness-love-story",
      "Extra Link": "cheerfulness-extra-link",
      "Rundown Acara": "cheerfulness-rundown",
      "RSVP 2": "cheerfulness-rsvp2",
      "Doa": "cheerfulness-doa",
      "Gift 1": "cheerfulness-gift1",
      "Contact Person": "cheerfulness-contact",
      "Terima Kasih": "cheerfulness-thanks"
},
    layoutCatalogSeeds: [
      {
            "layoutCode": "cheerfulness-opening",
            "family": "opening",
            "title": "Opening",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 1,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-salam",
            "family": "salam",
            "title": "Salam",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 2,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-quote",
            "family": "quote",
            "title": "Quote",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 3,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-mempelai4",
            "family": "mempelai",
            "title": "Mempelai 4",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 4,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-acara2",
            "family": "acara",
            "title": "Acara 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 5,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-acara5",
            "family": "acara",
            "title": "Acara 5",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 6,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-map2",
            "family": "map",
            "title": "Map 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 7,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-galeri",
            "family": "galeri",
            "title": "Galeri",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 8,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-video",
            "family": "video",
            "title": "Video",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 9,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-live-streaming",
            "family": "live-streaming",
            "title": "Live Streaming",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 10,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-love-story",
            "family": "love-story",
            "title": "Love Story",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 11,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-extra-link",
            "family": "extra-link",
            "title": "Extra Link",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 12,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-rundown",
            "family": "rundown",
            "title": "Rundown Acara",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 13,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-rsvp2",
            "family": "rsvp",
            "title": "RSVP 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 14,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-doa",
            "family": "doa",
            "title": "Doa",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 15,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-gift1",
            "family": "gift",
            "title": "Gift 1",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 16,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-contact",
            "family": "contact",
            "title": "Contact Person",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 17,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "cheerfulness-thanks",
            "family": "thanks",
            "title": "Terima Kasih",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 18,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      }
],
  },
  "javanese-magnolia-tan-mahogany": {
    themeId: "javanese-magnolia-tan-mahogany",
    assetBase: "/sapatamu-themes/javanese-magnolia-tan-mahogany",
    source: JAVANESE_MAGNOLIA_TAN_MAHOGANY_SOURCE,
    defaultFont: "font-javanese-magnolia-fahkwang",
    fontMap: {
      "0194f58e-1c24-7201-85c0-06c8f2a0aa0a": "font-javanese-magnolia-arima",
      "0194f58e-1c24-7201-85c0-06d116707e35": "font-javanese-magnolia-katibeh",
      "0194f58e-1c25-71d3-bf1c-5f577354a00b": "font-javanese-magnolia-tangier",
      "0194f58e-1c25-71d3-bf1c-614fe695e109": "font-javanese-magnolia-dulcinea",
      "0194f58e-1c25-71d3-bf1c-61c68ca5bd9f": "font-javanese-magnolia-aclonica",
      "0194f58e-1c26-7711-8646-9c60bf38a9b0": "font-javanese-magnolia-fahkwang"
},
    layoutCodeBySourceName: {
      "Opening": "javanese-magnolia-opening",
      "Salam": "javanese-magnolia-salam",
      "Quote": "javanese-magnolia-quote",
      "Mempelai 4": "javanese-magnolia-mempelai4",
      "Acara 2": "javanese-magnolia-acara2",
      "Acara 5": "javanese-magnolia-acara5",
      "Map 2": "javanese-magnolia-map2",
      "Live Streaming": "javanese-magnolia-live-streaming",
      "Galeri": "javanese-magnolia-galeri",
      "Video": "javanese-magnolia-video",
      "Love Story": "javanese-magnolia-love-story",
      "Extra Link": "javanese-magnolia-extra-link",
      "Rundown Acara": "javanese-magnolia-rundown",
      "Doa": "javanese-magnolia-doa",
      "RSVP 2": "javanese-magnolia-rsvp2",
      "Gift 1": "javanese-magnolia-gift1",
      "Contact Person": "javanese-magnolia-contact",
      "Terima Kasih": "javanese-magnolia-thanks"
},
    layoutCatalogSeeds: [
      {
            "layoutCode": "javanese-magnolia-opening",
            "family": "opening",
            "title": "Opening",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 1,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-salam",
            "family": "salam",
            "title": "Salam",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 2,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-quote",
            "family": "quote",
            "title": "Quote",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 3,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-mempelai4",
            "family": "mempelai",
            "title": "Mempelai 4",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 4,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-acara2",
            "family": "acara",
            "title": "Acara 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 5,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-acara5",
            "family": "acara",
            "title": "Acara 5",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 6,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-map2",
            "family": "map",
            "title": "Map 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 7,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-live-streaming",
            "family": "live-streaming",
            "title": "Live Streaming",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 8,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-galeri",
            "family": "galeri",
            "title": "Galeri",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 9,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-video",
            "family": "video",
            "title": "Video",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 10,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-love-story",
            "family": "love-story",
            "title": "Love Story",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 11,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-extra-link",
            "family": "extra-link",
            "title": "Extra Link",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 12,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-rundown",
            "family": "rundown",
            "title": "Rundown Acara",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 13,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-doa",
            "family": "doa",
            "title": "Doa",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 14,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-rsvp2",
            "family": "rsvp",
            "title": "RSVP 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 15,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-gift1",
            "family": "gift",
            "title": "Gift 1",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 16,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-contact",
            "family": "contact",
            "title": "Contact Person",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 17,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-magnolia-thanks",
            "family": "thanks",
            "title": "Terima Kasih",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 18,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      }
],
  },
  "polyanthus-linnea-light-coral": {
    themeId: "polyanthus-linnea-light-coral",
    assetBase: "/sapatamu-themes/polyanthus-linnea-light-coral",
    source: POLYANTHUS_LINNEA_LIGHT_CORAL_SOURCE,
    defaultFont: "font-polyanthus-fahkwang",
    fontMap: {
      "0194f58e-1c24-7201-85c0-06681e86ecd7": "font-polyanthus-poppins",
      "0194f58e-1c24-7201-85c0-06c8f2a0aa0a": "font-polyanthus-arima",
      "0194f58e-1c24-7201-85c0-06d116707e35": "font-polyanthus-katibeh",
      "0194f58e-1c25-71d3-bf1c-5eef6785351b": "font-polyanthus-annabelle-jf",
      "0194f58e-1c25-71d3-bf1c-5f577354a00b": "font-polyanthus-tangier",
      "0194f58e-1c25-71d3-bf1c-5f8c9246c1dc": "font-polyanthus-gautreaux",
      "0194f58e-1c25-71d3-bf1c-6195791407ac": "font-polyanthus-abhaya-libre",
      "0194f58e-1c26-7711-8646-9c60bf38a9b0": "font-polyanthus-fahkwang"
},
    layoutCodeBySourceName: {
      "Opening": "polyanthus-opening",
      "Salam": "polyanthus-salam",
      "Quote": "polyanthus-quote",
      "Mempelai 4": "polyanthus-mempelai4",
      "Acara 5": "polyanthus-acara5",
      "Acara 6": "polyanthus-acara6",
      "Map 2": "polyanthus-map2",
      "Galeri": "polyanthus-galeri",
      "Video": "polyanthus-video",
      "Live Streaming": "polyanthus-live-streaming",
      "Love Story": "polyanthus-love-story",
      "Extra Link": "polyanthus-extra-link",
      "Rundown Acara": "polyanthus-rundown",
      "RSVP 2": "polyanthus-rsvp2",
      "Doa": "polyanthus-doa",
      "Gift 1": "polyanthus-gift1",
      "Contact Person": "polyanthus-contact",
      "Terima Kasih": "polyanthus-thanks"
},
    layoutCatalogSeeds: [
      {
            "layoutCode": "polyanthus-opening",
            "family": "opening",
            "title": "Opening",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 1,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-salam",
            "family": "salam",
            "title": "Salam",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 2,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-quote",
            "family": "quote",
            "title": "Quote",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 3,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-mempelai4",
            "family": "mempelai",
            "title": "Mempelai 4",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 4,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-acara5",
            "family": "acara",
            "title": "Acara 5",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 5,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-acara6",
            "family": "acara",
            "title": "Acara 6",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 6,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-map2",
            "family": "map",
            "title": "Map 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 7,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-galeri",
            "family": "galeri",
            "title": "Galeri",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 8,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-video",
            "family": "video",
            "title": "Video",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 9,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-live-streaming",
            "family": "live-streaming",
            "title": "Live Streaming",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 10,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-love-story",
            "family": "love-story",
            "title": "Love Story",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 11,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-extra-link",
            "family": "extra-link",
            "title": "Extra Link",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 12,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-rundown",
            "family": "rundown",
            "title": "Rundown Acara",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 13,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-rsvp2",
            "family": "rsvp",
            "title": "RSVP 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 14,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-doa",
            "family": "doa",
            "title": "Doa",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 15,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-gift1",
            "family": "gift",
            "title": "Gift 1",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 16,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-contact",
            "family": "contact",
            "title": "Contact Person",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 17,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "polyanthus-thanks",
            "family": "thanks",
            "title": "Terima Kasih",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 18,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      }
],
  },
  "javanese-linnea-greenish-white": {
    themeId: "javanese-linnea-greenish-white",
    assetBase: "/sapatamu-themes/javanese-linnea-greenish-white",
    source: JAVANESE_LINNEA_GREENISH_WHITE_SOURCE,
    defaultFont: "font-javanese-linnea-poppins",
    fontMap: {
      "0194f58e-1c24-7201-85c0-06681e86ecd7": "font-javanese-linnea-poppins",
      "0194f58e-1c24-7201-85c0-06c8f2a0aa0a": "font-javanese-linnea-arima",
      "0194f58e-1c24-7201-85c0-06d116707e35": "font-javanese-linnea-katibeh",
      "0194f58e-1c25-71d3-bf1c-5e254841ffd4": "font-javanese-linnea-craw-modern-urw",
      "0194f58e-1c25-71d3-bf1c-5eef6785351b": "font-javanese-linnea-annabelle-jf",
      "0194f58e-1c25-71d3-bf1c-5f577354a00b": "font-javanese-linnea-tangier",
      "0194f58e-1c25-71d3-bf1c-5f7279aabb58": "font-javanese-linnea-questa-grande",
      "0194f58e-1c25-71d3-bf1c-5f8c9246c1dc": "font-javanese-linnea-gautreaux",
      "0194f58e-1c26-7711-8646-9c60bf38a9b0": "font-javanese-linnea-fahkwang"
},
    layoutCodeBySourceName: {
      "Opening": "javanese-linnea-opening",
      "Profile": "javanese-linnea-profile",
      "Salam": "javanese-linnea-salam",
      "Quote": "javanese-linnea-quote",
      "Mempelai 4": "javanese-linnea-mempelai4",
      "Acara 2": "javanese-linnea-acara2",
      "Acara 6": "javanese-linnea-acara6",
      "Map 2": "javanese-linnea-map2",
      "Galeri": "javanese-linnea-galeri",
      "Video": "javanese-linnea-video",
      "Live Streaming 2": "javanese-linnea-live-streaming2",
      "Love Story": "javanese-linnea-love-story",
      "Extra Link": "javanese-linnea-extra-link",
      "Rundown Acara": "javanese-linnea-rundown",
      "RSVP 2": "javanese-linnea-rsvp2",
      "Doa": "javanese-linnea-doa",
      "Gift 1": "javanese-linnea-gift1",
      "Contact Person": "javanese-linnea-contact",
      "Terima Kasih": "javanese-linnea-thanks"
},
    layoutCatalogSeeds: [
      {
            "layoutCode": "javanese-linnea-opening",
            "family": "opening",
            "title": "Opening",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 1,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-profile",
            "family": "profile",
            "title": "Profile",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 2,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-salam",
            "family": "salam",
            "title": "Salam",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 3,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-quote",
            "family": "quote",
            "title": "Quote",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 4,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-mempelai4",
            "family": "mempelai",
            "title": "Mempelai 4",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 5,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-acara2",
            "family": "acara",
            "title": "Acara 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 6,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-acara6",
            "family": "acara",
            "title": "Acara 6",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 7,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-map2",
            "family": "map",
            "title": "Map 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 8,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-galeri",
            "family": "galeri",
            "title": "Galeri",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 9,
            "supportsPreviewSelection": true,
            "mediaRequirements": "image",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-video",
            "family": "video",
            "title": "Video",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 10,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-live-streaming2",
            "family": "live-streaming",
            "title": "Live Streaming 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 11,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-love-story",
            "family": "love-story",
            "title": "Love Story",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 12,
            "supportsPreviewSelection": true,
            "mediaRequirements": "mixed",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-extra-link",
            "family": "extra-link",
            "title": "Extra Link",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 13,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-rundown",
            "family": "rundown",
            "title": "Rundown Acara",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 14,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-rsvp2",
            "family": "rsvp",
            "title": "RSVP 2",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 15,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-doa",
            "family": "doa",
            "title": "Doa",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 16,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-gift1",
            "family": "gift",
            "title": "Gift 1",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 17,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-contact",
            "family": "contact",
            "title": "Contact Person",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 18,
            "supportsPreviewSelection": true,
            "mediaRequirements": "none",
            "defaultVisible": true
      },
      {
            "layoutCode": "javanese-linnea-thanks",
            "family": "thanks",
            "title": "Terima Kasih",
            "requiredTier": "premium",
            "requiredFeatureCode": null,
            "maxInstances": 1,
            "sortOrder": 19,
            "supportsPreviewSelection": true,
            "mediaRequirements": "video",
            "defaultVisible": true
      }
],
  },
};

export const ADDITIONAL_SOURCE_THEME_CATALOG_SEEDS = [
  {
    "code": "cheerfulness-floralwhite",
    "name": "Cheerfulness - floralwhite",
    "description": "Tema luxury Cheerfulness bernuansa floralwhite.",
    "previewImageUrl": "/sapatamu-themes/cheerfulness-floralwhite/original/pictures/picture_17393762970235qag6qp.jpeg",
    "metadata": {
      "group": "Budaya",
      "tierCategory": "premium",
      "supportsDedicatedRenderer": true,
      "sourceTheme": "cheerfulness-floralwhite"
    }
  },
  {
    "code": "javanese-magnolia-tan-mahogany",
    "name": "Javanese magnolia - Tan mahogany",
    "description": "Tema luxury Javanese magnolia bernuansa tan mahogany.",
    "previewImageUrl": "/sapatamu-themes/javanese-magnolia-tan-mahogany/original/pictures/picture_1739341588542rfwkemh.jpeg",
    "metadata": {
      "group": "Budaya",
      "tierCategory": "premium",
      "supportsDedicatedRenderer": true,
      "sourceTheme": "javanese-magnolia-tan-mahogany"
    }
  },
  {
    "code": "kabagyan-linnea-swan-white",
    "name": "Kabagyan Linnea - Swan white",
    "description": "Tema luxury Kabagyan Linnea bernuansa swan white.",
    "previewImageUrl": "/sapatamu-themes/kabagyan-linnea-swan-white/original/pictures/picture_17598873167628sxuxvc.jpeg",
    "metadata": {
      "group": "Budaya",
      "tierCategory": "premium",
      "supportsDedicatedRenderer": true,
      "sourceTheme": "kabagyan-linnea-swan-white"
    }
  },
  {
    "code": "javanese-linnea-greenish-white",
    "name": "Javanese Linnea - Greenish white",
    "description": "Tema luxury Javanese Linnea bernuansa greenish white.",
    "previewImageUrl": "/sapatamu-themes/javanese-linnea-greenish-white/original/pictures/picture_1749014791063e9fk1kdf.jpeg",
    "metadata": {
      "group": "Budaya",
      "tierCategory": "premium",
      "supportsDedicatedRenderer": true,
      "sourceTheme": "javanese-linnea-greenish-white"
    }
  },
  {
    "code": "polyanthus-linnea-light-coral",
    "name": "Polyanthus Linnea - Light coral",
    "description": "Tema luxury Polyanthus Linnea bernuansa light coral.",
    "previewImageUrl": "/sapatamu-themes/polyanthus-linnea-light-coral/original/pictures/picture_1739341758292juehtaq.jpeg",
    "metadata": {
      "group": "Budaya",
      "tierCategory": "premium",
      "supportsDedicatedRenderer": true,
      "sourceTheme": "polyanthus-linnea-light-coral"
    }
  },
  {
    "code": "hollyhock-nauli-sienna-ivory",
    "name": "Hollyhock Nauli - Sienna ivory",
    "description": "Tema luxury Hollyhock Nauli bernuansa sienna ivory.",
    "previewImageUrl": "/sapatamu-themes/hollyhock-nauli-sienna-ivory/original/pictures/picture_1771210484572u3md4sr.jpeg",
    "metadata": {
      "group": "Budaya",
      "tierCategory": "premium",
      "supportsDedicatedRenderer": true,
      "sourceTheme": "hollyhock-nauli-sienna-ivory"
    }
  },
  {
    "code": "honeysuckle-seashell",
    "name": "Honeysuckle - seashell",
    "description": "Tema luxury Honeysuckle bernuansa seashell.",
    "previewImageUrl": "/sapatamu-themes/honeysuckle-seashell/original/pictures/picture_173937383935637doz57.jpeg",
    "metadata": {
      "group": "Budaya",
      "tierCategory": "premium",
      "supportsDedicatedRenderer": true,
      "sourceTheme": "honeysuckle-seashell"
    }
  },
  {
    "code": "calla-lily-plum-red-lead",
    "name": "Calla Lily Plum - Red lead",
    "description": "Tema luxury Calla Lily Plum bernuansa red lead.",
    "previewImageUrl": "/sapatamu-themes/calla-lily-plum-red-lead/original/pictures/picture_1739338788188xkqpvsi.jpeg",
    "metadata": {
      "group": "Budaya",
      "tierCategory": "premium",
      "supportsDedicatedRenderer": true,
      "sourceTheme": "calla-lily-plum-red-lead"
    }
  },
  {
    "code": "aishwarya-peonny",
    "name": "Aishwarya Peonny",
    "description": "Tema Signature Aishwarya Peonny dari Heritage Series dengan layout floral klasik.",
    "previewImageUrl": "/sapatamu-themes/aishwarya-peonny/original/pictures/Heritage-Background-Home.webp",
    "metadata": {
      "group": "Signature",
      "tierCategory": "vintage",
      "supportsDedicatedRenderer": true,
      "sourceTheme": "aishwarya-peonny"
    }
  }
] as const;

export const ADDITIONAL_SOURCE_THEME_ASSET_SEEDS = [
  {
    "templateCode": "aishwarya-peonny",
    "assetType": "preview",
    "assetKey": "cover.preview",
    "url": "/sapatamu-themes/aishwarya-peonny/original/pictures/Heritage-Background-Home.webp",
    "fileName": "Heritage-Background-Home.webp",
    "sortOrder": 1,
    "metadata": { "slot": "cover", "enabled": true }
  },
  {
    "templateCode": "aishwarya-peonny",
    "assetType": "background",
    "assetKey": "background.global",
    "url": "/sapatamu-themes/aishwarya-peonny/original/pictures/Heritage-Background-Home.webp",
    "fileName": "Heritage-Background-Home.webp",
    "sortOrder": 10,
    "metadata": { "slot": "global", "enabled": true, "blend": { "mode": "normal" } }
  },
  {
    "templateCode": "aishwarya-peonny",
    "assetType": "music",
    "assetKey": "music.default",
    "url": "/sapatamu-themes/aishwarya-peonny/original/musics/SANDHAYU-SONG-Donkgedank-KASWOSIH-Backsound-Nusantara-Relaxing-Music.mp3",
    "fileName": "SANDHAYU-SONG-Donkgedank-KASWOSIH-Backsound-Nusantara-Relaxing-Music.mp3",
    "sortOrder": 15,
    "metadata": { "slot": "default", "enabled": true }
  },
  {
    "templateCode": "aishwarya-peonny",
    "assetType": "video",
    "assetKey": "video.motion",
    "url": "/sapatamu-themes/aishwarya-peonny/original/videos/MOTION-SANDHAYU-CUT.mp4",
    "fileName": "MOTION-SANDHAYU-CUT.mp4",
    "sortOrder": 16,
    "metadata": { "slot": "gallery", "enabled": true }
  },
  {
    "templateCode": "aishwarya-peonny",
    "assetType": "ornament",
    "assetKey": "ornament.top_left",
    "url": "/sapatamu-themes/aishwarya-peonny/original/pictures/Heritage-Bunga-1.webp",
    "fileName": "Heritage-Bunga-1.webp",
    "sortOrder": 20,
    "metadata": { "slot": "top_left", "enabled": true, "animation": { "style": 17, "duration": 5 }, "opacity": 1 }
  },
  {
    "templateCode": "aishwarya-peonny",
    "assetType": "ornament",
    "assetKey": "ornament.top_right",
    "url": "/sapatamu-themes/aishwarya-peonny/original/pictures/Heritage-Bunga-2.webp",
    "fileName": "Heritage-Bunga-2.webp",
    "sortOrder": 21,
    "metadata": { "slot": "top_right", "enabled": true, "animation": { "style": 17, "duration": 5 }, "opacity": 1 }
  },
  {
    "templateCode": "aishwarya-peonny",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_left",
    "url": "/sapatamu-themes/aishwarya-peonny/original/pictures/Heritage-Bunga-3.webp",
    "fileName": "Heritage-Bunga-3.webp",
    "sortOrder": 24,
    "metadata": { "slot": "bottom_left", "enabled": true, "animation": { "style": 17, "duration": 5 }, "opacity": 1 }
  },
  {
    "templateCode": "aishwarya-peonny",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_right",
    "url": "/sapatamu-themes/aishwarya-peonny/original/pictures/Heritage-Bunga-4.webp",
    "fileName": "Heritage-Bunga-4.webp",
    "sortOrder": 25,
    "metadata": { "slot": "bottom_right", "enabled": true, "animation": { "style": 17, "duration": 5 }, "opacity": 1 }
  },
  {
    "templateCode": "calla-lily-plum-red-lead",
    "assetType": "preview",
    "assetKey": "cover.preview",
    "url": "/sapatamu-themes/calla-lily-plum-red-lead/original/pictures/picture_1739338788188xkqpvsi.jpeg",
    "fileName": "picture_1739338788188xkqpvsi.jpeg",
    "sortOrder": 1,
    "metadata": {
      "slot": "cover",
      "enabled": true
    }
  },
  {
    "templateCode": "calla-lily-plum-red-lead",
    "assetType": "background",
    "assetKey": "background.global",
    "url": "/sapatamu-themes/calla-lily-plum-red-lead/original/albums/album_1739411677066erwv7a5.jpeg",
    "fileName": "album_1739411677066erwv7a5.jpeg",
    "sortOrder": 10,
    "metadata": {
      "slot": "global",
      "enabled": true,
      "blend": {
        "mode": "normal"
      }
    }
  },
  {
    "templateCode": "calla-lily-plum-red-lead",
    "assetType": "ornament",
    "assetKey": "ornament.top_left",
    "url": "/sapatamu-themes/calla-lily-plum-red-lead/original/pictures/picture_1684898828235c1ypla1.png",
    "fileName": "picture_1684898828235c1ypla1.png",
    "sortOrder": 20,
    "metadata": {
      "slot": "top_left",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "calla-lily-plum-red-lead",
    "assetType": "ornament",
    "assetKey": "ornament.top_right",
    "url": "/sapatamu-themes/calla-lily-plum-red-lead/original/pictures/picture_1684898832753w0e9r1t.png",
    "fileName": "picture_1684898832753w0e9r1t.png",
    "sortOrder": 21,
    "metadata": {
      "slot": "top_right",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "calla-lily-plum-red-lead",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_left",
    "url": "/sapatamu-themes/calla-lily-plum-red-lead/original/pictures/picture_16848988371468yjclse.png",
    "fileName": "picture_16848988371468yjclse.png",
    "sortOrder": 24,
    "metadata": {
      "slot": "bottom_left",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "calla-lily-plum-red-lead",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_right",
    "url": "/sapatamu-themes/calla-lily-plum-red-lead/original/pictures/picture_1684898841561g91fxd9.png",
    "fileName": "picture_1684898841561g91fxd9.png",
    "sortOrder": 25,
    "metadata": {
      "slot": "bottom_right",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "calla-lily-plum-red-lead",
    "assetType": "music",
    "assetKey": "music.default",
    "url": "/sapatamu-themes/calla-lily-plum-red-lead/original/musics/music_1725365605552z6dbzjsi.mp3",
    "fileName": "music_1725365605552z6dbzjsi.mp3",
    "sortOrder": 40,
    "metadata": {
      "enabled": true,
      "title": "0.12 -1.30Nothing's Gonna Change My Love Shania Yan Cover"
    }
  },
  {
    "templateCode": "calla-lily-plum-red-lead",
    "assetType": "video",
    "assetKey": "video.salam",
    "url": "/sapatamu-themes/calla-lily-plum-red-lead/original/albums/album_1739411263741lkj027.mp4",
    "fileName": "album_1739411263741lkj027.mp4",
    "sortOrder": 50,
    "metadata": {
      "slot": "salam",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "calla-lily-plum-red-lead",
    "assetType": "video",
    "assetKey": "video.quote",
    "url": "/sapatamu-themes/calla-lily-plum-red-lead/original/albums/album_1739411680496ygt2x4q.mp4",
    "fileName": "album_1739411680496ygt2x4q.mp4",
    "sortOrder": 51,
    "metadata": {
      "slot": "quote",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "kabagyan-linnea-swan-white",
    "assetType": "preview",
    "assetKey": "cover.preview",
    "url": "/sapatamu-themes/kabagyan-linnea-swan-white/original/pictures/picture_17598873167628sxuxvc.jpeg",
    "fileName": "picture_17598873167628sxuxvc.jpeg",
    "sortOrder": 1,
    "metadata": {
      "slot": "cover",
      "enabled": true
    }
  },
  {
    "templateCode": "kabagyan-linnea-swan-white",
    "assetType": "music",
    "assetKey": "music.default",
    "url": "/sapatamu-themes/kabagyan-linnea-swan-white/original/musics/music_1749541826661fw9wslz.mp3",
    "fileName": "music_1749541826661fw9wslz.mp3",
    "sortOrder": 40,
    "metadata": {
      "enabled": true,
      "title": "DENNY CAKNAN FEAT BELLA BONITA - SINARENGAN LIRIK DAN TERJEMAHAN"
    }
  },
  {
    "templateCode": "kabagyan-linnea-swan-white",
    "assetType": "video",
    "assetKey": "video.salam",
    "url": "/sapatamu-themes/kabagyan-linnea-swan-white/original/albums/album_17598085537577icm0fc.mp4",
    "fileName": "album_17598085537577icm0fc.mp4",
    "sortOrder": 50,
    "metadata": {
      "slot": "salam",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "kabagyan-linnea-swan-white",
    "assetType": "video",
    "assetKey": "video.quote",
    "url": "/sapatamu-themes/kabagyan-linnea-swan-white/original/albums/album_1759808553745zkwueo1.mp4",
    "fileName": "album_1759808553745zkwueo1.mp4",
    "sortOrder": 51,
    "metadata": {
      "slot": "quote",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "kabagyan-linnea-swan-white",
    "assetType": "video",
    "assetKey": "video.thanks",
    "url": "/sapatamu-themes/kabagyan-linnea-swan-white/original/albums/album_1759808553811fq26w45.mp4",
    "fileName": "album_1759808553811fq26w45.mp4",
    "sortOrder": 52,
    "metadata": {
      "slot": "thanks",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "honeysuckle-seashell",
    "assetType": "preview",
    "assetKey": "cover.preview",
    "url": "/sapatamu-themes/honeysuckle-seashell/original/pictures/picture_173937383935637doz57.jpeg",
    "fileName": "picture_173937383935637doz57.jpeg",
    "sortOrder": 1,
    "metadata": {
      "slot": "cover",
      "enabled": true
    }
  },
  {
    "templateCode": "honeysuckle-seashell",
    "assetType": "background",
    "assetKey": "background.global",
    "url": "/sapatamu-themes/honeysuckle-seashell/original/pictures/picture_1728955448863yshliqlh.jpeg",
    "fileName": "picture_1728955448863yshliqlh.jpeg",
    "sortOrder": 10,
    "metadata": {
      "slot": "global",
      "enabled": true,
      "blend": {
        "mode": "normal"
      }
    }
  },
  {
    "templateCode": "honeysuckle-seashell",
    "assetType": "ornament",
    "assetKey": "ornament.top_left",
    "url": "/sapatamu-themes/honeysuckle-seashell/original/pictures/picture_1728874044117iha6v89.png",
    "fileName": "picture_1728874044117iha6v89.png",
    "sortOrder": 20,
    "metadata": {
      "slot": "top_left",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "honeysuckle-seashell",
    "assetType": "ornament",
    "assetKey": "ornament.top_right",
    "url": "/sapatamu-themes/honeysuckle-seashell/original/pictures/picture_1728874048582bpuaidz.png",
    "fileName": "picture_1728874048582bpuaidz.png",
    "sortOrder": 21,
    "metadata": {
      "slot": "top_right",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "honeysuckle-seashell",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_left",
    "url": "/sapatamu-themes/honeysuckle-seashell/original/pictures/picture_17288740507029un1o3fg.png",
    "fileName": "picture_17288740507029un1o3fg.png",
    "sortOrder": 24,
    "metadata": {
      "slot": "bottom_left",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "honeysuckle-seashell",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_right",
    "url": "/sapatamu-themes/honeysuckle-seashell/original/pictures/picture_1728874046569w2fuzf4.png",
    "fileName": "picture_1728874046569w2fuzf4.png",
    "sortOrder": 25,
    "metadata": {
      "slot": "bottom_right",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "honeysuckle-seashell",
    "assetType": "music",
    "assetKey": "music.default",
    "url": "/sapatamu-themes/honeysuckle-seashell/original/musics/music_1728885011510yqbolue.mp3",
    "fileName": "music_1728885011510yqbolue.mp3",
    "sortOrder": 40,
    "metadata": {
      "enabled": true,
      "title": "Lesti - Bawa Aku Ke Penghulu (REFF)"
    }
  },
  {
    "templateCode": "honeysuckle-seashell",
    "assetType": "video",
    "assetKey": "video.salam",
    "url": "/sapatamu-themes/honeysuckle-seashell/original/albums/album_1739420675192cwpghxi.mp4",
    "fileName": "album_1739420675192cwpghxi.mp4",
    "sortOrder": 50,
    "metadata": {
      "slot": "salam",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "honeysuckle-seashell",
    "assetType": "video",
    "assetKey": "video.quote",
    "url": "/sapatamu-themes/honeysuckle-seashell/original/albums/album_17394206753737gy2i2n.mp4",
    "fileName": "album_17394206753737gy2i2n.mp4",
    "sortOrder": 51,
    "metadata": {
      "slot": "quote",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "honeysuckle-seashell",
    "assetType": "video",
    "assetKey": "video.thanks",
    "url": "/sapatamu-themes/honeysuckle-seashell/original/albums/album_1739420675299lcid3s4.mp4",
    "fileName": "album_1739420675299lcid3s4.mp4",
    "sortOrder": 52,
    "metadata": {
      "slot": "thanks",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "hollyhock-nauli-sienna-ivory",
    "assetType": "preview",
    "assetKey": "cover.preview",
    "url": "/sapatamu-themes/hollyhock-nauli-sienna-ivory/original/pictures/picture_1771210484572u3md4sr.jpeg",
    "fileName": "picture_1771210484572u3md4sr.jpeg",
    "sortOrder": 1,
    "metadata": {
      "slot": "cover",
      "enabled": true
    }
  },
  {
    "templateCode": "hollyhock-nauli-sienna-ivory",
    "assetType": "music",
    "assetKey": "music.default",
    "url": "/sapatamu-themes/hollyhock-nauli-sienna-ivory/original/musics/music_1759580591927vidvxqa.mp3",
    "fileName": "music_1759580591927vidvxqa.mp3",
    "sortOrder": 40,
    "metadata": {
      "enabled": true,
      "title": "D'Bamboo Musik Batak – Horbo Paung (Gondang Batak Uning Uningan)"
    }
  },
  {
    "templateCode": "hollyhock-nauli-sienna-ivory",
    "assetType": "video",
    "assetKey": "video.salam",
    "url": "/sapatamu-themes/hollyhock-nauli-sienna-ivory/original/albums/album_1771208666820fixn5jj.mp4",
    "fileName": "album_1771208666820fixn5jj.mp4",
    "sortOrder": 50,
    "metadata": {
      "slot": "salam",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "hollyhock-nauli-sienna-ivory",
    "assetType": "video",
    "assetKey": "video.quote",
    "url": "/sapatamu-themes/hollyhock-nauli-sienna-ivory/original/albums/album_1771208666780qc2szkh.mp4",
    "fileName": "album_1771208666780qc2szkh.mp4",
    "sortOrder": 51,
    "metadata": {
      "slot": "quote",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "hollyhock-nauli-sienna-ivory",
    "assetType": "video",
    "assetKey": "video.thanks",
    "url": "/sapatamu-themes/hollyhock-nauli-sienna-ivory/original/albums/album_177121101917317peck1.mp4",
    "fileName": "album_177121101917317peck1.mp4",
    "sortOrder": 52,
    "metadata": {
      "slot": "thanks",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "cheerfulness-floralwhite",
    "assetType": "preview",
    "assetKey": "cover.preview",
    "url": "/sapatamu-themes/cheerfulness-floralwhite/original/pictures/picture_17393762970235qag6qp.jpeg",
    "fileName": "picture_17393762970235qag6qp.jpeg",
    "sortOrder": 1,
    "metadata": {
      "slot": "cover",
      "enabled": true
    }
  },
  {
    "templateCode": "cheerfulness-floralwhite",
    "assetType": "background",
    "assetKey": "background.global",
    "url": "/sapatamu-themes/cheerfulness-floralwhite/original/pictures/picture_1711527076541ge978oj.jpeg",
    "fileName": "picture_1711527076541ge978oj.jpeg",
    "sortOrder": 10,
    "metadata": {
      "slot": "global",
      "enabled": true,
      "blend": {
        "mode": "normal"
      }
    }
  },
  {
    "templateCode": "cheerfulness-floralwhite",
    "assetType": "ornament",
    "assetKey": "ornament.top_left",
    "url": "/sapatamu-themes/cheerfulness-floralwhite/original/pictures/picture_1711523083457yo9wu45.png",
    "fileName": "picture_1711523083457yo9wu45.png",
    "sortOrder": 20,
    "metadata": {
      "slot": "top_left",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "cheerfulness-floralwhite",
    "assetType": "ornament",
    "assetKey": "ornament.top_right",
    "url": "/sapatamu-themes/cheerfulness-floralwhite/original/pictures/picture_1711523088288z6dekw8k.png",
    "fileName": "picture_1711523088288z6dekw8k.png",
    "sortOrder": 21,
    "metadata": {
      "slot": "top_right",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "cheerfulness-floralwhite",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_left",
    "url": "/sapatamu-themes/cheerfulness-floralwhite/original/pictures/picture_1711523090204xbtgqvu.png",
    "fileName": "picture_1711523090204xbtgqvu.png",
    "sortOrder": 24,
    "metadata": {
      "slot": "bottom_left",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "cheerfulness-floralwhite",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_right",
    "url": "/sapatamu-themes/cheerfulness-floralwhite/original/pictures/picture_1711523085671f9ld811.png",
    "fileName": "picture_1711523085671f9ld811.png",
    "sortOrder": 25,
    "metadata": {
      "slot": "bottom_right",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "cheerfulness-floralwhite",
    "assetType": "music",
    "assetKey": "music.default",
    "url": "/sapatamu-themes/cheerfulness-floralwhite/original/musics/music_1707400625852ak1z7xy.mp3",
    "fileName": "music_1707400625852ak1z7xy.mp3",
    "sortOrder": 40,
    "metadata": {
      "enabled": true,
      "title": "Daylight The Wedding Violin Version"
    }
  },
  {
    "templateCode": "cheerfulness-floralwhite",
    "assetType": "video",
    "assetKey": "video.salam",
    "url": "/sapatamu-themes/cheerfulness-floralwhite/original/pictures/picture_1711532620255rnwj91j.mp4",
    "fileName": "picture_1711532620255rnwj91j.mp4",
    "sortOrder": 50,
    "metadata": {
      "slot": "salam",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "cheerfulness-floralwhite",
    "assetType": "video",
    "assetKey": "video.quote",
    "url": "/sapatamu-themes/cheerfulness-floralwhite/original/pictures/picture_17115274272431q7c67a.mp4",
    "fileName": "picture_17115274272431q7c67a.mp4",
    "sortOrder": 51,
    "metadata": {
      "slot": "quote",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "cheerfulness-floralwhite",
    "assetType": "video",
    "assetKey": "video.thanks",
    "url": "/sapatamu-themes/cheerfulness-floralwhite/original/pictures/picture_1711527488215c2dyfnh.mp4",
    "fileName": "picture_1711527488215c2dyfnh.mp4",
    "sortOrder": 52,
    "metadata": {
      "slot": "thanks",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "javanese-magnolia-tan-mahogany",
    "assetType": "preview",
    "assetKey": "cover.preview",
    "url": "/sapatamu-themes/javanese-magnolia-tan-mahogany/original/pictures/picture_1739341588542rfwkemh.jpeg",
    "fileName": "picture_1739341588542rfwkemh.jpeg",
    "sortOrder": 1,
    "metadata": {
      "slot": "cover",
      "enabled": true
    }
  },
  {
    "templateCode": "javanese-magnolia-tan-mahogany",
    "assetType": "background",
    "assetKey": "background.global",
    "url": "/sapatamu-themes/javanese-magnolia-tan-mahogany/original/pictures/picture_1696478410016ttebdfn.png",
    "fileName": "picture_1696478410016ttebdfn.png",
    "sortOrder": 10,
    "metadata": {
      "slot": "global",
      "enabled": true,
      "blend": {
        "mode": "normal"
      }
    }
  },
  {
    "templateCode": "javanese-magnolia-tan-mahogany",
    "assetType": "ornament",
    "assetKey": "ornament.top_left",
    "url": "/sapatamu-themes/javanese-magnolia-tan-mahogany/original/pictures/picture_1696478388741zns0zdk.png",
    "fileName": "picture_1696478388741zns0zdk.png",
    "sortOrder": 20,
    "metadata": {
      "slot": "top_left",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "javanese-magnolia-tan-mahogany",
    "assetType": "ornament",
    "assetKey": "ornament.top_right",
    "url": "/sapatamu-themes/javanese-magnolia-tan-mahogany/original/pictures/picture_1696478391462oyig61zj.png",
    "fileName": "picture_1696478391462oyig61zj.png",
    "sortOrder": 21,
    "metadata": {
      "slot": "top_right",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "javanese-magnolia-tan-mahogany",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_left",
    "url": "/sapatamu-themes/javanese-magnolia-tan-mahogany/original/pictures/picture_1696478393426haek917.png",
    "fileName": "picture_1696478393426haek917.png",
    "sortOrder": 24,
    "metadata": {
      "slot": "bottom_left",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "javanese-magnolia-tan-mahogany",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_right",
    "url": "/sapatamu-themes/javanese-magnolia-tan-mahogany/original/pictures/picture_1696478395464lxlyhqs.png",
    "fileName": "picture_1696478395464lxlyhqs.png",
    "sortOrder": 25,
    "metadata": {
      "slot": "bottom_right",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "javanese-magnolia-tan-mahogany",
    "assetType": "music",
    "assetKey": "music.default",
    "url": "/sapatamu-themes/javanese-magnolia-tan-mahogany/original/musics/music_1686382733226zr3gavn.mp3",
    "fileName": "music_1686382733226zr3gavn.mp3",
    "sortOrder": 40,
    "metadata": {
      "enabled": true,
      "title": "GENDING JAWA KEBO GIRO TEMU MANTENSUARA MANTAAAP"
    }
  },
  {
    "templateCode": "javanese-magnolia-tan-mahogany",
    "assetType": "video",
    "assetKey": "video.salam",
    "url": "/sapatamu-themes/javanese-magnolia-tan-mahogany/original/pictures/picture_1696479125136n3y1yzb.mp4",
    "fileName": "picture_1696479125136n3y1yzb.mp4",
    "sortOrder": 50,
    "metadata": {
      "slot": "salam",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "javanese-magnolia-tan-mahogany",
    "assetType": "video",
    "assetKey": "video.quote",
    "url": "/sapatamu-themes/javanese-magnolia-tan-mahogany/original/pictures/picture_1706773908209q1t0kgs.mp4",
    "fileName": "picture_1706773908209q1t0kgs.mp4",
    "sortOrder": 51,
    "metadata": {
      "slot": "quote",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "polyanthus-linnea-light-coral",
    "assetType": "preview",
    "assetKey": "cover.preview",
    "url": "/sapatamu-themes/polyanthus-linnea-light-coral/original/pictures/picture_1739341758292juehtaq.jpeg",
    "fileName": "picture_1739341758292juehtaq.jpeg",
    "sortOrder": 1,
    "metadata": {
      "slot": "cover",
      "enabled": true
    }
  },
  {
    "templateCode": "polyanthus-linnea-light-coral",
    "assetType": "background",
    "assetKey": "background.global",
    "url": "/sapatamu-themes/polyanthus-linnea-light-coral/original/pictures/picture_17198225356117kk67vmf.jpeg",
    "fileName": "picture_17198225356117kk67vmf.jpeg",
    "sortOrder": 10,
    "metadata": {
      "slot": "global",
      "enabled": true,
      "blend": {
        "mode": "normal"
      }
    }
  },
  {
    "templateCode": "polyanthus-linnea-light-coral",
    "assetType": "ornament",
    "assetKey": "ornament.top_left",
    "url": "/sapatamu-themes/polyanthus-linnea-light-coral/original/pictures/picture_17198214540020xi6a2kf.png",
    "fileName": "picture_17198214540020xi6a2kf.png",
    "sortOrder": 20,
    "metadata": {
      "slot": "top_left",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "polyanthus-linnea-light-coral",
    "assetType": "ornament",
    "assetKey": "ornament.top_right",
    "url": "/sapatamu-themes/polyanthus-linnea-light-coral/original/pictures/picture_1719821458527sk9v5m5.png",
    "fileName": "picture_1719821458527sk9v5m5.png",
    "sortOrder": 21,
    "metadata": {
      "slot": "top_right",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "polyanthus-linnea-light-coral",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_left",
    "url": "/sapatamu-themes/polyanthus-linnea-light-coral/original/pictures/picture_171982146051731v7cfj.png",
    "fileName": "picture_171982146051731v7cfj.png",
    "sortOrder": 24,
    "metadata": {
      "slot": "bottom_left",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "polyanthus-linnea-light-coral",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_right",
    "url": "/sapatamu-themes/polyanthus-linnea-light-coral/original/pictures/picture_171982145565558uf4mhg.png",
    "fileName": "picture_171982145565558uf4mhg.png",
    "sortOrder": 25,
    "metadata": {
      "slot": "bottom_right",
      "enabled": true,
      "animation": {
        "style": 1,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "polyanthus-linnea-light-coral",
    "assetType": "music",
    "assetKey": "music.default",
    "url": "/sapatamu-themes/polyanthus-linnea-light-coral/original/musics/music_17126553245316zz3fb4.mp3",
    "fileName": "music_17126553245316zz3fb4.mp3",
    "sortOrder": 40,
    "metadata": {
      "enabled": true,
      "title": "Gamelan Kraton - Gamelan Jawa(mp3cut.net)"
    }
  },
  {
    "templateCode": "polyanthus-linnea-light-coral",
    "assetType": "video",
    "assetKey": "video.salam",
    "url": "/sapatamu-themes/polyanthus-linnea-light-coral/original/pictures/picture_1719822682836b42cyj5.mp4",
    "fileName": "picture_1719822682836b42cyj5.mp4",
    "sortOrder": 50,
    "metadata": {
      "slot": "salam",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "polyanthus-linnea-light-coral",
    "assetType": "video",
    "assetKey": "video.quote",
    "url": "/sapatamu-themes/polyanthus-linnea-light-coral/original/pictures/picture_1719822749191obuab1j.mp4",
    "fileName": "picture_1719822749191obuab1j.mp4",
    "sortOrder": 51,
    "metadata": {
      "slot": "quote",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "polyanthus-linnea-light-coral",
    "assetType": "video",
    "assetKey": "video.thanks",
    "url": "/sapatamu-themes/polyanthus-linnea-light-coral/original/pictures/picture_1719822825213cmfham8.mp4",
    "fileName": "picture_1719822825213cmfham8.mp4",
    "sortOrder": 52,
    "metadata": {
      "slot": "thanks",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "preview",
    "assetKey": "cover.preview",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/pictures/picture_1749014791063e9fk1kdf.jpeg",
    "fileName": "picture_1749014791063e9fk1kdf.jpeg",
    "sortOrder": 1,
    "metadata": {
      "slot": "cover",
      "enabled": true
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "background",
    "assetKey": "background.global",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/albums/album_1748921819881gj9yif7.jpeg",
    "fileName": "album_1748921819881gj9yif7.jpeg",
    "sortOrder": 10,
    "metadata": {
      "slot": "global",
      "enabled": true,
      "blend": {
        "mode": "normal"
      }
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "ornament",
    "assetKey": "ornament.top_left",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/library/library_17490353233295a94ama.png",
    "fileName": "library_17490353233295a94ama.png",
    "sortOrder": 20,
    "metadata": {
      "slot": "top_left",
      "enabled": true,
      "animation": {
        "style": 17,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "ornament",
    "assetKey": "ornament.top_right",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/library/library_17490353104004z1lqhn.png",
    "fileName": "library_17490353104004z1lqhn.png",
    "sortOrder": 21,
    "metadata": {
      "slot": "top_right",
      "enabled": true,
      "animation": {
        "style": 17,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "ornament",
    "assetKey": "ornament.middle_left",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/library/library_1749035346211wpd1hq1.png",
    "fileName": "library_1749035346211wpd1hq1.png",
    "sortOrder": 22,
    "metadata": {
      "slot": "middle_left",
      "enabled": true,
      "animation": {
        "style": 17,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "ornament",
    "assetKey": "ornament.middle_right",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/library/library_17490353349807a0nbju.png",
    "fileName": "library_17490353349807a0nbju.png",
    "sortOrder": 23,
    "metadata": {
      "slot": "middle_right",
      "enabled": true,
      "animation": {
        "style": 17,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_left",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/library/library_1749035370760m1c7s58.png",
    "fileName": "library_1749035370760m1c7s58.png",
    "sortOrder": 24,
    "metadata": {
      "slot": "bottom_left",
      "enabled": true,
      "animation": {
        "style": 17,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "ornament",
    "assetKey": "ornament.bottom_right",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/library/library_17490353584050zqoidti.png",
    "fileName": "library_17490353584050zqoidti.png",
    "sortOrder": 25,
    "metadata": {
      "slot": "bottom_right",
      "enabled": true,
      "animation": {
        "style": 17,
        "duration": 3
      },
      "opacity": 1
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "music",
    "assetKey": "music.default",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/musics/music_1724397443711rjlqq6q.mp3",
    "fileName": "music_1724397443711rjlqq6q.mp3",
    "sortOrder": 40,
    "metadata": {
      "enabled": true,
      "title": "ANCANAYA GAMELAN"
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "video",
    "assetKey": "video.salam",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/albums/album_1748905956054altbuct.mp4",
    "fileName": "album_1748905956054altbuct.mp4",
    "sortOrder": 50,
    "metadata": {
      "slot": "salam",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "video",
    "assetKey": "video.quote",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/albums/album_17490052002558sqpvvq.mp4",
    "fileName": "album_17490052002558sqpvvq.mp4",
    "sortOrder": 51,
    "metadata": {
      "slot": "quote",
      "enabled": true,
      "loop": true
    }
  },
  {
    "templateCode": "javanese-linnea-greenish-white",
    "assetType": "video",
    "assetKey": "video.thanks",
    "url": "/sapatamu-themes/javanese-linnea-greenish-white/original/albums/album_1748921514736u49o0x7.mp4",
    "fileName": "album_1748921514736u49o0x7.mp4",
    "sortOrder": 52,
    "metadata": {
      "slot": "thanks",
      "enabled": true,
      "loop": true
    }
  }
] as const;
