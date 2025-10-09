import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddressModule } from './modulos/address/address.module';
import { CartModule } from './modulos/cart/cart.module';
import { CategoryModule } from './modulos/category/category.module';
import { NotificationModule } from './modulos/notification/notification.module';
import { OrderModule } from './modulos/order/order.module';
import { OrderreviewModule } from './modulos/orderreview/orderreview.module';
import { PaymentModule } from './modulos/payment/payment.module';
import { PaymentmethodModule } from './modulos/paymentmethod/paymentmethod.module';
import { ProductModule } from './modulos/product/product.module';
import { ReportModule } from './modulos/report/report.module';
import { ReviewModule } from './modulos/review/review.module';
import { StockhistoryModule } from './modulos/stockhistory/stockhistory.module';
import { SupplierModule } from './modulos/supplier/supplier.module';
import { UserModule } from './modulos/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CartitemModule } from './modulos/cartitem/cartitem.module';
import { OrderitemModule } from './modulos/orderitem/orderitem.module';

@Module({
  imports: [PrismaModule, UserModule, CategoryModule, SupplierModule, ProductModule, AddressModule, CartModule, OrderModule, PaymentModule, PaymentmethodModule, ReviewModule, OrderreviewModule, StockhistoryModule, NotificationModule, ReportModule, CartitemModule, OrderitemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 