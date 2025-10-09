import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderreviewDto } from './create-orderreview.dto';

export class UpdateOrderreviewDto extends PartialType(CreateOrderreviewDto) {}
