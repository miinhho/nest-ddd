import { BaseRepository } from '@/common/repository/base.repository';
import { OrderItem } from '@/modules/order/entity/order-item.entity';

export abstract class OrderItemRepository implements BaseRepository<OrderItem> {
  abstract save(orderItem: OrderItem): void;
  abstract findById(id: string): Promise<OrderItem>;
  abstract findAll(): Promise<OrderItem[]>;
  abstract delete(id: string): Promise<void>;
}
