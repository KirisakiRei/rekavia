import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PackageType, Prisma, TemplateAssetType } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
import {
  SAPATAMU_PACKAGE_SEEDS,
  SAPATAMU_TEMPLATE_ASSET_SEEDS,
  SAPATAMU_THEME_SEEDS,
} from 'src/sapatamu/sapatamu-catalog';
import {
  buildContentFromDraft,
  normalizeEvents,
  normalizeProfiles,
  type SapatamuEvent,
  type SapatamuEditorDocumentV3,
  type SapatamuProfile,
} from 'src/sapatamu/sapatamu-content.helper';
import {
  SAPATAMU_EDITOR_FONT_CATALOG,
  buildEditorFeatureGates,
  buildEditorPackageFeatures,
  buildLayoutCatalog,
  createEditorPageFromCatalog,
  type SapatamuEditorLayoutCatalogItem,
} from 'src/sapatamu/sapatamu-editor.helper';

type AuthAdmin = {
  accountId: string;
  role: string;
  data?: { id?: string } | null;
};

type AdminQuery = {
  page?: string | number;
  limit?: string | number;
  search?: string;
  status?: string;
  productCode?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
};

type AuditContext = {
  admin?: AuthAdmin;
  ip?: string;
  userAgent?: string;
};

type TierCategory = 'basic' | 'premium' | 'vintage';

const PRODUCT_SEEDS = [
  { code: 'sapatamu', name: 'Sapatamu', description: 'Undangan digital wedding invitation.', status: 'active', sort_order: 1 },
  { code: 'etalasepro', name: 'EtalasePro', description: 'Etalase toko online.', status: 'coming_soon', sort_order: 2 },
  { code: 'citrakorpora', name: 'CitraKorpora', description: 'Company profile bisnis.', status: 'coming_soon', sort_order: 3 },
  { code: 'edugerbang', name: 'EduGerbang', description: 'Website sekolah dan edukasi.', status: 'coming_soon', sort_order: 4 },
] as const;

const TIER_ORDER: TierCategory[] = ['basic', 'premium', 'vintage'];
const DEMO_PREVIEW_SLUG_ALIASES: Record<string, string> = {
  'calla-lily-plum-red-lead': 'calla-lily-preview',
  'honeysuckle-seashell': 'honeysuckle-preview',
};

function toInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseJsonObject(value: unknown, fallback: Record<string, unknown> = {}): Record<string, unknown> {
  if (!value) return fallback;
  if (typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value !== 'string') return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function slugify(value: unknown): string {
  return cleanString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

type SapatamuDemoPreviewProfile = SapatamuProfile & {
  photoUrl: string;
};

export type SapatamuGlobalDemoPreviewSettings = {
  enabled: boolean;
  profiles: SapatamuDemoPreviewProfile[];
  events: SapatamuEvent[];
  galleryImageUrls: string[];
  musicUrl: string;
  giftAccounts: Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>;
  giftAddress: string;
};

export type SapatamuDemoPreviewSettings = SapatamuGlobalDemoPreviewSettings & {
  slug: string;
  invitationId: string | null;
};

export function buildSapatamuDemoPreviewSlug(templateCode: string): string {
  const normalized = slugify(templateCode) || 'sapatamu';
  return DEMO_PREVIEW_SLUG_ALIASES[normalized] ?? `${normalized}-preview`;
}

export function normalizeSapatamuGlobalDemoPreviewSettings(
  payload: Record<string, unknown> | null | undefined,
  existing?: Partial<SapatamuGlobalDemoPreviewSettings> | null,
): SapatamuGlobalDemoPreviewSettings {
  const source = parseJsonObject(payload);
  const current = existing ?? {};
  const profileSource = Array.isArray(source.profiles) ? source.profiles : current.profiles;
  const normalizedProfiles = normalizeProfiles(profileSource).map((profile, index) => {
    const rawProfile = Array.isArray(profileSource) && profileSource[index] && typeof profileSource[index] === 'object'
      ? (profileSource[index] as Record<string, unknown>)
      : {};
    return {
      ...profile,
      photoUrl: cleanString(rawProfile.photoUrl) || cleanString((current.profiles?.[index] as SapatamuDemoPreviewProfile | undefined)?.photoUrl),
    };
  });
  const eventSource = Array.isArray(source.events) ? source.events : current.events;
  const normalizedEvents = normalizeEvents(eventSource);
  const rawGallery = Array.isArray(source.galleryImageUrls) ? source.galleryImageUrls : current.galleryImageUrls;
  const galleryImageUrls = (Array.isArray(rawGallery) ? rawGallery : [])
    .map((item) => cleanString(item))
    .filter(Boolean)
    .slice(0, 20);
  const rawGiftAccounts = Array.isArray(source.giftAccounts) ? source.giftAccounts : existing?.giftAccounts;
  const giftAccounts = (Array.isArray(rawGiftAccounts) ? rawGiftAccounts : [])
    .filter((item) => Boolean(item && typeof item === 'object' && !Array.isArray(item)))
    .map((item) => {
      const record = item as Record<string, unknown>;
      return {
        bankName: cleanString(record.bankName),
        accountNumber: cleanString(record.accountNumber),
        accountHolder: cleanString(record.accountHolder),
      };
    })
    .filter((item) => item.bankName || item.accountNumber || item.accountHolder)
    .slice(0, 2);

  return {
    enabled: typeof source.enabled === 'boolean' ? source.enabled : current.enabled ?? true,
    profiles: normalizedProfiles,
    events: normalizedEvents,
    galleryImageUrls,
    musicUrl: cleanString(source.musicUrl) || cleanString(current.musicUrl),
    giftAccounts,
    giftAddress: cleanString(source.giftAddress) || cleanString(current.giftAddress),
  };
}

export function normalizeSapatamuDemoPreviewSettings(
  payload: Record<string, unknown> | null | undefined,
  templateCode: string,
  existing?: Partial<SapatamuDemoPreviewSettings> | null,
): SapatamuDemoPreviewSettings {
  const source = parseJsonObject(payload);
  const globalSettings = normalizeSapatamuGlobalDemoPreviewSettings(payload, existing);
  const requestedSlug = slugify(source.slug) || slugify(existing?.slug);

  return {
    ...globalSettings,
    slug: requestedSlug || buildSapatamuDemoPreviewSlug(templateCode),
    invitationId: cleanString(source.invitationId) || existing?.invitationId || null,
  };
}

function isTierCategory(value: unknown): value is TierCategory {
  return value === 'basic' || value === 'premium' || value === 'vintage';
}

function normalizeSort(sort: string | undefined, fallback: Record<string, 'asc' | 'desc'>) {
  if (!sort) return fallback;
  const [field, direction] = sort.split(':');
  if (!field) return fallback;
  return { [field]: direction === 'asc' ? 'asc' : 'desc' };
}

function paginate(query: AdminQuery) {
  const page = toInt(query.page, 1);
  const limit = Math.min(toInt(query.limit, 20), 100);
  return { page, limit, skip: (page - 1) * limit };
}

function dateWhere(query: AdminQuery) {
  const created_at: Record<string, Date> = {};
  if (query.dateFrom) created_at.gte = new Date(query.dateFrom);
  if (query.dateTo) created_at.lte = new Date(query.dateTo);
  return Object.keys(created_at).length ? { created_at } : {};
}

function combineDateTime(date: string, time: string): Date | null {
  if (!date) return null;
  const parsed = new Date(`${date}T${time || '00:00'}:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toUploadUrl(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  const marker = '/uploads/';
  const index = normalized.lastIndexOf(marker);
  if (index === -1) return `/uploads/${normalized.split('/').pop() ?? 'file'}`;
  return normalized.slice(index);
}

@Injectable()
export class AdminService {
  private sapatamuCatalogReady = false;

  constructor(private readonly db: DatabaseService) {}

  private getTemplateTier(template: { metadata?: unknown }): 'basic' | 'premium' | 'vintage' {
    const metadata = parseJsonObject(template.metadata);
    const tier = cleanString(metadata.tierCategory);
    return tier === 'premium' || tier === 'vintage' ? tier : 'basic';
  }

  private getTemplatePreviewProfiles() {
    return [
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
        fullName: 'Nadia Kirana',
        nickName: 'Nadia',
        description: 'Putri kedua keluarga Kirana',
      },
    ];
  }

  private getTemplatePreviewEvents() {
    return [
      {
        id: 'event-1',
        name: 'Akad Nikah',
        date: '2026-08-10',
        timeStart: '08:00',
        timeEnd: '10:00',
        timeZone: 'WIB' as const,
        address: 'Gedung Serbaguna',
        mapLocation: 'https://maps.google.com',
        enabled: true,
      },
      {
        id: 'event-2',
        name: 'Resepsi',
        date: '2026-08-10',
        timeStart: '11:00',
        timeEnd: '14:00',
        timeZone: 'WIB' as const,
        address: 'Ballroom Nusantara',
        mapLocation: 'https://maps.google.com',
        enabled: true,
      },
    ];
  }

  private getTemplateDemoPreviewSettings(template: { code: string; metadata?: unknown }): SapatamuDemoPreviewSettings {
    const metadata = parseJsonObject(template.metadata);
    return normalizeSapatamuDemoPreviewSettings(
      parseJsonObject(metadata.demoPreview),
      template.code,
    );
  }

  private async getSapatamuProduct() {
    await this.ensureProducts();
    const product = await this.db.platformProduct.findUnique({ where: { code: 'sapatamu' } });
    if (!product) throw new NotFoundException('Produk Sapatamu tidak ditemukan');
    return product;
  }

  private async getSapatamuGlobalDemoPreviewSettings(): Promise<SapatamuGlobalDemoPreviewSettings> {
    const product = await this.getSapatamuProduct();
    const config = parseJsonObject(product.config_json);
    return normalizeSapatamuGlobalDemoPreviewSettings(parseJsonObject(config.demoPreview));
  }

  private buildTemplateDemoPreviewSettings(
    globalSettings: SapatamuGlobalDemoPreviewSettings,
    templateCode: string,
    invitationId: string | null = null,
  ): SapatamuDemoPreviewSettings {
    return {
      ...globalSettings,
      slug: buildSapatamuDemoPreviewSlug(templateCode),
      invitationId,
    };
  }

  private async getDemoOwnerUserId(ctx: AuditContext): Promise<string> {
    const adminUserId = cleanString(ctx.admin?.data?.id);
    if (adminUserId) return adminUserId;

    const adminUser = await this.db.user.findFirst({
      where: { deleted_at: null, account: { role: 'admin' } },
      orderBy: { created_at: 'asc' },
    });
    if (adminUser?.id) return adminUser.id;

    const fallbackUser = await this.db.user.findFirst({
      where: { deleted_at: null },
      orderBy: { created_at: 'asc' },
    });
    if (fallbackUser?.id) return fallbackUser.id;

    throw new BadRequestException('User owner untuk demo preview belum tersedia.');
  }

  private applyDemoImagesToDocument(
    document: SapatamuEditorDocumentV3,
    settings: SapatamuDemoPreviewSettings,
  ): SapatamuEditorDocumentV3 {
    const next = JSON.parse(JSON.stringify(document)) as SapatamuEditorDocumentV3;
    const profilePhotos = settings.profiles.map((profile) => profile.photoUrl).filter(Boolean);
    const fallbackImages = [...profilePhotos, ...settings.galleryImageUrls].filter(Boolean);
    const metaImage = fallbackImages[0] ?? null;

    next.meta.imageUrl = metaImage;
    next.weddingData.isDemoPreview = true;
    next.weddingData.demoPreviewSlug = settings.slug;
    if (settings.musicUrl) {
      next.musicSettings = { mode: 'library', value: settings.musicUrl };
      next.weddingData.bgmUrl = settings.musicUrl;
    }

    next.editor.pages.forEach((page) => {
      Object.entries(page.data).forEach(([key, value], index) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return;
        const element = value as {
          type?: string;
          content?: string;
          items?: string[];
        };

        if (element.type === 'image') {
          const photoIndex = /2|bride|right|wanita/i.test(key) ? 1 : /1|groom|left|pria/i.test(key) ? 0 : index % 2;
          const nextPhoto = profilePhotos[photoIndex] ?? fallbackImages[index % Math.max(1, fallbackImages.length)];
          if (nextPhoto) element.content = nextPhoto;
        }

        if (element.type === 'gallery' && settings.galleryImageUrls.length > 0) {
          element.items = settings.galleryImageUrls;
        }
      });
    });

    const hero = (next.editor.globalBackgroundDetails as {
      hero?: {
        left?: { photo?: { url?: string } };
        right?: { photo?: { url?: string } };
      };
    }).hero;
    if (hero?.left?.photo && profilePhotos[0]) hero.left.photo.url = profilePhotos[0];
    if (hero?.right?.photo && profilePhotos[1]) hero.right.photo.url = profilePhotos[1];

    return next;
  }

  private async buildDemoPreviewDocument(
    template: { id: string; code: string; metadata?: unknown; template_assets?: Array<{ asset_type: unknown; asset_key: string; url: string; metadata: unknown; is_active: boolean; sort_order: number }> },
    settings: SapatamuDemoPreviewSettings,
  ): Promise<SapatamuEditorDocumentV3> {
    const tierCategory = this.getTemplateTier(template);
    const packageFeatures = buildEditorPackageFeatures(tierCategory);
    const layouts = await this.buildTemplateLayoutCatalog({ template, tierCategory });
    const pages = layouts.map((layout, index) => ({
      ...createEditorPageFromCatalog({
        layout,
        uniqueId: index + 1,
        source: layout.defaultVisible ? 'base' : 'addon',
        packageFeatures,
      }),
      isActive: layout.defaultVisible,
    }));
    const baseDocument = buildContentFromDraft({
      themeId: template.code,
      profiles: settings.profiles,
      events: settings.events,
      basePhotoQuota: 20,
      requiredTierCategory: tierCategory,
      existing: {
        musicSettings: settings.musicUrl
          ? { mode: 'library', value: settings.musicUrl }
          : { mode: 'none', value: '' },
        settings: {
          commerce: {
            requiredTierCategory: tierCategory,
            selectedPackageCode: null,
            activationState: 'inactive',
          },
          giftAccounts: settings.giftAccounts,
          giftAddress: settings.giftAddress,
          lastEditedAtDisplay: null,
          activatedAtDisplay: null,
        },
      },
    });
    const assetDocument = this.applyTemplateAssetDefaults(
      {
        ...baseDocument,
        editor: {
          ...baseDocument.editor,
          pages,
          layoutCatalogSnapshot: layouts,
          packageFeatures,
        },
      },
      template.template_assets ?? [],
    );

    return this.applyDemoImagesToDocument(assetDocument, settings);
  }

  private async buildTemplateLayoutCatalog(params: {
    template: { id: string; code: string };
    tierCategory: 'basic' | 'premium' | 'vintage';
  }): Promise<SapatamuEditorLayoutCatalogItem[]> {
    const profiles = this.getTemplatePreviewProfiles();
    const events = this.getTemplatePreviewEvents();
    const fallback = buildLayoutCatalog({
      themeId: params.template.code,
      profiles,
      events,
    });
    const fallbackByCode = new Map(fallback.map((item) => [item.layoutCode, item]));
    const rows = await this.db.editorLayoutTemplate.findMany({
      where: {
        product_code: 'sapatamu',
        deleted_at: null,
        OR: [{ template_id: null }, { template_id: params.template.id }],
      },
      orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    });
    const rowsByCode = new Map<string, (typeof rows)[number]>();

    rows.forEach((row) => {
      const existing = rowsByCode.get(row.layout_code);
      if (!existing || (!existing.template_id && row.template_id === params.template.id)) {
        rowsByCode.set(row.layout_code, row);
      }
    });

    const merged = new Map<string, SapatamuEditorLayoutCatalogItem>(
      fallback.map((item) => [item.layoutCode, item]),
    );
    rowsByCode.forEach((row) => {
      const fallbackItem = fallbackByCode.get(row.layout_code);
      const defaultData =
        row.default_data_json && typeof row.default_data_json === 'object' && !Array.isArray(row.default_data_json)
          ? (row.default_data_json as Record<string, unknown>)
          : fallbackItem?.defaultPageData ?? {};

      merged.set(row.layout_code, {
        layoutCode: row.layout_code,
        family: row.family,
        title: row.title,
        previewImageUrl: row.preview_image_url ?? fallbackItem?.previewImageUrl ?? '',
        defaultPageData: defaultData,
        requiredTier: fallbackItem?.requiredTier ?? params.tierCategory,
        requiredFeatureCode: row.required_feature_code ?? fallbackItem?.requiredFeatureCode ?? null,
        maxInstances: row.max_instances ?? fallbackItem?.maxInstances ?? 1,
        sortOrder: row.sort_order,
        supportsPreviewSelection: row.supports_preview_selection,
        mediaRequirements: fallbackItem?.mediaRequirements ?? 'none',
        defaultVisible: row.is_active !== false,
      });
    });

    return Array.from(merged.values()).sort((left, right) => left.sortOrder - right.sortOrder);
  }

  private applyTemplateAssetDefaults(
    document: SapatamuEditorDocumentV3,
    assets: Array<{ asset_type: unknown; asset_key: string; url: string; metadata: unknown; is_active: boolean; sort_order: number }>,
  ): SapatamuEditorDocumentV3 {
    const next = JSON.parse(JSON.stringify(document)) as SapatamuEditorDocumentV3;
    const activeAssets = assets.filter((asset) => asset.is_active);
    const background = activeAssets.find((asset) => String(asset.asset_type) === 'background');

    if (background) {
      next.editor.globalBackground = background.url;
      next.editor.globalBackgroundDetails = {
        ...next.editor.globalBackgroundDetails,
        type: /\.(mp4|webm|mov)$/i.test(background.url) ? 'video' : 'image',
      };
    }

    const ornaments = activeAssets
      .filter((asset) => String(asset.asset_type) === 'ornament')
      .sort((left, right) => left.sort_order - right.sort_order);
    if (ornaments.length > 0) {
      next.editor.cornerElements = {
        ...next.editor.cornerElements,
        list: ornaments.map((asset) => {
          const metadata = parseJsonObject(asset.metadata);
          return {
            type: (cleanString(metadata.slot) || 'top_left') as never,
            disabled: metadata.enabled === false,
            url: asset.url,
            animation: {
              style: Number(parseJsonObject(metadata.animation).style ?? metadata.animationStyle ?? 0) || 0,
              duration: Number(parseJsonObject(metadata.animation).duration ?? metadata.animationDuration ?? 3) || 3,
            },
          };
        }),
      };
    }

    return next;
  }

  private async ensureProducts() {
    for (const product of PRODUCT_SEEDS) {
      await this.db.platformProduct.upsert({
        where: { code: product.code },
        create: { ...product },
        update: {
          name: product.name,
          description: product.description,
          sort_order: product.sort_order,
        },
      });
    }
  }

  private async audit(ctx: AuditContext, action: string, entity: string, entityId: string | null, before: unknown, after: unknown) {
    await this.db.adminAuditLog.create({
      data: {
        admin_user_id: ctx.admin?.data?.id ?? null,
        action,
        entity,
        entity_id: entityId,
        before_json: before === undefined ? undefined : (before as Prisma.InputJsonValue),
        after_json: after === undefined ? undefined : (after as Prisma.InputJsonValue),
        ip_address: ctx.ip,
        user_agent: ctx.userAgent,
      },
    });
  }

  private listResponse<T>(items: T[], total: number, page: number, limit: number) {
    return { items, total, page, limit, total_page: Math.ceil(total / limit) };
  }

  private getPackageTier(packageSeed: { featuresJson: Record<string, unknown> }): TierCategory {
    return isTierCategory(packageSeed.featuresJson.tierCategory) ? packageSeed.featuresJson.tierCategory : 'basic';
  }

  private getPackageRank(category: TierCategory): number {
    return TIER_ORDER.indexOf(category);
  }

  private async ensureSapatamuCatalog() {
    if (this.sapatamuCatalogReady) return;

    await this.ensureProducts();

    const themeMap = new Map<string, string>();
    const packageMap = new Map<string, string>();

    for (const seed of SAPATAMU_THEME_SEEDS) {
      const template = await this.db.invitationTemplate.upsert({
        where: { code: seed.code },
        update: {
          product_code: 'sapatamu',
          name: seed.name,
          category: 'sapatamu',
          description: seed.description,
          preview_image_url: seed.previewImageUrl,
          metadata: seed.metadata as Prisma.InputJsonValue,
          is_active: true,
          deleted_at: null,
        },
        create: {
          product_code: 'sapatamu',
          code: seed.code,
          name: seed.name,
          category: 'sapatamu',
          description: seed.description,
          preview_image_url: seed.previewImageUrl,
          metadata: seed.metadata as Prisma.InputJsonValue,
          is_active: true,
        },
      });
      themeMap.set(seed.code, template.id);
    }

    for (const seed of SAPATAMU_PACKAGE_SEEDS) {
      const pkg = await this.db.package.upsert({
        where: { code: seed.code },
        update: {
          product_code: 'sapatamu',
          name: seed.name,
          description: seed.description,
          price: seed.price,
          currency: 'IDR',
          package_type: seed.packageType as PackageType,
          features_json: seed.featuresJson as Prisma.InputJsonValue,
          is_active: true,
          sort_order: seed.sortOrder,
          deleted_at: null,
        },
        create: {
          product_code: 'sapatamu',
          code: seed.code,
          name: seed.name,
          description: seed.description,
          price: seed.price,
          currency: 'IDR',
          package_type: seed.packageType as PackageType,
          features_json: seed.featuresJson as Prisma.InputJsonValue,
          is_active: true,
          sort_order: seed.sortOrder,
        },
      });
      packageMap.set(seed.code, pkg.id);
    }

    for (const seed of SAPATAMU_TEMPLATE_ASSET_SEEDS) {
      const templateId = themeMap.get(seed.templateCode);
      if (!templateId) continue;

      await this.db.templateAsset.upsert({
        where: {
          template_id_asset_key: {
            template_id: templateId,
            asset_key: seed.assetKey,
          },
        },
        update: {
          product_code: 'sapatamu',
          asset_type: seed.assetType as TemplateAssetType,
          url: seed.url,
          file_name: seed.fileName ?? null,
          metadata: seed.metadata as Prisma.InputJsonValue,
          sort_order: seed.sortOrder,
          is_active: true,
          deleted_at: null,
        },
        create: {
          template_id: templateId,
          product_code: 'sapatamu',
          asset_type: seed.assetType as TemplateAssetType,
          asset_key: seed.assetKey,
          url: seed.url,
          file_name: seed.fileName ?? null,
          metadata: seed.metadata as Prisma.InputJsonValue,
          sort_order: seed.sortOrder,
          is_active: true,
        },
      });
    }

    const basePackages = SAPATAMU_PACKAGE_SEEDS.filter(
      (item) => item.packageType === 'base' || item.packageType === 'upgrade',
    );

    for (const pkg of basePackages) {
      const packageId = packageMap.get(pkg.code);
      if (!packageId) continue;
      const packageTier = this.getPackageTier(pkg);

      for (const theme of SAPATAMU_THEME_SEEDS) {
        const templateId = themeMap.get(theme.code);
        if (!templateId) continue;
        const themeTier = isTierCategory(theme.metadata.tierCategory) ? theme.metadata.tierCategory : 'basic';
        const isAvailable = this.getPackageRank(packageTier) >= this.getPackageRank(themeTier);

        await this.db.packageTemplateAccess.upsert({
          where: {
            package_id_template_id: {
              package_id: packageId,
              template_id: templateId,
            },
          },
          update: {
            is_available: isAvailable,
            deleted_at: null,
          },
          create: {
            package_id: packageId,
            template_id: templateId,
            is_available: isAvailable,
          },
        });
      }
    }

    this.sapatamuCatalogReady = true;
  }

  async overview() {
    await this.ensureProducts();
    const [users, activeUsers, invitations, publishedInvitations, orders, payments, revenue, pendingPayments, failedPayments, products] =
      await Promise.all([
        this.db.user.count({ where: { deleted_at: null } }),
        this.db.user.count({ where: { deleted_at: null, account: { status: 'active' } } }),
        this.db.invitation.count({ where: { deleted_at: null } }),
        this.db.invitation.count({ where: { deleted_at: null, status: 'published' } }),
        this.db.order.count({ where: { deleted_at: null } }),
        this.db.payment.count({ where: { deleted_at: null } }),
        this.db.payment.aggregate({ where: { deleted_at: null, status: 'paid' }, _sum: { amount: true } }),
        this.db.payment.count({ where: { deleted_at: null, status: 'pending' } }),
        this.db.payment.count({ where: { deleted_at: null, status: 'failed' } }),
        this.db.platformProduct.findMany({ where: { deleted_at: null }, orderBy: { sort_order: 'asc' } }),
      ]);

    const paidOrders = await this.db.order.count({ where: { deleted_at: null, status: 'paid' } });
    const conversionRate = orders > 0 ? Math.round((paidOrders / orders) * 1000) / 10 : 0;

    return {
      kpis: {
        users,
        activeUsers,
        invitations,
        publishedInvitations,
        orders,
        payments,
        pendingPayments,
        failedPayments,
        revenue: Number(revenue._sum.amount ?? 0),
        conversionRate,
      },
      products: await Promise.all(products.map((product) => this.productSummary(product.code))),
      topTemplates: await this.topTemplates(),
    };
  }

  private async productSummary(productCode: string) {
    const [product, templates, packages, invitations, orders, revenue] = await Promise.all([
      this.db.platformProduct.findUnique({ where: { code: productCode } }),
      this.db.invitationTemplate.count({ where: { product_code: productCode, deleted_at: null } }),
      this.db.package.count({ where: { product_code: productCode, deleted_at: null } }),
      this.db.invitation.count({ where: { deleted_at: null, template: { product_code: productCode } } }),
      this.db.order.count({
        where: { deleted_at: null, order_items: { some: { deleted_at: null, package: { product_code: productCode } } } },
      }),
      this.db.payment.aggregate({
        where: {
          deleted_at: null,
          status: 'paid',
          order: { order_items: { some: { deleted_at: null, package: { product_code: productCode } } } },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      code: productCode,
      name: product?.name ?? productCode,
      description: product?.description ?? '',
      status: product?.status ?? 'inactive',
      templates,
      packages,
      invitations,
      orders,
      revenue: Number(revenue._sum.amount ?? 0),
    };
  }

  private async topTemplates() {
    const grouped = await this.db.invitation.groupBy({
      by: ['template_id'],
      where: { deleted_at: null },
      _count: { template_id: true },
      orderBy: { _count: { template_id: 'desc' } },
      take: 5,
    });
    const templates = await this.db.invitationTemplate.findMany({
      where: { id: { in: grouped.map((item) => item.template_id) } },
    });
    return grouped.map((item) => {
      const template = templates.find((entry) => entry.id === item.template_id);
      return {
        templateId: item.template_id,
        name: template?.name ?? 'Unknown template',
        code: template?.code ?? '',
        productCode: template?.product_code ?? 'sapatamu',
        invitations: item._count.template_id,
      };
    });
  }

  async users(query: AdminQuery) {
    const { page, limit, skip } = paginate(query);
    const search = cleanString(query.search);
    const status = cleanString(query.status);
    const where: Prisma.UserWhereInput = {
      deleted_at: null,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
              { account: { username: { contains: search } } },
            ],
          }
        : {}),
      ...(status ? { account: { status: status as never } } : {}),
    };

    const [items, total] = await Promise.all([
      this.db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: normalizeSort(query.sort, { created_at: 'desc' }),
        include: {
          account: true,
          _count: { select: { invitations: true, orders: true, user_template_licenses: true } },
        },
      }),
      this.db.user.count({ where }),
    ]);

    const userIds = items.map((item) => item.id);
    const paidOrders = await this.db.order.groupBy({
      by: ['user_id'],
      where: { user_id: { in: userIds }, deleted_at: null, status: 'paid' },
      _sum: { total_amount: true },
    });

    return this.listResponse(
      items.map((user) => ({
        id: user.id,
        accountId: user.account_id,
        name: user.name,
        email: user.email,
        role: user.account.role,
        status: user.account.status,
        username: user.account.username,
        totalInvitations: user._count.invitations,
        totalOrders: user._count.orders,
        totalLicenses: user._count.user_template_licenses,
        totalRevenue: Number(paidOrders.find((item) => item.user_id === user.id)?._sum.total_amount ?? 0),
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      })),
      total,
      page,
      limit,
    );
  }

  async userDetail(id: string) {
    const user = await this.db.user.findFirst({
      where: { id, deleted_at: null },
      include: {
        account: true,
        invitations: {
          where: { deleted_at: null },
          include: {
            template: true,
            invitation_slugs: { where: { deleted_at: null, is_primary: true } },
            _count: { select: { invitation_guests: true, invitation_rsvps: true, invitation_visits: true } },
          },
          orderBy: { updated_at: 'desc' },
        },
        orders: {
          where: { deleted_at: null },
          include: { payments: { where: { deleted_at: null } }, order_items: { include: { package: true, template: true } } },
          orderBy: { created_at: 'desc' },
          take: 20,
        },
        user_template_licenses: {
          where: { deleted_at: null },
          include: { package: true, template: true },
          orderBy: { created_at: 'desc' },
        },
      },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    return {
      profile: {
        id: user.id,
        accountId: user.account_id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phone_number,
        address: user.address,
        role: user.account.role,
        status: user.account.status,
        username: user.account.username,
        createdAt: user.created_at,
      },
      invitations: user.invitations.map((invitation) => ({
        id: invitation.id,
        title: invitation.title,
        status: invitation.status,
        template: invitation.template,
        slug: invitation.invitation_slugs[0]?.slug ?? null,
        editorUrl: `/cms/sapatamu/${invitation.id}/editor`,
        manageUrl: `/cms/sapatamu/${invitation.id}/send`,
        guests: invitation._count.invitation_guests,
        rsvps: invitation._count.invitation_rsvps,
        views: invitation._count.invitation_visits,
        updatedAt: invitation.updated_at,
      })),
      orders: user.orders,
      licenses: user.user_template_licenses,
    };
  }

  async setUserStatus(id: string, payload: Record<string, unknown>, ctx: AuditContext) {
    const status = cleanString(payload.status);
    if (!['active', 'suspended'].includes(status)) {
      throw new BadRequestException('Status akun harus active atau suspended.');
    }
    const user = await this.db.user.findFirst({ where: { id, deleted_at: null }, include: { account: true } });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    const updated = await this.db.account.update({
      where: { id: user.account_id },
      data: {
        status: status as never,
        ...(status === 'suspended' ? { refresh_token_hash: null } : {}),
      },
    });
    await this.audit(ctx, 'user.status.update', 'account', user.account_id, { status: user.account.status }, { status: updated.status });
    return { userId: user.id, accountId: user.account_id, status: updated.status };
  }

  async products() {
    await this.ensureProducts();
    const products = await this.db.platformProduct.findMany({ where: { deleted_at: null }, orderBy: { sort_order: 'asc' } });
    return Promise.all(products.map((product) => this.productSummary(product.code)));
  }

  async productOverview(productCode: string) {
    await this.ensureProducts();
    const summary = await this.productSummary(productCode);
    if (summary.status === 'inactive') throw new NotFoundException('Produk tidak ditemukan');
    if (productCode !== 'sapatamu') {
      return { ...summary, comingSoon: true, message: 'Management detail produk ini belum diaktifkan di V1.' };
    }

    const [published, draft, archived, rsvps, visits, packageDistribution] = await Promise.all([
      this.db.invitation.count({ where: { deleted_at: null, status: 'published', template: { product_code: productCode } } }),
      this.db.invitation.count({ where: { deleted_at: null, status: 'draft', template: { product_code: productCode } } }),
      this.db.invitation.count({ where: { deleted_at: null, status: 'archived', template: { product_code: productCode } } }),
      this.db.invitationRsvp.count({ where: { deleted_at: null, invitation: { template: { product_code: productCode } } } }),
      this.db.invitationVisit.count({ where: { invitation: { template: { product_code: productCode } } } }),
      this.db.userTemplateLicense.groupBy({
        by: ['package_id'],
        where: { deleted_at: null, package: { product_code: productCode } },
        _count: { package_id: true },
      }),
    ]);
    const packages = await this.db.package.findMany({ where: { id: { in: packageDistribution.map((item) => item.package_id) } } });

    return {
      ...summary,
      comingSoon: false,
      invitationsByStatus: { published, draft, archived },
      rsvps,
      visits,
      packageDistribution: packageDistribution.map((item) => ({
        packageId: item.package_id,
        packageName: packages.find((pkg) => pkg.id === item.package_id)?.name ?? 'Unknown package',
        total: item._count.package_id,
      })),
    };
  }

  async templates(query: AdminQuery) {
    const productCode = cleanString(query.productCode) || 'sapatamu';
    if (productCode === 'sapatamu') {
      await this.ensureSapatamuCatalog();
    }

    const { page, limit, skip } = paginate(query);
    const search = cleanString(query.search);
    const status = cleanString(query.status);
    const where: Prisma.InvitationTemplateWhereInput = {
      deleted_at: null,
      product_code: productCode,
      ...(status ? { is_active: status === 'active' } : {}),
      ...(search ? { OR: [{ name: { contains: search } }, { code: { contains: search } }, { category: { contains: search } }] } : {}),
    };
    const [items, total] = await Promise.all([
      this.db.invitationTemplate.findMany({
        where,
        skip,
        take: limit,
        orderBy: normalizeSort(query.sort, { created_at: 'desc' }),
        include: {
          template_assets: { where: { deleted_at: null }, orderBy: { sort_order: 'asc' } },
          _count: { select: { invitations: true, package_template_access: true, editor_layout_templates: true } },
        },
      }),
      this.db.invitationTemplate.count({ where }),
    ]);
    return this.listResponse(items, total, page, limit);
  }

  async upsertTemplate(payload: Record<string, unknown>, ctx: AuditContext, id?: string) {
    const data = {
      product_code: cleanString(payload.productCode) || cleanString(payload.product_code) || 'sapatamu',
      code: cleanString(payload.code),
      name: cleanString(payload.name),
      category: cleanString(payload.category) || null,
      description: cleanString(payload.description) || null,
      preview_image_url: cleanString(payload.previewImageUrl) || cleanString(payload.preview_image_url) || null,
      metadata: parseJsonObject(payload.metadata) as Prisma.InputJsonValue,
      is_active: typeof payload.isActive === 'boolean' ? payload.isActive : typeof payload.is_active === 'boolean' ? payload.is_active : true,
    };
    if (!data.code || !data.name) throw new BadRequestException('Code dan name template wajib diisi.');
    await this.ensureProducts();

    if (id) {
      const before = await this.db.invitationTemplate.findFirst({ where: { id, deleted_at: null } });
      if (!before) throw new NotFoundException('Template tidak ditemukan');
      const updated = await this.db.invitationTemplate.update({ where: { id }, data });
      await this.audit(ctx, 'template.update', 'invitation_template', id, before, updated);
      return updated;
    }

    const created = await this.db.invitationTemplate.create({ data });
    await this.audit(ctx, 'template.create', 'invitation_template', created.id, null, created);
    return created;
  }

  async templateAssets(templateId: string, query: AdminQuery) {
    const template = await this.db.invitationTemplate.findFirst({ where: { id: templateId, deleted_at: null } });
    if (!template) throw new NotFoundException('Template tidak ditemukan');
    const where: Prisma.TemplateAssetWhereInput = {
      template_id: templateId,
      deleted_at: null,
      ...(query.status ? { is_active: query.status === 'active' } : {}),
    };
    return this.db.templateAsset.findMany({ where, orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }] });
  }

  async templateEditor(templateId: string) {
    const template = await this.db.invitationTemplate.findFirst({
      where: { id: templateId, deleted_at: null },
      include: {
        template_assets: { where: { deleted_at: null }, orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }] },
      },
    });
    if (!template) throw new NotFoundException('Template tidak ditemukan');

    const tierCategory = this.getTemplateTier(template);
    const packageFeatures = buildEditorPackageFeatures(tierCategory);
    const profiles = this.getTemplatePreviewProfiles();
    const events = this.getTemplatePreviewEvents();
    const layouts = await this.buildTemplateLayoutCatalog({ template, tierCategory });
    const pages = layouts.map((layout, index) => ({
      ...createEditorPageFromCatalog({
        layout,
        uniqueId: index + 1,
        source: layout.defaultVisible ? 'base' : 'addon',
        packageFeatures,
      }),
      isActive: layout.defaultVisible,
    }));
    const baseDocument = buildContentFromDraft({
      themeId: template.code,
      profiles,
      events,
      basePhotoQuota: 20,
      requiredTierCategory: tierCategory,
    });
    const previewDocument = this.applyTemplateAssetDefaults(
      {
        ...baseDocument,
        editor: {
          ...baseDocument.editor,
          pages,
          layoutCatalogSnapshot: layouts,
          packageFeatures,
        },
      },
      template.template_assets,
    );

    return {
      template,
      assets: template.template_assets,
      layouts,
      previewDocument,
      catalog: {
        layouts,
        fonts: SAPATAMU_EDITOR_FONT_CATALOG,
        featureGates: buildEditorFeatureGates(packageFeatures, layouts),
        media: template.template_assets.map((asset) => ({
          id: asset.id,
          url: asset.url,
          fileName: asset.file_name,
          sortOrder: asset.sort_order,
          mediaType: String(asset.asset_type),
        })),
      },
    };
  }

  async getTemplateDemoPreview(templateId: string) {
    const template = await this.db.invitationTemplate.findFirst({
      where: { id: templateId, deleted_at: null },
      include: {
        template_assets: { where: { deleted_at: null }, orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }] },
      },
    });
    if (!template) throw new NotFoundException('Template tidak ditemukan');

    const globalSettings = await this.getSapatamuGlobalDemoPreviewSettings();
    const expectedSlug = buildSapatamuDemoPreviewSlug(template.code);
    const slugRow = await this.db.invitationSlug.findUnique({
      where: { slug: expectedSlug },
      include: { invitation: true },
    });
    const invitation = slugRow && !slugRow.deleted_at && !slugRow.invitation.deleted_at ? slugRow.invitation : null;
    const settings = this.buildTemplateDemoPreviewSettings(globalSettings, template.code, invitation?.id ?? null);

    return {
      templateId: template.id,
      templateCode: template.code,
      settings,
      publicUrl: `/${expectedSlug}`,
      canOpenPublic: Boolean(invitation && settings.enabled && invitation.status === 'published'),
    };
  }

  async saveTemplateDemoPreview(templateId: string, payload: Record<string, unknown>, ctx: AuditContext) {
    return this.saveSapatamuGlobalDemoPreview(payload, ctx, templateId);
  }

  async getSapatamuGlobalDemoPreview(currentTemplateId?: string) {
    const product = await this.getSapatamuProduct();
    const settings = normalizeSapatamuGlobalDemoPreviewSettings(parseJsonObject(parseJsonObject(product.config_json).demoPreview));
    const template = currentTemplateId
      ? await this.db.invitationTemplate.findFirst({ where: { id: currentTemplateId, deleted_at: null } })
      : null;
    const publicUrl = template ? `/${buildSapatamuDemoPreviewSlug(template.code)}` : '';

    return {
      productCode: 'sapatamu',
      templateId: template?.id ?? null,
      templateCode: template?.code ?? null,
      settings,
      publicUrl,
      canOpenPublic: template
        ? Boolean(await this.db.invitationSlug.findUnique({
            where: { slug: buildSapatamuDemoPreviewSlug(template.code) },
            include: { invitation: true },
          }).then((row) => row && !row.deleted_at && !row.invitation.deleted_at && row.invitation.status === 'published' && settings.enabled))
        : false,
    };
  }

  private async prepareDemoPreview(template: {
    id: string;
    code: string;
    name: string;
    metadata?: unknown;
    template_assets?: Array<{ asset_type: unknown; asset_key: string; url: string; metadata: unknown; is_active: boolean; sort_order: number }>;
  }, globalSettings: SapatamuGlobalDemoPreviewSettings) {
    const settings = this.buildTemplateDemoPreviewSettings(globalSettings, template.code);
    const document = await this.buildDemoPreviewDocument(template, settings);
    const primaryEvent = settings.events.find((event) => event.enabled) ?? settings.events[0];
    const eventDate = combineDateTime(primaryEvent?.date ?? '', primaryEvent?.timeStart ?? '');
    const groom = settings.profiles[0];
    const bride = settings.profiles[1];

    return {
      template,
      settings,
      document,
      eventDate,
      title: `Demo ${template.name}: ${groom.nickName || groom.fullName} & ${bride.nickName || bride.fullName}`,
      groom,
      bride,
    };
  }

  async saveSapatamuGlobalDemoPreview(payload: Record<string, unknown>, ctx: AuditContext, currentTemplateId?: string) {
    const product = await this.getSapatamuProduct();
    const beforeConfig = parseJsonObject(product.config_json);
    const currentSettings = normalizeSapatamuGlobalDemoPreviewSettings(parseJsonObject(beforeConfig.demoPreview));
    const settings = normalizeSapatamuGlobalDemoPreviewSettings(payload, currentSettings);
    const ownerUserId = await this.getDemoOwnerUserId(ctx);
    const templates = await this.db.invitationTemplate.findMany({
      where: { product_code: 'sapatamu', deleted_at: null, is_active: true },
      include: {
        template_assets: { where: { deleted_at: null }, orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }] },
      },
      orderBy: { created_at: 'asc' },
    });
    const prepared = await Promise.all(templates.map((template) => this.prepareDemoPreview(template, settings)));

    const saved = await this.db.$transaction(async (tx) => {
      const previewByTemplateId: Record<string, { invitationId: string; slug: string; publicUrl: string }> = {};

      for (const item of prepared) {
        const existingSlug = await tx.invitationSlug.findUnique({
          where: { slug: item.settings.slug },
          include: {
            invitation: {
              include: {
                invitation_contents: {
                  where: { deleted_at: null, is_current: true },
                  take: 1,
                },
              },
            },
          },
        });
        const currentContent = existingSlug?.invitation.invitation_contents[0]?.content_json as Record<string, unknown> | undefined;
        const currentWeddingData = parseJsonObject(currentContent?.weddingData);
        const isExistingDemo = currentWeddingData.isDemoPreview === true;
        if (existingSlug && existingSlug.invitation.template_id !== item.template.id && !isExistingDemo) {
          throw new BadRequestException(`Slug ${item.settings.slug} sudah digunakan undangan lain.`);
        }

        const invitation = existingSlug
          ? await tx.invitation.update({
            where: { id: existingSlug.invitation_id },
            data: {
              user_id: ownerUserId,
              template_id: item.template.id,
              title: item.title,
              groom_name: item.groom.fullName || null,
              bride_name: item.bride.fullName || null,
              event_date: item.eventDate,
              status: settings.enabled ? 'published' : 'draft',
              published_at: settings.enabled ? new Date() : null,
              deleted_at: null,
            },
          })
        : await tx.invitation.create({
            data: {
              user_id: ownerUserId,
              template_id: item.template.id,
              title: item.title,
              groom_name: item.groom.fullName || null,
              bride_name: item.bride.fullName || null,
              event_date: item.eventDate,
              status: settings.enabled ? 'published' : 'draft',
              published_at: settings.enabled ? new Date() : null,
            },
          });

        await tx.invitationSlug.updateMany({
          where: { invitation_id: invitation.id, deleted_at: null, is_primary: true },
          data: { is_primary: false },
        });
        if (existingSlug) {
          await tx.invitationSlug.update({
            where: { id: existingSlug.id },
            data: { invitation_id: invitation.id, is_primary: true, deleted_at: null },
          });
        } else {
          await tx.invitationSlug.create({
            data: {
              invitation_id: invitation.id,
              slug: item.settings.slug,
              is_primary: true,
              created_by: 'admin',
            },
          });
        }

        await tx.invitationContent.updateMany({
          where: { invitation_id: invitation.id, deleted_at: null, is_current: true },
          data: { is_current: false },
        });
        const latest = await tx.invitationContent.findFirst({
          where: { invitation_id: invitation.id, deleted_at: null },
          orderBy: { version: 'desc' },
        });
        await tx.invitationContent.create({
          data: {
            invitation_id: invitation.id,
            version: (latest?.version ?? 0) + 1,
            content_json: item.document as Prisma.InputJsonValue,
            is_current: true,
            updated_by_user_id: ownerUserId,
          },
        });

        await tx.invitationMedia.updateMany({
          where: { invitation_id: invitation.id, deleted_at: null },
          data: { deleted_at: new Date() },
        });
        const mediaUrls = [...settings.profiles.map((profile) => profile.photoUrl), ...settings.galleryImageUrls]
          .map((url) => cleanString(url))
          .filter(Boolean);
        for (const [index, url] of mediaUrls.entries()) {
          await tx.invitationMedia.create({
            data: {
              invitation_id: invitation.id,
              media_type: 'image',
              url,
              file_name: url.split('/').pop() ?? null,
              sort_order: index,
              metadata: { source: 'demo-preview' } as Prisma.InputJsonValue,
            },
          });
        }

        previewByTemplateId[item.template.id] = {
          invitationId: invitation.id,
          slug: item.settings.slug,
          publicUrl: `/${item.settings.slug}`,
        };
      }

      const nextConfig = {
        ...beforeConfig,
        demoPreview: settings,
      };
      const updatedProduct = await tx.platformProduct.update({
        where: { code: 'sapatamu' },
        data: { config_json: nextConfig as Prisma.InputJsonValue },
      });

      return { updatedProduct, previewByTemplateId };
    });

    await this.audit(ctx, 'sapatamu.demo_preview.update', 'platform_product', product.id, product, saved.updatedProduct);
    const currentTemplate = currentTemplateId ? templates.find((template) => template.id === currentTemplateId) : templates[0];
    const currentPreview = currentTemplate ? saved.previewByTemplateId[currentTemplate.id] : null;

    return {
      productCode: 'sapatamu',
      templateId: currentTemplate?.id ?? null,
      templateCode: currentTemplate?.code ?? null,
      settings,
      publicUrl: currentPreview?.publicUrl ?? (currentTemplate ? `/${buildSapatamuDemoPreviewSlug(currentTemplate.code)}` : ''),
      canOpenPublic: settings.enabled && Boolean(currentPreview),
      previews: saved.previewByTemplateId,
    };
  }

  async uploadSapatamuDemoPreviewAsset(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File belum dipilih.');
    return {
      url: toUploadUrl(file.path),
      fileName: file.originalname,
      size: file.size,
      mime: file.mimetype,
    };
  }

  async saveTemplateEditorDefaults(templateId: string, payload: Record<string, unknown>, ctx: AuditContext) {
    const before = await this.db.invitationTemplate.findFirst({ where: { id: templateId, deleted_at: null } });
    if (!before) throw new NotFoundException('Template tidak ditemukan');

    const metadata = {
      ...parseJsonObject(before.metadata),
      editorDefaults: parseJsonObject(payload.editorDefaults ?? payload.editor_defaults),
    };
    const updated = await this.db.invitationTemplate.update({
      where: { id: templateId },
      data: { metadata: metadata as Prisma.InputJsonValue },
    });
    await this.audit(ctx, 'template.editor_defaults.update', 'invitation_template', templateId, before, updated);
    return updated;
  }

  async saveTemplateEditorLayout(
    templateId: string,
    layoutCode: string,
    payload: Record<string, unknown>,
    ctx: AuditContext,
  ) {
    const template = await this.db.invitationTemplate.findFirst({ where: { id: templateId, deleted_at: null } });
    if (!template) throw new NotFoundException('Template tidak ditemukan');

    const tierCategory = this.getTemplateTier(template);
    const fallback = (await this.buildTemplateLayoutCatalog({ template, tierCategory })).find(
      (item) => item.layoutCode === layoutCode,
    );
    if (!fallback) throw new NotFoundException('Layout tidak ditemukan');

    const existing = await this.db.editorLayoutTemplate.findFirst({
      where: {
        template_id: templateId,
        layout_code: layoutCode,
        deleted_at: null,
      },
    });
    const data = {
      product_code: template.product_code,
      template_id: templateId,
      layout_code: layoutCode,
      family: cleanString(payload.family) || fallback.family,
      title: cleanString(payload.title) || fallback.title,
      preview_image_url: cleanString(payload.previewImageUrl) || cleanString(payload.preview_image_url) || fallback.previewImageUrl || null,
      default_data_json: parseJsonObject(payload.defaultDataJson ?? payload.default_data_json, fallback.defaultPageData) as Prisma.InputJsonValue,
      required_feature_code: cleanString(payload.requiredFeatureCode) || fallback.requiredFeatureCode,
      max_instances: Number(payload.maxInstances ?? payload.max_instances ?? fallback.maxInstances),
      sort_order: Number(payload.sortOrder ?? payload.sort_order ?? fallback.sortOrder),
      supports_preview_selection:
        typeof payload.supportsPreviewSelection === 'boolean'
          ? payload.supportsPreviewSelection
          : fallback.supportsPreviewSelection,
      is_active: typeof payload.isActive === 'boolean' ? payload.isActive : true,
    };

    const saved = existing
      ? await this.db.editorLayoutTemplate.update({ where: { id: existing.id }, data })
      : await this.db.editorLayoutTemplate.create({ data });
    await this.audit(
      ctx,
      existing ? 'template.editor_layout.update' : 'template.editor_layout.create',
      'editor_layout_template',
      saved.id,
      existing,
      saved,
    );
    return saved;
  }

  async createAsset(templateId: string, payload: Record<string, unknown>, ctx: AuditContext) {
    const template = await this.db.invitationTemplate.findFirst({ where: { id: templateId, deleted_at: null } });
    if (!template) throw new NotFoundException('Template tidak ditemukan');
    const data = this.normalizeAssetPayload(payload, template.product_code, templateId);
    const created = await this.db.templateAsset.create({ data: data as never });
    await this.audit(ctx, 'template_asset.create', 'template_asset', created.id, null, created);
    return created;
  }

  async updateAsset(assetId: string, payload: Record<string, unknown>, ctx: AuditContext) {
    const before = await this.db.templateAsset.findFirst({ where: { id: assetId, deleted_at: null } });
    if (!before) throw new NotFoundException('Asset tidak ditemukan');
    const updated = await this.db.templateAsset.update({
      where: { id: assetId },
      data: this.normalizeAssetPayload(payload, before.product_code, before.template_id ?? undefined, true) as never,
    });
    await this.audit(ctx, 'template_asset.update', 'template_asset', assetId, before, updated);
    return updated;
  }

  async deleteAsset(assetId: string, ctx: AuditContext) {
    const before = await this.db.templateAsset.findFirst({ where: { id: assetId, deleted_at: null } });
    if (!before) throw new NotFoundException('Asset tidak ditemukan');
    const updated = await this.db.templateAsset.update({ where: { id: assetId }, data: { deleted_at: new Date(), is_active: false } });
    await this.audit(ctx, 'template_asset.delete', 'template_asset', assetId, before, updated);
    return { id: assetId, deleted: true };
  }

  private normalizeAssetPayload(payload: Record<string, unknown>, productCode: string, templateId?: string, partial = false) {
    const data: Record<string, unknown> = {
      product_code: cleanString(payload.productCode) || cleanString(payload.product_code) || productCode,
      template_id: templateId ?? null,
      asset_type: cleanString(payload.assetType) || cleanString(payload.asset_type),
      asset_key: cleanString(payload.assetKey) || cleanString(payload.asset_key),
      url: cleanString(payload.url),
      file_name: cleanString(payload.fileName) || cleanString(payload.file_name) || null,
      metadata: parseJsonObject(payload.metadata) as Prisma.InputJsonValue,
      sort_order: Number(payload.sortOrder ?? payload.sort_order ?? 0),
      is_active: typeof payload.isActive === 'boolean' ? payload.isActive : typeof payload.is_active === 'boolean' ? payload.is_active : true,
    };
    if (partial) {
      Object.keys(data).forEach((key) => {
        if (data[key] === '' || data[key] === undefined) delete data[key];
      });
      return data;
    }
    if (!data.asset_type || !data.asset_key || !data.url) throw new BadRequestException('assetType, assetKey, dan url wajib diisi.');
    return data;
  }

  async layouts(query: AdminQuery) {
    const { page, limit, skip } = paginate(query);
    const search = cleanString(query.search);
    const where: Prisma.EditorLayoutTemplateWhereInput = {
      deleted_at: null,
      product_code: cleanString(query.productCode) || 'sapatamu',
      ...(query.status ? { is_active: query.status === 'active' } : {}),
      ...(search ? { OR: [{ title: { contains: search } }, { layout_code: { contains: search } }, { family: { contains: search } }] } : {}),
    };
    const [items, total] = await Promise.all([
      this.db.editorLayoutTemplate.findMany({ where, skip, take: limit, orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }] }),
      this.db.editorLayoutTemplate.count({ where }),
    ]);
    return this.listResponse(items, total, page, limit);
  }

  async upsertLayout(payload: Record<string, unknown>, ctx: AuditContext, id?: string) {
    const data = {
      product_code: cleanString(payload.productCode) || cleanString(payload.product_code) || 'sapatamu',
      template_id: cleanString(payload.templateId) || cleanString(payload.template_id) || null,
      layout_code: cleanString(payload.layoutCode) || cleanString(payload.layout_code),
      family: cleanString(payload.family),
      title: cleanString(payload.title),
      preview_image_url: cleanString(payload.previewImageUrl) || cleanString(payload.preview_image_url) || null,
      default_data_json: parseJsonObject(payload.defaultDataJson ?? payload.default_data_json) as Prisma.InputJsonValue,
      required_feature_code: cleanString(payload.requiredFeatureCode) || cleanString(payload.required_feature_code) || null,
      max_instances: payload.maxInstances === null || payload.max_instances === null ? null : Number(payload.maxInstances ?? payload.max_instances ?? 1),
      sort_order: Number(payload.sortOrder ?? payload.sort_order ?? 0),
      supports_preview_selection:
        typeof payload.supportsPreviewSelection === 'boolean'
          ? payload.supportsPreviewSelection
          : typeof payload.supports_preview_selection === 'boolean'
            ? payload.supports_preview_selection
            : true,
      is_active: typeof payload.isActive === 'boolean' ? payload.isActive : typeof payload.is_active === 'boolean' ? payload.is_active : true,
    };
    if (!data.layout_code || !data.family || !data.title) throw new BadRequestException('layoutCode, family, dan title wajib diisi.');
    await this.ensureProducts();

    if (id) {
      const before = await this.db.editorLayoutTemplate.findFirst({ where: { id, deleted_at: null } });
      if (!before) throw new NotFoundException('Layout tidak ditemukan');
      const updated = await this.db.editorLayoutTemplate.update({ where: { id }, data });
      await this.audit(ctx, 'layout.update', 'editor_layout_template', id, before, updated);
      return updated;
    }
    const created = await this.db.editorLayoutTemplate.create({ data });
    await this.audit(ctx, 'layout.create', 'editor_layout_template', created.id, null, created);
    return created;
  }

  async packages(query: AdminQuery) {
    const { page, limit, skip } = paginate(query);
    const search = cleanString(query.search);
    const where: Prisma.PackageWhereInput = {
      deleted_at: null,
      ...(query.productCode ? { product_code: query.productCode } : {}),
      ...(query.status ? { is_active: query.status === 'active' } : {}),
      ...(search ? { OR: [{ name: { contains: search } }, { code: { contains: search } }] } : {}),
    };
    const [items, total] = await Promise.all([
      this.db.package.findMany({ where, skip, take: limit, orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }] }),
      this.db.package.count({ where }),
    ]);
    return this.listResponse(items, total, page, limit);
  }

  async upsertPackage(payload: Record<string, unknown>, ctx: AuditContext, id?: string) {
    const data = {
      product_code: cleanString(payload.productCode) || cleanString(payload.product_code) || 'sapatamu',
      code: cleanString(payload.code),
      name: cleanString(payload.name),
      description: cleanString(payload.description) || null,
      price: Number(payload.price ?? 0),
      currency: cleanString(payload.currency) || 'IDR',
      package_type: cleanString(payload.packageType) || cleanString(payload.package_type) || 'base',
      features_json: parseJsonObject(payload.featuresJson ?? payload.features_json) as Prisma.InputJsonValue,
      is_active: typeof payload.isActive === 'boolean' ? payload.isActive : typeof payload.is_active === 'boolean' ? payload.is_active : true,
      sort_order: Number(payload.sortOrder ?? payload.sort_order ?? 0),
    };
    if (!data.code || !data.name || data.price < 0) throw new BadRequestException('Code, name, dan price package wajib valid.');
    await this.ensureProducts();

    if (id) {
      const before = await this.db.package.findFirst({ where: { id, deleted_at: null } });
      if (!before) throw new NotFoundException('Package tidak ditemukan');
      const updated = await this.db.package.update({ where: { id }, data: data as never });
      await this.audit(ctx, 'package.update', 'package', id, before, updated);
      return updated;
    }
    const created = await this.db.package.create({ data: data as never });
    await this.audit(ctx, 'package.create', 'package', created.id, null, created);
    return created;
  }

  async vouchers(query: AdminQuery) {
    const { page, limit, skip } = paginate(query);
    const search = cleanString(query.search);
    const where: Prisma.VoucherWhereInput = {
      deleted_at: null,
      ...(query.productCode ? { product_code: query.productCode } : {}),
      ...(query.status ? { is_active: query.status === 'active' } : {}),
      ...(search ? { OR: [{ code: { contains: search } }, { label: { contains: search } }] } : {}),
    };
    const [items, total] = await Promise.all([
      this.db.voucher.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { package: true, _count: { select: { redemptions: true } } },
      }),
      this.db.voucher.count({ where }),
    ]);
    return this.listResponse(items, total, page, limit);
  }

  async upsertVoucher(payload: Record<string, unknown>, ctx: AuditContext, id?: string) {
    const code = cleanString(payload.code).toUpperCase();
    const data = {
      product_code: cleanString(payload.productCode) || cleanString(payload.product_code) || 'sapatamu',
      package_id: cleanString(payload.packageId) || cleanString(payload.package_id) || null,
      code,
      label: cleanString(payload.label) || code,
      description: cleanString(payload.description) || null,
      discount_type: cleanString(payload.discountType) || cleanString(payload.discount_type) || 'percent',
      discount_value: Number(payload.discountValue ?? payload.discount_value ?? 0),
      min_order_amount: payload.minOrderAmount ?? payload.min_order_amount ? Number(payload.minOrderAmount ?? payload.min_order_amount) : null,
      max_discount_amount: payload.maxDiscountAmount ?? payload.max_discount_amount ? Number(payload.maxDiscountAmount ?? payload.max_discount_amount) : null,
      quota_total: payload.quotaTotal ?? payload.quota_total ? Number(payload.quotaTotal ?? payload.quota_total) : null,
      quota_per_user: payload.quotaPerUser ?? payload.quota_per_user ? Number(payload.quotaPerUser ?? payload.quota_per_user) : null,
      starts_at: payload.startsAt || payload.starts_at ? new Date(String(payload.startsAt ?? payload.starts_at)) : null,
      ends_at: payload.endsAt || payload.ends_at ? new Date(String(payload.endsAt ?? payload.ends_at)) : null,
      is_active: typeof payload.isActive === 'boolean' ? payload.isActive : typeof payload.is_active === 'boolean' ? payload.is_active : true,
      metadata: parseJsonObject(payload.metadata) as Prisma.InputJsonValue,
    };
    if (!data.code || data.discount_value <= 0) throw new BadRequestException('Code dan nilai diskon voucher wajib valid.');
    if (!['percent', 'fixed'].includes(data.discount_type)) throw new BadRequestException('discountType harus percent atau fixed.');

    if (id) {
      const before = await this.db.voucher.findFirst({ where: { id, deleted_at: null } });
      if (!before) throw new NotFoundException('Voucher tidak ditemukan');
      const updated = await this.db.voucher.update({ where: { id }, data: data as never });
      await this.audit(ctx, 'voucher.update', 'voucher', id, before, updated);
      return updated;
    }
    const created = await this.db.voucher.create({ data: data as never });
    await this.audit(ctx, 'voucher.create', 'voucher', created.id, null, created);
    return created;
  }

  async financeOrders(query: AdminQuery) {
    const { page, limit, skip } = paginate(query);
    const search = cleanString(query.search);
    const where: Prisma.OrderWhereInput = {
      deleted_at: null,
      ...dateWhere(query),
      ...(query.status ? { status: query.status as never } : {}),
      ...(query.productCode
        ? { order_items: { some: { package: { product_code: query.productCode }, deleted_at: null } } }
        : {}),
      ...(search
        ? {
            OR: [
              { checkout_token: { contains: search } },
              { user: { name: { contains: search } } },
              { user: { email: { contains: search } } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.db.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: normalizeSort(query.sort, { created_at: 'desc' }),
        include: {
          user: true,
          payments: { where: { deleted_at: null }, orderBy: { created_at: 'desc' } },
          order_items: { where: { deleted_at: null }, include: { package: true, template: true } },
        },
      }),
      this.db.order.count({ where }),
    ]);
    return this.listResponse(items, total, page, limit);
  }

  async financePayments(query: AdminQuery) {
    const { page, limit, skip } = paginate(query);
    const search = cleanString(query.search);
    const where: Prisma.PaymentWhereInput = {
      deleted_at: null,
      ...dateWhere(query),
      ...(query.status ? { status: query.status as never } : {}),
      ...(query.productCode
        ? { order: { order_items: { some: { package: { product_code: query.productCode }, deleted_at: null } } } }
        : {}),
      ...(search
        ? {
            OR: [
              { provider_ref: { contains: search } },
              { method: { contains: search } },
              { order: { checkout_token: { contains: search } } },
              { order: { user: { email: { contains: search } } } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.db.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: normalizeSort(query.sort, { created_at: 'desc' }),
        include: { order: { include: { user: true, order_items: { include: { package: true, template: true } } } } },
      }),
      this.db.payment.count({ where }),
    ]);
    return this.listResponse(items, total, page, limit);
  }

  async paymentDetail(id: string) {
    const payment = await this.db.payment.findFirst({
      where: { id, deleted_at: null },
      include: {
        order: {
          include: {
            user: true,
            order_items: { include: { package: true, template: true } },
            voucher_redemptions: { include: { voucher: true } },
          },
        },
      },
    });
    if (!payment) throw new NotFoundException('Payment tidak ditemukan');
    return payment;
  }

  async reconcilePayment(id: string, payload: Record<string, unknown>, ctx: AuditContext) {
    const before = await this.db.payment.findFirst({ where: { id, deleted_at: null } });
    if (!before) throw new NotFoundException('Payment tidak ditemukan');
    const status = cleanString(payload.status) || before.status;
    if (!['pending', 'paid', 'failed', 'refunded'].includes(status)) {
      throw new BadRequestException('Status payment tidak valid.');
    }
    const metadata = {
      ...parseJsonObject(before.metadata),
      adminReconcile: {
        at: new Date().toISOString(),
        providerStatus: cleanString(payload.providerStatus),
        note: cleanString(payload.note),
      },
    };
    const updated = await this.db.payment.update({
      where: { id },
      data: {
        status: status as never,
        paid_at: status === 'paid' ? (before.paid_at ?? new Date()) : before.paid_at,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });
    await this.audit(ctx, 'payment.reconcile', 'payment', id, before, updated);
    return updated;
  }

  async auditLogs(query: AdminQuery) {
    const { page, limit, skip } = paginate(query);
    const search = cleanString(query.search);
    const where: Prisma.AdminAuditLogWhereInput = {
      ...dateWhere(query),
      ...(search ? { OR: [{ action: { contains: search } }, { entity: { contains: search } }, { entity_id: { contains: search } }] } : {}),
    };
    const [items, total] = await Promise.all([
      this.db.adminAuditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { admin_user: true },
      }),
      this.db.adminAuditLog.count({ where }),
    ]);
    return this.listResponse(items, total, page, limit);
  }
}
