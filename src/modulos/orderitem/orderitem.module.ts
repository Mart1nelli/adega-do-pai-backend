import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrderitemController } from './orderitem.controller';
import { OrderitemService } from './orderitem.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrderitemController],
  providers: [OrderitemService],
})
export class OrderitemModule {}
