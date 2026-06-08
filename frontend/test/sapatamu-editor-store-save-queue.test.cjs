const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const storeSource = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'stores', 'sapatamuEditorStore.ts'),
  'utf8',
)

assert.match(storeSource, /while\s*\(\s*get\(\)\.pendingOperations\.length\s*>\s*0\s*\)/)
assert.match(storeSource, /uploadMedia:\s*async[\s\S]*?await get\(\)\.flushPending\(invitationId\)/)
assert.doesNotMatch(
  storeSource,
  /uploadMedia:\s*async[\s\S]*?setResponseState\(set,\s*response\.data\)/,
)

console.log('sapatamu-editor-store-save-queue tests passed')
