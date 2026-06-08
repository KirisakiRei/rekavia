import {
  buildImageVariantTargets,
  mergeImageVariantMetadata,
} from './sapatamu-image-variants.helper';

describe('sapatamu image variant helpers', () => {
  it('builds stable upload urls for generated image variants', () => {
    const targets = buildImageVariantTargets(
      'C:\\app\\uploads\\invitations\\invite-1\\editor-media\\photo.jpeg',
    );

    expect(targets.thumb.url).toBe('/uploads/invitations/invite-1/editor-media/variants/photo-thumb.webp');
    expect(targets.medium.url).toBe('/uploads/invitations/invite-1/editor-media/variants/photo-medium.webp');
    expect(targets.large.url).toBe('/uploads/invitations/invite-1/editor-media/variants/photo-large.webp');
    expect(targets.medium.width).toBe(960);
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
});
