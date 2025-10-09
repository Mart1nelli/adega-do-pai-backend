import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrderreviewController } from './orderreview.controller';
import { OrderreviewService } from './orderreview.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrderreviewController],
  providers: [OrderreviewService],
})
export class OrderreviewModule {}
