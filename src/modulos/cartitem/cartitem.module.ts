import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CartitemController } from './cartitem.controller';
import { CartitemService } from './cartitem.service';

@Module({
  imports: [PrismaModule],
  controllers: [CartitemController],
  providers: [CartitemService]
})
export class CartitemModule {}
