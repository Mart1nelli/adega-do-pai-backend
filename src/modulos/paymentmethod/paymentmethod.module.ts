import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PaymentmethodController } from './paymentmethod.controller';
import { PaymentmethodService } from './paymentmethod.service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentmethodController],
  providers: [PaymentmethodService],
})
export class PaymentmethodModule {}
