import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { SapatamuModule } from 'src/sapatamu/sapatamu.module';

@Module({
  imports: [SapatamuModule],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
