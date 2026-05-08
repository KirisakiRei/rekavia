import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('maps resolver', () => {
    it('resolves Google Maps short links to their final URL', async () => {
      const finalUrl = 'https://www.google.com/maps/place/Bandung/@-6.903363,107.6081381,13z/data=!3d-6.9174639!4d107.6191228';
      const fetchMock = jest.fn().mockResolvedValue({
        status: 302,
        headers: {
          get: (name: string) => (name.toLowerCase() === 'location' ? finalUrl : null),
        },
      });

      await expect(appService.resolveGoogleMapsUrl('https://maps.app.goo.gl/abc123', fetchMock as never)).resolves.toEqual({
        url: finalUrl,
      });
    });
  });
});
