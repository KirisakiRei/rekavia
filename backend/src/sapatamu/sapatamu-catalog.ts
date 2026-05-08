import {
  ADDITIONAL_SOURCE_THEME_ASSET_SEEDS,
  ADDITIONAL_SOURCE_THEME_CATALOG_SEEDS,
} from './theme-sources/source-theme-registry';

export type ThemeSeed = {
  code: string;
  name: string;
  description: string;
  previewImageUrl: string;
  metadata: Record<string, unknown>;
};

export type ThemeReleaseStatus = 'available' | 'comingSoon';

export type PackageSeed = {
  code: string;
  name: string;
  description: string;
  price: number;
  packageType: 'base' | 'upgrade' | 'add_on';
  sortOrder: number;
  featuresJson: Record<string, unknown>;
};

export type TemplateAssetSeed = {
  templateCode: string;
  assetType: string;
  assetKey: string;
  url: string;
  fileName?: string | null;
  sortOrder: number;
  metadata: Record<string, unknown>;
};

const ADDITIONAL_SOURCE_THEME_CATALOG_BY_CODE: Map<string, ThemeSeed> = new Map(
  ADDITIONAL_SOURCE_THEME_CATALOG_SEEDS.map((theme) => [
    theme.code,
    { ...theme, metadata: { ...theme.metadata } },
  ]),
);

function additionalSourceThemeSeed(code: string): ThemeSeed {
  const theme = ADDITIONAL_SOURCE_THEME_CATALOG_BY_CODE.get(code);
  if (!theme) throw new Error(`Missing source theme catalog seed: ${code}`);
  return { ...theme, metadata: { ...theme.metadata } };
}

function withThemeReleaseStatus(theme: ThemeSeed): ThemeSeed {
  const releaseStatus: ThemeReleaseStatus = theme.metadata.tierCategory === 'premium' ? 'available' : 'comingSoon';

  return {
    ...theme,
    metadata: {
      ...theme.metadata,
      releaseStatus,
      availabilityLabel: releaseStatus === 'available' ? 'Available' : 'Coming soon',
    },
  };
}

export const SAPATAMU_THEME_SEEDS: ThemeSeed[] = [
  {
    code: 'malay-ethnic-red-ruby',
    name: 'Malay ethnic - Red ruby',
    description: 'Tema luxury Malay ethnic bernuansa red ruby.',
    previewImageUrl: '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17393765661722ej1do.jpeg',
    metadata: {
      group: 'Budaya',
      tierCategory: 'premium',
      supportsDedicatedRenderer: true,
      sourceTheme: 'malay-ethnic-red-ruby',
    },
  },
  additionalSourceThemeSeed('cheerfulness-floralwhite'),
  {
    code: 'batak-ethnic-maroon-mistyrose',
    name: 'Batak ethnic - maroon mistyrose',
    description: 'Tema luxury Batak ethnic bernuansa maroon mistyrose.',
    previewImageUrl: '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1739377539664wswbzef.jpeg',
    metadata: {
      group: 'Budaya',
      tierCategory: 'premium',
      supportsDedicatedRenderer: true,
      sourceTheme: 'batak-ethnic-maroon-mistyrose',
    },
  },
  additionalSourceThemeSeed('javanese-magnolia-tan-mahogany'),
  additionalSourceThemeSeed('kabagyan-linnea-swan-white'),
  additionalSourceThemeSeed('javanese-linnea-greenish-white'),
  additionalSourceThemeSeed('polyanthus-linnea-light-coral'),
  additionalSourceThemeSeed('hollyhock-nauli-sienna-ivory'),
  additionalSourceThemeSeed('honeysuckle-seashell'),
  additionalSourceThemeSeed('calla-lily-plum-red-lead'),
  additionalSourceThemeSeed('aishwarya-peonny'),
].map(withThemeReleaseStatus);

