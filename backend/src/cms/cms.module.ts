import { Module } from '@nestjs/common';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import { SapatamuModule } from 'src/sapatamu/sapatamu.module';

@Module({
  imports: [SapatamuModule],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}
