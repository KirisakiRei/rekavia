import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('maps/resolve')
  async resolveGoogleMapsUrl(@Query('url') url: string) {
    return {
      status: 'success',
      code: 200,
      message: 'Google Maps URL resolved',
      data: await this.appService.resolveGoogleMapsUrl(url),
    };
  }

  @Get('u/:slug')
  async publicInvitationHtml(
    @Param('slug') slug: string,
    @Query('to') guestName: string,
    @Res() res: Response,
  ): Promise<Response> {
    const html = await this.appService.renderPublicInvitationHtml(slug, guestName);
    return res.type('html').status(200).send(html);
  }
}
