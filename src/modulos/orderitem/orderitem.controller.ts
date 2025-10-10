import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../auth/current-user.decorator';
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
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.orderitemService.findOne(id, userId);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderitemDto: UpdateOrderitemDto, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.orderitemService.update(id, updateOrderitemDto, userId);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.orderitemService.remove(id, userId);
  }
}
