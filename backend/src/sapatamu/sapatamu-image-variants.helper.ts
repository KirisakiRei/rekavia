import * as fs from 'fs';
import { basename, dirname, extname, join } from 'path';

export type SapatamuImageVariantKey = 'thumb' | 'medium' | 'large';

export type SapatamuImageVariantMetadata = {
  url: string;
  width: number;
  format: 'webp';
  size?: number;
};

export type SapatamuImageVariantMap = Partial<
  Record<SapatamuImageVariantKey, SapatamuImageVariantMetadata>
>;

type SapatamuImageVariantConfig = {
  width: number;
  quality: number;
};

export const SAPATAMU_IMAGE_VARIANT_CONFIG: Record<
  SapatamuImageVariantKey,
  SapatamuImageVariantConfig
> = {
  thumb: { width: 640, quality: 74 },
  medium: { width: 1280, quality: 80 },
  large: { width: 1920, quality: 84 },
};

const REQUIRED_IMAGE_VARIANTS: SapatamuImageVariantKey[] = ['thumb', 'medium', 'large'];

type SapatamuImageVariantTarget = SapatamuImageVariantMetadata & {
  path: string;
  quality: number;
};

function filePathToUploadUrl(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  const marker = '/uploads/';
  const index = normalized.lastIndexOf(marker);
  if (index === -1) {
    return `/uploads/${normalized.split('/').pop() ?? 'file'}`;
  }
  return normalized.slice(index);
}

export function uploadUrlToLocalPath(url: string, cwd = process.cwd()): string | null {
  if (!url.startsWith('/uploads/')) return null;
  const safePath = url
    .replace(/^\/uploads\//, '')
    .split('/')
    .filter((part) => part && part !== '..')
    .join('/');
  return join(cwd, 'uploads', safePath);
}

export function buildImageVariantTargets(
  sourcePath: string,
): Record<SapatamuImageVariantKey, SapatamuImageVariantTarget> {
  const sourceDir = dirname(sourcePath);
  const outputDir = join(sourceDir, 'variants');
  const sourceBaseName = basename(sourcePath, extname(sourcePath));

  return Object.fromEntries(
    Object.entries(SAPATAMU_IMAGE_VARIANT_CONFIG).map(([key, config]) => {
      const variantKey = key as SapatamuImageVariantKey;
      const path = join(outputDir, `${sourceBaseName}-${variantKey}.webp`);
      return [
        variantKey,
        {
          path,
          url: filePathToUploadUrl(path),
          width: config.width,
          quality: config.quality,
          format: 'webp' as const,
        },
      ];
    }),
  ) as Record<SapatamuImageVariantKey, SapatamuImageVariantTarget>;
}

export async function generateImageVariants(sourcePath: string): Promise<SapatamuImageVariantMap> {
  const targets = buildImageVariantTargets(sourcePath);
  const sharpModule = await import('sharp');
  const sharp = sharpModule.default;

  fs.mkdirSync(dirname(targets.thumb.path), { recursive: true });

  const entries = await Promise.all(
    Object.entries(targets).map(async ([key, target]) => {
      await sharp(sourcePath)
        .rotate()
        .resize({ width: target.width, withoutEnlargement: true })
        .webp({ quality: target.quality, effort: 4 })
        .toFile(target.path);

      const stat = fs.statSync(target.path);
      const { path: _path, quality: _quality, ...metadata } = target;
      return [key, { ...metadata, size: stat.size }];
    }),
  );

  return Object.fromEntries(entries) as SapatamuImageVariantMap;
}

export function mergeImageVariantMetadata(
  metadata: Record<string, unknown>,
  variants: SapatamuImageVariantMap,
): Record<string, unknown> {
  return {
    ...metadata,
    variants,
  };
}

function parseVariantMetadata(metadata: Record<string, unknown>): SapatamuImageVariantMap {
  const variants = metadata.variants;
  if (!variants || typeof variants !== 'object' || Array.isArray(variants)) return {};
  return variants as SapatamuImageVariantMap;
}

function isVariantFileReachable(url: string, cwd = process.cwd()): boolean {
  const variantPath = uploadUrlToLocalPath(url, cwd);
  return Boolean(variantPath && fs.existsSync(variantPath));
}

function isUsableVariantMetadata(
  value: SapatamuImageVariantMetadata | undefined,
  cwd = process.cwd(),
): boolean {
  if (!value) return false;
  if (!value.url || typeof value.url !== 'string') return false;
  if (!Number.isFinite(value.width) || value.width <= 0) return false;
  if (value.format !== 'webp') return false;
  return isVariantFileReachable(value.url, cwd);
}

export function hasCompleteImageVariants(
  metadata: Record<string, unknown>,
  cwd = process.cwd(),
): boolean {
  const variants = parseVariantMetadata(metadata);
  return REQUIRED_IMAGE_VARIANTS.every((key) =>
    isUsableVariantMetadata(variants[key], cwd),
  );
}

export async function ensureImageVariantMetadata(
  sourceUrl: string,
  metadata: Record<string, unknown>,
  cwd = process.cwd(),
): Promise<{ metadata: Record<string, unknown>; generated: boolean }> {
  if (hasCompleteImageVariants(metadata, cwd)) {
    return { metadata, generated: false };
  }

  const sourcePath = uploadUrlToLocalPath(sourceUrl, cwd);
  if (!sourcePath || !fs.existsSync(sourcePath)) {
    return { metadata, generated: false };
  }

  const variants = await generateImageVariants(sourcePath);
  return {
    metadata: mergeImageVariantMetadata(metadata, variants),
    generated: true,
  };
}
