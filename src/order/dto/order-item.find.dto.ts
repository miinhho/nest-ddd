import { OrderItemDto } from '@/order/dto/order-item.dto';

class OrderItemFindDto extends OrderItemDto {}

export class OrderItemFindOneResponseDto extends OrderItemFindDto {}

export class OrderItemFindAllResponseDto extends Array<OrderItemFindDto> {}
