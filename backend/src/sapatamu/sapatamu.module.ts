import { Module } from '@nestjs/common';
import { SapatamuController } from './sapatamu.controller';
import { SapatamuService } from './sapatamu.service';
import { PakasirService } from 'src/payments/pakasir.service';

@Module({
  controllers: [SapatamuController],
  providers: [SapatamuService, PakasirService],
  exports: [SapatamuService],
})
export class SapatamuModule {}
