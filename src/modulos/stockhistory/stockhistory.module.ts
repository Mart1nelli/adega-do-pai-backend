import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StockhistoryController } from './stockhistory.controller';
import { StockhistoryService } from './stockhistory.service';

@Module({
  imports: [PrismaModule],
  controllers: [StockhistoryController],
  providers: [StockhistoryService],
})
export class StockhistoryModule {}
