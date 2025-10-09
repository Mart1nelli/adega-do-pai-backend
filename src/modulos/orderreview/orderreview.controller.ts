import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderreviewService } from './orderreview.service';
import { CreateOrderreviewDto } from './dto/create-orderreview.dto';
import { UpdateOrderreviewDto } from './dto/update-orderreview.dto';

@Controller('orderreview')
export class OrderreviewController {
  constructor(private readonly orderreviewService: OrderreviewService) {}

  @Post()
  create(@Body() createOrderreviewDto: CreateOrderreviewDto) {
    return this.orderreviewService.create(createOrderreviewDto);
  }

  @Get()
  findAll() {
    return this.orderreviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderreviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderreviewDto: UpdateOrderreviewDto) {
    return this.orderreviewService.update(+id, updateOrderreviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderreviewService.remove(+id);
  }
}
