import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import {
  InvitationDraftStatus,
  InvitationMediaType,
  PackageType,
  PaymentStatus,
  TemplateAssetType,
  type InvitationStatus,
  type Prisma,
  type User,
} from 'generated/prisma';
import { randomBytes } from 'crypto';
import * as fs from 'fs';
import { extname, join } from 'path';
import { DatabaseService } from 'src/database/database.service';
import {
  SAPATAMU_ALBUM_ALLOWED_EXTENSIONS,
  SAPATAMU_ALBUM_ALLOWED_MIME_TYPES,
  SAPATAMU_ALBUM_MAX_SIZE_BYTES,
  SAPATAMU_EDITOR_ALLOWED_EXTENSIONS,
  SAPATAMU_EDITOR_ALLOWED_MIME_TYPES,
  SAPATAMU_EDITOR_MAX_SIZE_BYTES,
  formatUploadSize,
} from 'src/helpers/upload-policy.helper';
import { BRAND } from './workspace-brand.const';
import {
  SAPATAMU_PACKAGE_SEEDS,
  SAPATAMU_TEMPLATE_ASSET_SEEDS,
  SAPATAMU_THEME_SEEDS,
} from './sapatamu-catalog';
import {
  buildContentForThemeSwitch,
  buildContentFromDraft,
  buildDefaultDraftWizard,
  buildDraftWizardSummary,
  buildInvitationTitleFromContent,
  buildSlugCandidateFromProfiles,
  mergeContentPatch,
  migrateContentJson,
  normalizeEvents,
  normalizeProfiles,
  type DraftWizardState,
  type SapatamuEditorDocumentV3,
} from './sapatamu-content.helper';
import {
  SAPATAMU_EDITOR_FONT_CATALOG,
  applyEditorPatchOperations,
  buildEditorFeatureGates,
  buildEditorMediaTypeFromMime,
  buildEditorPackageFeatures,
  buildLayoutCatalog,
  createEditorPageFromCatalog,
  createPageFromLayoutCode,
  findLayoutByCode,
  normalizeEditorPageSlug,
  normalizeEditorState,
  type SapatamuEditorLayoutCatalogItem,
  type SapatamuEditorPage,
  type SapatamuEditorPatchOperation,
} from './sapatamu-editor.helper';

type AuthRequestUser = {
  accountId: string;
  role: string;
  data?: User | null;
};

type GuestInput = {
  id?: string;
  name?: string;
  phoneNumber?: string;
  sendStatus?: 'draft' | 'copied' | 'sent';
  lastSentAt?: string | null;
};

type TierCategory = 'basic' | 'premium' | 'vintage';

type PaymentMethod = 'qris' | 'bni_va' | 'bri_va' | 'mandiri_va' | 'bca_va' | 'bsi_va';
type CartKind = 'activation' | 'theme_add_on';

const TIER_ORDER: TierCategory[] = ['basic', 'premium', 'vintage'];
const CART_NOTE_PREFIX = 'invitation-cart:';
const CART_KIND_ACTIVATION = 'activation';
const CART_KIND_THEME_ADDON = 'theme_add_on';
const THEME_ACTIVATION_BASE_PRICE = 349000;
const THEME_ACTIVATION_SPECIAL_PRICE = 279000;
const THEME_ADDON_FIRST_PRICE = 150000;
const THEME_ADDON_SECOND_PRICE = 75000;
const SAPATAMU_MAX_ALBUM_PHOTOS = 50;
const SHARED_THEME_ACCESS_DAYS = 30;
function slugify(source: string): string {
  const base = source
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return base || 'undangan';
}

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function parseJsonObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mergeEditorElementDataWithDefaults(
  defaultValue: unknown,
  currentValue: unknown,
): unknown {
  if (
    defaultValue &&
    typeof defaultValue === 'object' &&
    !Array.isArray(defaultValue) &&
    currentValue &&
    typeof currentValue === 'object' &&
    !Array.isArray(currentValue)
  ) {
    const defaultRecord = defaultValue as Record<string, unknown>;
    const currentRecord = currentValue as Record<string, unknown>;
    const defaultType = defaultRecord.type;
    const currentType = currentRecord.type;

    if (typeof defaultType === 'string' && typeof currentType === 'string' && defaultType !== currentType) {
      return cloneJson(defaultRecord);
    }

    const next: Record<string, unknown> = cloneJson(defaultRecord);
    Object.entries(currentRecord).forEach(([key, value]) => {
      next[key] = mergeEditorElementDataWithDefaults(next[key], value);
    });
    return next;
  }

  return cloneJson(currentValue);
}

export function mergeEditorPageDataWithDefaults(
  currentData: SapatamuEditorPage['data'] | undefined,
  defaultData: Record<string, unknown>,
) {
  const next = cloneJson(defaultData) as SapatamuEditorPage['data'];
  if (!currentData || typeof currentData !== 'object') return next;

  Object.entries(currentData).forEach(([key, currentValue]) => {
    const defaultValue = defaultData[key];
    if (
      defaultValue &&
      typeof defaultValue === 'object' &&
      !Array.isArray(defaultValue) &&
      currentValue &&
      typeof currentValue === 'object' &&
      !Array.isArray(currentValue) &&
      typeof (defaultValue as { type?: unknown }).type === 'string' &&
      (defaultValue as { type?: unknown }).type === (currentValue as { type?: unknown }).type
    ) {
      next[key] = mergeEditorElementDataWithDefaults(defaultValue, currentValue);
      return;
    }

    if (defaultValue === undefined) {
      next[key] = cloneJson(currentValue);
    }
  });

  return next;
}

