jest.mock(
  'generated/prisma',
  () => ({
    PackageType: {},
    Prisma: {},
    TemplateAssetType: {},
  }),
  { virtual: true },
);

jest.mock(
  'src/database/database.service',
  () => ({
    DatabaseService: class DatabaseService {},
  }),
  { virtual: true },
);

jest.mock(
  'src/sapatamu/sapatamu-catalog',
  () => ({
    SAPATAMU_PACKAGE_SEEDS: [],
    SAPATAMU_TEMPLATE_ASSET_SEEDS: [],
    SAPATAMU_THEME_SEEDS: [],
  }),
  { virtual: true },
);

jest.mock(
  'src/sapatamu/sapatamu-content.helper',
  () => ({
    buildContentFromDraft: jest.fn(),
    normalizeProfiles: (raw: unknown) => {
      const fallback = [
        { id: 'profile-1', label: 'Profile 1', fullName: '', nickName: '', description: '' },
        { id: 'profile-2', label: 'Profile 2', fullName: '', nickName: '', description: '' },
      ];
      if (!Array.isArray(raw)) return fallback;
      return fallback.map((profile, index) => ({
        ...profile,
        ...(raw[index] && typeof raw[index] === 'object' ? raw[index] : {}),
      }));
    },
    normalizeEvents: (raw: unknown) => {
      const fallback = [
        { id: 'event-1', name: 'Akad Nikah', date: '', timeStart: '', timeEnd: '', timeZone: 'WIB', address: '', mapLocation: '', enabled: true },
        { id: 'event-2', name: 'Resepsi', date: '', timeStart: '', timeEnd: '', timeZone: 'WIB', address: '', mapLocation: '', enabled: true },
      ];
      if (!Array.isArray(raw)) return fallback;
      return fallback.map((event, index) => ({
        ...event,
        ...(raw[index] && typeof raw[index] === 'object' ? raw[index] : {}),
        timeZone: 'WIB',
      }));
    },
  }),
  { virtual: true },
);

jest.mock(
  'src/sapatamu/sapatamu-editor.helper',
  () => ({
    SAPATAMU_EDITOR_FONT_CATALOG: [],
    buildEditorFeatureGates: jest.fn(() => []),
    buildEditorPackageFeatures: jest.fn(() => ({})),
    buildLayoutCatalog: jest.fn(() => []),
    createEditorPageFromCatalog: jest.fn(),
  }),
  { virtual: true },
);

import {
  buildSapatamuDemoPreviewSlug,
  normalizeSapatamuGlobalDemoPreviewSettings,
  normalizeSapatamuDemoPreviewSettings,
} from './admin.service';

describe('Sapatamu demo preview settings', () => {
  it('builds concise public preview slugs from template codes', () => {
    expect(buildSapatamuDemoPreviewSlug('calla-lily-plum-red-lead')).toBe('calla-lily-preview');
    expect(buildSapatamuDemoPreviewSlug('honeysuckle-seashell')).toBe('honeysuckle-preview');
    expect(buildSapatamuDemoPreviewSlug('javanese-magnolia-tan-mahogany')).toBe('javanese-magnolia-tan-mahogany-preview');
    expect(buildSapatamuDemoPreviewSlug('javanese-linnea-greenish-white')).toBe('javanese-linnea-greenish-white-preview');
  });

  it('normalizes admin demo data into two profiles, events, and image URLs', () => {
    const settings = normalizeSapatamuDemoPreviewSettings({
      enabled: true,
      slug: 'Calla Lily Preview',
      profiles: [
        {
          fullName: 'Arya Pratama',
          nickName: 'Arya',
          description: 'Putra pertama keluarga Pratama',
          photoUrl: '/uploads/arya.jpg',
        },
        {
          fullName: 'Laras Kirana',
          nickName: 'Laras',
          description: 'Putri kedua keluarga Kirana',
          photoUrl: '/uploads/laras.jpg',
        },
      ],
      events: [
        {
          name: 'Akad Nikah',
          date: '2026-08-08',
          timeStart: '08:00',
          timeEnd: '10:00',
          address: 'Ballroom Nusantara',
          mapLocation: 'https://maps.google.com',
          enabled: true,
        },
      ],
      galleryImageUrls: ['/uploads/gallery-1.jpg', '', '/uploads/gallery-2.jpg'],
      musicUrl: '/uploads/music.mp3',
    }, 'calla-lily-plum-red-lead');

    expect(settings).toMatchObject({
      enabled: true,
      slug: 'calla-lily-preview',
      musicUrl: '/uploads/music.mp3',
      profiles: [
        {
          id: 'profile-1',
          label: 'Profile 1',
          fullName: 'Arya Pratama',
          nickName: 'Arya',
          description: 'Putra pertama keluarga Pratama',
          photoUrl: '/uploads/arya.jpg',
        },
        {
          id: 'profile-2',
          label: 'Profile 2',
          fullName: 'Laras Kirana',
          nickName: 'Laras',
          description: 'Putri kedua keluarga Kirana',
          photoUrl: '/uploads/laras.jpg',
        },
      ],
      events: [
        {
          id: 'event-1',
          name: 'Akad Nikah',
          date: '2026-08-08',
          timeStart: '08:00',
          timeEnd: '10:00',
          timeZone: 'WIB',
          address: 'Ballroom Nusantara',
          mapLocation: 'https://maps.google.com',
          enabled: true,
        },
        {
          id: 'event-2',
          name: 'Resepsi',
          enabled: true,
        },
      ],
      galleryImageUrls: ['/uploads/gallery-1.jpg', '/uploads/gallery-2.jpg'],
    });
  });

  it('normalizes global demo data without template-specific slug state', () => {
    const settings = normalizeSapatamuGlobalDemoPreviewSettings({
      enabled: true,
      slug: 'should-not-be-kept',
      invitationId: 'template-specific-id',
      profiles: [
        {
          fullName: 'Arya Pratama',
          photoUrl: '/uploads/demo/arya.jpg',
        },
      ],
      galleryImageUrls: ['/uploads/demo/gallery-1.jpg', ''],
      musicUrl: '/uploads/demo/music.mp3',
      giftAccounts: [
        { bankName: 'BCA', accountNumber: '1234567890', accountHolder: 'Arya Pratama' },
        { bankName: 'Mandiri', accountNumber: '0987654321', accountHolder: 'Laras Kirana' },
        { bankName: 'Should be ignored', accountNumber: '0000', accountHolder: 'Extra' },
      ],
      giftAddress: 'Jl. Melati No. 8, Jakarta Selatan',
    });

    expect(settings).toMatchObject({
      enabled: true,
      musicUrl: '/uploads/demo/music.mp3',
      profiles: [
        {
          fullName: 'Arya Pratama',
          photoUrl: '/uploads/demo/arya.jpg',
        },
        {
          id: 'profile-2',
          photoUrl: '',
        },
      ],
      galleryImageUrls: ['/uploads/demo/gallery-1.jpg'],
      giftAccounts: [
        { bankName: 'BCA', accountNumber: '1234567890', accountHolder: 'Arya Pratama' },
        { bankName: 'Mandiri', accountNumber: '0987654321', accountHolder: 'Laras Kirana' },
      ],
      giftAddress: 'Jl. Melati No. 8, Jakarta Selatan',
    });
    expect(settings).not.toHaveProperty('slug');
    expect(settings).not.toHaveProperty('invitationId');
  });
});
