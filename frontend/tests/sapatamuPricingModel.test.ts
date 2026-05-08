import test from 'node:test'
import assert from 'node:assert/strict'
import { getSapatamuPricingPackages } from '../src/pages/admin/sapatamuPricingModel.ts'

const packages = [
  { id: 'old-pro', code: 'pro-1776958090219', name: 'Pro', package_type: 'base', price: 250000, features_json: {}, is_active: true },
  { id: 'old-basic', code: 'sapatamu-basic', name: 'Basic', package_type: 'base', price: 200000, features_json: {}, is_active: true },
  { id: 'luxury', code: 'sapatamu-signature', name: 'Luxury', package_type: 'base', price: 279000, features_json: { basePrice: 349000 }, is_active: true },
  { id: 'signature', code: 'sapatamu-vintage', name: 'Signature', package_type: 'upgrade', price: 0, features_json: { releaseStatus: 'comingSoon' }, is_active: true },
  { id: 'addon-1', code: 'sapatamu-theme-addon', name: 'Theme Add-on', package_type: 'add_on', price: 150000, features_json: { addonSlot: 1 }, is_active: true },
  { id: 'addon-2', code: 'sapatamu-theme-addon-second', name: 'Theme Add-on Second', package_type: 'add_on', price: 75000, features_json: { addonSlot: 2, normalPrice: 150000 }, is_active: true },
]

test('shows only active SapaTamu pricing SKUs used by current commerce', () => {
  const result = getSapatamuPricingPackages(packages)

  assert.deepEqual(result.tiers.map((item) => item.label), ['Luxury', 'Signature'])
  assert.deepEqual(result.addOns.map((item) => item.label), ['Tema add-on 1', 'Tema add-on 2'])
  assert.deepEqual(
    [...result.tiers, ...result.addOns].map((item) => item.package.code),
    ['sapatamu-signature', 'sapatamu-vintage', 'sapatamu-theme-addon', 'sapatamu-theme-addon-second'],
  )
})