export const SAPATAMU_TEMPLATE_ASSET_SEEDS: TemplateAssetSeed[] = [
  {
    templateCode: 'malay-ethnic-red-ruby',
    assetType: 'preview',
    assetKey: 'cover.preview',
    url: '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17393765661722ej1do.jpeg',
    fileName: 'picture_17393765661722ej1do.jpeg',
    sortOrder: 1,
    metadata: { slot: 'cover', enabled: true },
  },
  {
    templateCode: 'malay-ethnic-red-ruby',
    assetType: 'background',
    assetKey: 'background.global',
    url: '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17044658190466dpttoc.jpeg',
    fileName: 'picture_17044658190466dpttoc.jpeg',
    sortOrder: 10,
    metadata: { slot: 'global', enabled: true, blend: { mode: 'multiply' } },
  },
  {
    templateCode: 'malay-ethnic-red-ruby',
    assetType: 'ornament',
    assetKey: 'ornament.top_left',
    url: '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17044657499537ts127.png',
    fileName: 'picture_17044657499537ts127.png',
    sortOrder: 20,
    metadata: { slot: 'top_left', enabled: true, animation: { style: 1, duration: 3 }, opacity: 1 },
  },
  {
    templateCode: 'malay-ethnic-red-ruby',
    assetType: 'ornament',
    assetKey: 'ornament.top_right',
    url: '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_1704465766840snx37cj.png',
    fileName: 'picture_1704465766840snx37cj.png',
    sortOrder: 21,
    metadata: { slot: 'top_right', enabled: true, animation: { style: 1, duration: 3 }, opacity: 1 },
  },
  {
    templateCode: 'malay-ethnic-red-ruby',
    assetType: 'ornament',
    assetKey: 'ornament.bottom_left',
    url: '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_1704465776183vds1syc.png',
    fileName: 'picture_1704465776183vds1syc.png',
    sortOrder: 22,
    metadata: { slot: 'bottom_left', enabled: true, animation: { style: 1, duration: 3 }, opacity: 1 },
  },
  {
    templateCode: 'malay-ethnic-red-ruby',
    assetType: 'ornament',
    assetKey: 'ornament.bottom_right',
    url: '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_1704465772125ob6ekuy.png',
    fileName: 'picture_1704465772125ob6ekuy.png',
    sortOrder: 23,
    metadata: { slot: 'bottom_right', enabled: true, animation: { style: 1, duration: 3 }, opacity: 1 },
  },
  {
    templateCode: 'malay-ethnic-red-ruby',
    assetType: 'frame',
    assetKey: 'frame.profile',
    url: '/sapatamu-themes/malay-ethnic-red-ruby/original/library/library_1699507559952r57f1be.png',
    fileName: 'library_1699507559952r57f1be.png',
    sortOrder: 30,
    metadata: { slot: 'profile_photo', enabled: true },
  },
  {
    templateCode: 'malay-ethnic-red-ruby',
    assetType: 'music',
    assetKey: 'music.default',
    url: '/sapatamu-themes/malay-ethnic-red-ruby/original/musics/music_1712289738674y409aqv.mp3',
    fileName: 'music_1712289738674y409aqv.mp3',
    sortOrder: 40,
    metadata: { enabled: true, title: 'Malay ethnic' },
  },
  {
    templateCode: 'malay-ethnic-red-ruby',
    assetType: 'video',
    assetKey: 'video.salam',
    url: '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_1704467138434rrkf6yk.mp4',
    fileName: 'picture_1704467138434rrkf6yk.mp4',
    sortOrder: 50,
    metadata: { slot: 'salam', enabled: true, loop: true },
  },
  {
    templateCode: 'malay-ethnic-red-ruby',
    assetType: 'video',
    assetKey: 'video.quote',
    url: '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_1704467438132lu32suk.mp4',
    fileName: 'picture_1704467438132lu32suk.mp4',
    sortOrder: 51,
    metadata: { slot: 'quote', enabled: true, loop: true },
  },
  {
    templateCode: 'malay-ethnic-red-ruby',
    assetType: 'video',
    assetKey: 'video.thanks',
    url: '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_1704471487844uxabc69.mp4',
    fileName: 'picture_1704471487844uxabc69.mp4',
    sortOrder: 52,
    metadata: { slot: 'thanks', enabled: true, loop: true },
  },
  {
    templateCode: 'batak-ethnic-maroon-mistyrose',
    assetType: 'preview',
    assetKey: 'cover.preview',
    url: '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1739377539664wswbzef.jpeg',
    fileName: 'picture_1739377539664wswbzef.jpeg',
    sortOrder: 1,
    metadata: { slot: 'cover', enabled: true },
  },
  {
    templateCode: 'batak-ethnic-maroon-mistyrose',
    assetType: 'background',
    assetKey: 'background.global',
    url: '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_170778647164894xcmz8.jpeg',
    fileName: 'picture_170778647164894xcmz8.jpeg',
    sortOrder: 10,
    metadata: { slot: 'global', enabled: true, blend: { mode: 'normal' } },
  },
  {
    templateCode: 'batak-ethnic-maroon-mistyrose',
    assetType: 'ornament',
    assetKey: 'ornament.top_left',
    url: '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1707786409433kmv9phx.png',
    fileName: 'picture_1707786409433kmv9phx.png',
    sortOrder: 20,
    metadata: { slot: 'top_left', enabled: true, animation: { style: 1, duration: 3 }, opacity: 1 },
  },
  {
    templateCode: 'batak-ethnic-maroon-mistyrose',
    assetType: 'ornament',
    assetKey: 'ornament.top_right',
    url: '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1707786414227x9zfw31k.png',
    fileName: 'picture_1707786414227x9zfw31k.png',
    sortOrder: 21,
    metadata: { slot: 'top_right', enabled: true, animation: { style: 1, duration: 3 }, opacity: 1 },
  },
  {
    templateCode: 'batak-ethnic-maroon-mistyrose',
    assetType: 'ornament',
    assetKey: 'ornament.bottom_left',
    url: '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1707786417669tomzgzu.png',
    fileName: 'picture_1707786417669tomzgzu.png',
    sortOrder: 22,
    metadata: { slot: 'bottom_left', enabled: true, animation: { style: 1, duration: 3 }, opacity: 1 },
  },
  {
    templateCode: 'batak-ethnic-maroon-mistyrose',
    assetType: 'ornament',
    assetKey: 'ornament.bottom_right',
    url: '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1707786411877i8b31e2.png',
    fileName: 'picture_1707786411877i8b31e2.png',
    sortOrder: 23,
    metadata: { slot: 'bottom_right', enabled: true, animation: { style: 1, duration: 3 }, opacity: 1 },
  },
  {
    templateCode: 'batak-ethnic-maroon-mistyrose',
    assetType: 'music',
    assetKey: 'music.default',
    url: '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/musics/music_1688982834916jisgv9.mp3',
    fileName: 'music_1688982834916jisgv9.mp3',
    sortOrder: 40,
    metadata: { enabled: true, title: 'DA NATINIPTIP SANGGAR MAXIMA' },
  },
  {
    templateCode: 'batak-ethnic-maroon-mistyrose',
    assetType: 'video',
    assetKey: 'video.salam',
    url: '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_17077867456228y7r96s.mp4',
    fileName: 'picture_17077867456228y7r96s.mp4',
    sortOrder: 50,
    metadata: { slot: 'salam', enabled: true, loop: true },
  },
  {
    templateCode: 'batak-ethnic-maroon-mistyrose',
    assetType: 'video',
    assetKey: 'video.quote',
    url: '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_17077868396671pgiaz7.mp4',
    fileName: 'picture_17077868396671pgiaz7.mp4',
    sortOrder: 51,
    metadata: { slot: 'quote', enabled: true, loop: true },
  },
  {
    templateCode: 'batak-ethnic-maroon-mistyrose',
    assetType: 'video',
    assetKey: 'video.thanks',
    url: '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1707787160620afdjwb6.mp4',
    fileName: 'picture_1707787160620afdjwb6.mp4',
    sortOrder: 52,
    metadata: { slot: 'thanks', enabled: true, loop: true },
  },
  ...ADDITIONAL_SOURCE_THEME_ASSET_SEEDS.map((asset) => ({ ...asset })),
];

