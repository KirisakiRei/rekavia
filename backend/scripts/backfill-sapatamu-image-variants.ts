import * as fs from 'fs';
import { InvitationMediaType, PrismaClient, type Prisma } from '../generated/prisma';
import {
  ensureImageVariantMetadata,
  generateImageVariants,
  hasCompleteImageVariants,
  mergeImageVariantMetadata,
  uploadUrlToLocalPath,
} from '../src/sapatamu/sapatamu-image-variants.helper';

const prisma = new PrismaClient();

function parseMetadata(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

async function main() {
  const force = process.argv.includes('--force');
  const media = await prisma.invitationMedia.findMany({
    where: {
      deleted_at: null,
      media_type: InvitationMediaType.image,
    },
    orderBy: [{ created_at: 'asc' }],
  });

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of media) {
    const metadata = parseMetadata(item.metadata);
    if (!force && hasCompleteImageVariants(metadata)) {
      skipped += 1;
      continue;
    }

    const filePath = uploadUrlToLocalPath(item.url);
    if (!filePath || !fs.existsSync(filePath)) {
      skipped += 1;
      continue;
    }

    try {
      const ensured = force
        ? {
            metadata: mergeImageVariantMetadata(metadata, await generateImageVariants(filePath)),
            generated: true,
          }
        : await ensureImageVariantMetadata(item.url, metadata);
      if (!ensured.generated) {
        skipped += 1;
        continue;
      }
      await prisma.invitationMedia.update({
        where: { id: item.id },
        data: {
          metadata: ensured.metadata as Prisma.InputJsonValue,
        },
      });
      generated += 1;
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[image-variants] failed ${item.id}: ${message}`);
    }
  }

  console.log(
    `[image-variants] generated=${generated} skipped=${skipped} failed=${failed} total=${media.length}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
