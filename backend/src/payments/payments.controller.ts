import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { SapatamuService } from 'src/sapatamu/sapatamu.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly sapatamuService: SapatamuService) {}

  @Get(':orderId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('user')
  async getPaymentDetail(
    @Request() req: { user: any },
    @Param('orderId') orderId: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.sapatamuService.getPaymentDetail(req.user, orderId);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Detail pembayaran ditemukan',
      data,
    });
  }

  @Post(':orderId/mock-complete')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('user')
  async mockComplete(
    @Request() req: { user: any },
    @Param('orderId') orderId: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.sapatamuService.mockCompletePayment(req.user, orderId);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Pembayaran mock berhasil diselesaikan',
      data,
    });
  }

  @Post('webhooks/pakasir')
  async pakasirWebhook(
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.sapatamuService.handlePakasirWebhook(body);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Webhook diterima',
      data,
    });
  }
}
