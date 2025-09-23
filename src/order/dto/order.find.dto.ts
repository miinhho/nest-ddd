import { OrderItemDto } from '@/order/dto/order-item.dto';
import { OrderStatus } from '@/order/entity/order.entity';

class OrderFindDto {
  id: string;
  status: OrderStatus;
  total: number;
}

export class OrderFindOneResponseDto extends OrderFindDto {
  items: OrderItemDto[];
}

export class OrderFindAllResponseDto extends Array<OrderFindDto> {}
