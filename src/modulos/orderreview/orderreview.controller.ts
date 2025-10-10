import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../auth/current-user.decorator';
import { Roles } from '../../auth/roles.decorator';
import { CreateOrderreviewDto } from './dto/create-orderreview.dto';
import { UpdateOrderreviewDto } from './dto/update-orderreview.dto';
import { OrderreviewService } from './orderreview.service';

@Controller('orderreview')
export class OrderreviewController {
  constructor(private readonly orderreviewService: OrderreviewService) {}

  @Post()
  create(@Body() createOrderreviewDto: CreateOrderreviewDto) {
    return this.orderreviewService.create(createOrderreviewDto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.orderreviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.orderreviewService.findOne(+id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderreviewDto: UpdateOrderreviewDto, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.orderreviewService.update(+id, updateOrderreviewDto, userId);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.orderreviewService.remove(+id, userId);
  }
}
