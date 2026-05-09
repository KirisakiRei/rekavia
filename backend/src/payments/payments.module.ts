import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { SapatamuModule } from 'src/sapatamu/sapatamu.module';
import { PakasirService } from './pakasir.service';

@Module({
  imports: [SapatamuModule],
  controllers: [PaymentsController],
  providers: [PakasirService],
  exports: [PakasirService],
})
export class PaymentsModule {}