function combineDateTime(date: string, time: string): Date | null {
  if (!date) return null;

  const candidate = `${date}T${time || '00:00'}:00`;
  const parsed = new Date(candidate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toUploadUrl(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  const marker = '/uploads/';
  const index = normalized.lastIndexOf(marker);
  if (index === -1) {
    return `/uploads/${normalized.split('/').pop() ?? 'file'}`;
  }
  return normalized.slice(index);
}

function generateCheckoutToken(): string {
  return `rek-${Date.now()}-${randomBytes(6).toString('hex')}`;
}

function buildGuestKey(name: string): string {
  return `${slugify(name)}-${randomBytes(4).toString('hex')}`;
}

function isTierCategory(value: unknown): value is TierCategory {
  return value === 'basic' || value === 'premium' || value === 'vintage';
}

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === 'qris' || value === 'bni_va' || value === 'bri_va' || value === 'mandiri_va' || value === 'bca_va' || value === 'bsi_va';
}

function addDays(baseDate: Date, days: number): Date {
  return new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
}

export function calculateThemeActivationCheckout(params: {
  basePrice?: number;
  specialPrice?: number;
  voucherDiscountAmount?: number;
}) {
  const originalAmount = Math.max(0, Math.round(params.basePrice ?? THEME_ACTIVATION_BASE_PRICE));
  const specialPrice = Math.max(0, Math.round(params.specialPrice ?? THEME_ACTIVATION_SPECIAL_PRICE));
  const voucherDiscountAmount = Math.max(0, Math.round(params.voucherDiscountAmount ?? 0));
  const specialDiscountAmount = Math.max(0, originalAmount - specialPrice);
  const specialDiscountPercent = originalAmount > 0 ? Math.round((specialDiscountAmount / originalAmount) * 100) : 0;

  if (voucherDiscountAmount > 0) {
    const discountAmount = Math.min(originalAmount, voucherDiscountAmount);
    return {
      originalAmount,
      discountAmount,
      totalAmount: Math.max(0, originalAmount - discountAmount),
      priceMode: 'voucher' as const,
      specialDiscountPercent,
    };
  }

  return {
    originalAmount,
    discountAmount: specialDiscountAmount,
    totalAmount: specialPrice,
    priceMode: 'special' as const,
    specialDiscountPercent,
  };
}

export function buildThemeAddonCartItems(
  themes: Array<{ templateId: string; themeCode: string; themeName: string }>,
  pricing?: { firstPrice?: number; secondPrice?: number; normalPrice?: number },
) {
  const firstPrice = Math.max(0, Math.round(pricing?.firstPrice ?? THEME_ADDON_FIRST_PRICE));
  const secondPrice = Math.max(0, Math.round(pricing?.secondPrice ?? THEME_ADDON_SECOND_PRICE));
  const normalPrice = Math.max(firstPrice, Math.round(pricing?.normalPrice ?? firstPrice));

  return themes.slice(0, 2).map((theme, index) => ({
    ...theme,
    addonSlot: index + 1,
    normalPrice,
    unitPrice: index === 0 ? firstPrice : secondPrice,
  }));
}

export function sortThemeAddonOrderItemsForFulfillment<T extends { metadata?: unknown; created_at?: Date | string | null; id?: string }>(
  items: T[],
) {
  return [...items].sort((left, right) => {
    const leftMetadata = parseJsonObject(left.metadata);
    const rightMetadata = parseJsonObject(right.metadata);
    const leftSlot = toNumber(leftMetadata.addonSlot, Number.MAX_SAFE_INTEGER);
    const rightSlot = toNumber(rightMetadata.addonSlot, Number.MAX_SAFE_INTEGER);
    if (leftSlot !== rightSlot) return leftSlot - rightSlot;

    const leftCreatedAt = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightCreatedAt = right.created_at ? new Date(right.created_at).getTime() : 0;
    if (leftCreatedAt !== rightCreatedAt) return leftCreatedAt - rightCreatedAt;

    return cleanString(left.id).localeCompare(cleanString(right.id));
  });
}

export function isInvitationThemeAccessActive(
  access: {
    starts_at?: Date | null;
    expires_at?: Date | null;
    revoked_at?: Date | null;
    deleted_at?: Date | null;
  },
  now = new Date(),
) {
  if (access.revoked_at || access.deleted_at) return false;
  if (access.starts_at && access.starts_at.getTime() > now.getTime()) return false;
  if (access.expires_at && access.expires_at.getTime() <= now.getTime()) return false;
  return true;
}

@Injectable()
export class SapatamuService {
  private catalogReady = false;

  constructor(private readonly db: DatabaseService) {}

  private async getCurrentUser(authUser: AuthRequestUser): Promise<User> {
    if (authUser.data?.id) {
      return authUser.data;
    }

    const user = await this.db.user.findFirst({
      where: {
        account_id: authUser.accountId,
        deleted_at: null,
      },
    });

    if (!user) {
      throw new ForbiddenException('Profil pengguna tidak ditemukan.');
    }

    return user;
  }

  async ensureCatalog() {
    if (this.catalogReady) {
      const [themes, packages] = await Promise.all([
        this.db.invitationTemplate.findMany({
          where: {
            code: { in: SAPATAMU_THEME_SEEDS.map((item) => item.code) },
            deleted_at: null,
            is_active: true,
          },
          orderBy: { created_at: 'asc' },
        }),
        this.db.package.findMany({
          where: {
            code: { in: SAPATAMU_PACKAGE_SEEDS.map((item) => item.code) },
            deleted_at: null,
            is_active: true,
          },
          orderBy: [{ sort_order: 'asc' }, { price: 'asc' }],
        }),
      ]);

      return { themes, packages };
    }

    const themeMap = new Map<string, string>();
    const packageMap = new Map<string, string>();

    for (const seed of SAPATAMU_THEME_SEEDS) {
      const template = await this.db.invitationTemplate.upsert({
        where: { code: seed.code },
        update: {
          name: seed.name,
          category: 'sapatamu',
          description: seed.description,
          preview_image_url: seed.previewImageUrl,
          metadata: seed.metadata as Prisma.InputJsonValue,
          is_active: true,
        },
        create: {
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

    const officialThemeCodes = SAPATAMU_THEME_SEEDS.map((item) => item.code);
    const fallbackTemplateId = themeMap.get('malay-ethnic-red-ruby') ?? themeMap.get(officialThemeCodes[0]);
    if (fallbackTemplateId) {
      const obsoleteTemplates = await this.db.invitationTemplate.findMany({
        where: {
          product_code: 'sapatamu',
          code: { notIn: officialThemeCodes },
          deleted_at: null,
        },
        select: { id: true },
      });
      const obsoleteTemplateIds = obsoleteTemplates.map((item) => item.id);

      if (obsoleteTemplateIds.length > 0) {
        await this.db.invitation.updateMany({
          where: { template_id: { in: obsoleteTemplateIds }, deleted_at: null },
          data: { template_id: fallbackTemplateId },
        });
        await this.db.invitationDraft.updateMany({
          where: { theme_id: { in: obsoleteTemplateIds }, deleted_at: null },
          data: { theme_id: fallbackTemplateId },
        });
        await this.db.packageTemplateAccess.updateMany({
          where: { template_id: { in: obsoleteTemplateIds }, deleted_at: null },
          data: { is_available: false, deleted_at: new Date() },
        });
        await this.db.templateAsset.updateMany({
          where: { template_id: { in: obsoleteTemplateIds }, deleted_at: null },
          data: { is_active: false, deleted_at: new Date() },
        });
        await this.db.editorLayoutTemplate.updateMany({
          where: { template_id: { in: obsoleteTemplateIds }, deleted_at: null },
          data: { is_active: false, deleted_at: new Date() },
        });
        await this.db.invitationTemplate.updateMany({
          where: { id: { in: obsoleteTemplateIds } },
          data: { is_active: false, deleted_at: new Date() },
        });
      }
    }

    for (const seed of SAPATAMU_PACKAGE_SEEDS) {
      const pkg = await this.db.package.upsert({
        where: { code: seed.code },
        update: {
          name: seed.name,
          description: seed.description,
          price: seed.price,
          currency: 'IDR',
          package_type: seed.packageType as PackageType,
          features_json: seed.featuresJson as Prisma.InputJsonValue,
          is_active: true,
          sort_order: seed.sortOrder,
        },
        create: {
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
      const packageTier = this.getTierCategoryFromPackage({
        features_json: pkg.featuresJson as Prisma.JsonValue,
      });

      for (const theme of SAPATAMU_THEME_SEEDS) {
        const templateId = themeMap.get(theme.code);
        if (!templateId) continue;
        const themeTier = isTierCategory(theme.metadata.tierCategory)
          ? theme.metadata.tierCategory
          : 'basic';
        const isAvailable =
          this.getPackageRank(packageTier) >= this.getPackageRank(themeTier);

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

    const [themes, packages] = await Promise.all([
      this.db.invitationTemplate.findMany({
        where: {
          code: { in: SAPATAMU_THEME_SEEDS.map((item) => item.code) },
          deleted_at: null,
          is_active: true,
        },
        orderBy: { created_at: 'asc' },
      }),
      this.db.package.findMany({
        where: {
          code: { in: SAPATAMU_PACKAGE_SEEDS.map((item) => item.code) },
          deleted_at: null,
          is_active: true,
        },
        orderBy: [{ sort_order: 'asc' }, { price: 'asc' }],
      }),
    ]);

    this.catalogReady = true;

    return { themes, packages };
  }

  private async assertSlugAvailability(
    slug: string,
    options?: { excludeDraftId?: string; excludeInvitationId?: string },
  ): Promise<void> {
    const normalized = slugify(slug);

    const [slugRow, draftRow] = await Promise.all([
      this.db.invitationSlug.findFirst({
        where: {
          slug: normalized,
          deleted_at: null,
          invitation_id: options?.excludeInvitationId
            ? { not: options.excludeInvitationId }
            : undefined,
        },
      }),
      this.db.invitationDraft.findFirst({
        where: {
          slug_candidate: normalized,
          deleted_at: null,
          status: {
            in: [InvitationDraftStatus.in_progress, InvitationDraftStatus.pending_payment],
          },
          id: options?.excludeDraftId ? { not: options.excludeDraftId } : undefined,
        },
      }),
    ]);

    if (slugRow || draftRow) {
      throw new BadRequestException('Link undangan tersebut sudah digunakan. Silakan pilih link lain.');
    }
  }

  private async getOwnedDraft(userId: string, draftId: string) {
    const draft = await this.db.invitationDraft.findFirst({
      where: {
        id: draftId,
        user_id: userId,
        deleted_at: null,
      },
      include: {
        theme: true,
        selected_package: true,
      },
    });

    if (!draft) {
      throw new NotFoundException('Draft undangan tidak ditemukan.');
    }

    return draft;
  }

  private async getOwnedInvitation(userId: string, invitationId: string) {
    const invitation = await this.db.invitation.findFirst({
      where: {
        id: invitationId,
        user_id: userId,
        deleted_at: null,
      },
      include: {
        license: {
          include: {
            package: true,
            order_item: {
              include: {
                order: {
                  include: {
                    payments: true,
                  },
                },
              },
            },
          },
        },
        template: true,
        invitation_theme_accesses: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Undangan tidak ditemukan.');
    }

    return invitation;
  }

  private async getCurrentContent(invitationId: string) {
    const record = await this.db.invitationContent.findFirst({
      where: {
        invitation_id: invitationId,
        is_current: true,
        deleted_at: null,
      },
      orderBy: { version: 'desc' },
    });

    return {
      record,
      content: migrateContentJson(record?.content_json),
    };
  }

  private async getInvitationFeatureGrants(invitationId: string) {
    return this.db.invitationFeatureGrant.findMany({
      where: {
        invitation_id: invitationId,
        deleted_at: null,
      },
    });
  }

  private getBasePhotoQuota(packageRecord?: { features_json?: Prisma.JsonValue | null }): number {
    return SAPATAMU_MAX_ALBUM_PHOTOS;
  }

  private getEditAccessDays(packageRecord?: { features_json?: Prisma.JsonValue | null }): number {
    const features = parseJsonObject(packageRecord?.features_json);
    return Math.max(0, toNumber(features.editAccessDays, 30));
  }

  private getActiveDays(packageRecord?: { features_json?: Prisma.JsonValue | null }): number | null {
    const features = parseJsonObject(packageRecord?.features_json);
    if (features.activeDays === null) {
      return null;
    }

    const days = toNumber(features.activeDays, 0);
    return days > 0 ? days : null;
  }

  private isLifetimeActive(packageRecord?: { features_json?: Prisma.JsonValue | null }): boolean {
    const features = parseJsonObject(packageRecord?.features_json);
    return Boolean(features.lifetimeActive);
  }

  private getTierCategoryFromTheme(theme?: { metadata?: Prisma.JsonValue | null }): TierCategory {
    const metadata = parseJsonObject(theme?.metadata);
    return isTierCategory(metadata.tierCategory) ? metadata.tierCategory : 'basic';
  }

  private isThemeComingSoon(theme?: { metadata?: Prisma.JsonValue | null }): boolean {
    const metadata = parseJsonObject(theme?.metadata);
    if (metadata.releaseStatus === 'comingSoon') return true;
    if (metadata.releaseStatus === 'available') return false;
    return this.getTierCategoryFromTheme(theme) !== 'premium';
  }

  private assertThemeAvailableForSelection(theme?: { metadata?: Prisma.JsonValue | null }) {
    if (this.isThemeComingSoon(theme)) {
      throw new BadRequestException('Tema Signature sedang coming soon. Silakan pilih tema Luxury.');
    }
  }

  private getTierCategoryFromPackage(
    packageRecord?: { features_json?: Prisma.JsonValue | null },
  ): TierCategory {
    const features = parseJsonObject(packageRecord?.features_json);
    return isTierCategory(features.tierCategory) ? features.tierCategory : 'basic';
  }

  private getTemplateAssetSlot(asset: {
    asset_key: string;
    metadata?: Prisma.JsonValue | null;
  }): string {
    const metadata = parseJsonObject(asset.metadata);
    return cleanString(metadata.slot) || cleanString(asset.asset_key.split('.').pop());
  }

  private assetBackgroundType(url: string): 'image' | 'video' {
    return /\.(mp4|webm|mov)$/i.test(url) ? 'video' : 'image';
  }

  private applyCornerAsset(
    content: SapatamuEditorDocumentV3,
    slot: string,
    url: string,
    metadata: Record<string, unknown>,
    enabled: boolean,
  ) {
    const animation = parseJsonObject(metadata.animation);
    const applyToList = (list: Array<{ type: string; disabled: boolean; url: string; animation: { style: number; duration: number } }>) => {
      const corner = list.find((item) => item.type === slot);
      if (!corner) return;
      corner.disabled = !enabled;
      corner.url = url;
      corner.animation = {
        ...corner.animation,
        style: toNumber(animation.style, corner.animation.style),
        duration: toNumber(animation.duration, corner.animation.duration),
      };
    };

    applyToList(content.editor.cornerElements.list);
    content.editor.pages.forEach((page) => applyToList(page.data.cornerElements.list));

    const gradient = parseJsonObject(metadata.gradient);
    const blend = parseJsonObject(metadata.blend);
    content.editor.cornerElements.style = {
      ...content.editor.cornerElements.style,
      opacity: toNumber(metadata.opacity, content.editor.cornerElements.style.opacity),
      gradient: {
        ...content.editor.cornerElements.style.gradient,
        ...(cleanString(gradient.from) ? { from: cleanString(gradient.from), disabled: false } : {}),
        ...(cleanString(gradient.to) ? { to: cleanString(gradient.to), disabled: false } : {}),
      },
      blend: {
        ...content.editor.cornerElements.style.blend,
        ...(cleanString(blend.mode) ? { mode: cleanString(blend.mode), disabled: false } : {}),
      },
    };
    content.editor.pages.forEach((page) => {
      page.data.cornerElements.style = content.editor.cornerElements.style;
    });
  }

  private applyFrameAsset(content: SapatamuEditorDocumentV3, url: string, enabled: boolean) {
    content.editor.pages.forEach((page) => {
      Object.values(page.data).forEach((value) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return;
        const element = value as { type?: string; frame?: { disabled: boolean; content: string } };
        if (element.type !== 'image' || !element.frame) return;
        const usesTemplateFrame = element.frame.disabled === false || Boolean(cleanString(element.frame.content));
        if (!usesTemplateFrame) return;
        element.frame.disabled = !enabled;
        element.frame.content = url;
      });
    });
  }

  private applyTemplateAssets(
    content: SapatamuEditorDocumentV3,
    assets: Array<{
      asset_type: string;
      asset_key: string;
      url: string;
      metadata?: Prisma.JsonValue | null;
      is_active: boolean;
    }>,
  ): SapatamuEditorDocumentV3 {
    const nextContent = JSON.parse(JSON.stringify(content)) as SapatamuEditorDocumentV3;

    assets
      .filter((asset) => asset.is_active && cleanString(asset.url))
      .forEach((asset) => {
        const metadata = parseJsonObject(asset.metadata);
        const enabled = metadata.enabled !== false;
        const slot = this.getTemplateAssetSlot(asset);

        if (asset.asset_type === 'preview') {
          nextContent.meta.imageUrl = asset.url;
          const opening = nextContent.editor.pages.find((page) => page.family === 'opening');
          const image = opening?.data.image1 as { type?: string; content?: string } | undefined;
          if (image?.type === 'image') image.content = asset.url;
        }

        if (asset.asset_type === 'background') {
          if (slot === 'global') {
            nextContent.editor.globalBackground = asset.url;
            nextContent.editor.globalBackgroundDetails.type = this.assetBackgroundType(asset.url);
          } else {
            nextContent.editor.pages
              .filter((page) => page.family === slot || page.layoutCode.endsWith(`-${slot}`))
              .forEach((page) => {
                page.data.background = asset.url;
                page.data.backgroundDetails.type = this.assetBackgroundType(asset.url);
              });
          }
        }

        if (asset.asset_type === 'video') {
          nextContent.editor.pages
            .filter((page) => page.family === slot || page.layoutCode.endsWith(`-${slot}`))
            .forEach((page) => {
              page.data.background = asset.url;
              page.data.backgroundDetails.type = 'video';
            });
        }

        if (asset.asset_type === 'ornament') {
          this.applyCornerAsset(nextContent, slot, asset.url, metadata, enabled);
        }

        if (asset.asset_type === 'frame') {
          this.applyFrameAsset(nextContent, asset.url, enabled);
        }

        if (asset.asset_type === 'music' && nextContent.musicSettings.mode === 'none') {
          nextContent.musicSettings = { mode: 'library', value: asset.url };
          nextContent.weddingData.bgmUrl = asset.url;
        }
      });

    return nextContent;
  }

  private async applyTemplateAssetsFromDb(
    templateId: string,
    content: SapatamuEditorDocumentV3,
  ): Promise<SapatamuEditorDocumentV3> {
    const assets = await this.db.templateAsset.findMany({
      where: {
        template_id: templateId,
        deleted_at: null,
        is_active: true,
      },
      orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    });

    return this.applyTemplateAssets(content, assets);
  }

  private getPackageRank(category: TierCategory): number {
    return TIER_ORDER.indexOf(category);
  }

  private getActivationStartDate(invitation: {
    published_at?: Date | null;
    license?: { activated_at?: Date | null } | null;
  }): Date | null {
    return invitation.published_at ?? invitation.license?.activated_at ?? null;
  }

  private calculateCountdownWindow(params: {
    invitation: {
      status: InvitationStatus;
      published_at?: Date | null;
      license?: { activated_at?: Date | null; package?: { features_json?: Prisma.JsonValue | null } | null } | null;
    };
    featureCode: 'edit_access_days' | 'active_window';
    featureGrants?: Array<{ feature_code: string; quantity: number; deleted_at?: Date | null }>;
  }) {
    const activationStart = this.getActivationStartDate(params.invitation);
    const activePackage = params.invitation.license?.package ?? null;

    if (!activationStart || !activePackage) {
      return {
        status: params.invitation.status === 'published' ? 'unknown' : 'inactive',
        expiresAt: null as string | null,
        remainingDays: null as number | null,
        lifetime: false,
      };
    }

    if (params.featureCode === 'active_window' && this.isLifetimeActive(activePackage)) {
      return {
        status: 'lifetime',
        expiresAt: null as string | null,
        remainingDays: null as number | null,
        lifetime: true,
      };
    }

    const baseDays =
      params.featureCode === 'edit_access_days'
        ? this.getEditAccessDays(activePackage)
        : this.getActiveDays(activePackage) ?? 0;

    const extraDays = (params.featureGrants ?? [])
      .filter((item) => item.feature_code === params.featureCode && !item.deleted_at)
      .reduce((total, item) => total + Math.max(0, item.quantity), 0);

    const totalDays = baseDays + extraDays;
    if (totalDays <= 0) {
      return {
        status: 'expired',
        expiresAt: activationStart.toISOString(),
        remainingDays: 0,
        lifetime: false,
      };
    }

    const expiresAt = addDays(activationStart, totalDays);
    const remainingMs = expiresAt.getTime() - Date.now();
    const remainingDays = Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));

    return {
      status: remainingMs > 0 ? 'active' : 'expired',
      expiresAt: expiresAt.toISOString(),
      remainingDays,
      lifetime: false,
    };
  }

  private resolveMetaTitleTemplate(
    template: string,
    profiles: Array<{ fullName?: string | null; nickName?: string | null }>,
  ) {
    const left =
      cleanString(profiles[0]?.nickName) || cleanString(profiles[0]?.fullName) || 'Mempelai 1';
    const right =
      cleanString(profiles[1]?.nickName) || cleanString(profiles[1]?.fullName) || 'Mempelai 2';

    return template
      .replaceAll('{{nick-name-1}}', left)
      .replaceAll('{{nick-name-2}}', right)
      .replaceAll('{{full-name-1}}', cleanString(profiles[0]?.fullName) || left)
      .replaceAll('{{full-name-2}}', cleanString(profiles[1]?.fullName) || right);
  }

  private assertInvitationEditable(invitation: {
    status: InvitationStatus;
    published_at?: Date | null;
    license?: { activated_at?: Date | null; package?: { features_json?: Prisma.JsonValue | null } | null } | null;
  }, featureGrants?: Array<{ feature_code: string; quantity: number; deleted_at?: Date | null }>) {
    if (invitation.status !== 'published') {
      return;
    }

    const editWindow = this.calculateCountdownWindow({
      invitation,
      featureCode: 'edit_access_days',
      featureGrants,
    });

    if (editWindow.status === 'expired') {
      throw new ForbiddenException(
        'Masa edit undangan sudah berakhir. Tambahkan edit time untuk melanjutkan perubahan.',
      );
    }
  }

  private hasActiveThemeAccess(
    accesses: Array<{
      template_id: string;
      starts_at?: Date | null;
      expires_at?: Date | null;
      revoked_at?: Date | null;
      deleted_at?: Date | null;
    }> | undefined,
    templateId: string,
  ) {
    return (accesses ?? []).some(
      (access) => access.template_id === templateId && isInvitationThemeAccessActive(access),
    );
  }

  private async findReusableThemeAccess(userId: string, templateId: string) {
    const accesses = await this.db.invitationThemeAccess.findMany({
      where: {
        user_id: userId,
        template_id: templateId,
        access_type: { in: ['primary', 'addon_owner'] },
        revoked_at: null,
        deleted_at: null,
      },
      orderBy: { created_at: 'desc' },
    });

    return accesses.find((access) => isInvitationThemeAccessActive(access)) ?? null;
  }

  private async ensureThemeAccessForApply(params: {
    userId: string;
    invitation: Awaited<ReturnType<SapatamuService['getOwnedInvitation']>>;
    templateId: string;
  }) {
    if (this.hasActiveThemeAccess(params.invitation.invitation_theme_accesses, params.templateId)) {
      return;
    }

    const reusable = await this.findReusableThemeAccess(params.userId, params.templateId);
    if (!reusable) {
      throw new ForbiddenException('Tema ini belum dibeli. Preview tetap bisa digunakan, tetapi tema belum bisa dijadikan live.');
    }

    if (params.invitation.status !== 'published' || !params.invitation.license_id) {
      throw new ForbiddenException('Tema add-on hanya bisa digunakan di undangan lain setelah undangan tersebut aktif.');
    }

    await this.db.invitationThemeAccess.create({
      data: {
        user_id: params.userId,
        invitation_id: params.invitation.id,
        template_id: params.templateId,
        user_template_license_id: reusable.user_template_license_id,
        access_type: 'addon_shared',
        starts_at: new Date(),
        expires_at: addDays(new Date(), SHARED_THEME_ACCESS_DAYS),
      },
    });
  }

  private getMinimumPackageForTheme(
    theme: { metadata?: Prisma.JsonValue | null },
    packages: Array<{
      id: string;
      code: string;
      package_type: PackageType;
      features_json?: Prisma.JsonValue | null;
      price: Prisma.Decimal;
      name: string;
      description: string | null;
      currency: string;
    }>,
  ) {
    const tierCategory = this.getTierCategoryFromTheme(theme);
    return (
      packages.find(
        (item) =>
          item.package_type !== PackageType.add_on &&
          this.getTierCategoryFromPackage(item) === tierCategory,
      ) ?? packages.find((item) => item.package_type !== PackageType.add_on)
    );
  }

  private getAvailableActivationOffers(params: {
    theme: { metadata?: Prisma.JsonValue | null };
    packages: Array<{
      id: string;
      code: string;
      name: string;
      description: string | null;
      price: Prisma.Decimal;
      currency: string;
      package_type: PackageType;
      features_json?: Prisma.JsonValue | null;
    }>;
    currentPackage?: { features_json?: Prisma.JsonValue | null; code?: string | null } | null;
  }) {
    const minimumRank = this.getPackageRank(this.getTierCategoryFromTheme(params.theme));
    const currentRank = params.currentPackage
      ? this.getPackageRank(this.getTierCategoryFromPackage(params.currentPackage))
      : -1;

    return params.packages
      .filter((item) => item.package_type !== PackageType.add_on)
      .filter((item) => this.getPackageRank(this.getTierCategoryFromPackage(item)) >= minimumRank)
      .filter((item) => this.getPackageRank(this.getTierCategoryFromPackage(item)) > currentRank)
      .sort((left, right) => Number(left.price) - Number(right.price));
  }

  private async getVoucher(code: string, userId: string, packageId: string, amount: number) {
    const normalized = cleanString(code).toUpperCase();
    if (!normalized) return null;

    const voucher = await this.db.voucher.findFirst({
      where: {
        code: normalized,
        deleted_at: null,
        is_active: true,
        OR: [{ product_code: null }, { product_code: 'sapatamu' }],
        AND: [
          { OR: [{ package_id: null }, { package_id: packageId }] },
          { OR: [{ starts_at: null }, { starts_at: { lte: new Date() } }] },
          { OR: [{ ends_at: null }, { ends_at: { gte: new Date() } }] },
        ],
      },
      include: {
        _count: {
          select: {
            redemptions: {
              where: {
                deleted_at: null,
              },
            },
          },
        },
      },
    });

    if (!voucher) return null;
    if (voucher.min_order_amount && amount < Number(voucher.min_order_amount)) return null;
    if (voucher.quota_total !== null && voucher._count.redemptions >= voucher.quota_total) return null;

    if (voucher.quota_per_user !== null) {
      const userUsage = await this.db.voucherRedemption.count({
        where: {
          voucher_id: voucher.id,
          user_id: userId,
          deleted_at: null,
        },
      });
      if (userUsage >= voucher.quota_per_user) return null;
    }

    return voucher;
  }

  private calculateVoucherDiscount(amount: number, voucher: Awaited<ReturnType<SapatamuService['getVoucher']>>): number {
    if (!voucher) return 0;
    if (voucher.discount_type === 'percent') {
      const discount = Math.round((amount * Number(voucher.discount_value)) / 100);
      const capped = voucher.max_discount_amount ? Math.min(discount, Number(voucher.max_discount_amount)) : discount;
      return Math.min(amount, capped);
    }
    return Math.min(amount, Number(voucher.discount_value));
  }

  private buildCartNote(invitationId: string) {
    return `${CART_NOTE_PREFIX}${invitationId}`;
  }

  private buildMockPaymentPayload(method: PaymentMethod, orderId: string, total: number) {
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    if (method === 'qris') {
      return {
        paymentMethod: method,
        paymentNumber: `00020101021126660014ID.CO.QRIS.WWW0118936009180000000000${orderId.slice(-6)}520454995303360540${total}5802ID5910REKAVIA6013JAKARTA PUSAT6105103106304ABCD`,
        instructions: [
          'Buka aplikasi mobile banking atau e-wallet yang mendukung QRIS.',
          'Scan kode QRIS atau salin QR string yang tersedia.',
          'Pastikan nominal pembayaran sesuai sebelum menyelesaikan transaksi.',
        ],
        expiredAt,
      };
    }

    const vaPrefixes: Record<Exclude<PaymentMethod, 'qris'>, string> = {
      bni_va: '9888',
      bri_va: '7777',
      mandiri_va: '8899',
      bca_va: '3901',
      bsi_va: '9009',
    };

    return {
      paymentMethod: method,
      paymentNumber: `${vaPrefixes[method]}${Date.now()
        .toString()
        .slice(-10)}`,
      instructions: [
        'Masuk ke mobile banking atau ATM bank terkait.',
        'Pilih menu Virtual Account lalu masukkan nomor VA.',
        'Pastikan nominal sesuai dan selesaikan pembayaran sebelum timer habis.',
      ],
      expiredAt,
    };
  }

  private async getPendingCartOrder(userId: string, invitationId: string) {
    return this.db.order.findFirst({
      where: {
        user_id: userId,
        status: 'pending',
        deleted_at: null,
        notes: this.buildCartNote(invitationId),
      },
      include: {
        order_items: {
          where: {
            deleted_at: null,
          },
          include: {
            package: true,
            template: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        payments: {
          where: {
            deleted_at: null,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  private async syncPaidThemeAddonAccesses(userId: string, invitationId: string) {
    const paidAddonOrders = await this.db.order.findMany({
      where: {
        user_id: userId,
        status: 'paid',
        deleted_at: null,
        notes: this.buildCartNote(invitationId),
      },
      include: {
        order_items: {
          where: {
            deleted_at: null,
          },
        },
        payments: {
          where: {
            deleted_at: null,
            status: PaymentStatus.paid,
          },
          orderBy: {
            paid_at: 'desc',
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    for (const order of paidAddonOrders) {
      const paidAt = order.payments[0]?.paid_at ?? order.payments[0]?.created_at ?? order.created_at;
      const addonItems = sortThemeAddonOrderItemsForFulfillment(order.order_items).filter(
        (item) => parseJsonObject(item.metadata).kind === CART_KIND_THEME_ADDON,
      );
      if (addonItems.length === 0) continue;

      await this.db.$transaction(async (tx) => {
        for (const addonItem of addonItems) {
          const existingLicense = await tx.userTemplateLicense.findFirst({
            where: {
              order_item_id: addonItem.id,
              deleted_at: null,
            },
          });
          const license =
            existingLicense ??
            (await tx.userTemplateLicense.create({
              data: {
                user_id: userId,
                template_id: addonItem.template_id,
                package_id: addonItem.package_id,
                order_item_id: addonItem.id,
                status: 'active',
              },
            }));

          const existingAccess = await tx.invitationThemeAccess.findFirst({
            where: {
              source_order_item_id: addonItem.id,
              deleted_at: null,
            },
          });

          if (!existingAccess) {
            await tx.invitationThemeAccess.create({
              data: {
                user_id: userId,
                invitation_id: invitationId,
                template_id: addonItem.template_id,
                user_template_license_id: license.id,
                source_order_item_id: addonItem.id,
                access_type: 'addon_owner',
                starts_at: paidAt,
                expires_at: null,
              },
            });
          }
        }
      });
    }
  }

  private async buildCartPayload(
    userId: string,
    invitationId: string,
    order?: Awaited<ReturnType<SapatamuService['getPendingCartOrder']>> | null,
  ) {
    const invitation = await this.getOwnedInvitation(userId, invitationId);
    const catalog = await this.ensureCatalog();
    const currentOrder = order ?? (await this.getPendingCartOrder(userId, invitationId));
    const activeItems = sortThemeAddonOrderItemsForFulfillment(currentOrder?.order_items ?? []);
    const currentItem = activeItems[0];
    const metadata = parseJsonObject(currentItem?.metadata);
    const voucherCode =
      typeof metadata.voucherCode === 'string' ? metadata.voucherCode : null;
    const voucher =
      voucherCode && currentItem
        ? await this.getVoucher(voucherCode, userId, currentItem.package_id, Number(currentItem.subtotal))
        : null;
    const originalAmount = activeItems.reduce((total, item) => total + Number(item.subtotal), 0);
    const discountAmount = activeItems.reduce((total, item) => total + toNumber(parseJsonObject(item.metadata).discountAmount, 0), 0);
    const totalAmount = currentOrder ? Number(currentOrder.total_amount) : 0;
    const availableOffers = this.getAvailableActivationOffers({
      theme: invitation.template,
      packages: catalog.packages,
      currentPackage: invitation.license?.package ?? null,
    });

    return {
      invitationId: invitation.id,
      orderId: currentOrder?.id ?? null,
      status: currentOrder?.status ?? 'empty',
      originalAmount,
      discountAmount,
      totalAmount,
      voucher: voucher
        ? {
            code: voucher.code,
            label: voucher.label,
          }
        : null,
      item: currentItem
        ? {
            packageId: currentItem.package_id,
            packageCode: currentItem.package.code,
            packageName: currentItem.package.name,
            packageType: currentItem.package.package_type,
            quantity: currentItem.qty,
            price: Number(currentItem.unit_price_snapshot),
            kind:
              metadata.kind === CART_KIND_THEME_ADDON ? CART_KIND_THEME_ADDON : CART_KIND_ACTIVATION,
            themeId: cleanString(metadata.themeId) || currentItem.template_id,
            themeCode: cleanString(metadata.themeCode) || currentItem.template.code,
            themeName: cleanString(metadata.themeName) || currentItem.template.name,
            normalPrice: toNumber(metadata.normalPrice, Number(currentItem.subtotal)),
            basePrice: toNumber(metadata.basePrice, Number(currentItem.subtotal)),
            specialPrice: toNumber(metadata.specialPrice, Number(currentOrder?.total_amount ?? currentItem.subtotal)),
            priceMode: cleanString(metadata.priceMode) || null,
            addonSlot: toNumber(metadata.addonSlot, 0) || null,
            specialDiscountPercent: toNumber(metadata.specialDiscountPercent, 0),
          }
        : null,
      items: activeItems.map((item) => {
        const itemMetadata = parseJsonObject(item.metadata);
        return {
          packageId: item.package_id,
          packageCode: item.package.code,
          packageName: item.package.name,
          packageType: item.package.package_type,
          quantity: item.qty,
          price: Number(item.unit_price_snapshot),
          subtotal: Number(item.subtotal),
          discountAmount: toNumber(itemMetadata.discountAmount, 0),
          kind: itemMetadata.kind === CART_KIND_THEME_ADDON ? CART_KIND_THEME_ADDON : CART_KIND_ACTIVATION,
          themeId: cleanString(itemMetadata.themeId) || item.template_id,
          themeCode: cleanString(itemMetadata.themeCode) || item.template.code,
          themeName: cleanString(itemMetadata.themeName) || item.template.name,
          normalPrice: toNumber(itemMetadata.normalPrice, Number(item.subtotal)),
          basePrice: toNumber(itemMetadata.basePrice, Number(item.subtotal)),
          specialPrice: toNumber(itemMetadata.specialPrice, Number(item.unit_price_snapshot)),
          priceMode: cleanString(itemMetadata.priceMode) || null,
          addonSlot: toNumber(itemMetadata.addonSlot, 0) || null,
          specialDiscountPercent: toNumber(itemMetadata.specialDiscountPercent, 0),
        };
      }),
      availableOffers: availableOffers.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        currency: item.currency,
        packageType: item.package_type,
        features: item.features_json,
      })),
      availableAddOns: catalog.packages
        .filter((item) => item.package_type === PackageType.add_on)
        .filter((item) => cleanString(parseJsonObject(item.features_json).featureCode) === 'theme_add_on')
        .map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          currency: item.currency,
          packageType: item.package_type,
          features: item.features_json,
        })),
    };
  }

  private buildGuestMetadata(input: GuestInput): Prisma.InputJsonValue {
    return {
      sendStatus:
        input.sendStatus === 'copied' || input.sendStatus === 'sent' ? input.sendStatus : 'draft',
      lastSentAt: cleanString(input.lastSentAt) || null,
    } as Prisma.InputJsonValue;
  }

  private buildPersonalizedUrl(slug: string, guestName: string): string {
    return `https://${BRAND.domain}/u/${slug}?to=${encodeURIComponent(guestName)}`;
  }

  private buildEditorVariableCatalog(
    content: SapatamuEditorDocumentV3,
    publicUrl: string,
  ) {
    const variables = [
      {
        token: 'link',
        label: 'Link undangan',
        example: publicUrl,
      },
    ];

    content.profiles.forEach((profile, index) => {
      variables.push(
        {
          token: `full-name-${index + 1}`,
          label: `Nama lengkap ${index + 1}`,
          example: cleanString(profile.fullName) || `Mempelai ${index + 1}`,
        },
        {
          token: `nick-name-${index + 1}`,
          label: `Nama panggilan ${index + 1}`,
          example:
            cleanString(profile.nickName) ||
            cleanString(profile.fullName) ||
            `Mempelai ${index + 1}`,
        },
        {
          token: `desc-${index + 1}`,
          label: `Deskripsi ${index + 1}`,
          example: cleanString(profile.description) || `Deskripsi ${index + 1}`,
        },
      );
    });

    content.events.forEach((event, index) => {
      variables.push(
        {
          token: `event-name-${index + 1}`,
          label: `Nama event ${index + 1}`,
          example: cleanString(event.name) || `Acara ${index + 1}`,
        },
        {
          token: `event-date-${index + 1}`,
          label: `Tanggal event ${index + 1}`,
          example: cleanString(event.date) || 'Tanggal belum ditetapkan',
        },
        {
          token: `time-start-${index + 1}`,
          label: `Jam mulai ${index + 1}`,
          example: cleanString(event.timeStart) || '00:00',
        },
        {
          token: `time-end-${index + 1}`,
          label: `Jam selesai ${index + 1}`,
          example: cleanString(event.timeEnd) || '00:00',
        },
        {
          token: `zone-time-${index + 1}`,
          label: `Zona waktu ${index + 1}`,
          example: cleanString(event.timeZone) || 'WIB',
        },
        {
          token: `event-location-${index + 1}`,
          label: `Lokasi event ${index + 1}`,
          example: cleanString(event.address) || `Lokasi ${index + 1}`,
        },
      );
    });

    return variables;
  }

  private async buildEditorPayload(invitationId: string, userId: string) {
    await this.syncPaidThemeAddonAccesses(userId, invitationId);
    const invitation = await this.getOwnedInvitation(userId, invitationId);
    const [{ record, content }, slugRow, media] = await Promise.all([
      this.getCurrentContent(invitationId),
      this.db.invitationSlug.findFirst({
        where: {
          invitation_id: invitationId,
          is_primary: true,
          deleted_at: null,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.db.invitationMedia.findMany({
        where: {
          invitation_id: invitationId,
          deleted_at: null,
          media_type: {
            in: [InvitationMediaType.image, InvitationMediaType.video],
          },
        },
        orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
      }),
    ]);

    const slug = slugRow?.slug ?? slugify(invitation.title);
    const tierCategory = isTierCategory(content.settings.commerce.requiredTierCategory)
      ? content.settings.commerce.requiredTierCategory
      : this.getTierCategoryFromTheme(invitation.template);
    const packageFeatures = buildEditorPackageFeatures(tierCategory);
    const layouts = await this.buildEditorLayoutCatalogFromDb({
      themeId: content.selectedTheme,
      templateId: invitation.template_id,
      profiles: content.profiles,
      events: content.events,
    });
    const themeCatalog = await this.ensureCatalog();
    const baseDocument = buildContentFromDraft({
      themeId: content.selectedTheme,
      profiles: content.profiles,
      events: content.events,
      basePhotoQuota: content.albumSettings.basePhotoQuota,
      requiredTierCategory: tierCategory,
      existing: {
        ...content,
        editor: normalizeEditorState({
          themeId: content.selectedTheme,
          requiredTierCategory: tierCategory,
          profiles: content.profiles,
          events: content.events,
          raw: content.editor,
        }),
      },
    });
    const activeLayouts = layouts
      .filter((layout) => layout.defaultVisible !== false)
      .sort((left, right) => left.sortOrder - right.sortOrder);
    const activeLayoutCodes = new Set(activeLayouts.map((layout) => layout.layoutCode));
    const currentPagesByLayout = new Map<string, SapatamuEditorPage[]>();
    baseDocument.editor.pages.forEach((page) => {
      currentPagesByLayout.set(page.layoutCode, [
        ...(currentPagesByLayout.get(page.layoutCode) ?? []),
        page,
      ]);
    });
    const usedCurrentPageKeys = new Set<string>();
    const addonPackages = themeCatalog.packages
      .filter((item) => item.package_type === PackageType.add_on)
      .filter((item) => cleanString(parseJsonObject(item.features_json).featureCode) === 'theme_add_on')
      .sort((left, right) => toNumber(parseJsonObject(left.features_json).addonSlot, 1) - toNumber(parseJsonObject(right.features_json).addonSlot, 1));
    const firstAddonPackage = addonPackages[0];
    const secondAddonPackage = addonPackages[1] ?? firstAddonPackage;
    const firstAddonPrice = firstAddonPackage ? Number(firstAddonPackage.price) : THEME_ADDON_FIRST_PRICE;
    const secondAddonPrice = secondAddonPackage ? Number(secondAddonPackage.price) : THEME_ADDON_SECOND_PRICE;
    const addonNormalPrice = secondAddonPackage
      ? toNumber(parseJsonObject(secondAddonPackage.features_json).normalPrice, firstAddonPrice)
      : firstAddonPrice;
    const reconciledPages = activeLayouts
      .map((layout, index) => {
        const exactPage = currentPagesByLayout
          .get(layout.layoutCode)
          ?.find((page) => {
            const pageIndex = baseDocument.editor.pages.indexOf(page);
            return !usedCurrentPageKeys.has(`${page.layoutCode}:${page.id}:${pageIndex}`);
          });
        const currentPage =
          exactPage ??
          baseDocument.editor.pages.find(
            (page) => {
              const pageIndex = baseDocument.editor.pages.indexOf(page);
              return (
                page.family === layout.family &&
                !activeLayoutCodes.has(page.layoutCode) &&
                !usedCurrentPageKeys.has(`${page.layoutCode}:${page.id}:${pageIndex}`)
              );
            },
          );
        if (currentPage) {
          const pageIndex = baseDocument.editor.pages.indexOf(currentPage);
          usedCurrentPageKeys.add(`${currentPage.layoutCode}:${currentPage.id}:${pageIndex}`);
        }
        const uniqueId = index + 1;
        return {
          ...(currentPage ?? createEditorPageFromCatalog({
            layout,
            uniqueId,
            source: 'base',
            packageFeatures,
          })),
          id: layout.layoutCode,
          uniqueId,
          title: layout.title,
          slug: normalizeEditorPageSlug(layout.title, uniqueId),
          layoutCode: layout.layoutCode,
          family: layout.family,
          isActive: currentPage?.isActive ?? true,
          isLocked: false,
          source: 'base' as const,
          data: mergeEditorPageDataWithDefaults(currentPage?.data, layout.defaultPageData),
        } satisfies SapatamuEditorPage;
      });
    const document: SapatamuEditorDocumentV3 = {
      ...baseDocument,
      editor: {
        ...baseDocument.editor,
        pages: reconciledPages,
        layoutCatalogSnapshot: layouts,
        packageFeatures,
      },
    };

    return {
      invitation: {
        id: invitation.id,
        title: invitation.title,
        slug,
        publicUrl: `https://${BRAND.domain}/u/${slug}`,
        previewUrl: `/cms/sapatamu/${invitation.id}/editor`,
        status: invitation.status,
        theme: invitation.template
          ? {
              id: invitation.template.id,
              code: invitation.template.code,
              name: invitation.template.name,
            }
          : null,
      },
      document,
      currentVersion: record?.version ?? 1,
      catalog: {
        themes: await Promise.all(themeCatalog.themes.map(async (item) => {
          const directAccess = this.hasActiveThemeAccess(invitation.invitation_theme_accesses, item.id);
          const reusableAccess = directAccess ? null : await this.findReusableThemeAccess(userId, item.id);
          return {
            id: item.id,
            code: item.code,
            name: item.name,
            description: item.description,
            previewImageUrl: item.preview_image_url,
            metadata: {
              ...parseJsonObject(item.metadata),
              accessStatus:
                item.id === invitation.template_id
                  ? 'active'
                  : directAccess
                    ? 'owned'
                    : reusableAccess
                      ? 'reusable'
                      : 'locked',
            },
          };
        })),
        themeAddOnPricing: {
          firstPrice: firstAddonPrice,
          secondPrice: secondAddonPrice,
          normalPrice: addonNormalPrice,
        },
        layouts,
        fonts: SAPATAMU_EDITOR_FONT_CATALOG,
        featureGates: buildEditorFeatureGates(packageFeatures, layouts),
        media: media.map((item) => ({
          id: item.id,
          url: item.url,
          fileName: item.file_name,
          sortOrder: item.sort_order,
          mediaType:
            item.media_type === InvitationMediaType.video
              ? 'video'
              : buildEditorMediaTypeFromMime(
                  typeof parseJsonObject(item.metadata).mime === 'string'
                    ? String(parseJsonObject(item.metadata).mime)
                    : 'image/jpeg',
                ),
        })),
      },
      session: {
        autoSaveDelayMs: 500,
        availableVariables: this.buildEditorVariableCatalog(
          document,
          `https://${BRAND.domain}/u/${slug}`,
        ),
      },
    };
  }

  private async buildEditorLayoutCatalogFromDb(params: {
    themeId: string;
    templateId?: string | null;
    profiles: SapatamuEditorDocumentV3['profiles'];
    events: SapatamuEditorDocumentV3['events'];
  }): Promise<SapatamuEditorLayoutCatalogItem[]> {
    const fallback = buildLayoutCatalog(params);
    const rows = await this.db.editorLayoutTemplate.findMany({
      where: {
        product_code: 'sapatamu',
        deleted_at: null,
        OR: params.templateId
          ? [{ template_id: null }, { template_id: params.templateId }]
          : [{ template_id: null }],
      },
      orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
    });

    if (rows.length === 0) return fallback;

    const fallbackByCode = new Map(fallback.map((item) => [item.layoutCode, item]));
    const rowsByCode = new Map<string, (typeof rows)[number]>();
    rows.forEach((row) => {
      const existing = rowsByCode.get(row.layout_code);
      if (!existing || (!existing.template_id && row.template_id === params.templateId)) {
        rowsByCode.set(row.layout_code, row);
      }
    });

    const merged = new Map<string, SapatamuEditorLayoutCatalogItem>(
      fallback.map((item) => [item.layoutCode, item]),
    );

    rowsByCode.forEach((row) => {
      if (row.is_active === false) {
        merged.delete(row.layout_code);
        return;
      }

      const fallbackItem = fallbackByCode.get(row.layout_code);
      const defaultData =
        row.default_data_json && typeof row.default_data_json === 'object' && !Array.isArray(row.default_data_json)
          ? (row.default_data_json as Record<string, unknown>)
          : fallbackItem?.defaultPageData ?? {};
      merged.set(row.layout_code, {
        layoutCode: row.layout_code,
        family: fallbackItem?.family ?? row.family,
        title: fallbackItem?.title ?? row.title,
        previewImageUrl: row.preview_image_url ?? fallbackItem?.previewImageUrl ?? '',
        defaultPageData: defaultData,
        requiredTier: fallbackItem?.requiredTier ?? 'basic',
        requiredFeatureCode: row.required_feature_code ?? fallbackItem?.requiredFeatureCode ?? null,
        maxInstances: row.max_instances ?? fallbackItem?.maxInstances ?? 1,
        sortOrder: row.sort_order,
        supportsPreviewSelection: row.supports_preview_selection,
        mediaRequirements: fallbackItem?.mediaRequirements ?? 'none',
        defaultVisible: fallbackItem?.defaultVisible ?? true,
      });
    });

    return Array.from(merged.values()).sort((left, right) => left.sortOrder - right.sortOrder);
  }

  private async saveContentVersion(params: {
    tx: Prisma.TransactionClient;
    invitationId: string;
    userId: string;
    nextContent: SapatamuEditorDocumentV3;
  }) {
    const stampedContent: SapatamuEditorDocumentV3 = {
      ...params.nextContent,
      settings: {
        ...params.nextContent.settings,
        lastEditedAtDisplay: new Date().toISOString(),
      },
    };

    const latest = await params.tx.invitationContent.findFirst({
      where: {
        invitation_id: params.invitationId,
        deleted_at: null,
      },
      orderBy: { version: 'desc' },
    });

    await params.tx.invitationContent.updateMany({
      where: {
        invitation_id: params.invitationId,
        is_current: true,
        deleted_at: null,
      },
      data: {
        is_current: false,
      },
    });

    try {
      return await params.tx.invitationContent.create({
        data: {
          invitation_id: params.invitationId,
          version: (latest?.version ?? 0) + 1,
          content_json: stampedContent as Prisma.InputJsonValue,
          is_current: true,
          updated_by_user_id: params.userId,
        },
      });
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
        throw new ConflictException('Versi editor sudah berubah. Muat ulang editor untuk melanjutkan.');
      }
      throw error;
    }
  }

  private async buildWorkspace(invitationId: string, userId: string) {
    const invitation = await this.getOwnedInvitation(userId, invitationId);
    const catalog = await this.ensureCatalog();
    const [{ record, content }, slugRow, guests, media, rsvps, greetings, featureGrants, musicAssets] =
      await Promise.all([
        this.getCurrentContent(invitationId),
        this.db.invitationSlug.findFirst({
          where: {
            invitation_id: invitationId,
            is_primary: true,
            deleted_at: null,
          },
          orderBy: { created_at: 'desc' },
        }),
        this.db.invitationGuest.findMany({
          where: {
            invitation_id: invitationId,
            deleted_at: null,
          },
          orderBy: { created_at: 'asc' },
        }),
        this.db.invitationMedia.findMany({
          where: {
            invitation_id: invitationId,
            deleted_at: null,
            media_type: InvitationMediaType.image,
          },
          orderBy: { sort_order: 'asc' },
        }),
        this.db.invitationRsvp.findMany({
          where: {
            invitation_id: invitationId,
            deleted_at: null,
          },
          orderBy: { created_at: 'desc' },
          take: 50,
        }),
        this.db.invitationGreeting.findMany({
          where: {
            invitation_id: invitationId,
            deleted_at: null,
          },
          orderBy: { created_at: 'desc' },
          take: 100,
        }),
        this.db.invitationFeatureGrant.findMany({
          where: {
            invitation_id: invitationId,
            deleted_at: null,
          },
          include: {
            source_order_item: {
              include: {
                order: {
                  include: {
                    payments: true,
                  },
                },
              },
            },
          },
        }),
        this.db.templateAsset.findMany({
          where: {
            product_code: 'sapatamu',
            asset_type: TemplateAssetType.music,
            is_active: true,
            deleted_at: null,
            template: {
              code: { in: SAPATAMU_THEME_SEEDS.map((item) => item.code) },
              deleted_at: null,
              is_active: true,
            },
          },
          include: { template: true },
          orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }],
        }),
      ]);

    const slug = slugRow?.slug ?? slugify(invitation.title);
    const requiredTierCategory = isTierCategory(content.settings.commerce.requiredTierCategory)
      ? content.settings.commerce.requiredTierCategory
      : this.getTierCategoryFromTheme(invitation.template);
    const activePackage = invitation.license?.package ?? null;
    const allowedPhotoQuota = SAPATAMU_MAX_ALBUM_PHOTOS;
    const activationOffers = this.getAvailableActivationOffers({
      theme: invitation.template,
      packages: catalog.packages,
      currentPackage: invitation.license?.package ?? null,
    });

    const guestRows = guests.map((guest) => {
      const metadata = parseJsonObject(guest.metadata);
      return {
        id: guest.id,
        name: guest.name,
        phoneNumber: guest.phone_number,
        sendStatus:
          metadata.sendStatus === 'copied' || metadata.sendStatus === 'sent'
            ? metadata.sendStatus
            : 'draft',
        lastSentAt: typeof metadata.lastSentAt === 'string' ? metadata.lastSentAt : null,
        personalizedUrl:
          guest.personalized_url ?? this.buildPersonalizedUrl(slug, guest.name),
      };
    });

    const attendingCount = rsvps.filter((item) => item.status === 'hadir').length;
    const notAttendingCount = rsvps.filter((item) => item.status === 'tidak').length;
    const totalGuestsComing = rsvps.reduce((total, item) => total + item.attendees_count, 0);
    const activationStart = this.getActivationStartDate(invitation);
    const editWindow = this.calculateCountdownWindow({
      invitation,
      featureCode: 'edit_access_days',
      featureGrants,
    });
    const activeWindow = this.calculateCountdownWindow({
      invitation,
      featureCode: 'active_window',
      featureGrants,
    });
    const resolvedMetaTitle = this.resolveMetaTitleTemplate(
      content.meta.titleTemplate,
      content.profiles,
    );
    const resolvedMetaDate =
      content.events.find((item) => item.enabled)?.date ??
      content.events[0]?.date ??
      '';

    return {
      invitation: {
        id: invitation.id,
        title: invitation.title,
        status: invitation.status,
        slug,
        publicUrl: `https://${BRAND.domain}/u/${slug}`,
        previewUrl: `/cms/sapatamu/${invitation.id}/editor`,
        canPublicOpen: invitation.status === 'published',
        activationState: invitation.status === 'published' ? 'active' : 'needs_activation',
        requiredTierCategory,
        package: activePackage
          ? {
              id: activePackage.id,
              code: activePackage.code,
              name: activePackage.name,
              price: Number(activePackage.price),
              packageType: activePackage.package_type,
            }
          : null,
        theme: invitation.template
          ? {
              id: invitation.template.id,
              code: invitation.template.code,
              name: invitation.template.name,
            }
          : null,
        currentVersion: record?.version ?? 1,
        updatedAt: invitation.updated_at,
      },
      profiles: content.profiles,
      events: content.events,
      send: {
        prefaceTemplate: content.sendSettings.prefaceTemplate,
        guests: guestRows,
        metadataPreview: {
          title: resolvedMetaTitle,
          titleTemplate: content.meta.titleTemplate,
          date: resolvedMetaDate,
          link: `https://${BRAND.domain}/u/${slug}`,
          imageUrl: content.meta.imageUrl,
        },
      },
      album: {
        usedPhotoQuota: media.length,
        allowedPhotoQuota,
        addOnPackages: [],
        items: media.map((item) => ({
          id: item.id,
          url: item.url,
          fileName: item.file_name,
          sortOrder: item.sort_order,
        })),
      },
      rsvp: {
        attendingCount,
        notAttendingCount,
        totalGuestsComing,
        recentResponses: rsvps.map((item) => ({
          id: item.id,
          guestName: item.guest_name,
          status: item.status,
          attendeesCount: item.attendees_count,
          message: item.message,
          createdAt: item.created_at,
        })),
      },
      messages: greetings.map((item) => ({
        id: item.id,
        guestName: item.guest_name,
        message: item.message,
        isApproved: item.is_approved,
        createdAt: item.created_at,
      })),
      settings: {
        meta: content.meta,
        musicSettings: content.musicSettings,
        musicLibrary: musicAssets.map((asset) => ({
          id: asset.id,
          themeCode: asset.template?.code ?? '',
          themeName: asset.template?.name ?? asset.asset_key,
          assetKey: asset.asset_key,
          url: asset.url,
          fileName: asset.file_name,
        })),
        extraLinks: content.extraLinks,
        lastEditedAtDisplay: content.settings.lastEditedAtDisplay,
        activatedAtDisplay:
          content.settings.activatedAtDisplay ?? invitation.published_at?.toISOString() ?? null,
        editAccess: {
          status: editWindow.status,
          expiresAt: editWindow.expiresAt,
          remainingDays: editWindow.remainingDays,
          lifetime: editWindow.lifetime,
          activatedAt: activationStart?.toISOString() ?? null,
          addOnPackages: [],
        },
        activeAccess: {
          status: activeWindow.status,
          expiresAt: activeWindow.expiresAt,
          remainingDays: activeWindow.remainingDays,
          lifetime: activeWindow.lifetime,
          activatedAt:
            activationStart?.toISOString() ??
            content.settings.activatedAtDisplay ??
            null,
        },
        giftAccounts: content.settings.giftAccounts,
        giftAddress: content.settings.giftAddress,
        packageOverview: {
          currentPackage: activePackage
            ? {
                id: activePackage.id,
                code: activePackage.code,
                name: activePackage.name,
                price: Number(activePackage.price),
                packageType: activePackage.package_type,
                features: activePackage.features_json,
              }
            : null,
          activationOffers: activationOffers.map((item) => ({
            id: item.id,
            code: item.code,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            currency: item.currency,
            packageType: item.package_type,
            features: item.features_json,
          })),
        },
        helpPath: '/cms',
      },
    };
  }

  private async applyEditorDefaultsFromDb(
    templateId: string,
    content: SapatamuEditorDocumentV3,
  ): Promise<SapatamuEditorDocumentV3> {
    const tierCategory = content.settings.commerce.requiredTierCategory;
    const packageFeatures = buildEditorPackageFeatures(tierCategory);
    const catalog = await this.buildEditorLayoutCatalogFromDb({
      themeId: content.selectedTheme,
      templateId,
      profiles: content.profiles,
      events: content.events,
    });

    return {
      ...content,
      editor: {
        ...content.editor,
        pages: catalog
          .filter((layout) => layout.defaultVisible)
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .map((layout, index) =>
            createEditorPageFromCatalog({
              layout,
              uniqueId: index + 1,
              source: 'base',
              packageFeatures,
            }),
          ),
        layoutCatalogSnapshot: catalog,
        packageFeatures,
      },
    };
  }

  async getCmsHome(authUser: AuthRequestUser) {
    const user = await this.getCurrentUser(authUser);
    const catalog = await this.ensureCatalog();

    const [invitations, drafts] = await Promise.all([
      this.db.invitation.findMany({
        where: {
          user_id: user.id,
          deleted_at: null,
        },
        include: {
          license: {
            include: {
              package: true,
            },
          },
          template: true,
          invitation_slugs: {
            where: {
              deleted_at: null,
              is_primary: true,
            },
            orderBy: { created_at: 'desc' },
            take: 1,
          },
          invitation_contents: {
            where: {
              deleted_at: null,
              is_current: true,
            },
            orderBy: { version: 'desc' },
            take: 1,
          },
        },
        orderBy: { updated_at: 'desc' },
      }),
      this.db.invitationDraft.findMany({
        where: {
          user_id: user.id,
          deleted_at: null,
          status: {
            in: [InvitationDraftStatus.in_progress, InvitationDraftStatus.pending_payment],
          },
        },
        include: {
          theme: true,
          selected_package: true,
        },
        orderBy: { updated_at: 'desc' },
      }),
    ]);

    const invitationSummaries = invitations.map((item) => {
      const content = migrateContentJson(item.invitation_contents[0]?.content_json);
      return {
        id: item.id,
        title: item.title,
        status: item.status,
        slug: item.invitation_slugs[0]?.slug ?? '',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        activationState: item.status === 'published' ? 'active' : 'needs_activation',
        packageName: item.license?.package?.name ?? 'Belum aktif',
        packageCode: item.license?.package?.code ?? '',
        themeCode: item.template?.code ?? content.selectedTheme,
        profiles: content.profiles,
      };
    });
    const activeInvitations = invitationSummaries.filter((item) => item.status === 'published');
    const needsActivation = invitationSummaries.filter((item) => item.status === 'draft');

    const activeDrafts = drafts.map((item) => {
      const wizard = buildDraftWizardSummary(item.wizard_json, {
        slugCandidate: item.slug_candidate ?? '',
        themeId: item.theme_id ?? '',
        selectedPackageId: item.selected_package_id ?? null,
      });

      return {
        id: item.id,
        slugCandidate: item.slug_candidate ?? wizard.slugCandidate,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        step: wizard.step,
        selectedPackage: item.selected_package
          ? {
              id: item.selected_package.id,
              name: item.selected_package.name,
              code: item.selected_package.code,
            }
          : null,
        theme: item.theme
          ? {
              id: item.theme.id,
              name: item.theme.name,
              code: item.theme.code,
            }
          : null,
        profiles: wizard.profiles,
      };
    });

    const recentActivity = [
      ...invitationSummaries.slice(0, 5).map((item) => ({
        id: `invitation-${item.id}`,
        label:
          item.status === 'published'
            ? `Undangan ${item.title} sudah aktif dan siap dikelola`
            : `Undangan ${item.title} menunggu aktivasi publik`,
        createdAt: item.updatedAt,
      })),
      ...activeDrafts.slice(0, 5).map((item) => ({
        id: `draft-${item.id}`,
        label: `Draft ${item.slugCandidate || 'undangan baru'} masih menunggu diselesaikan`,
        createdAt: item.updatedAt,
      })),
    ]
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .slice(0, 8);

    return {
      productScope: 'sapatamu',
      activeInvitations,
      needsActivation,
      drafts: activeDrafts,
      recentActivity,
      catalog: {
        themes: catalog.themes.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          previewImageUrl: item.preview_image_url,
          metadata: item.metadata,
        })),
        packages: catalog.packages.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          currency: item.currency,
          packageType: item.package_type,
          features: item.features_json,
        })),
      },
    };
  }

  async createDraft(authUser: AuthRequestUser, payload: Record<string, unknown>) {
    const user = await this.getCurrentUser(authUser);
    const catalog = await this.ensureCatalog();
    const initialTheme = catalog.themes.find((item) => !this.isThemeComingSoon(item)) ?? catalog.themes[0];

    if (!initialTheme) {
      throw new BadRequestException('Katalog SapaTamu belum siap dipakai.');
    }

    const profiles = normalizeProfiles(payload.profiles);
    const suggestedSlug =
      cleanString(payload.slugCandidate) ||
      buildSlugCandidateFromProfiles(profiles) ||
      slugify(user.name);

    const requestedTheme = typeof payload.themeId === 'string' ? cleanString(payload.themeId) : '';
    const selectedTheme = requestedTheme
      ? catalog.themes.find((item) => item.id === requestedTheme || item.code === requestedTheme)
      : initialTheme;
    if (!selectedTheme) {
      throw new BadRequestException('Tema yang dipilih tidak tersedia.');
    }
    this.assertThemeAvailableForSelection(selectedTheme);
    const selectedThemeId = selectedTheme.id;
    await this.assertSlugAvailability(suggestedSlug);

    const draft = await this.db.invitationDraft.create({
      data: {
        user_id: user.id,
        product_category: 'sapatamu',
        slug_candidate: suggestedSlug,
        theme_id: selectedThemeId,
        selected_package_id: null,
        wizard_json: buildDefaultDraftWizard({
          step: toNumber(payload.step, 0),
          invitationName: typeof payload.invitationName === 'string' ? payload.invitationName : '',
          slugCandidate: suggestedSlug,
          themeId: selectedThemeId,
          selectedPackageId: null,
          profiles,
          events: normalizeEvents(payload.events),
        }),
        status: InvitationDraftStatus.in_progress,
        reserved_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        theme: true,
        selected_package: true,
      },
    });

    return {
      id: draft.id,
      slugCandidate: draft.slug_candidate,
      status: draft.status,
      themeId: draft.theme_id,
      selectedPackageId: null,
      wizard: buildDraftWizardSummary(draft.wizard_json, {
        slugCandidate: draft.slug_candidate ?? '',
      }),
    };
  }

  async updateDraft(
    authUser: AuthRequestUser,
    draftId: string,
    payload: Record<string, unknown>,
  ) {
    const user = await this.getCurrentUser(authUser);
    const draft = await this.getOwnedDraft(user.id, draftId);
    const catalog = await this.ensureCatalog();

    const nextWizard = buildDraftWizardSummary(payload, {
      ...buildDraftWizardSummary(draft.wizard_json, {
        slugCandidate: draft.slug_candidate ?? '',
        themeId: draft.theme_id ?? '',
        selectedPackageId: draft.selected_package_id ?? null,
        invitationName: typeof payload.invitationName === 'string' ? payload.invitationName : undefined,
      }),
      step: typeof payload.step === 'number' ? payload.step : undefined,
    });

    const slugCandidate =
      cleanString(payload.slugCandidate) ||
      cleanString(nextWizard.slugCandidate) ||
      draft.slug_candidate ||
      slugify(user.name);

    if (slugCandidate !== draft.slug_candidate) {
      await this.assertSlugAvailability(slugCandidate, { excludeDraftId: draft.id });
    }

    const requestedTheme = typeof payload.themeId === 'string' ? cleanString(payload.themeId) : '';
    const selectedTheme = requestedTheme
      ? catalog.themes.find((item) => item.id === requestedTheme || item.code === requestedTheme)
      : catalog.themes.find((item) => item.id === draft.theme_id) ?? catalog.themes[0];
    const themeId = selectedTheme?.id;
    if (!themeId) {
      throw new BadRequestException('Tema yang dipilih tidak tersedia.');
    }
    this.assertThemeAvailableForSelection(selectedTheme);

    const updated = await this.db.invitationDraft.update({
      where: { id: draft.id },
      data: {
        slug_candidate: slugCandidate,
        theme_id: themeId,
        selected_package_id: null,
        wizard_json: {
          ...nextWizard,
          slugCandidate,
          themeId,
          selectedPackageId: null,
        },
        status: InvitationDraftStatus.in_progress,
        reserved_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        theme: true,
        selected_package: true,
      },
    });

    return {
      id: updated.id,
      slugCandidate: updated.slug_candidate,
      status: updated.status,
      themeId: updated.theme_id,
      selectedPackageId: null,
      wizard: buildDraftWizardSummary(updated.wizard_json, {
        slugCandidate: updated.slug_candidate ?? '',
        themeId: updated.theme_id ?? '',
        selectedPackageId: null,
      }),
    };
  }

  async deleteDraft(authUser: AuthRequestUser, draftId: string) {
    const user = await this.getCurrentUser(authUser);
    const draft = await this.getOwnedDraft(user.id, draftId);

    await this.db.invitationDraft.update({
      where: { id: draft.id },
      data: {
        status: InvitationDraftStatus.cancelled,
        deleted_at: new Date(),
      },
    });

    return { deleted: true };
  }

  async finalizeDraft(authUser: AuthRequestUser, draftId: string) {
    const user = await this.getCurrentUser(authUser);
    const draft = await this.getOwnedDraft(user.id, draftId);
    const catalog = await this.ensureCatalog();

    if (!draft.theme_id) {
      throw new BadRequestException('Draft belum lengkap untuk diproses.');
    }

    const theme = catalog.themes.find((item) => item.id === draft.theme_id);
    const selectedPackage = theme
      ? this.getMinimumPackageForTheme(theme, catalog.packages)
      : null;

    if (!theme || !selectedPackage) {
      throw new BadRequestException('Tema atau paket draft sudah tidak tersedia.');
    }
    this.assertThemeAvailableForSelection(theme);

    await this.assertSlugAvailability(draft.slug_candidate ?? slugify(user.name), {
      excludeDraftId: draft.id,
    });

    const wizard = buildDraftWizardSummary(draft.wizard_json, {
      slugCandidate: draft.slug_candidate ?? '',
      themeId: draft.theme_id,
      selectedPackageId: draft.selected_package_id,
    });
    let content = buildContentFromDraft({
      themeId: theme.code,
      profiles: wizard.profiles,
      events: wizard.events,
      basePhotoQuota: this.getBasePhotoQuota(selectedPackage),
      requiredTierCategory: this.getTierCategoryFromTheme(theme),
      existing: {
        weddingData: {
          invitationName: wizard.invitationName,
        },
        settings: {
          commerce: {
            requiredTierCategory: this.getTierCategoryFromTheme(theme),
            selectedPackageCode: null,
            activationState: 'inactive',
          },
          giftAccounts: [],
          giftAddress: '',
          lastEditedAtDisplay: new Date().toISOString(),
          activatedAtDisplay: null,
        },
        historyDisplayHints: {
          origin: 'draft-finalize',
        },
      },
    });
    content = await this.applyEditorDefaultsFromDb(theme.id, content);
    content = await this.applyTemplateAssetsFromDb(theme.id, content);

    const invitation = await this.db.$transaction(async (tx) => {
      const createdInvitation = await tx.invitation.create({
        data: {
          user_id: user.id,
          license_id: null,
          template_id: theme.id,
          title: buildInvitationTitleFromContent(content),
          groom_name: cleanString(content.profiles[0]?.fullName) || null,
          bride_name: cleanString(content.profiles[1]?.fullName) || null,
          event_date: combineDateTime(
            content.events.find((item) => item.enabled)?.date ?? '',
            content.events.find((item) => item.enabled)?.timeStart ?? '',
          ),
          status: 'draft' as InvitationStatus,
          published_at: null,
        },
      });

      await tx.invitationSlug.create({
        data: {
          invitation_id: createdInvitation.id,
          slug: draft.slug_candidate ?? slugify(user.name),
          is_primary: true,
          created_by: 'user',
        },
      });

      await tx.invitationContent.create({
        data: {
          invitation_id: createdInvitation.id,
          version: 1,
          content_json: content as Prisma.InputJsonValue,
          is_current: true,
          updated_by_user_id: user.id,
        },
      });

      await tx.invitationDraft.update({
        where: { id: draft.id },
        data: {
          status: InvitationDraftStatus.converted,
          selected_package_id: selectedPackage.id,
        },
      });

      return createdInvitation;
    });

    return {
      invitationId: invitation.id,
      nextPath: `/cms/sapatamu/${invitation.id}/send`,
    };
  }

  async getDraft(authUser: AuthRequestUser, draftId: string) {
    const user = await this.getCurrentUser(authUser);
    const draft = await this.getOwnedDraft(user.id, draftId);

    return {
      id: draft.id,
      slugCandidate: draft.slug_candidate,
      status: draft.status,
      themeId: draft.theme_id,
      selectedPackageId: null,
      wizard: buildDraftWizardSummary(draft.wizard_json, {
        slugCandidate: draft.slug_candidate ?? '',
        themeId: draft.theme_id ?? '',
        selectedPackageId: null,
      }),
    };
  }

  async getActivationOffers(authUser: AuthRequestUser, invitationId: string) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const catalog = await this.ensureCatalog();
    const offers = this.getAvailableActivationOffers({
      theme: invitation.template,
      packages: catalog.packages,
      currentPackage: invitation.license?.package ?? null,
    });
    const activePackage = invitation.license?.package ?? null;

    return {
      invitationId: invitation.id,
      activationState: invitation.status === 'published' ? 'active' : 'needs_activation',
      requiredTierCategory: this.getTierCategoryFromTheme(invitation.template),
      currentPackage: activePackage
        ? {
            id: activePackage.id,
            code: activePackage.code,
            name: activePackage.name,
            price: Number(activePackage.price),
            packageType: activePackage.package_type,
            features: activePackage.features_json,
          }
        : null,
      offers: offers.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        currency: item.currency,
        packageType: item.package_type,
        features: item.features_json,
      })),
    };
  }

  async upsertCart(
    authUser: AuthRequestUser,
    invitationId: string,
    payload: { packageId?: string; kind?: string; themeIds?: string[] },
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const catalog = await this.ensureCatalog();
    const kind: CartKind = payload.kind === CART_KIND_THEME_ADDON ? CART_KIND_THEME_ADDON : CART_KIND_ACTIVATION;
    if (kind === CART_KIND_THEME_ADDON) {
      return this.upsertThemeAddonCart(authUser, invitationId, payload.themeIds ?? []);
    }

    const packageId = cleanString(payload.packageId);
    const activationOffers = this.getAvailableActivationOffers({
      theme: invitation.template,
      packages: catalog.packages,
      currentPackage: invitation.license?.package ?? null,
    });
    const selectedPackage = packageId
      ? activationOffers.find((item) => item.id === packageId)
      : activationOffers[0];

    if (!selectedPackage) {
      throw new BadRequestException('Paket aktivasi tidak tersedia untuk tema undangan ini.');
    }

    const pricing = calculateThemeActivationCheckout({
      basePrice: toNumber(parseJsonObject(selectedPackage.features_json).basePrice, THEME_ACTIVATION_BASE_PRICE),
      specialPrice: toNumber(parseJsonObject(selectedPackage.features_json).specialPrice, Number(selectedPackage.price)),
      voucherDiscountAmount: 0,
    });

    await this.db.$transaction(async (tx) => {
      const existingOrder = await tx.order.findFirst({
        where: {
          user_id: user.id,
          status: 'pending',
          deleted_at: null,
          notes: this.buildCartNote(invitation.id),
        },
      });

      const order =
        existingOrder ??
        (await tx.order.create({
          data: {
            user_id: user.id,
            status: 'pending',
            total_amount: pricing.totalAmount,
            currency: selectedPackage.currency,
            checkout_token: generateCheckoutToken(),
            notes: this.buildCartNote(invitation.id),
          },
        }));

      await tx.orderItem.updateMany({
        where: {
          order_id: order.id,
          deleted_at: null,
        },
        data: {
          deleted_at: new Date(),
        },
      });

      await tx.payment.updateMany({
        where: {
          order_id: order.id,
          deleted_at: null,
          status: 'pending',
        },
        data: {
          deleted_at: new Date(),
        },
      });

      await tx.orderItem.create({
        data: {
          order_id: order.id,
          template_id: invitation.template_id,
          package_id: selectedPackage.id,
          qty: 1,
          unit_price_snapshot: pricing.originalAmount,
          subtotal: pricing.originalAmount,
          metadata: {
            invitationId: invitation.id,
            kind: CART_KIND_ACTIVATION,
            themeId: invitation.template_id,
            themeCode: invitation.template.code,
            themeName: invitation.template.name,
            basePrice: pricing.originalAmount,
            specialPrice: pricing.totalAmount,
            priceMode: pricing.priceMode,
            discountAmount: pricing.discountAmount,
            voucherCode: null,
            specialDiscountPercent: pricing.specialDiscountPercent,
          },
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          total_amount: pricing.totalAmount,
          currency: selectedPackage.currency,
          expired_at: null,
        },
      });
    });

    return this.buildCartPayload(user.id, invitation.id);
  }

  async upsertThemeAddonCart(
    authUser: AuthRequestUser,
    invitationId: string,
    themeIds: string[],
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    if (invitation.status !== 'published' || !invitation.license_id) {
      throw new BadRequestException('Tema add-on hanya bisa dibeli setelah undangan utama aktif.');
    }

    const catalog = await this.ensureCatalog();
    const requestedThemeIds = Array.from(new Set(themeIds.map((item) => cleanString(item)).filter(Boolean))).slice(0, 2);
    if (requestedThemeIds.length === 0) {
      throw new BadRequestException('Pilih minimal satu tema add-on.');
    }

    const selectedThemes = requestedThemeIds.map((themeId) =>
      catalog.themes.find((item) => item.id === themeId || item.code === themeId),
    );
    if (selectedThemes.some((theme) => !theme)) {
      throw new BadRequestException('Tema add-on tidak tersedia.');
    }
    selectedThemes.forEach((theme) => this.assertThemeAvailableForSelection(theme));
    if (selectedThemes.some((theme) => theme!.id === invitation.template_id)) {
      throw new BadRequestException('Tema utama undangan sudah aktif dan tidak perlu dibeli sebagai add-on.');
    }

    const alreadyAccessible = selectedThemes.find((theme) =>
      this.hasActiveThemeAccess(invitation.invitation_theme_accesses, theme!.id),
    );
    if (alreadyAccessible) {
      throw new BadRequestException(`Tema ${alreadyAccessible.name} sudah terbuka untuk undangan ini.`);
    }

    const addonPackages = catalog.packages
      .filter((item) => item.package_type === PackageType.add_on)
      .filter((item) => cleanString(parseJsonObject(item.features_json).featureCode) === 'theme_add_on')
      .sort((left, right) => toNumber(parseJsonObject(left.features_json).addonSlot, 1) - toNumber(parseJsonObject(right.features_json).addonSlot, 1));
    const firstPackage = addonPackages[0];
    const secondPackage = addonPackages[1] ?? firstPackage;
    if (!firstPackage || !secondPackage) {
      throw new BadRequestException('Paket tema add-on belum tersedia.');
    }

    const cartThemes = buildThemeAddonCartItems(
      selectedThemes.map((theme) => ({
        templateId: theme!.id,
        themeCode: theme!.code,
        themeName: theme!.name,
      })),
      {
        firstPrice: Number(firstPackage.price),
        secondPrice: Number(secondPackage.price),
        normalPrice: toNumber(parseJsonObject(secondPackage.features_json).normalPrice, Number(firstPackage.price)),
      },
    );
    const totalAmount = cartThemes.reduce((total, item) => total + item.unitPrice, 0);

    await this.db.$transaction(async (tx) => {
      const existingOrder = await tx.order.findFirst({
        where: {
          user_id: user.id,
          status: 'pending',
          deleted_at: null,
          notes: this.buildCartNote(invitation.id),
        },
      });

      const order =
        existingOrder ??
        (await tx.order.create({
          data: {
            user_id: user.id,
            status: 'pending',
            total_amount: totalAmount,
            currency: 'IDR',
            checkout_token: generateCheckoutToken(),
            notes: this.buildCartNote(invitation.id),
          },
        }));

      await tx.orderItem.updateMany({
        where: { order_id: order.id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
      await tx.payment.updateMany({
        where: { order_id: order.id, deleted_at: null, status: 'pending' },
        data: { deleted_at: new Date() },
      });

      for (const item of cartThemes) {
        const selectedPackage = item.addonSlot === 1 ? firstPackage : secondPackage;
        await tx.orderItem.create({
          data: {
            order_id: order.id,
            template_id: item.templateId,
            package_id: selectedPackage.id,
            qty: 1,
            unit_price_snapshot: item.unitPrice,
            subtotal: item.unitPrice,
            metadata: {
              invitationId: invitation.id,
              kind: CART_KIND_THEME_ADDON,
              themeId: item.templateId,
              themeCode: item.themeCode,
              themeName: item.themeName,
              addonSlot: item.addonSlot,
              normalPrice: item.normalPrice,
              discountAmount: item.normalPrice - item.unitPrice,
              voucherCode: null,
            },
          },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          total_amount: totalAmount,
          currency: 'IDR',
          expired_at: null,
        },
      });
    });

    return this.buildCartPayload(user.id, invitation.id);
  }

  async getCart(authUser: AuthRequestUser, invitationId: string) {
    const user = await this.getCurrentUser(authUser);
    await this.getOwnedInvitation(user.id, invitationId);
    return this.buildCartPayload(user.id, invitationId);
  }

  async applyVoucher(
    authUser: AuthRequestUser,
    invitationId: string,
    code: string,
  ) {
    const user = await this.getCurrentUser(authUser);
    await this.getOwnedInvitation(user.id, invitationId);
    const order = await this.getPendingCartOrder(user.id, invitationId);

    if (!order || !order.order_items[0]) {
      throw new BadRequestException('Keranjang belum tersedia.');
    }

    const orderItems = sortThemeAddonOrderItemsForFulfillment(order.order_items);
    const item = orderItems[0];
    const itemMetadata = parseJsonObject(item.metadata);
    if (itemMetadata.kind !== CART_KIND_ACTIVATION) {
      throw new BadRequestException('Voucher hanya berlaku untuk aktivasi tema utama.');
    }
    const originalAmount = Number(item.subtotal);
    const voucher = await this.getVoucher(code, user.id, item.package_id, originalAmount);
    if (!voucher) {
      throw new BadRequestException('Kode voucher tidak valid.');
    }

    const discountAmount = this.calculateVoucherDiscount(originalAmount, voucher);
    const nextPricing = calculateThemeActivationCheckout({
      basePrice: originalAmount,
      specialPrice: toNumber(itemMetadata.specialPrice, THEME_ACTIVATION_SPECIAL_PRICE),
      voucherDiscountAmount: discountAmount,
    });

    await this.db.$transaction(async (tx) => {
      await tx.orderItem.update({
        where: { id: item.id },
        data: {
          metadata: {
            ...itemMetadata,
            voucherCode: voucher.code,
            discountAmount: nextPricing.discountAmount,
            voucherLabel: voucher.label,
            priceMode: nextPricing.priceMode,
          },
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          total_amount: nextPricing.totalAmount,
        },
      });
    });

    return this.buildCartPayload(user.id, invitationId);
  }

  async createPayment(
    authUser: AuthRequestUser,
    invitationId: string,
    method: string,
  ) {
    const user = await this.getCurrentUser(authUser);
    await this.getOwnedInvitation(user.id, invitationId);
    const order = await this.getPendingCartOrder(user.id, invitationId);

    if (!order || !order.order_items[0]) {
      throw new BadRequestException('Keranjang belum tersedia.');
    }

    if (!isPaymentMethod(method)) {
      throw new BadRequestException('Metode pembayaran tidak tersedia.');
    }

    const totalAmount = Number(order.total_amount);
    const paymentPayload = this.buildMockPaymentPayload(method, order.id, totalAmount);
    const orderItems = sortThemeAddonOrderItemsForFulfillment(order.order_items);
    const item = orderItems[0];
    const itemMetadata = parseJsonObject(item.metadata);

    await this.db.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: {
          order_id: order.id,
          deleted_at: null,
          status: 'pending',
        },
        data: {
          deleted_at: new Date(),
        },
      });

      await tx.payment.create({
        data: {
          order_id: order.id,
          method,
          status: PaymentStatus.pending,
          provider_ref: `mock-${order.id}-${Date.now()}`,
          amount: totalAmount,
          metadata: {
            ...paymentPayload,
            invitationId,
            kind:
              typeof itemMetadata.kind === 'string'
                ? itemMetadata.kind
                : CART_KIND_ACTIVATION,
            packageId: item.package_id,
            items: orderItems.map((orderItem) => {
              const metadata = parseJsonObject(orderItem.metadata);
              return {
                packageId: orderItem.package_id,
                templateId: orderItem.template_id,
                kind: metadata.kind === CART_KIND_THEME_ADDON ? CART_KIND_THEME_ADDON : CART_KIND_ACTIVATION,
                themeCode: cleanString(metadata.themeCode) || orderItem.template.code,
                amount: Number(orderItem.subtotal),
              };
            }),
            voucherCode:
              typeof itemMetadata.voucherCode === 'string'
                ? itemMetadata.voucherCode
                : null,
            discountAmount: toNumber(itemMetadata.discountAmount, 0),
          },
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          expired_at: new Date(paymentPayload.expiredAt),
        },
      });
    });

    return {
      orderId: order.id,
      nextPath: `/cms/payments/${order.id}`,
    };
  }

  async getPaymentDetail(authUser: AuthRequestUser, orderId: string) {
    const user = await this.getCurrentUser(authUser);
    const order = await this.db.order.findFirst({
      where: {
        id: orderId,
        user_id: user.id,
        deleted_at: null,
      },
      include: {
        order_items: {
          where: {
            deleted_at: null,
          },
          include: {
            package: true,
            template: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        payments: {
          where: {
            deleted_at: null,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!order || !order.order_items[0]) {
      throw new NotFoundException('Data pembayaran tidak ditemukan.');
    }

    const item = order.order_items[0];
    const metadata = parseJsonObject(item.metadata);
    const payment = order.payments[0] ?? null;
    const paymentMetadata = parseJsonObject(payment?.metadata);

    return {
      orderId: order.id,
      invitationId:
        typeof metadata.invitationId === 'string' ? metadata.invitationId : null,
      status: payment?.status ?? order.status,
      amount: Number(order.total_amount),
      originalAmount: Number(item.subtotal),
      discountAmount: toNumber(metadata.discountAmount, 0),
      voucherCode: typeof metadata.voucherCode === 'string' ? metadata.voucherCode : null,
      package: {
        id: item.package.id,
        code: item.package.code,
        name: item.package.name,
        price: Number(item.package.price),
        packageType: item.package.package_type,
      },
      payment: payment
        ? {
            id: payment.id,
            method: payment.method,
            status: payment.status,
            total: Number(payment.amount),
            expiredAt:
              typeof paymentMetadata.expiredAt === 'string'
                ? paymentMetadata.expiredAt
                : order.expired_at?.toISOString() ?? null,
            paymentNumber:
              typeof paymentMetadata.paymentNumber === 'string'
                ? paymentMetadata.paymentNumber
                : null,
            instructions: Array.isArray(paymentMetadata.instructions)
              ? paymentMetadata.instructions
              : [],
            paidAt: payment.paid_at?.toISOString() ?? null,
          }
        : null,
    };
  }

  async mockCompletePayment(authUser: AuthRequestUser, orderId: string) {
    const user = await this.getCurrentUser(authUser);
    const order = await this.db.order.findFirst({
      where: {
        id: orderId,
        user_id: user.id,
        deleted_at: null,
      },
      include: {
        order_items: {
          where: {
            deleted_at: null,
          },
          include: {
            package: true,
            template: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        payments: {
          where: {
            deleted_at: null,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!order || !order.order_items[0] || !order.payments[0]) {
      throw new NotFoundException('Transaksi pembayaran tidak ditemukan.');
    }

    const orderItems = sortThemeAddonOrderItemsForFulfillment(order.order_items);
    const item = orderItems[0];
    const itemMetadata = parseJsonObject(item.metadata);
    const voucherCode = cleanString(itemMetadata.voucherCode).toUpperCase();
    const discountAmount = toNumber(itemMetadata.discountAmount, 0);
    const invitationId = cleanString(itemMetadata.invitationId);
    const kind: CartKind = cleanString(itemMetadata.kind) === CART_KIND_THEME_ADDON ? CART_KIND_THEME_ADDON : CART_KIND_ACTIVATION;
    const isAlreadyPaid = order.payments[0].status === PaymentStatus.paid;

    if (!invitationId) {
      throw new BadRequestException('Transaksi tidak terhubung ke undangan.');
    }

    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const currentContent = await this.getCurrentContent(invitation.id);
    const paidAt = order.payments[0].paid_at ?? new Date();
    let addonContent: SapatamuEditorDocumentV3 | null = null;
    let addonFirstTemplateId: string | null = null;
    const addonItems = orderItems.filter(
      (orderItem) => parseJsonObject(orderItem.metadata).kind === CART_KIND_THEME_ADDON,
    );

    if (kind === CART_KIND_THEME_ADDON) {
      const firstAddonItem = addonItems[0];
      addonFirstTemplateId = firstAddonItem.template_id;
      let nextContent = buildContentForThemeSwitch({
        themeId: firstAddonItem.template.code,
        existing: currentContent.content,
        requiredTierCategory: this.getTierCategoryFromTheme(firstAddonItem.template),
      });
      nextContent = await this.applyEditorDefaultsFromDb(firstAddonItem.template_id, nextContent);
      nextContent = await this.applyTemplateAssetsFromDb(firstAddonItem.template_id, nextContent);
      addonContent = nextContent;
    }

    await this.db.$transaction(async (tx) => {
      if (!isAlreadyPaid) {
        await tx.payment.update({
          where: { id: order.payments[0].id },
          data: {
            status: PaymentStatus.paid,
            paid_at: paidAt,
          },
        });

        await tx.order.update({
          where: { id: order.id },
          data: {
            status: 'paid',
          },
        });
      }

      if (voucherCode && discountAmount > 0) {
        const voucher = await tx.voucher.findFirst({
          where: {
            code: voucherCode,
            deleted_at: null,
          },
        });
        if (voucher) {
          await tx.voucherRedemption.create({
            data: {
              voucher_id: voucher.id,
              user_id: user.id,
              order_id: order.id,
              discount_amount: discountAmount,
              metadata: {
                source: 'sapatamu_mock_complete',
                orderItemId: item.id,
              },
            },
          });
        }
      }

      if (kind === CART_KIND_THEME_ADDON) {
        for (const addonItem of addonItems) {
          const existingLicense = await tx.userTemplateLicense.findFirst({
            where: {
              order_item_id: addonItem.id,
              deleted_at: null,
            },
          });
          const license =
            existingLicense ??
            (await tx.userTemplateLicense.create({
              data: {
                user_id: user.id,
                template_id: addonItem.template_id,
                package_id: addonItem.package_id,
                order_item_id: addonItem.id,
                status: 'active',
              },
            }));

          const existingAccess = await tx.invitationThemeAccess.findFirst({
            where: {
              source_order_item_id: addonItem.id,
              deleted_at: null,
            },
          });

          if (!existingAccess) {
            await tx.invitationThemeAccess.create({
              data: {
                user_id: user.id,
                invitation_id: invitation.id,
                template_id: addonItem.template_id,
                user_template_license_id: license.id,
                source_order_item_id: addonItem.id,
                access_type: 'addon_owner',
                starts_at: paidAt,
                expires_at: null,
              },
            });
          }
        }

        if (addonContent && addonFirstTemplateId && invitation.template_id !== addonFirstTemplateId) {
          await this.saveContentVersion({
            tx,
            invitationId: invitation.id,
            userId: user.id,
            nextContent: addonContent,
          });

          await tx.invitation.update({
            where: { id: invitation.id },
            data: {
              template_id: addonFirstTemplateId,
              title: buildInvitationTitleFromContent(addonContent),
              groom_name: cleanString(addonContent.profiles[0]?.fullName) || null,
              bride_name: cleanString(addonContent.profiles[1]?.fullName) || null,
            },
          });
        }
        return;
      }

      const existingLicense = await tx.userTemplateLicense.findFirst({
        where: {
          order_item_id: item.id,
          deleted_at: null,
        },
      });
      const license =
        existingLicense ??
        (await tx.userTemplateLicense.create({
          data: {
            user_id: user.id,
            template_id: invitation.template_id,
            package_id: item.package_id,
            order_item_id: item.id,
            status: 'active',
          },
        }));

      const existingAccess = await tx.invitationThemeAccess.findFirst({
        where: {
          source_order_item_id: item.id,
          deleted_at: null,
        },
      });

      if (!existingAccess) {
        await tx.invitationThemeAccess.create({
          data: {
            user_id: user.id,
            invitation_id: invitation.id,
            template_id: invitation.template_id,
            user_template_license_id: license.id,
            source_order_item_id: item.id,
            access_type: 'primary',
            starts_at: paidAt,
            expires_at: null,
          },
        });
      }

      if (invitation.status === 'published' && invitation.license_id) {
        return;
      }

      const nextContent = mergeContentPatch(currentContent.content, {
        albumSettings: {
          basePhotoQuota: this.getBasePhotoQuota(item.package),
        },
        settings: {
          ...currentContent.content.settings,
          commerce: {
            ...currentContent.content.settings.commerce,
            selectedPackageCode: item.package.code,
            activationState: 'active',
          },
          activatedAtDisplay:
            currentContent.content.settings.activatedAtDisplay ?? paidAt.toISOString(),
        },
      });

      await this.saveContentVersion({
        tx,
        invitationId: invitation.id,
        userId: user.id,
        nextContent,
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          license_id: license.id,
          status: 'published',
          published_at: invitation.published_at ?? paidAt,
        },
      });
    });

    return this.getPaymentDetail(authUser, order.id);
  }

  async handlePakasirWebhook(payload: Record<string, unknown>) {
    return {
      received: true,
      orderId: cleanString(payload.order_id),
      status: cleanString(payload.status) || 'pending',
    };
  }

  async getWorkspace(authUser: AuthRequestUser, invitationId: string) {
    const user = await this.getCurrentUser(authUser);
    return this.buildWorkspace(invitationId, user.id);
  }

  async getEditor(authUser: AuthRequestUser, invitationId: string) {
    const user = await this.getCurrentUser(authUser);
    return this.buildEditorPayload(invitationId, user.id);
  }

  async patchEditorDocument(
    authUser: AuthRequestUser,
    invitationId: string,
    payload: {
      baseVersion?: number;
      operations?: SapatamuEditorPatchOperation[];
    },
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);

    const current = await this.getCurrentContent(invitation.id);
    const baseVersion = typeof payload.baseVersion === 'number' ? payload.baseVersion : current.record?.version ?? 1;
    if ((current.record?.version ?? 1) !== baseVersion) {
      throw new ConflictException('Versi editor sudah berubah. Muat ulang editor untuk melanjutkan.');
    }

    const operations = Array.isArray(payload.operations) ? payload.operations : [];
    if (operations.length === 0) {
      throw new BadRequestException('Tidak ada perubahan editor yang dikirim.');
    }

    let nextContent = applyEditorPatchOperations(current.content, operations);
    nextContent = buildContentFromDraft({
      themeId: nextContent.selectedTheme,
      profiles: nextContent.profiles,
      events: nextContent.events,
      basePhotoQuota: nextContent.albumSettings.basePhotoQuota,
      requiredTierCategory: nextContent.settings.commerce.requiredTierCategory,
      existing: nextContent,
    });

    await this.db.$transaction(async (tx) => {
      await this.saveContentVersion({
        tx,
        invitationId: invitation.id,
        userId: user.id,
        nextContent,
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          title: buildInvitationTitleFromContent(nextContent),
          groom_name: cleanString(nextContent.profiles[0]?.fullName) || null,
          bride_name: cleanString(nextContent.profiles[1]?.fullName) || null,
        },
      });
    });

    return this.buildEditorPayload(invitation.id, user.id);
  }

  async applyEditorTheme(
    authUser: AuthRequestUser,
    invitationId: string,
    payload: {
      baseVersion?: number;
      themeId?: string;
    },
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);

    const current = await this.getCurrentContent(invitation.id);
    const baseVersion = typeof payload.baseVersion === 'number' ? payload.baseVersion : current.record?.version ?? 1;
    if ((current.record?.version ?? 1) !== baseVersion) {
      throw new ConflictException('Versi editor sudah berubah. Muat ulang editor untuk melanjutkan.');
    }

    const requestedTheme = cleanString(payload.themeId);
    if (!requestedTheme) {
      throw new BadRequestException('Tema yang ingin dipakai belum dipilih.');
    }

    const catalog = await this.ensureCatalog();
    const selectedTheme = catalog.themes.find(
      (item) => item.id === requestedTheme || item.code === requestedTheme,
    );
    if (!selectedTheme) {
      throw new BadRequestException('Tema yang dipilih tidak tersedia.');
    }
    this.assertThemeAvailableForSelection(selectedTheme);
    await this.ensureThemeAccessForApply({
      userId: user.id,
      invitation,
      templateId: selectedTheme.id,
    });

    const targetTierCategory = this.getTierCategoryFromTheme(selectedTheme);
    let nextContent = buildContentForThemeSwitch({
      themeId: selectedTheme.code,
      existing: current.content,
      requiredTierCategory: targetTierCategory,
    });
    nextContent = await this.applyEditorDefaultsFromDb(selectedTheme.id, nextContent);
    nextContent = await this.applyTemplateAssetsFromDb(selectedTheme.id, nextContent);

    await this.db.$transaction(async (tx) => {
      await this.saveContentVersion({
        tx,
        invitationId: invitation.id,
        userId: user.id,
        nextContent,
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          template_id: selectedTheme.id,
          title: buildInvitationTitleFromContent(nextContent),
          groom_name: cleanString(nextContent.profiles[0]?.fullName) || null,
          bride_name: cleanString(nextContent.profiles[1]?.fullName) || null,
        },
      });
    });

    return this.buildEditorPayload(invitation.id, user.id);
  }

  async previewEditorTheme(
    authUser: AuthRequestUser,
    invitationId: string,
    payload: {
      themeId?: string;
    },
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const current = await this.getCurrentContent(invitation.id);
    const requestedTheme = cleanString(payload.themeId);
    if (!requestedTheme) {
      throw new BadRequestException('Tema preview belum dipilih.');
    }

    const catalog = await this.ensureCatalog();
    const selectedTheme = catalog.themes.find(
      (item) => item.id === requestedTheme || item.code === requestedTheme,
    );
    if (!selectedTheme) {
      throw new BadRequestException('Tema preview tidak tersedia.');
    }
    this.assertThemeAvailableForSelection(selectedTheme);

    let previewDocument = buildContentForThemeSwitch({
      themeId: selectedTheme.code,
      existing: current.content,
      requiredTierCategory: this.getTierCategoryFromTheme(selectedTheme),
    });
    previewDocument = await this.applyEditorDefaultsFromDb(selectedTheme.id, previewDocument);
    previewDocument = await this.applyTemplateAssetsFromDb(selectedTheme.id, previewDocument);

    const hasAccess = this.hasActiveThemeAccess(invitation.invitation_theme_accesses, selectedTheme.id);
    return {
      invitationId: invitation.id,
      theme: {
        id: selectedTheme.id,
        code: selectedTheme.code,
        name: selectedTheme.name,
      },
      canApplyLive: hasAccess,
      document: previewDocument,
      currentVersion: current.record?.version ?? 1,
    };
  }

  async reorderEditorPages(
    authUser: AuthRequestUser,
    invitationId: string,
    payload: {
      baseVersion?: number;
      orderedUniqueIds?: number[];
    },
  ) {
    return this.patchEditorDocument(authUser, invitationId, {
      baseVersion: payload.baseVersion,
      operations: [
        {
          type: 'reorder_pages',
          orderedUniqueIds: Array.isArray(payload.orderedUniqueIds) ? payload.orderedUniqueIds : [],
        },
      ],
    });
  }

  async toggleEditorPage(
    authUser: AuthRequestUser,
    invitationId: string,
    uniqueId: number,
    payload: { baseVersion?: number; isActive?: boolean },
  ) {
    return this.patchEditorDocument(authUser, invitationId, {
      baseVersion: payload.baseVersion,
      operations: [
        {
          type: 'set_page_field',
          uniqueId,
          path: 'isActive',
          value: Boolean(payload.isActive),
        },
      ],
    });
  }

  async addEditorPage(
    authUser: AuthRequestUser,
    invitationId: string,
    payload: {
      baseVersion?: number;
      layoutCode?: string;
      afterUniqueId?: number;
    },
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);

    const current = await this.getCurrentContent(invitation.id);
    const baseVersion = typeof payload.baseVersion === 'number' ? payload.baseVersion : current.record?.version ?? 1;
    if ((current.record?.version ?? 1) !== baseVersion) {
      throw new ConflictException('Versi editor sudah berubah. Muat ulang editor untuk melanjutkan.');
    }

    const layoutCode = cleanString(payload.layoutCode);
    if (!layoutCode) {
      throw new BadRequestException('Layout yang ingin ditambahkan belum dipilih.');
    }

    const catalog = await this.buildEditorLayoutCatalogFromDb({
      themeId: current.content.selectedTheme,
      templateId: invitation.template_id,
      profiles: current.content.profiles,
      events: current.content.events,
    });
    const layout = findLayoutByCode(catalog, layoutCode);
    if (!layout) {
      throw new NotFoundException('Layout yang dipilih tidak ditemukan.');
    }

    const packageFeatures = buildEditorPackageFeatures(
      current.content.settings.commerce.requiredTierCategory,
    );

    if (
      this.getPackageRank(packageFeatures.tierCategory) <
      this.getPackageRank(layout.requiredTier)
    ) {
      throw new BadRequestException(
        `Layout ${layout.title} membutuhkan paket ${layout.requiredTier}.`,
      );
    }

    const existingCount = current.content.editor.pages.filter(
      (page) => page.family === layout.family || page.layoutCode === layout.layoutCode,
    ).length;
    if (existingCount >= layout.maxInstances) {
      throw new BadRequestException(`Maksimal ${layout.maxInstances} layout untuk jenis ini.`);
    }

    const page = createPageFromLayoutCode({
      catalog,
      layoutCode,
      uniqueId:
        current.content.editor.pages.reduce((max, item) => Math.max(max, item.uniqueId), 0) + 1,
      source: 'addon',
      packageFeatures,
    });

    if (!page) {
      throw new NotFoundException('Layout yang dipilih tidak ditemukan.');
    }

    return this.patchEditorDocument(authUser, invitationId, {
      baseVersion,
      operations: [
        {
          type: 'add_page',
          page,
          afterUniqueId:
            typeof payload.afterUniqueId === 'number' ? payload.afterUniqueId : undefined,
        },
      ],
    });
  }

  async removeEditorPage(
    authUser: AuthRequestUser,
    invitationId: string,
    uniqueId: number,
    payload: { baseVersion?: number },
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);

    const current = await this.getCurrentContent(invitation.id);
    const target = current.content.editor.pages.find((page) => page.uniqueId === uniqueId);
    if (!target) {
      throw new NotFoundException('Layout editor tidak ditemukan.');
    }
    if (target.source !== 'addon') {
      throw new BadRequestException('Layout bawaan tidak dapat dihapus.');
    }

    return this.patchEditorDocument(authUser, invitationId, {
      baseVersion: payload.baseVersion,
      operations: [
        {
          type: 'remove_page',
          uniqueId,
        },
      ],
    });
  }

  async uploadEditorMedia(
    authUser: AuthRequestUser,
    invitationId: string,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File media belum dipilih.');
    }

    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);

    if (file.size > SAPATAMU_EDITOR_MAX_SIZE_BYTES) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new BadRequestException(
        `Ukuran file terlalu besar. Maksimal ${formatUploadSize(SAPATAMU_EDITOR_MAX_SIZE_BYTES)} per media.`,
      );
    }

    const { fileTypeFromFile } = await import('file-type');
    const detectedType = await fileTypeFromFile(file.path);
    const extensionFromName = extname(file.originalname).toLowerCase();
    const detectedExtension = detectedType ? `.${detectedType.ext.toLowerCase()}` : '';

    if (
      !detectedType ||
      !SAPATAMU_EDITOR_ALLOWED_MIME_TYPES.includes(detectedType.mime.toLowerCase()) ||
      !SAPATAMU_EDITOR_ALLOWED_EXTENSIONS.includes(detectedExtension)
    ) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new UnsupportedMediaTypeException(
        'Gunakan file JPG, PNG, WEBP, atau MP4 yang valid.',
      );
    }

    if (
      extensionFromName &&
      SAPATAMU_EDITOR_ALLOWED_EXTENSIONS.includes(extensionFromName) &&
      extensionFromName !== detectedExtension
    ) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new UnsupportedMediaTypeException(
        'Ekstensi file tidak sesuai dengan isi file yang diunggah.',
      );
    }

    const extension = detectedExtension || extensionFromName;
    const editorFolder = join(
      process.cwd(),
      'uploads',
      'invitations',
      invitation.id,
      'editor-media',
    );
    const targetFileName = `${Date.now()}-${randomBytes(4).toString('hex')}${extension}`;
    const targetPath = join(editorFolder, targetFileName);
    fs.mkdirSync(editorFolder, { recursive: true });
    fs.renameSync(file.path, targetPath);

    const mediaType =
      detectedType.mime.toLowerCase() === 'video/mp4'
        ? InvitationMediaType.video
        : InvitationMediaType.image;
    const currentMedia = await this.db.invitationMedia.findMany({
      where: {
        invitation_id: invitation.id,
        deleted_at: null,
      },
    });

    await this.db.invitationMedia.create({
      data: {
        invitation_id: invitation.id,
        media_type: mediaType,
        url: toUploadUrl(targetPath),
        file_name: file.originalname,
        sort_order: currentMedia.length,
        metadata: {
          ext: extension.replace('.', '').toLowerCase(),
          size: file.size,
          mime: detectedType.mime.toLowerCase(),
        },
      },
    });

    return this.buildEditorPayload(invitation.id, user.id);
  }

  async updateProfiles(
    authUser: AuthRequestUser,
    invitationId: string,
    payload: Record<string, unknown>,
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);
    const current = await this.getCurrentContent(invitation.id);
    const nextContent = mergeContentPatch(current.content, {
      profiles: normalizeProfiles(payload.profiles),
    });

    await this.db.$transaction(async (tx) => {
      await this.saveContentVersion({
        tx,
        invitationId: invitation.id,
        userId: user.id,
        nextContent,
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          title: buildInvitationTitleFromContent(nextContent),
          groom_name: cleanString(nextContent.profiles[0]?.fullName) || null,
          bride_name: cleanString(nextContent.profiles[1]?.fullName) || null,
        },
      });
    });

    return this.buildWorkspace(invitation.id, user.id);
  }

  async updateEvents(
    authUser: AuthRequestUser,
    invitationId: string,
    payload: Record<string, unknown>,
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);
    const current = await this.getCurrentContent(invitation.id);
    const nextContent = mergeContentPatch(current.content, {
      events: normalizeEvents(payload.events),
    });

    const primaryEvent = nextContent.events.find((item) => item.enabled) ?? nextContent.events[0];

    await this.db.$transaction(async (tx) => {
      await this.saveContentVersion({
        tx,
        invitationId: invitation.id,
        userId: user.id,
        nextContent,
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          event_date: combineDateTime(primaryEvent?.date ?? '', primaryEvent?.timeStart ?? ''),
        },
      });
    });

    return this.buildWorkspace(invitation.id, user.id);
  }

  async updateSend(
    authUser: AuthRequestUser,
    invitationId: string,
    payload: Record<string, unknown>,
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);
    const current = await this.getCurrentContent(invitation.id);
    const slugRow = await this.db.invitationSlug.findFirst({
      where: {
        invitation_id: invitation.id,
        is_primary: true,
        deleted_at: null,
      },
      orderBy: { created_at: 'desc' },
    });
    const slug = slugRow?.slug ?? slugify(invitation.title);

    const nextContent = mergeContentPatch(current.content, {
      sendSettings: {
        prefaceTemplate: cleanString(payload.prefaceTemplate) || current.content.sendSettings.prefaceTemplate,
      },
    });

    const guests = Array.isArray(payload.guests) ? (payload.guests as GuestInput[]) : null;

    await this.db.$transaction(async (tx) => {
      await this.saveContentVersion({
        tx,
        invitationId: invitation.id,
        userId: user.id,
        nextContent,
      });

      if (guests) {
        const existing = await tx.invitationGuest.findMany({
          where: {
            invitation_id: invitation.id,
            deleted_at: null,
          },
        });

        const keptIds = new Set<string>();

        for (const guest of guests) {
          const name = cleanString(guest.name);
          if (!name) continue;

          const metadata = this.buildGuestMetadata(guest);

          if (guest.id && existing.some((item) => item.id === guest.id)) {
            keptIds.add(guest.id);
            await tx.invitationGuest.update({
              where: { id: guest.id },
              data: {
                name,
                phone_number: cleanString(guest.phoneNumber) || null,
                email: null,
                notes: null,
                metadata,
                personalized_url: this.buildPersonalizedUrl(slug, name),
              },
            });
            continue;
          }

          const created = await tx.invitationGuest.create({
            data: {
              invitation_id: invitation.id,
              name,
              phone_number: cleanString(guest.phoneNumber) || null,
              email: null,
              notes: null,
              guest_key: buildGuestKey(name),
              personalized_url: this.buildPersonalizedUrl(slug, name),
              metadata,
            },
          });
          keptIds.add(created.id);
        }

        const removed = existing.filter((item) => !keptIds.has(item.id));
        if (removed.length > 0) {
          await tx.invitationGuest.updateMany({
            where: {
              id: {
                in: removed.map((item) => item.id),
              },
            },
            data: {
              deleted_at: new Date(),
            },
          });
        }
      }
    });

    return this.buildWorkspace(invitation.id, user.id);
  }

  async updateSettings(
    authUser: AuthRequestUser,
    invitationId: string,
    payload: Record<string, unknown>,
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);
    const current = await this.getCurrentContent(invitation.id);

    const nextSlug = cleanString(payload.slugCandidate);
    if (nextSlug) {
      const currentPrimary = await this.db.invitationSlug.findFirst({
        where: {
          invitation_id: invitation.id,
          is_primary: true,
          deleted_at: null,
        },
        orderBy: { created_at: 'desc' },
      });

      if (nextSlug !== currentPrimary?.slug) {
        await this.assertSlugAvailability(nextSlug, {
          excludeInvitationId: invitation.id,
        });

        await this.db.$transaction(async (tx) => {
          if (currentPrimary) {
            await tx.invitationSlug.update({
              where: { id: currentPrimary.id },
              data: { is_primary: false },
            });
          }

          await tx.invitationSlug.create({
            data: {
              invitation_id: invitation.id,
              slug: slugify(nextSlug),
              is_primary: true,
              created_by: 'user',
            },
          });
        });
      }
    }

    const nextMusicMode =
      payload.musicMode === 'none' || payload.musicMode === 'library' || payload.musicMode === 'youtube'
        ? payload.musicMode
        : current.content.musicSettings.mode;
    const nextMusicValue =
      nextMusicMode === 'none'
        ? ''
        : cleanString(payload.musicValue) || current.content.musicSettings.value;

    const nextContent = mergeContentPatch(current.content, {
      meta: {
        titleTemplate:
          cleanString(payload.metaTitleTemplate) || current.content.meta.titleTemplate,
        description:
          cleanString(payload.metaDescription) || current.content.meta.description,
        imageUrl:
          cleanString(payload.metaImageUrl) || current.content.meta.imageUrl || null,
      },
      musicSettings: {
        mode: nextMusicMode,
        value: nextMusicValue,
      },
      extraLinks: {
        youtube: cleanString(payload.extraYoutube) || current.content.extraLinks.youtube,
      },
      settings: {
        ...current.content.settings,
        giftAccounts: Array.isArray(payload.giftAccounts)
          ? payload.giftAccounts
              .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
              .map((item) => ({
                bankName: cleanString(item.bankName),
                accountNumber: cleanString(item.accountNumber),
                accountHolder: cleanString(item.accountHolder),
              }))
              .filter((item) => item.bankName || item.accountNumber || item.accountHolder)
              .slice(0, 2)
          : current.content.settings.giftAccounts,
        giftAddress:
          typeof payload.giftAddress === 'string'
            ? cleanString(payload.giftAddress)
            : current.content.settings.giftAddress,
      },
    });

    await this.db.$transaction(async (tx) => {
      await this.saveContentVersion({
        tx,
        invitationId: invitation.id,
        userId: user.id,
        nextContent,
      });
    });

    return this.buildWorkspace(invitation.id, user.id);
  }

  async uploadAlbumImage(
    authUser: AuthRequestUser,
    invitationId: string,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File foto belum dipilih.');
    }

    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);
    const workspace = await this.buildWorkspace(invitation.id, user.id);

    if (workspace.album.usedPhotoQuota >= workspace.album.allowedPhotoQuota) {
      throw new BadRequestException(`Maksimal ${SAPATAMU_MAX_ALBUM_PHOTOS} foto dapat diunggah untuk satu undangan.`);
    }

    if (file.size > SAPATAMU_ALBUM_MAX_SIZE_BYTES) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new BadRequestException(
        `Ukuran file terlalu besar. Maksimal ${formatUploadSize(SAPATAMU_ALBUM_MAX_SIZE_BYTES)} per foto.`,
      );
    }

    const { fileTypeFromFile } = await import('file-type');
    const detectedType = await fileTypeFromFile(file.path);
    const extensionFromName = extname(file.originalname).toLowerCase();
    const detectedExtension = detectedType ? `.${detectedType.ext.toLowerCase()}` : '';

    if (
      !detectedType ||
      !SAPATAMU_ALBUM_ALLOWED_MIME_TYPES.includes(detectedType.mime.toLowerCase()) ||
      !SAPATAMU_ALBUM_ALLOWED_EXTENSIONS.includes(detectedExtension)
    ) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new UnsupportedMediaTypeException(
        'Gunakan file foto JPG, PNG, atau WEBP yang valid.',
      );
    }

    if (
      extensionFromName &&
      SAPATAMU_ALBUM_ALLOWED_EXTENSIONS.includes(extensionFromName) &&
      extensionFromName !== detectedExtension
    ) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new UnsupportedMediaTypeException(
        'Ekstensi file tidak sesuai dengan isi file yang diunggah.',
      );
    }

    const extension = detectedExtension || extensionFromName;
    const albumFolder = join(
      process.cwd(),
      'uploads',
      'invitations',
      invitation.id,
      'album',
    );
    const targetFileName = `${Date.now()}-${randomBytes(4).toString('hex')}${extension}`;
    const targetPath = join(albumFolder, targetFileName);
    fs.mkdirSync(albumFolder, { recursive: true });
    fs.renameSync(file.path, targetPath);

    await this.db.invitationMedia.create({
      data: {
        invitation_id: invitation.id,
        media_type: InvitationMediaType.image,
        url: toUploadUrl(targetPath),
        file_name: file.originalname,
        sort_order: workspace.album.usedPhotoQuota,
        metadata: {
          ext: extension.replace('.', '').toLowerCase(),
          size: file.size,
        },
      },
    });

    return this.buildWorkspace(invitation.id, user.id);
  }

  async deleteAlbumImage(
    authUser: AuthRequestUser,
    invitationId: string,
    mediaId: string,
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);

    const media = await this.db.invitationMedia.findFirst({
      where: {
        id: mediaId,
        invitation_id: invitation.id,
        deleted_at: null,
      },
    });

    if (!media) {
      throw new NotFoundException('Foto tidak ditemukan.');
    }

    await this.db.invitationMedia.update({
      where: { id: media.id },
      data: {
        deleted_at: new Date(),
      },
    });

    return this.buildWorkspace(invitation.id, user.id);
  }

  async checkoutAlbumQuota(
    authUser: AuthRequestUser,
    invitationId: string,
    packageId: string,
  ) {
    throw new BadRequestException(`Add-on foto sudah tidak tersedia. Setiap undangan dapat mengunggah maksimal ${SAPATAMU_MAX_ALBUM_PHOTOS} foto.`);
  }

  async listHistory(authUser: AuthRequestUser, invitationId: string) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);

    const [contentVersions, slugHistory, featureGrants] = await Promise.all([
      this.db.invitationContent.findMany({
        where: {
          invitation_id: invitation.id,
          deleted_at: null,
        },
        orderBy: { created_at: 'desc' },
        take: 20,
      }),
      this.db.invitationSlug.findMany({
        where: {
          invitation_id: invitation.id,
          deleted_at: null,
        },
        orderBy: { created_at: 'desc' },
        take: 20,
      }),
      this.db.invitationFeatureGrant.findMany({
        where: {
          invitation_id: invitation.id,
          deleted_at: null,
        },
        include: {
          source_order_item: {
            include: {
              order: {
                include: {
                  payments: true,
                },
              },
              package: true,
            },
          },
        },
      }),
    ]);

    const initialPayment = invitation.license?.order_item?.order?.payments?.[0];

    const history = [
      ...contentVersions.map((item) => ({
        id: `content-${item.id}`,
        label: `Konten undangan diperbarui ke versi ${item.version}`,
        type: 'content',
        createdAt: item.created_at,
      })),
      ...slugHistory.map((item) => ({
        id: `slug-${item.id}`,
        label: `Link undangan diperbarui menjadi /${item.slug}`,
        type: 'link',
        createdAt: item.created_at,
      })),
      ...(initialPayment
        ? [
            {
              id: `payment-${initialPayment.id}`,
              label: `Paket ${invitation.license?.package?.name ?? 'Aktif'} berhasil diaktifkan`,
              type: 'payment',
              createdAt: initialPayment.paid_at ?? initialPayment.created_at,
            },
          ]
        : []),
      ...featureGrants.map((item) => ({
        id: `grant-${item.id}`,
        label: `${item.source_order_item.package.name} berhasil ditambahkan`,
        type: 'add_on',
        createdAt:
          item.source_order_item.order.payments[0]?.paid_at ??
          item.source_order_item.created_at,
      })),
    ]
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .slice(0, 30);

    return { history };
  }

  async moderateMessage(
    authUser: AuthRequestUser,
    invitationId: string,
    messageId: string,
    isApproved: boolean,
  ) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);
    const featureGrants = await this.getInvitationFeatureGrants(invitation.id);
    this.assertInvitationEditable(invitation, featureGrants);

    const greeting = await this.db.invitationGreeting.findFirst({
      where: {
        id: messageId,
        invitation_id: invitation.id,
        deleted_at: null,
      },
    });

    if (!greeting) {
      throw new NotFoundException('Pesan tidak ditemukan.');
    }

    await this.db.invitationGreeting.update({
      where: { id: greeting.id },
      data: {
        is_approved: isApproved,
      },
    });

    return this.buildWorkspace(invitation.id, user.id);
  }

  async deleteInvitation(authUser: AuthRequestUser, invitationId: string) {
    const user = await this.getCurrentUser(authUser);
    const invitation = await this.getOwnedInvitation(user.id, invitationId);

    await this.db.$transaction(async (tx) => {
      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          deleted_at: new Date(),
        },
      });

      await tx.invitationSlug.updateMany({
        where: {
          invitation_id: invitation.id,
          deleted_at: null,
        },
        data: {
          deleted_at: new Date(),
        },
      });
    });

    return { deleted: true };
  }
}