export const SAPATAMU_PACKAGE_SEEDS: PackageSeed[] = [
  {
    code: 'sapatamu-signature',
    name: 'Luxury',
    description: 'Aktivasi satu tema Luxury pilihan untuk satu undangan, dengan harga spesial peluncuran.',
    price: 279000,
    packageType: 'base',
    sortOrder: 1,
    featuresJson: {
      tierCategory: 'premium',
      commerceMode: 'theme_activation',
      basePrice: 349000,
      specialPrice: 279000,
      photoQuota: 50,
      editAccessDays: 60,
      activeDays: null,
      supportsMusic: true,
      supportsExtraLinks: true,
      supportsBroadcast: true,
      supportsGift: true,
      lifetimeActive: true,
    },
  },
  {
    code: 'sapatamu-vintage',
    name: 'Signature',
    description: 'Tier Signature untuk tema Aishwarya. Paket ini disiapkan sebagai coming soon.',
    price: 0,
    packageType: 'upgrade',
    sortOrder: 2,
    featuresJson: {
      tierCategory: 'vintage',
      releaseStatus: 'comingSoon',
      commerceMode: 'theme_activation',
      basePrice: 0,
      specialPrice: 0,
      photoQuota: 50,
      editAccessDays: 90,
      activeDays: null,
      supportsMusic: true,
      supportsExtraLinks: true,
      supportsBroadcast: true,
      supportsGift: true,
      lifetimeActive: true,
    },
  },
  {
    code: 'sapatamu-theme-addon',
    name: 'Tema Add-on',
    description: 'Buka satu tema tambahan untuk undangan ini dan gunakan kembali di undangan lain selama 30 hari setelah diaktifkan.',
    price: 150000,
    packageType: 'add_on',
    sortOrder: 10,
    featuresJson: {
      featureCode: 'theme_add_on',
      addonSlot: 1,
      normalPrice: 150000,
      sharedAccessDays: 30,
    },
  },
  {
    code: 'sapatamu-theme-addon-second',
    name: 'Tema Add-on Kedua',
    description: 'Promo tema kedua untuk bundle add-on. Harga normal Rp150.000, khusus bundle hanya Rp75.000.',
    price: 75000,
    packageType: 'add_on',
    sortOrder: 11,
    featuresJson: {
      featureCode: 'theme_add_on',
      addonSlot: 2,
      normalPrice: 150000,
      sharedAccessDays: 30,
    },
  },
];
