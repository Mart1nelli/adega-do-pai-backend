import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateOrderitemDto } from './dto/create-orderitem.dto';
import { UpdateOrderitemDto } from './dto/update-orderitem.dto';
import { OrderitemService } from './orderitem.service';

@Controller('orderitem')
export class OrderitemController {
  constructor(private readonly orderitemService: OrderitemService) {}

  @Post()
  create(@Body() createOrderitemDto: CreateOrderitemDto) {
    return this.orderitemService.create(createOrderitemDto);
  }

  @Get()
  findAll() {
    return this.orderitemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderitemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderitemDto: UpdateOrderitemDto) {
    return this.orderitemService.update(id, updateOrderitemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderitemService.remove(id);
  }
}
