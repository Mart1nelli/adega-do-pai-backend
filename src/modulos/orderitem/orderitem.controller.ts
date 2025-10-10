import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Roles } from '../../auth/roles.decorator';
import { CreateOrderitemDto } from './dto/create-orderitem.dto';
import { UpdateOrderitemDto } from './dto/update-orderitem.dto';
import { OrderitemService } from './orderitem.service';

@Controller('orderitem')
export class OrderitemController {
  constructor(private readonly orderitemService: OrderitemService) {}

  @Roles('admin')
  @Post()
  create(@Body() createOrderitemDto: CreateOrderitemDto) {
    return this.orderitemService.create(createOrderitemDto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.orderitemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderitemService.findOne(id);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderitemDto: UpdateOrderitemDto) {
    return this.orderitemService.update(id, updateOrderitemDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderitemService.remove(id);
  }
}
