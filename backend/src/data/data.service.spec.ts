jest.mock('src/database/database.service', () => ({ DatabaseService: class {} }), { virtual: true });
jest.mock('src/dto/response.dto', () => ({}), { virtual: true });
jest.mock('src/sapatamu/sapatamu-content.helper', () => ({ migrateContentJson: (value: unknown) => value }), { virtual: true });

import { DataService } from './data.service';

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
});
