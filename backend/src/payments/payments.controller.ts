import {
  Body,
  Controller,
  Get,
  HttpCode,
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

  /**
   * Webhook dari Pakasir — selalu return 200 agar Pakasir tidak retry.
   * Error internal ditangani di dalam service dan di-log.
   */
  @Post('webhooks/pakasir')
  @HttpCode(200)
  async pakasirWebhook(
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const data = await this.sapatamuService.handlePakasirWebhook(body);
      return res.status(200).send({
        status: 'success',
        code: 200,
        message: 'Webhook diterima',
        data,
      });
    } catch {
      // Tetap return 200 ke Pakasir — error sudah di-log di service layer
      // Jangan return 5xx karena Pakasir akan retry terus
      return res.status(200).send({
        status: 'success',
        code: 200,
        message: 'Webhook diterima',
        data: { received: true, processed: false },
      });
    }
  }
}
