import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Roles } from '../../auth/roles.decorator';
import { CartitemService } from './cartitem.service';
import { CreateCartitemDto } from './dto/create-cartitem.dto';
import { UpdateCartitemDto } from './dto/update-cartitem.dto';

@Controller('cartitem')
export class CartitemController {
  constructor(private readonly cartitemService: CartitemService) {}

  @Post()
  create(@Body() createCartitemDto: CreateCartitemDto) {
    return this.cartitemService.create(createCartitemDto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.cartitemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartitemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCartitemDto: UpdateCartitemDto) {
    return this.cartitemService.update(id, updateCartitemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartitemService.remove(id);
  }
}
