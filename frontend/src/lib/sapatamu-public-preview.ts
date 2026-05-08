export const SIGNATURE_THEME_IDS = ['aishwarya-peonny'] as const
const DEMO_PREVIEW_SLUG_ALIASES: Record<string, string> = {
  'calla-lily-plum-red-lead': 'calla-lily-preview',
  'honeysuckle-seashell': 'honeysuckle-preview',
}

export function isSignatureThemeId(themeId: string): boolean {
  return SIGNATURE_THEME_IDS.includes(themeId as (typeof SIGNATURE_THEME_IDS)[number])
}

export function buildDefaultSapatamuDemoSlug(themeId: string): string {
  const normalized = themeId
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  if (!normalized) return 'sapatamu-preview'

  return DEMO_PREVIEW_SLUG_ALIASES[normalized] ?? `${normalized}-preview`
}

export function buildSapatamuPublicPreviewUrl(themeId: string): string | null {
  if (!themeId || isSignatureThemeId(themeId)) return null
  return `/${buildDefaultSapatamuDemoSlug(themeId)}`
}
