import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../auth/current-user.decorator';
import { Roles } from '../../auth/roles.decorator';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.cartService.findOne(+id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.cartService.update(+id, updateCartDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user?: any) {
    const userId = user?.role === 'admin' ? undefined : user?.userId;
    return this.cartService.remove(+id, userId);
  }
}
