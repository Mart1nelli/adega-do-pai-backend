import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateStockhistoryDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  change: number;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
