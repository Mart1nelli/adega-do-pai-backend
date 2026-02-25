import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/current-user.decorator';
import { Roles } from '../../auth/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any) {
    // Override userId from JWT to prevent users creating orders for others
    createOrderDto.userId = user.userId;
    return this.orderService.create(createOrderDto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('my')
  findMyOrders(@CurrentUser() user: any) {
    return this.orderService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.orderService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user?: any,
  ) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.orderService.update(+id, updateOrderDto, userId);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.orderService.remove(+id, userId);
  }
}
