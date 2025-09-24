import { BaseRepository } from '@/common/repository/base.repository';
import { OrderItem } from '@/modules/order/entity/order-item.entity';

export abstract class OrderItemRepository extends BaseRepository<OrderItem> {
  abstract findById(id: string): Promise<OrderItem>;
  abstract findAll(): Promise<OrderItem[]>;
}
