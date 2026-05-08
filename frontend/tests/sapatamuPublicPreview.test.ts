import test from 'node:test'
import assert from 'node:assert/strict'
import { buildSapatamuPublicPreviewUrl, isSignatureThemeId } from '../src/lib/sapatamu-public-preview.ts'

test('builds public preview URLs only for released Luxury themes', () => {
  assert.equal(buildSapatamuPublicPreviewUrl('calla-lily-plum-red-lead'), '/calla-lily-preview')
  assert.equal(buildSapatamuPublicPreviewUrl('honeysuckle-seashell'), '/honeysuckle-preview')
  assert.equal(buildSapatamuPublicPreviewUrl('javanese-magnolia-tan-mahogany'), '/javanese-magnolia-tan-mahogany-preview')
  assert.equal(buildSapatamuPublicPreviewUrl('javanese-linnea-greenish-white'), '/javanese-linnea-greenish-white-preview')
  assert.equal(buildSapatamuPublicPreviewUrl('aishwarya-peonny'), null)
  assert.equal(isSignatureThemeId('aishwarya-peonny'), true)
})
