export const SAPATAMU_ALBUM_ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
];

export const SAPATAMU_ALBUM_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const SAPATAMU_ALBUM_MAX_SIZE_BYTES = 5 * 1024 * 1024;

export const SAPATAMU_EDITOR_ALLOWED_EXTENSIONS = [
  ...SAPATAMU_ALBUM_ALLOWED_EXTENSIONS,
  '.mp4',
];

export const SAPATAMU_EDITOR_ALLOWED_MIME_TYPES = [
  ...SAPATAMU_ALBUM_ALLOWED_MIME_TYPES,
  'video/mp4',
];

export const SAPATAMU_EDITOR_MAX_SIZE_BYTES = 25 * 1024 * 1024;

export function formatUploadSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} B`;
}
