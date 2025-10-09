import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
