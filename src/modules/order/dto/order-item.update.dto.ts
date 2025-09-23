import { OrderItemDto } from '@/modules/order/dto/order-item.dto';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderItemUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}

export class OrderItemUpdateResponseDto extends OrderItemDto {}
