import { OrderItemDto } from '@/modules/order/dto/order-item.dto';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class OrderItemCreateBodyDto {
  @IsString()
  name: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  price: number;
}

export class OrderItemCreateResponseDto extends OrderItemDto {}
