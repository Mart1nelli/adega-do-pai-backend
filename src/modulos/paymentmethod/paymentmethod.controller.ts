import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Roles } from '../../auth/roles.decorator';
import { Public } from '../../auth/public.decorator';
import { PaymentmethodService } from './paymentmethod.service';
import { CreatePaymentmethodDto } from './dto/create-paymentmethod.dto';
import { UpdatePaymentmethodDto } from './dto/update-paymentmethod.dto';

@Controller('paymentmethod')
export class PaymentmethodController {
  constructor(private readonly paymentmethodService: PaymentmethodService) {}

  @Roles('admin')
  @Post()
  create(@Body() createPaymentmethodDto: CreatePaymentmethodDto) {
    return this.paymentmethodService.create(createPaymentmethodDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.paymentmethodService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentmethodService.findOne(+id);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentmethodDto: UpdatePaymentmethodDto) {
    return this.paymentmethodService.update(+id, updatePaymentmethodDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentmethodService.remove(+id);
  }
}
