import {
  buildImageVariantTargets,
  hasCompleteImageVariants,
  mergeImageVariantMetadata,
  resolveSharpFactory,
  uploadUrlToLocalPath,
} from './sapatamu-image-variants.helper';
import * as fs from 'fs';
import { join } from 'path';

describe('sapatamu image variant helpers', () => {
  it('builds stable upload urls for generated image variants', () => {
    const targets = buildImageVariantTargets(
      'C:\\app\\uploads\\invitations\\invite-1\\editor-media\\photo.jpeg',
    );

    expect(targets.thumb.url).toBe('/uploads/invitations/invite-1/editor-media/variants/photo-thumb.webp');
    expect(targets.medium.url).toBe('/uploads/invitations/invite-1/editor-media/variants/photo-medium.webp');
    expect(targets.large.url).toBe('/uploads/invitations/invite-1/editor-media/variants/photo-large.webp');
    expect(targets.thumb.width).toBe(640);
    expect(targets.medium.width).toBe(1280);
    expect(targets.large.width).toBe(1920);
  });

  it('merges generated variants without dropping existing upload metadata', () => {
    const metadata = mergeImageVariantMetadata(
      { ext: 'jpg', size: 1234, mime: 'image/jpeg' },
      {
        thumb: {
          url: '/uploads/photo-thumb.webp',
          width: 480,
          format: 'webp',
          size: 100,
        },
      },
    );

    expect(metadata).toEqual({
      ext: 'jpg',
      size: 1234,
      mime: 'image/jpeg',
      variants: {
        thumb: {
          url: '/uploads/photo-thumb.webp',
          width: 480,
          format: 'webp',
          size: 100,
        },
      },
    });
  });

  it('detects when image variants are incomplete or missing on disk', () => {
    const cwd = process.cwd();
    const variantUrls = {
      thumb: '/uploads/test/photo-thumb.webp',
      medium: '/uploads/test/photo-medium.webp',
      large: '/uploads/test/photo-large.webp',
    };
    const variantPaths = Object.values(variantUrls)
      .map((url) => uploadUrlToLocalPath(url, cwd))
      .filter((value): value is string => Boolean(value));

    fs.mkdirSync(join(cwd, 'uploads', 'test'), { recursive: true });
    variantPaths.forEach((path) => fs.writeFileSync(path, 'ok'));

    expect(hasCompleteImageVariants({
      variants: {
        thumb: { url: variantUrls.thumb, width: 640, format: 'webp' },
        medium: { url: variantUrls.medium, width: 1280, format: 'webp' },
        large: { url: variantUrls.large, width: 1920, format: 'webp' },
      },
    }, cwd)).toBe(true);

    fs.rmSync(variantPaths[0], { force: true });

    expect(hasCompleteImageVariants({
      variants: {
        thumb: { url: variantUrls.thumb, width: 640, format: 'webp' },
        medium: { url: variantUrls.medium, width: 1280, format: 'webp' },
        large: { url: variantUrls.large, width: 1920, format: 'webp' },
      },
    }, cwd)).toBe(false);

    variantPaths.slice(1).forEach((path) => fs.rmSync(path, { force: true }));
  });

  it('resolves sharp factory from both cjs and esm-shaped modules', () => {
    const directFactory = jest.fn();
    const defaultFactory = jest.fn();

    expect(resolveSharpFactory(directFactory)).toBe(directFactory);
    expect(resolveSharpFactory({ default: defaultFactory })).toBe(defaultFactory);
    expect(() => resolveSharpFactory({})).toThrow('Sharp module could not be resolved');
  });
});
