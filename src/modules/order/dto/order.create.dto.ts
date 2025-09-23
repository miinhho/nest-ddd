import { OrderStatus } from '@/modules/order/entity/order.entity';
import { IsInt, IsNumber, IsString, ValidateNested } from 'class-validator';

class OrderItemDto {
  @IsString()
  name: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  price: number;
}

export class OrderCreateBodyDto {
  @ValidateNested({ each: true })
  items: OrderItemDto[];
}

export class OrderCreateResponseDto {
  id: string;
  status: OrderStatus;
  total: number;
}
