import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { CmsService } from './cms.service';

@Controller('cms')
@UseGuards(JwtGuard, RolesGuard)
@Roles('user')
export class CmsController {
  constructor(private readonly service: CmsService) {}

  @Get('home')
  async home(
    @Request() req: { user: any },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.home(req.user);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Dashboard CMS ditemukan',
      data,
    });
  }
}
