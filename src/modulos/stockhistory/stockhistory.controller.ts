import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Roles } from '../../auth/roles.decorator';
import { StockhistoryService } from './stockhistory.service';
import { CreateStockhistoryDto } from './dto/create-stockhistory.dto';
import { UpdateStockhistoryDto } from './dto/update-stockhistory.dto';

@Controller('stockhistory')
export class StockhistoryController {
  constructor(private readonly stockhistoryService: StockhistoryService) {}

  @Roles('admin')
  @Post()
  create(@Body() createStockhistoryDto: CreateStockhistoryDto) {
    return this.stockhistoryService.create(createStockhistoryDto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.stockhistoryService.findAll();
  }

  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockhistoryService.findOne(+id);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockhistoryDto: UpdateStockhistoryDto) {
    return this.stockhistoryService.update(+id, updateStockhistoryDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockhistoryService.remove(+id);
  }
}
