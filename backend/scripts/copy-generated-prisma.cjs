const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'generated', 'prisma');
const target = path.join(root, 'dist', 'generated', 'prisma');

if (!fs.existsSync(source)) {
  throw new Error(`Generated Prisma client not found: ${source}. Run "npx prisma generate" first.`);
}

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.cpSync(source, target, { recursive: true });

console.log(`[build] copied generated Prisma client to ${path.relative(root, target)}`);
