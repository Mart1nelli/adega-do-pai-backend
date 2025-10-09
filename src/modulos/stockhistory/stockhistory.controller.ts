import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockhistoryService } from './stockhistory.service';
import { CreateStockhistoryDto } from './dto/create-stockhistory.dto';
import { UpdateStockhistoryDto } from './dto/update-stockhistory.dto';

@Controller('stockhistory')
export class StockhistoryController {
  constructor(private readonly stockhistoryService: StockhistoryService) {}

  @Post()
  create(@Body() createStockhistoryDto: CreateStockhistoryDto) {
    return this.stockhistoryService.create(createStockhistoryDto);
  }

  @Get()
  findAll() {
    return this.stockhistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockhistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockhistoryDto: UpdateStockhistoryDto) {
    return this.stockhistoryService.update(+id, updateStockhistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockhistoryService.remove(+id);
  }
}
