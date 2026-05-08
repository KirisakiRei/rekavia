import { Module } from '@nestjs/common';
import { SapatamuController } from './sapatamu.controller';
import { SapatamuService } from './sapatamu.service';

@Module({
  controllers: [SapatamuController],
  providers: [SapatamuService],
  exports: [SapatamuService],
})
export class SapatamuModule {}
