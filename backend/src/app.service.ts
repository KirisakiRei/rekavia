import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { migrateContentJson } from './sapatamu/sapatamu-content.helper';
import { BRAND } from './sapatamu/workspace-brand.const';

const GOOGLE_MAPS_HOSTS = new Set([
  'maps.app.goo.gl',
  'goo.gl',
  'google.com',
  'www.google.com',
  'maps.google.com',
  'google.co.id',
  'www.google.co.id',
])

type FetchLike = (input: string, init?: RequestInit) => Promise<Pick<Response, 'status' | 'headers'>>

function parseUrl(value: string): URL | null {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function isAllowedGoogleMapsUrl(value: string): boolean {
  const parsed = parseUrl(value)
  if (!parsed || !['http:', 'https:'].includes(parsed.protocol)) return false

  const hostname = parsed.hostname.toLowerCase()
  if (!GOOGLE_MAPS_HOSTS.has(hostname)) return false

  if (hostname === 'maps.app.goo.gl') return true
  if (hostname === 'goo.gl') return parsed.pathname.startsWith('/maps')
  return parsed.pathname.includes('/maps') || hostname === 'maps.google.com'
}

@Injectable()
export class AppService {
  constructor(private readonly db: DatabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async resolveGoogleMapsUrl(url: string, fetcher: FetchLike = fetch): Promise<{ url: string }> {
    const initialUrl = typeof url === 'string' ? url.trim() : '';
    if (!isAllowedGoogleMapsUrl(initialUrl)) {
      return { url: '' };
    }

    let currentUrl = initialUrl;

    for (let redirectCount = 0; redirectCount < 6; redirectCount += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetcher(currentUrl, {
          method: 'HEAD',
          redirect: 'manual',
          signal: controller.signal,
        });
        const location = response.status >= 300 && response.status < 400
          ? response.headers.get('location')
          : null;

        if (!location) return { url: currentUrl };

        const nextUrl = new URL(location, currentUrl).toString();
        if (!isAllowedGoogleMapsUrl(nextUrl)) return { url: '' };
        currentUrl = nextUrl;
      } catch {
        return { url: currentUrl };
      } finally {
        clearTimeout(timeout);
      }
    }

    return { url: currentUrl };
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private resolveMetaTitle(template: string, profiles: Array<{ fullName?: string | null; nickName?: string | null }>) {
    const left = profiles[0]?.nickName || profiles[0]?.fullName || 'Mempelai';
    const right = profiles[1]?.nickName || profiles[1]?.fullName || 'Tamu Undangan';
    return template
      .replaceAll('{{nick-name-1}}', left)
      .replaceAll('{{nick-name-2}}', right)
      .replaceAll('{{full-name-1}}', profiles[0]?.fullName || left)
      .replaceAll('{{full-name-2}}', profiles[1]?.fullName || right);
  }

  async renderPublicInvitationHtml(slug: string, guestName = ''): Promise<string> {
    const slugRow = await this.db.invitationSlug.findFirst({
      where: { slug, is_primary: true, deleted_at: null },
      include: {
        invitation: {
          include: {
            invitation_contents: {
              where: { is_current: true, deleted_at: null },
              orderBy: { version: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    const invitation = slugRow?.invitation;
    const content = migrateContentJson(invitation?.invitation_contents?.[0]?.content_json);
    const title = invitation?.status === 'published'
      ? this.resolveMetaTitle(content.meta.titleTemplate, content.profiles)
      : 'Undangan belum aktif';
    const description = invitation?.status === 'published'
      ? content.meta.description || `Undangan digital ${title}`
      : 'Pemilik undangan belum mengaktifkan halaman publik ini.';
    const imageUrl = content.meta.imageUrl
      ? new URL(content.meta.imageUrl, `https://${BRAND.domain}`).toString()
      : `https://${BRAND.domain}/logo/brand-logo.png`;
    const frontendBase = process.env.FRONTEND_PUBLIC_URL || `https://${BRAND.domain}`;
    const appUrl = `${frontendBase}/${encodeURIComponent(slug)}${guestName ? `?to=${encodeURIComponent(guestName)}` : ''}`;

    return `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${this.escapeHtml(title)}</title>
  <meta name="description" content="${this.escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${this.escapeHtml(title)}" />
  <meta property="og:description" content="${this.escapeHtml(description)}" />
  <meta property="og:image" content="${this.escapeHtml(imageUrl)}" />
  <meta property="og:url" content="${this.escapeHtml(appUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${this.escapeHtml(title)}" />
  <meta name="twitter:description" content="${this.escapeHtml(description)}" />
  <meta name="twitter:image" content="${this.escapeHtml(imageUrl)}" />
</head>
<body>
  <main style="font-family: system-ui, sans-serif; min-height: 100vh; display: grid; place-items: center; color: #241b16;">
    <a href="${this.escapeHtml(appUrl)}" style="color: inherit;">Buka undangan ${this.escapeHtml(title)}</a>
  </main>
  <script>window.location.replace(${JSON.stringify(appUrl)});</script>
</body>
</html>`;
  }
}
