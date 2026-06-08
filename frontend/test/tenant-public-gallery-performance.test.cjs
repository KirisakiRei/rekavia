const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const tenantSource = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'pages', 'tenant', 'TenantWeddingPage.tsx'),
  'utf8',
)
const editorSource = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'pages', 'cms', 'sapatamu', 'CmsSapatamuEditor.tsx'),
  'utf8',
)

assert.match(tenantSource, /function preloadImagesInBackground/)
assert.doesNotMatch(tenantSource, /await Promise\.all\(\s*criticalUrls\.map/)
assert.match(tenantSource, /void preloadImagesInBackground\(criticalUrls/)
assert.match(tenantSource, /function shouldRenderPublicSlide/)
assert.match(tenantSource, /shouldRenderPublicSlide\(index, publicPageIndex, activeEditorPages\.length\)/)
assert.match(tenantSource, /function getMediaVariantUrl/)
assert.match(tenantSource, /function resolveGalleryVariantUrl/)
assert.match(tenantSource, /resolveGalleryVariantUrl\(item\.url, gallery, 'medium'\)/)
assert.match(tenantSource, /resolveGalleryVariantUrl\(item, gallery, 'large'\)/)
assert.match(tenantSource, /srcSet=\{\[/)
assert.match(editorSource, /resolveGalleryImageUrl\?: \(url: string, usage: 'thumbnail' \| 'lightbox'\) => string/)
assert.match(editorSource, /loading=\{isEditing \? 'eager' : 'lazy'\}/)
assert.match(editorSource, /decoding="async"/)

console.log('tenant-public-gallery-performance tests passed')
