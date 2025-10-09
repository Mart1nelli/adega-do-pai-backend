import { PartialType } from '@nestjs/mapped-types';
import { CreateStockhistoryDto } from './create-stockhistory.dto';

export class UpdateStockhistoryDto extends PartialType(CreateStockhistoryDto) {}
