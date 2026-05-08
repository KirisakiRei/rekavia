import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  applyEditorPatchOperations,
  buildDefaultEditorState,
  buildEditorFeatureGates,
  buildEditorPackageFeatures,
  buildLayoutCatalog,
  createPageFromLayoutCode,
  normalizeEditorPageSlug,
} from './sapatamu-editor.helper';
import { buildContentForThemeSwitch, buildContentFromDraft, migrateContentJson } from './sapatamu-content.helper';
import { SAPATAMU_PACKAGE_SEEDS, SAPATAMU_TEMPLATE_ASSET_SEEDS, SAPATAMU_THEME_SEEDS } from './sapatamu-catalog';
import {
  ADDITIONAL_SOURCE_THEME_ASSET_SEEDS,
  ADDITIONAL_SOURCE_THEME_CATALOG_SEEDS,
  ADDITIONAL_SOURCE_THEME_DEFINITIONS,
} from './theme-sources/source-theme-registry';

describe('sapatamu editor helpers', () => {
  const profiles = [
    {
      id: 'profile-1',
      label: 'Profile 1',
      fullName: 'Raka Pratama',
      nickName: 'Raka',
      description: 'Putra pertama keluarga Pratama',
    },
    {
      id: 'profile-2',
      label: 'Profile 2',
      fullName: 'Nadia Larasati',
      nickName: 'Nadia',
      description: 'Putri kedua keluarga Larasati',
    },
  ];

  const events = [
    {
      id: 'event-1',
      name: 'Akad',
      date: '2026-08-01',
      timeStart: '08:00',
      timeEnd: '10:00',
      timeZone: 'WIB' as const,
      address: 'Gedung Serbaguna',
      mapLocation: 'https://maps.example.com/akad',
      enabled: true,
    },
    {
      id: 'event-2',
      name: 'Resepsi',
      date: '2026-08-01',
      timeStart: '11:00',
      timeEnd: '14:00',
      timeZone: 'WIB' as const,
      address: 'Ballroom Nusantara',
      mapLocation: 'https://maps.example.com/resepsi',
      enabled: true,
    },
  ];

  it('builds default editor state with default visible pages and lock status', () => {
    const editor = buildDefaultEditorState({
      themeId: 'malay-ethnic-red-ruby',
      requiredTierCategory: 'premium',
      profiles,
      events,
    });

    expect(editor.pages.length).toBeGreaterThan(5);
    expect(editor.pages.some((page) => page.family === 'opening')).toBe(true);
    expect(editor.pages.some((page) => page.layoutCode === 'malay-ethnic-red-ruby-video' && page.isLocked)).toBe(false);
    expect(editor.pages.some((page) => page.layoutCode === 'malay-ethnic-red-ruby-gift1' && page.isLocked)).toBe(false);
    expect(editor.colorPalette.themeId).toBe('malay-ethnic-red-ruby');
    expect(editor.layoutCatalogSnapshot.length).toBeGreaterThanOrEqual(editor.pages.length);
  });

  it('only exposes the dedicated source themes in branded order', () => {
    expect(SAPATAMU_THEME_SEEDS).toHaveLength(11);
    expect(SAPATAMU_THEME_SEEDS.map((theme) => theme.code)).toEqual([
      'malay-ethnic-red-ruby',
      'cheerfulness-floralwhite',
      'batak-ethnic-maroon-mistyrose',
      'javanese-magnolia-tan-mahogany',
      'kabagyan-linnea-swan-white',
      'javanese-linnea-greenish-white',
      'polyanthus-linnea-light-coral',
      'hollyhock-nauli-sienna-ivory',
      'honeysuckle-seashell',
      'calla-lily-plum-red-lead',
      'aishwarya-peonny',
    ]);
    SAPATAMU_THEME_SEEDS.forEach((theme) => {
      expect(theme.metadata).toMatchObject({ supportsDedicatedRenderer: true });
      expect(JSON.stringify(theme)).not.toMatch(/satu\.love|satu love|satulove/i);
    });
  });

  it('marks premium themes as available while non-premium themes are coming soon', () => {
    expect(SAPATAMU_THEME_SEEDS.some((theme) => theme.metadata.tierCategory === 'premium')).toBe(true);
    expect(SAPATAMU_THEME_SEEDS.some((theme) => theme.metadata.tierCategory === 'vintage')).toBe(true);

    SAPATAMU_THEME_SEEDS.forEach((theme) => {
      const expectedStatus = theme.metadata.tierCategory === 'premium' ? 'available' : 'comingSoon';
      expect(theme.metadata.releaseStatus).toBe(expectedStatus);
    });
  });

  it('uses Luxury and Signature labels for current Sapatamu commercial tiers', () => {
    const packageLabels = SAPATAMU_PACKAGE_SEEDS.filter((item) => item.packageType !== 'add_on').map((item) => item.name);

    expect(packageLabels).toEqual(['Luxury', 'Signature']);
    expect(packageLabels).not.toEqual(expect.arrayContaining(['Basic', 'Vintage']));
  });

  it('keeps Calla Lily and Honeysuckle in Luxury while Aishwarya is Signature', () => {
    const themeTierByCode = new Map(SAPATAMU_THEME_SEEDS.map((theme) => [theme.code, theme.metadata.tierCategory]));

    expect(themeTierByCode.get('calla-lily-plum-red-lead')).toBe('premium');
    expect(themeTierByCode.get('honeysuckle-seashell')).toBe('premium');
    expect(themeTierByCode.get('aishwarya-peonny')).toBe('vintage');
  });

  it('normalizes source layout labels for editor and admin display', () => {
    const catalog = buildLayoutCatalog({
      themeId: 'javanese-linnea-greenish-white',
      profiles,
      events,
    });

    expect(catalog.map((layout) => layout.title)).not.toEqual(
      expect.arrayContaining(['Mempelai 4', 'RSVP 2', 'Gift 1', 'Acara 5']),
    );
    expect(catalog.find((layout) => layout.family === 'mempelai')?.title).toBe('Mempelai');
    expect(catalog.filter((layout) => layout.family === 'acara').map((layout) => layout.title)).toEqual([
      'Acara 1',
      'Acara 2',
    ]);
  });

  it('uses new premium gallery defaults and non-empty localized backgrounds for source themes', () => {
    const editor = buildDefaultEditorState({
      themeId: 'malay-ethnic-red-ruby',
      requiredTierCategory: 'premium',
      profiles,
      events,
    });
    const gallery = editor.pages.flatMap((page) => Object.values(page.data)).find(
      (element): element is { type: 'gallery'; variant: string } =>
        Boolean(element && typeof element === 'object' && !Array.isArray(element) && (element as { type?: string }).type === 'gallery'),
    );

    expect(editor.globalBackground).toBeTruthy();
    expect(editor.globalBackground).toContain('/sapatamu-themes/malay-ethnic-red-ruby/original/');
    expect(gallery?.variant).toBe('gallery-mosaic-six');
  });

  it('exposes only three active premium gallery layouts with new default variants', () => {
    const editor = buildDefaultEditorState({
      themeId: 'gallery',
      requiredTierCategory: 'premium',
      profiles,
      events,
    });
    const galleryLayouts = buildLayoutCatalog({
      themeId: 'gallery',
      profiles,
      events,
    }).filter((layout) => layout.family === 'galeri');
    const activeGalleryPages = editor.pages.filter((page) => page.family === 'galeri');

    expect(galleryLayouts.map((layout) => layout.layoutCode)).toEqual(['galeri1', 'galeri2', 'galeri3']);
    expect(galleryLayouts.every((layout) => layout.requiredTier === 'premium' && layout.defaultVisible)).toBe(true);
    expect(activeGalleryPages.map((page) => page.layoutCode)).toEqual(['galeri1', 'galeri2', 'galeri3']);
    expect(
      activeGalleryPages.map((page) => {
        const galleryElement = page.data.gallery as { frameSettings?: unknown; imageAdjustments?: unknown[]; variant?: string } | undefined;
        expect(galleryElement?.frameSettings).toEqual({});
        expect(galleryElement?.imageAdjustments).toEqual([]);
        return galleryElement?.variant;
      }),
    ).toEqual(['gallery-mosaic-six', 'gallery-quad-offset', 'gallery-hero-trio']);
  });

  it('expands premium source theme gallery layouts into three visible gallery pages', () => {
    const editor = buildDefaultEditorState({
      themeId: 'malay-ethnic-red-ruby',
      requiredTierCategory: 'premium',
      profiles,
      events,
    });
    const galleryLayouts = buildLayoutCatalog({
      themeId: 'malay-ethnic-red-ruby',
      profiles,
      events,
    }).filter((layout) => layout.family === 'galeri');
    const activeGalleryPages = editor.pages.filter((page) => page.family === 'galeri');

    expect(galleryLayouts.map((layout) => layout.layoutCode)).toEqual([
      'malay-ethnic-red-ruby-galeri1',
      'malay-ethnic-red-ruby-galeri2',
      'malay-ethnic-red-ruby-galeri3',
    ]);
    expect(galleryLayouts.map((layout) => layout.title)).toEqual(['Galeri 1', 'Galeri 2', 'Galeri 3']);
    expect(activeGalleryPages.map((page) => page.layoutCode)).toEqual([
      'malay-ethnic-red-ruby-galeri1',
      'malay-ethnic-red-ruby-galeri2',
      'malay-ethnic-red-ruby-galeri3',
    ]);
    expect(activeGalleryPages.map((page) => (page.data.gallery as { variant?: string }).variant)).toEqual([
      'gallery-mosaic-six',
      'gallery-quad-offset',
      'gallery-hero-trio',
    ]);
  });

  it('upgrades legacy source theme documents with one unnumbered gallery page into three gallery pages', () => {
    const legacy = buildContentFromDraft({
      themeId: 'malay-ethnic-red-ruby',
      profiles,
      events,
      basePhotoQuota: 15,
      requiredTierCategory: 'premium',
    });
    legacy.editor.pages = legacy.editor.pages.filter((page) => page.family !== 'galeri' || page.layoutCode.endsWith('galeri1'));
    const galleryPage = legacy.editor.pages.find((page) => page.family === 'galeri');
    expect(galleryPage).toBeDefined();
    galleryPage!.id = 'malay-ethnic-red-ruby-galeri';
    galleryPage!.layoutCode = 'malay-ethnic-red-ruby-galeri';
    galleryPage!.title = 'Galeri';

    const migrated = migrateContentJson(legacy);
    const activeGalleryPages = migrated.editor.pages.filter((page) => page.family === 'galeri');

    expect(activeGalleryPages.map((page) => page.layoutCode)).toEqual([
      'malay-ethnic-red-ruby-galeri1',
      'malay-ethnic-red-ruby-galeri2',
      'malay-ethnic-red-ruby-galeri3',
    ]);
    expect(activeGalleryPages.map((page) => (page.data.gallery as { variant?: string }).variant)).toEqual([
      'gallery-mosaic-six',
      'gallery-quad-offset',
      'gallery-hero-trio',
    ]);
  });

  it('migrates schema version 2 content into schema version 3 with editor state', () => {
    const migrated = migrateContentJson({
      schemaVersion: 2,
      selectedTheme: 'ampir',
      profiles,
      events,
      albumSettings: {
        basePhotoQuota: 20,
      },
      sendSettings: {
        prefaceTemplate: 'Halo {{guest-name}}',
      },
      meta: {
        titleTemplate: 'The Wedding',
        description: 'Deskripsi',
        imageUrl: null,
      },
      extraLinks: {
        youtube: '',
      },
      musicSettings: {
        mode: 'none',
        value: '',
      },
      settings: {
        commerce: {
          requiredTierCategory: 'premium',
          selectedPackageCode: 'premium',
          activationState: 'active',
        },
        giftAccounts: [],
        lastEditedAtDisplay: null,
        activatedAtDisplay: null,
      },
      historyDisplayHints: {},
      weddingData: {},
    });

    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.selectedTheme).toBe('ampir');
    expect(migrated.editor.pages.length).toBeGreaterThan(0);
    expect(migrated.editor.packageFeatures.tierCategory).toBe('premium');
    expect(migrated.editor.pages.some((page) => page.family === 'opening')).toBe(true);
  });

  it('applies granular patch operations and keeps page slugs normalized', () => {
    const document = buildContentFromDraft({
      themeId: 'malay-ethnic-red-ruby',
      profiles,
      events,
      basePhotoQuota: 15,
      requiredTierCategory: 'premium',
    });

    const catalog = buildLayoutCatalog({
      themeId: 'floral',
      profiles,
      events,
    });
    const packageFeatures = buildEditorPackageFeatures('premium');
    const addonPage = createPageFromLayoutCode({
      catalog,
      layoutCode: 'video2',
      uniqueId: 999,
      source: 'addon',
      packageFeatures,
    });

    expect(addonPage).not.toBeNull();

    const opening = document.editor.pages.find((page) => page.family === 'opening');
    expect(opening).toBeDefined();

    const patched = applyEditorPatchOperations(document, [
      {
        type: 'set_page_field',
        uniqueId: opening!.uniqueId,
        path: 'data.text1.content',
        value: 'UPDATED OPENING',
      },
      {
        type: 'add_page',
        page: addonPage!,
        afterUniqueId: opening!.uniqueId,
      },
      {
        type: 'reorder_pages',
        orderedUniqueIds: [
          2,
          1,
          ...document.editor.pages.slice(2).map((page) => page.uniqueId),
          document.editor.pages.length + 1,
        ],
      },
      {
        type: 'remove_page',
        uniqueId: document.editor.pages.length + 1,
      },
    ]);

    const patchedOpening = patched.editor.pages.find((page) => page.family === 'opening');

    expect(patchedOpening).toBeDefined();
    expect((patchedOpening!.data.text1 as { content: string }).content).toBe('UPDATED OPENING');
    expect(patched.editor.pages.every((page, index) => page.uniqueId === index + 1)).toBe(true);
    expect(patched.editor.pages.every((page) => page.slug === normalizeEditorPageSlug(page.title, page.uniqueId))).toBe(true);
  });

  it('builds feature gates from tier availability', () => {
    const catalog = buildLayoutCatalog({
      themeId: 'floral',
      profiles,
      events,
    });

    const basicFeatures = buildEditorPackageFeatures('basic');
    const gates = buildEditorFeatureGates(basicFeatures, catalog);

    expect(gates.find((item) => item.code === 'opening1')?.enabled).toBe(true);
    expect(gates.find((item) => item.code === 'video2')?.enabled).toBe(false);
    expect(gates.find((item) => item.code === 'love-story')?.enabled).toBe(false);
  });

  it('registers malay-ethnic-red-ruby as a dedicated signature theme seed', () => {
    const malayTheme = SAPATAMU_THEME_SEEDS.find((theme) => theme.code === 'malay-ethnic-red-ruby');

    expect(malayTheme).toBeDefined();
    expect(malayTheme?.name).toBe('Malay ethnic - Red ruby');
    expect(malayTheme?.previewImageUrl).toBe(
      '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17393765661722ej1do.jpeg',
    );
    expect(malayTheme?.metadata).toMatchObject({
      group: 'Budaya',
      tierCategory: 'premium',
      supportsDedicatedRenderer: true,
    });
  });

  it('registers batak-ethnic-maroon-mistyrose as a dedicated signature theme seed', () => {
    const batakTheme = SAPATAMU_THEME_SEEDS.find((theme) => theme.code === 'batak-ethnic-maroon-mistyrose');

    expect(batakTheme).toBeDefined();
    expect(batakTheme?.name).toBe('Batak ethnic - maroon mistyrose');
    expect(batakTheme?.previewImageUrl).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1739377539664wswbzef.jpeg',
    );
    expect(batakTheme?.metadata).toMatchObject({
      group: 'Budaya',
      tierCategory: 'premium',
      supportsDedicatedRenderer: true,
      sourceTheme: 'batak-ethnic-maroon-mistyrose',
    });
  });

  it('seeds malay-ethnic-red-ruby admin assets from the localized original scrape assets', () => {
    const signatureAssets = SAPATAMU_TEMPLATE_ASSET_SEEDS.filter((asset) => asset.templateCode === 'malay-ethnic-red-ruby');
    const byKey = new Map(signatureAssets.map((asset) => [asset.assetKey, asset]));

    expect(byKey.get('cover.preview')?.url).toBe(
      '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17393765661722ej1do.jpeg',
    );
    expect(byKey.get('background.global')?.url).toBe(
      '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17044658190466dpttoc.jpeg',
    );
    expect(byKey.get('ornament.top_left')?.url).toBe(
      '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17044657499537ts127.png',
    );
    expect(byKey.get('frame.profile')?.url).toBe(
      '/sapatamu-themes/malay-ethnic-red-ruby/original/library/library_1699507559952r57f1be.png',
    );
    expect(byKey.get('music.default')?.url).toBe(
      '/sapatamu-themes/malay-ethnic-red-ruby/original/musics/music_1712289738674y409aqv.mp3',
    );
    expect(JSON.stringify(signatureAssets)).not.toContain('be.satu.love');
    expect(JSON.stringify(signatureAssets)).not.toContain('/sapatamu-themes/malay-ethnic-red-ruby/backgrounds/global.webp');
  });

  it('seeds batak-ethnic-maroon-mistyrose admin assets from the localized original scrape assets', () => {
    const batakAssets = SAPATAMU_TEMPLATE_ASSET_SEEDS.filter((asset) => asset.templateCode === 'batak-ethnic-maroon-mistyrose');
    const byKey = new Map(batakAssets.map((asset) => [asset.assetKey, asset]));

    expect(byKey.get('cover.preview')?.url).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1739377539664wswbzef.jpeg',
    );
    expect(byKey.get('background.global')?.url).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_170778647164894xcmz8.jpeg',
    );
    expect(byKey.get('ornament.top_left')?.url).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1707786409433kmv9phx.png',
    );
    expect(byKey.get('ornament.bottom_right')?.url).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1707786411877i8b31e2.png',
    );
    expect(byKey.get('music.default')?.url).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/musics/music_1688982834916jisgv9.mp3',
    );
    expect(byKey.get('video.salam')?.url).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_17077867456228y7r96s.mp4',
    );
    expect(JSON.stringify(batakAssets)).not.toContain('be.satu.love');
  });

  it('builds malay-ethnic-red-ruby with localized assets and the 20 active source layouts', () => {
    const editor = buildDefaultEditorState({
      themeId: 'malay-ethnic-red-ruby',
      requiredTierCategory: 'premium',
      profiles,
      events,
    });

    expect(editor.pages.map((page) => page.title)).toEqual([
      'Opening',
      'Salam',
      'Quote',
      'Mempelai',
      'Acara 1',
      'Acara 2',
      'Lokasi',
      'Video',
      'Galeri 1',
      'Galeri 2',
      'Galeri 3',
      'Live Streaming',
      'Kisah Cinta',
      'Link Tambahan',
      'Rundown Acara',
      'Doa',
      'RSVP',
      'Gift',
      'Contact Person',
      'Terima Kasih',
    ]);
    expect(editor.colorPalette).toMatchObject({
      themeId: 'malay-ethnic-red-ruby',
      canvas: '#4a1a1f',
      surface: '#341215',
      accent: '#a97f71',
      accentSoft: '#feffe1',
      text: '#fffef0',
      muted: '#b8727c',
    });
    expect(editor.navMenu).toMatchObject({
      enabled: true,
      activeColor: '#a97f71',
      inactiveColor: '#feffe1',
    });
    expect(editor.globalBackground).toBe('/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17044658190466dpttoc.jpeg');

    const opening = editor.pages[0];
    expect(opening.layoutCode).toBe('malay-ethnic-red-ruby-opening');
    expect(opening.data.background).toBe('/sapatamu-themes/malay-ethnic-red-ruby/original/albums/album_1744898203389261ov4l.jpeg');
    expect(opening.data.backgroundDetails.type).toBe('image');
    expect(opening.data.backgroundDetails.gradient.disabled).toBe(true);
    expect((opening.data.image as { content: string; size: number }).content).toBe(
      '/sapatamu-themes/malay-ethnic-red-ruby/original/illustrations/illustration_16697744675065qqufoy.png',
    );
    expect((opening.data.image as { content: string; size: number }).size).toBe(46);
    expect((opening.data.text2 as { content: string; size: number; lineHeight: number; color: string }).content).toContain(
      '{{nick-name-1}}',
    );
    expect((opening.data.text2 as { content: string; size: number; lineHeight: number; color: string }).size).toBe(72);
    expect((opening.data.text2 as { content: string; size: number; lineHeight: number; color: string }).lineHeight).toBe(79);
    expect((opening.data.text2 as { content: string; size: number; lineHeight: number; color: string }).color).toBe('#fffef0');
    expect(opening.data.cornerElements.list.filter((corner) => !corner.disabled)).toHaveLength(4);

    const salam = editor.pages[1];
    expect(salam.layoutCode).toBe('malay-ethnic-red-ruby-salam');
    expect(salam.data.background).toBe('/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_1704467138434rrkf6yk.mp4');
    expect(salam.data.backgroundDetails.type).toBe('video');
    expect((salam.data.text1 as { size: number; color: string }).size).toBe(25);
    expect((salam.data.text1 as { size: number; color: string }).color).toBe('#311114');

    const mempelai = editor.pages[3];
    expect(mempelai.layoutCode).toBe('malay-ethnic-red-ruby-mempelai4');
    expect(mempelai.data.background).toBe('/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_1704465733256r3s72q3.jpeg');
    expect((mempelai.data.image1 as { size: number; frame: { content: string; disabled: boolean } }).size).toBe(155);
    expect((mempelai.data.image1 as { size: number; frame: { content: string; disabled: boolean } }).frame).toMatchObject({
      disabled: false,
      content: '/sapatamu-themes/malay-ethnic-red-ruby/original/library/library_1699507559952r57f1be.png',
    });

    expect(new Set(editor.pages.map((page) => page.data.background))).toContain(
      '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_1704471487844uxabc69.mp4',
    );

    const serialized = JSON.stringify(editor);
    expect(serialized).not.toContain('be.satu.love');
  });

  it('builds batak-ethnic-maroon-mistyrose with localized assets and the 20 active source layouts', () => {
    const editor = buildDefaultEditorState({
      themeId: 'batak-ethnic-maroon-mistyrose',
      requiredTierCategory: 'premium',
      profiles,
      events,
    });

    expect(editor.pages.map((page) => page.title)).toEqual([
      'Opening',
      'Salam',
      'Quote',
      'Mempelai',
      'Acara 1',
      'Acara 2',
      'Lokasi',
      'Video',
      'Galeri 1',
      'Galeri 2',
      'Galeri 3',
      'Live Streaming',
      'Kisah Cinta',
      'Link Tambahan',
      'Rundown Acara',
      'RSVP',
      'Doa',
      'Gift',
      'Contact Person',
      'Terima Kasih',
    ]);
    expect(editor.colorPalette).toMatchObject({
      themeId: 'batak-ethnic-maroon-mistyrose',
      canvas: '#7b0f24',
      surface: '#230c10',
      accent: '#b55963',
      accentSoft: '#f1e9d3',
      text: '#fdfcd9',
      muted: '#b8727c',
    });
    expect(editor.navMenu).toMatchObject({
      enabled: true,
      activeColor: '#b55963',
      inactiveColor: '#f1e9d3',
    });
    expect(editor.globalBackground).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_170778647164894xcmz8.jpeg',
    );

    const opening = editor.pages[0];
    expect(opening.layoutCode).toBe('batak-opening');
    expect(opening.data.background).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/albums/album_17448994507899bxd2l5.jpeg',
    );
    expect(opening.data.backgroundDetails.type).toBe('image');
    expect(opening.data.backgroundDetails.gradient.disabled).toBe(true);
    expect((opening.data.image as { content: string; size: number }).content).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/illustrations/illustration_16697744675065qqufoy.png',
    );
    expect((opening.data.image as { content: string; size: number }).size).toBe(50);
    expect((opening.data.text2 as { content: string; size: number; lineHeight: number; color: string }).content).toContain(
      '{{nick-name-1}}',
    );
    expect((opening.data.text2 as { content: string; size: number; lineHeight: number; color: string }).size).toBe(75);
    expect((opening.data.text2 as { content: string; size: number; lineHeight: number; color: string }).lineHeight).toBe(80);
    expect((opening.data.text2 as { content: string; size: number; lineHeight: number; color: string }).color).toBe('#fdfcd9');
    expect(opening.data.cornerElements.list.filter((corner) => !corner.disabled)).toHaveLength(4);

    const salam = editor.pages[1];
    expect(salam.layoutCode).toBe('batak-salam');
    expect(salam.data.background).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_17077867456228y7r96s.mp4',
    );
    expect(salam.data.backgroundDetails.type).toBe('video');

    const mempelai = editor.pages[3];
    expect(mempelai.layoutCode).toBe('batak-mempelai4');
    expect(mempelai.data.background).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_170778647164894xcmz8.jpeg',
    );

    expect(new Set(editor.pages.map((page) => page.data.background))).toContain(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_1707787160620afdjwb6.mp4',
    );

    const serialized = JSON.stringify(editor);
    expect(serialized).not.toContain('be.satu.love');
  });

  it('switches an existing editor document to malay-ethnic-red-ruby with theme structure and preserved invitation data', () => {
    const existing = buildContentFromDraft({
      themeId: 'floral',
      profiles,
      events,
      basePhotoQuota: 15,
      requiredTierCategory: 'premium',
    });
    const opening = existing.editor.pages.find((page) => page.family === 'opening');
    if (opening?.data.text1 && typeof opening.data.text1 === 'object') {
      (opening.data.text1 as { content: string }).content = 'CUSTOM OLD OPENING';
    }
    existing.settings.giftAccounts = [
      {
        bankName: 'BCA',
        accountNumber: '123456',
        accountHolder: 'Raka Pratama',
      },
    ];
    existing.meta.titleTemplate = 'Undangan Raka dan Nadia';
    existing.musicSettings = {
      mode: 'library',
      value: '/uploads/music/custom.mp3',
    };

    const switched = buildContentForThemeSwitch({
      themeId: 'malay-ethnic-red-ruby',
      existing,
      requiredTierCategory: 'premium',
    });

    expect(switched.selectedTheme).toBe('malay-ethnic-red-ruby');
    expect(switched.profiles).toEqual(existing.profiles);
    expect(switched.events).toEqual(existing.events);
    expect(switched.settings.giftAccounts).toEqual(existing.settings.giftAccounts);
    expect(switched.meta.titleTemplate).toBe('Undangan Raka dan Nadia');
    expect(switched.musicSettings).toEqual(existing.musicSettings);
    expect(switched.editor.pages).toHaveLength(20);
    expect(switched.editor.pages[0].layoutCode).toBe('malay-ethnic-red-ruby-opening');
    expect((switched.editor.pages[0].data.text1 as { content: string }).content).not.toBe('CUSTOM OLD OPENING');
    expect(switched.editor.globalBackground).toBe('/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17044658190466dpttoc.jpeg');
    expect(switched.editor.cornerElements.list.filter((corner) => !corner.disabled)).toHaveLength(4);
  });

  it('switches an existing editor document to batak-ethnic-maroon-mistyrose with theme structure and preserved invitation data', () => {
    const existing = buildContentFromDraft({
      themeId: 'floral',
      profiles,
      events,
      basePhotoQuota: 15,
      requiredTierCategory: 'premium',
    });
    existing.settings.giftAccounts = [
      {
        bankName: 'BCA',
        accountNumber: '123456',
        accountHolder: 'Raka Pratama',
      },
    ];
    existing.meta.titleTemplate = 'Undangan Raka dan Nadia';

    const switched = buildContentForThemeSwitch({
      themeId: 'batak-ethnic-maroon-mistyrose',
      existing,
      requiredTierCategory: 'premium',
    });

    expect(switched.selectedTheme).toBe('batak-ethnic-maroon-mistyrose');
    expect(switched.profiles).toEqual(existing.profiles);
    expect(switched.events).toEqual(existing.events);
    expect(switched.settings.giftAccounts).toEqual(existing.settings.giftAccounts);
    expect(switched.meta.titleTemplate).toBe('Undangan Raka dan Nadia');
    expect(switched.editor.pages).toHaveLength(20);
    expect(switched.editor.pages[0].layoutCode).toBe('batak-opening');
    expect(switched.editor.globalBackground).toBe(
      '/sapatamu-themes/batak-ethnic-maroon-mistyrose/original/pictures/picture_170778647164894xcmz8.jpeg',
    );
    expect(switched.editor.cornerElements.list.filter((corner) => !corner.disabled)).toHaveLength(4);
  });

  it('registers additional scraped source themes as dedicated signature themes', () => {
    ADDITIONAL_SOURCE_THEME_CATALOG_SEEDS.forEach((expectedTheme) => {
      const seed = SAPATAMU_THEME_SEEDS.find((theme) => theme.code === expectedTheme.code);

      expect(seed).toBeDefined();
      expect(seed?.name).toBe(expectedTheme.name);
      expect(seed?.previewImageUrl).toBe(expectedTheme.previewImageUrl);
      expect(seed?.metadata).toMatchObject({
        tierCategory: expectedTheme.metadata.tierCategory,
        supportsDedicatedRenderer: true,
        sourceTheme: expectedTheme.code,
      });
    });
  });

  it('builds localized editor documents for every additional scraped source theme', () => {
    Object.entries(ADDITIONAL_SOURCE_THEME_DEFINITIONS).forEach(([themeId, definition]) => {
      const expectedCatalog = buildLayoutCatalog({
        themeId,
        profiles,
        events,
      });
      const editor = buildDefaultEditorState({
        themeId,
        requiredTierCategory: definition.layoutCatalogSeeds.some((layout) => layout.requiredTier === 'vintage')
          ? 'vintage'
          : 'premium',
        profiles,
        events,
      });

      expect(editor.colorPalette.themeId).toBe(themeId);
      expect(editor.navMenu.enabled).toBe(true);
      expect(editor.pages).toHaveLength(expectedCatalog.length);
      expect(editor.layoutCatalogSnapshot).toHaveLength(expectedCatalog.length);
      expect(editor.pages[0].layoutCode).toBe(definition.layoutCatalogSeeds[0].layoutCode);
      expect(JSON.stringify(editor)).not.toContain('be.satu.love');
      expect(editor.globalBackground ?? '').not.toContain('https://');
      expect(editor.globalBackground).toContain(`/sapatamu-themes/${themeId}/original/`);
    });
  });

  it('registers aishwarya-peonny as a Signature dedicated renderer theme', () => {
    const theme = SAPATAMU_THEME_SEEDS.find((item) => item.code === 'aishwarya-peonny');

    expect(theme).toBeDefined();
    expect(theme?.name).toBe('Aishwarya Peonny');
    expect(theme?.metadata).toMatchObject({
      group: 'Signature',
      tierCategory: 'vintage',
      supportsDedicatedRenderer: true,
      sourceTheme: 'aishwarya-peonny',
    });
  });

  it('builds the aishwarya-peonny vintage flow with local assets only', () => {
    const editor = buildDefaultEditorState({
      themeId: 'aishwarya-peonny',
      requiredTierCategory: 'vintage',
      profiles,
      events,
    });
    const serialized = JSON.stringify(editor);

    expect(editor.colorPalette).toMatchObject({
      themeId: 'aishwarya-peonny',
      canvas: '#a54141',
      surface: '#46402a',
      accent: '#c4a15d',
    });
    expect(editor.navMenu.enabled).toBe(true);
    expect(editor.globalBackground).toBe(
      '/sapatamu-themes/aishwarya-peonny/original/pictures/Heritage-Background-Home.webp',
    );
    expect(editor.pages.map((page) => page.layoutCode)).toEqual([
      'aishwarya-peonny-opening',
      'aishwarya-peonny-quote',
      'aishwarya-peonny-mempelai',
      'aishwarya-peonny-love-story',
      'aishwarya-peonny-save-date',
      'aishwarya-peonny-events',
      'aishwarya-peonny-attire',
      'aishwarya-peonny-live-streaming',
      'aishwarya-peonny-wedding-frame',
      'aishwarya-peonny-gallery',
      'aishwarya-peonny-rsvp',
      'aishwarya-peonny-gift',
      'aishwarya-peonny-thanks',
    ]);
    expect(serialized).toContain('/sapatamu-themes/aishwarya-peonny/original/');
    expect(serialized).toContain('"vintageRenderer":"aishwarya-peonny"');
    expect(serialized).toContain('vintageLayers');
    expect(serialized).not.toMatch(/â€œ|â€|â€¢|�/);
    expect(serialized).not.toMatch(
      /attarivitation\.com|googletagmanager|googleads|facebook|cloudflareinsights|admin-ajax|wp-admin/i,
    );
  });

  it('builds aishwarya-peonny with vintage-native gate, menu, popup, and gift contracts', () => {
    const editor = buildDefaultEditorState({
      themeId: 'aishwarya-peonny',
      requiredTierCategory: 'vintage',
      profiles,
      events,
    });

    const opening = editor.pages.find((page) => page.layoutCode === 'aishwarya-peonny-opening');
    const quote = editor.pages.find((page) => page.layoutCode === 'aishwarya-peonny-quote');
    const gift = editor.pages.find((page) => page.layoutCode === 'aishwarya-peonny-gift');
    const openingMenu = opening?.data.vintageMenu as { items?: Array<Record<string, unknown>> } | undefined;

    expect(opening?.data.vintageGate).toMatchObject({
      enabled: true,
      lockScrollUntilOpen: true,
      hideLayerCoverAfterOpen: true,
      secondOpenButtonLabel: 'the story begins...',
    });
    expect(opening?.data.vintageMenu).toMatchObject({
      enabled: true,
      variant: 'sandhayu-side-menu',
    });
    expect(openingMenu?.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Gallery', target: '#gallery' }),
        expect.objectContaining({ label: 'RSVP', target: '#rsvp' }),
        expect.objectContaining({ label: 'Souvenir Card', target: 'popup:souvenir-card' }),
      ]),
    );
    expect(opening?.data.vintagePopups).toMatchObject({
      qrCheckin: expect.objectContaining({ downloadMode: 'card', sourceElement: 'qr-boundary' }),
      souvenirCard: expect.objectContaining({ downloadMode: 'image-card' }),
      weddingFrame: expect.objectContaining({ downloadMode: 'image-card' }),
    });
    expect(quote?.data.vintagePopups).toMatchObject(opening?.data.vintagePopups ?? {});
    expect(gift?.data.vintageGiftRegistry).toMatchObject({
      defaultVisiblePanel: 'none',
      panels: expect.arrayContaining(['gift-list', 'confirmation-form']),
      confirmation: expect.objectContaining({ mode: 'whatsapp' }),
    });
  });

  it('seeds additional scraped source theme assets from local public files', () => {
    const rootCandidates = [
      join(process.cwd(), '..', 'frontend', 'public'),
      join(process.cwd(), 'frontend', 'public'),
    ];
    const publicRoot = rootCandidates.find((candidate) => existsSync(candidate)) ?? rootCandidates[0];

    ADDITIONAL_SOURCE_THEME_ASSET_SEEDS.forEach((asset) => {
      expect(asset.url).not.toContain('be.satu.love');
      expect(asset.url).toContain(`/sapatamu-themes/${asset.templateCode}/original/`);
      expect(existsSync(join(publicRoot, asset.url.replace(/^\//, '')))).toBe(true);
    });
  });

  it('migrates legacy malay-ethnic-red-ruby placeholder assets to the localized source assets', () => {
    const legacy = buildContentFromDraft({
      themeId: 'malay-ethnic-red-ruby',
      profiles,
      events,
      basePhotoQuota: 15,
      requiredTierCategory: 'premium',
    });
    legacy.editor.globalBackground = '/sapatamu-themes/malay-ethnic-red-ruby/backgrounds/global.webp';
    legacy.editor.globalBackgroundDetails = {
      type: 'image',
      color: '#4a1a1f',
      opacity: 0.9,
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
    legacy.editor.pages[0].data.background = '/sapatamu-themes/malay-ethnic-red-ruby/backgrounds/opening.webp';
    legacy.editor.pages[0].data.backgroundDetails = legacy.editor.globalBackgroundDetails;
    (legacy.editor.pages[0].data as Record<string, unknown>).image1 = {
      type: 'image',
      content: '/sapatamu-themes/malay-ethnic-red-ruby/cover/preview.webp',
      disabled: false,
    };
    legacy.editor.pages[1].data.background = '/sapatamu-themes/malay-ethnic-red-ruby/video/salam.mp4';
    legacy.editor.pages[1].data.backgroundDetails = {
      ...legacy.editor.globalBackgroundDetails,
      type: 'video',
    };
    legacy.editor.pages[1].data.cornerElements.list[0].url = '/sapatamu-themes/malay-ethnic-red-ruby/ornaments/top-left.png';

    const migrated = migrateContentJson(legacy);
    const opening = migrated.editor.pages[0];
    const salam = migrated.editor.pages[1];

    expect(migrated.editor.globalBackground).toBe(
      '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17044658190466dpttoc.jpeg',
    );
    expect(migrated.editor.globalBackgroundDetails.gradient.disabled).toBe(true);
    expect(migrated.editor.globalBackgroundDetails.blend.disabled).toBe(true);
    expect(opening.data.background).toBe('/sapatamu-themes/malay-ethnic-red-ruby/original/albums/album_1744898203389261ov4l.jpeg');
    expect(opening.data.backgroundDetails.gradient.disabled).toBe(true);
    expect(opening.data).not.toHaveProperty('image1');
    expect(salam.data.background).toBe('/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_1704467138434rrkf6yk.mp4');
    expect(salam.data.cornerElements.list[0].url).toBe(
      '/sapatamu-themes/malay-ethnic-red-ruby/original/pictures/picture_17044657499537ts127.png',
    );
  });
});
