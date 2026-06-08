jest.mock('src/database/database.service', () => ({ DatabaseService: class {} }), { virtual: true });
jest.mock('src/dto/response.dto', () => ({}), { virtual: true });
jest.mock('src/sapatamu/sapatamu-content.helper', () => ({ migrateContentJson: (value: unknown) => value }), { virtual: true });
jest.mock('src/sapatamu/sapatamu-image-variants.helper', () => ({
  ensureImageVariantMetadata: jest.fn(),
}), { virtual: true });

import { DataService } from './data.service';
import { ensureImageVariantMetadata } from 'src/sapatamu/sapatamu-image-variants.helper';

describe('DataService', () => {
  it('cleans RSVP payloads before writing to Prisma', async () => {
    const create = jest.fn().mockResolvedValue({ id: 'rsvp-1' });
    const service = new DataService({
      invitationRsvp: { create },
    } as never);

    await service.create('invitation-rsvps', {
      id: 'client-id',
      invitation_id: 'invitation-1',
      guest_name: '  Tamu Undangan  ',
      phone_number: '08123456789',
      status: 'unknown',
      attendees_count: '2.8',
      message: '  Selamat ya  ',
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        invitation_id: 'invitation-1',
        guest_name: 'Tamu Undangan',
        status: 'hadir',
        attendees_count: 2,
        message: 'Selamat ya',
      },
    });
  });

  it('backfills missing image variants for invitation media list responses', async () => {
    const nextMetadata = {
      ext: 'jpg',
      mime: 'image/jpeg',
      size: 1234,
      variants: {
        thumb: {
          url: '/uploads/invitations/invitation-1/editor-media/variants/photo-thumb.webp',
          width: 640,
          format: 'webp',
          size: 321,
        },
        medium: {
          url: '/uploads/invitations/invitation-1/editor-media/variants/photo-medium.webp',
          width: 1280,
          format: 'webp',
          size: 654,
        },
        large: {
          url: '/uploads/invitations/invitation-1/editor-media/variants/photo-large.webp',
          width: 1920,
          format: 'webp',
          size: 987,
        },
      },
    };
    const findMany = jest.fn().mockResolvedValue([
      {
        id: 'media-1',
        invitation_id: 'invitation-1',
        media_type: 'image',
        url: '/uploads/invitations/invitation-1/editor-media/photo.jpg',
        metadata: { ext: 'jpg', mime: 'image/jpeg', size: 1234 },
        deleted_at: null,
      },
    ]);
    const count = jest.fn().mockResolvedValue(1);
    const update = jest.fn().mockResolvedValue({
      id: 'media-1',
      metadata: nextMetadata,
    });
    (ensureImageVariantMetadata as jest.Mock).mockResolvedValue({
      metadata: nextMetadata,
      generated: true,
    });

    const service = new DataService({
      invitationMedia: { findMany, count, update },
    } as never);

    const result = await service.list('invitation-media', {
      where: JSON.stringify({ invitation_id: 'invitation-1', media_type: 'image' }),
      orderBy: JSON.stringify({ sort_order: 'asc' }),
      limit: 20,
      page: 1,
    });

    expect(ensureImageVariantMetadata).toHaveBeenCalledWith(
      '/uploads/invitations/invitation-1/editor-media/photo.jpg',
      { ext: 'jpg', mime: 'image/jpeg', size: 1234 },
    );
    expect(update).toHaveBeenCalledWith({
      where: { id: 'media-1' },
      data: {
        metadata: expect.objectContaining({
          variants: expect.objectContaining({
            thumb: expect.objectContaining({ width: 640 }),
            medium: expect.objectContaining({ width: 1280 }),
            large: expect.objectContaining({ width: 1920 }),
          }),
        }),
      },
    });
    expect(result.data?.items[0]?.metadata).toEqual(
      expect.objectContaining({
        variants: expect.objectContaining({
          thumb: expect.objectContaining({ width: 640 }),
          medium: expect.objectContaining({ width: 1280 }),
          large: expect.objectContaining({ width: 1920 }),
        }),
      }),
    );
  });
});
