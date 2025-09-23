import { OrderItemDto } from '@/modules/order/dto/order-item.dto';
import { OrderStatus } from '@/modules/order/entity/order.entity';

class OrderFindDto {
  id: string;
  status: OrderStatus;
  total: number;
}

export class OrderFindOneResponseDto extends OrderFindDto {
  items: OrderItemDto[];
}

export class OrderFindAllResponseDto extends Array<OrderFindDto> {}
