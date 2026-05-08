export type SapatamuPricingPackageLike = {
  code: string
  name: string
  package_type: string
  price: string | number
  features_json?: Record<string, unknown>
  is_active: boolean
}

export type SapatamuPricingItem<TPackage extends SapatamuPricingPackageLike = SapatamuPricingPackageLike> = {
  key: 'luxury' | 'signature' | 'theme-addon-first' | 'theme-addon-second'
  label: string
  description: string
  usage: string
  package: TPackage
}

const SAPATAMU_PRICING_CONFIG = [
  {
    key: 'luxury',
    code: 'sapatamu-signature',
    label: 'Luxury',
    description: 'Harga aktivasi tema utama Luxury.',
    usage: 'Aktivasi tema utama',
    group: 'tiers',
  },
  {
    key: 'signature',
    code: 'sapatamu-vintage',
    label: 'Signature',
    description: 'Tier Signature disiapkan sebagai rilisan berikutnya.',
    usage: 'Coming soon',
    group: 'tiers',
  },
  {
    key: 'theme-addon-first',
    code: 'sapatamu-theme-addon',
    label: 'Tema add-on 1',
    description: 'Harga tema tambahan pertama dari modal editor.',
    usage: 'Modal add-on editor',
    group: 'addOns',
  },
  {
    key: 'theme-addon-second',
    code: 'sapatamu-theme-addon-second',
    label: 'Tema add-on 2',
    description: 'Harga promo tema kedua dalam bundle upsell.',
    usage: 'Upsell tema kedua',
    group: 'addOns',
  },
] as const

export function getSapatamuPricingPackages<TPackage extends SapatamuPricingPackageLike>(packages: TPackage[]) {
  const items: SapatamuPricingItem<TPackage>[] = []

  SAPATAMU_PRICING_CONFIG.forEach((config) => {
    const packageItem = packages.find((pkg) => pkg.code === config.code)
    if (packageItem) {
      items.push({
        key: config.key,
        label: config.label,
        description: config.description,
        usage: config.usage,
        package: packageItem,
      })
    }
  })

  return {
    tiers: items.filter((item) => item.key === 'luxury' || item.key === 'signature'),
    addOns: items.filter((item) => item.key === 'theme-addon-first' || item.key === 'theme-addon-second'),
    all: items,
  }
}
