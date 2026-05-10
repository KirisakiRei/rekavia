jest.mock(
  'generated/prisma',
  () => ({
    InvitationDraftStatus: {},
    InvitationMediaType: {},
    PackageType: {},
    PaymentStatus: {},
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
  'src/helpers/upload-policy.helper',
  () => ({
    SAPATAMU_ALBUM_ALLOWED_EXTENSIONS: [],
    SAPATAMU_ALBUM_ALLOWED_MIME_TYPES: [],
    SAPATAMU_ALBUM_MAX_SIZE_BYTES: 0,
    SAPATAMU_EDITOR_ALLOWED_EXTENSIONS: [],
    SAPATAMU_EDITOR_ALLOWED_MIME_TYPES: [],
    SAPATAMU_EDITOR_MAX_SIZE_BYTES: 0,
    buildEditorMediaTypeFromMime: jest.fn(),
    formatUploadSize: (value: number) => `${value} B`,
  }),
  { virtual: true },
);

import {
  SapatamuService,
  buildThemeAddonCartItems,
  calculateThemeActivationCheckout,
  isInvitationThemeAccessActive,
  mergeEditorPageDataWithDefaults,
  sortThemeAddonOrderItemsForFulfillment,
} from './sapatamu.service';
import { buildDefaultEditorState } from './sapatamu-editor.helper';
import type { SapatamuEditorDocumentV3 } from './sapatamu-content.helper';

describe('SapatamuService template asset application', () => {
  it('only applies frame assets to image slots that use template frames', () => {
    const content = {
      editor: buildDefaultEditorState({
        themeId: 'malay-ethnic-red-ruby',
        requiredTierCategory: 'premium',
        profiles: [
          { fullName: 'Raka Pratama', nickName: 'Raka' },
          { fullName: 'Nadia Kirana', nickName: 'Nadia' },
        ],
        events: [{ name: 'Akad', date: '2026-08-10' }],
      }),
    } as SapatamuEditorDocumentV3;

    const openingImage = content.editor.pages[0].data.image as {
      frame: { disabled: boolean; content: string };
    };
    const framedImage = content.editor.pages
      .flatMap((page) => Object.values(page.data))
      .find(
        (value): value is { type: string; frame: { disabled: boolean; content: string } } =>
          Boolean(
            value &&
              typeof value === 'object' &&
              !Array.isArray(value) &&
              (value as { type?: string }).type === 'image' &&
              (value as { frame?: { disabled?: boolean; content?: string } }).frame?.disabled === false,
          ),
      );

    expect(openingImage.frame.disabled).toBe(true);
    expect(framedImage).toBeDefined();

    const service = new SapatamuService({} as never) as unknown as {
      applyFrameAsset: (document: SapatamuEditorDocumentV3, url: string, enabled: boolean) => void;
    };
    service.applyFrameAsset(content, '/sapatamu-themes/malay-ethnic-red-ruby/original/library/replacement-frame.png', true);

    expect(openingImage.frame).toEqual({ disabled: true, content: '' });
    expect(framedImage?.frame).toEqual({
      disabled: false,
      content: '/sapatamu-themes/malay-ethnic-red-ruby/original/library/replacement-frame.png',
    });
  });
});

describe('SapatamuService theme commerce helpers', () => {
  it('uses special Luxury activation pricing when no voucher is applied', () => {
    const pricing = calculateThemeActivationCheckout({
      basePrice: 349000,
      specialPrice: 279000,
      voucherDiscountAmount: 0,
    });

    expect(pricing).toEqual({
      originalAmount: 349000,
      discountAmount: 70000,
      totalAmount: 279000,
      priceMode: 'special',
      specialDiscountPercent: 20,
    });
  });

  it('applies voucher on special Luxury pricing', () => {
    const pricing = calculateThemeActivationCheckout({
      basePrice: 349000,
      specialPrice: 279000,
      voucherDiscountAmount: 50000,
    });

    expect(pricing).toEqual({
      originalAmount: 349000,
      discountAmount: 50000,
      totalAmount: 229000,
      priceMode: 'voucher',
      specialDiscountPercent: 20,
    });
  });

  it('builds one or two theme add-on cart items with the second theme promo price', () => {
    const items = buildThemeAddonCartItems([
      { templateId: 'theme-calla', themeCode: 'calla-lily-plum-red-lead', themeName: 'Calla Lily' },
      { templateId: 'theme-honey', themeCode: 'honeysuckle-seashell', themeName: 'Honeysuckle' },
    ]);

    expect(items).toEqual([
      {
        templateId: 'theme-calla',
        themeCode: 'calla-lily-plum-red-lead',
        themeName: 'Calla Lily',
        addonSlot: 1,
        normalPrice: 150000,
        unitPrice: 150000,
      },
      {
        templateId: 'theme-honey',
        themeCode: 'honeysuckle-seashell',
        themeName: 'Honeysuckle',
        addonSlot: 2,
        normalPrice: 150000,
        unitPrice: 75000,
      },
    ]);
  });

  it('builds theme add-on cart items from admin configured package prices', () => {
    const items = buildThemeAddonCartItems(
      [
        { templateId: 'theme-calla', themeCode: 'calla-lily-plum-red-lead', themeName: 'Calla Lily' },
        { templateId: 'theme-honey', themeCode: 'honeysuckle-seashell', themeName: 'Honeysuckle' },
      ],
      {
        firstPrice: 175000,
        secondPrice: 99000,
        normalPrice: 175000,
      },
    );

    expect(items[0]).toMatchObject({ addonSlot: 1, normalPrice: 175000, unitPrice: 175000 });
    expect(items[1]).toMatchObject({ addonSlot: 2, normalPrice: 175000, unitPrice: 99000 });
  });

  it('sorts theme add-on order items by add-on slot before fulfillment', () => {
    const items = sortThemeAddonOrderItemsForFulfillment([
      {
        id: 'order-item-2',
        metadata: { kind: 'theme_add_on', addonSlot: 2 },
        created_at: new Date('2026-05-08T10:00:02.000Z'),
      },
      {
        id: 'order-item-1',
        metadata: { kind: 'theme_add_on', addonSlot: 1 },
        created_at: new Date('2026-05-08T10:00:01.000Z'),
      },
    ]);

    expect(items.map((item) => item.id)).toEqual(['order-item-1', 'order-item-2']);
  });

  it('treats invitation theme access as active only inside its access window', () => {
    const now = new Date('2026-05-08T10:00:00.000Z');

    expect(isInvitationThemeAccessActive({ starts_at: null, expires_at: null, revoked_at: null, deleted_at: null }, now)).toBe(true);
    expect(isInvitationThemeAccessActive({ starts_at: new Date('2026-05-08T11:00:00.000Z'), expires_at: null, revoked_at: null, deleted_at: null }, now)).toBe(false);
    expect(isInvitationThemeAccessActive({ starts_at: null, expires_at: new Date('2026-05-08T09:00:00.000Z'), revoked_at: null, deleted_at: null }, now)).toBe(false);
    expect(isInvitationThemeAccessActive({ starts_at: null, expires_at: null, revoked_at: now, deleted_at: null }, now)).toBe(false);
  });
});

describe('SapatamuService template editor defaults', () => {
  it('preserves user-edited element design values while filling missing template defaults', () => {
    const merged = mergeEditorPageDataWithDefaults(
      ({
        text1: {
          type: 'text',
          content: 'CUSTOM COPY',
          size: 42,
          padding: {
            x: 24,
            y: -12,
            top: 8,
          },
        },
      } as unknown as SapatamuEditorDocumentV3['editor']['pages'][number]['data']),
      {
        text1: {
          type: 'text',
          content: 'DEFAULT COPY',
          size: 18,
          color: '#111111',
          padding: {
            x: 0,
            y: 0,
            top: 0,
            bottom: 16,
          },
        },
      },
    );

    expect(merged.text1).toEqual({
      type: 'text',
      content: 'CUSTOM COPY',
      size: 42,
      color: '#111111',
      padding: {
        x: 24,
        y: -12,
        top: 8,
        bottom: 16,
      },
    });
  });

  it('prefers template-scoped layout defaults over global layout defaults', async () => {
    const db = {
      editorLayoutTemplate: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'global-opening',
            product_code: 'sapatamu',
            template_id: null,
            layout_code: 'malay-ethnic-red-ruby-opening',
            family: 'opening',
            title: 'Opening Global',
            preview_image_url: '/global.webp',
            default_data_json: { text1: { type: 'text', content: 'GLOBAL' } },
            required_feature_code: null,
            max_instances: 1,
            sort_order: 1,
            supports_preview_selection: true,
          },
          {
            id: 'template-opening',
            product_code: 'sapatamu',
            template_id: 'template-malay-ethnic-red-ruby',
            layout_code: 'malay-ethnic-red-ruby-opening',
            family: 'opening',
            title: 'Opening Template',
            preview_image_url: '/template.webp',
            default_data_json: { text1: { type: 'text', content: 'TEMPLATE' } },
            required_feature_code: null,
            max_instances: 1,
            sort_order: 1,
            supports_preview_selection: true,
          },
        ]),
      },
    };

    const service = new SapatamuService(db as never) as unknown as {
      buildEditorLayoutCatalogFromDb: (params: {
        themeId: string;
        templateId: string;
        profiles: Array<{ fullName?: string; nickName?: string; description?: string }>;
        events: Array<{ name?: string; date?: string }>;
      }) => Promise<Array<{ layoutCode: string; defaultPageData: Record<string, unknown>; previewImageUrl: string }>>;
    };

    const catalog = await service.buildEditorLayoutCatalogFromDb({
      themeId: 'malay-ethnic-red-ruby',
      templateId: 'template-malay-ethnic-red-ruby',
      profiles: [{ fullName: 'Raka', nickName: 'Raka' }, { fullName: 'Nadia', nickName: 'Nadia' }],
      events: [{ name: 'Akad', date: '2026-08-10' }],
    });

    const openingLayouts = catalog.filter((item) => item.layoutCode === 'malay-ethnic-red-ruby-opening');
    expect(openingLayouts).toHaveLength(1);
    expect(openingLayouts[0].previewImageUrl).toBe('/template.webp');
    expect(openingLayouts[0].defaultPageData).toEqual({ text1: { type: 'text', content: 'TEMPLATE' } });
  });

  it('hides a layout when the template-scoped default is inactive', async () => {
    const db = {
      editorLayoutTemplate: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'template-live',
            product_code: 'sapatamu',
            template_id: 'template-malay-ethnic-red-ruby',
            layout_code: 'malay-ethnic-red-ruby-livestreaming',
            family: 'livestreaming',
            title: 'Live Streaming',
            preview_image_url: '/live.webp',
            default_data_json: { text1: { type: 'text', content: 'LIVE' } },
            required_feature_code: null,
            max_instances: 1,
            sort_order: 10,
            supports_preview_selection: true,
            is_active: false,
          },
        ]),
      },
    };

    const service = new SapatamuService(db as never) as unknown as {
      buildEditorLayoutCatalogFromDb: (params: {
        themeId: string;
        templateId: string;
        profiles: Array<{ fullName?: string; nickName?: string; description?: string }>;
        events: Array<{ name?: string; date?: string }>;
      }) => Promise<Array<{ layoutCode: string; defaultPageData: Record<string, unknown>; defaultVisible?: boolean }>>;
    };

    const catalog = await service.buildEditorLayoutCatalogFromDb({
      themeId: 'malay-ethnic-red-ruby',
      templateId: 'template-malay-ethnic-red-ruby',
      profiles: [{ fullName: 'Raka', nickName: 'Raka' }, { fullName: 'Nadia', nickName: 'Nadia' }],
      events: [{ name: 'Akad', date: '2026-08-10' }],
    });

    expect(catalog.some((item) => item.layoutCode === 'malay-ethnic-red-ruby-livestreaming')).toBe(false);
  });
});
