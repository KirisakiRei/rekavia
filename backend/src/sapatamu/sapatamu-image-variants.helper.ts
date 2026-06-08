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
  thumb: { width: 480, quality: 72 },
  medium: { width: 960, quality: 78 },
  large: { width: 1600, quality: 82 },
};

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
