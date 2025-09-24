import { BaseRepository } from '@/common/repository/base.repository';
import { Order } from '@/modules/order/entity/order.entity';

export abstract class OrderRepository extends BaseRepository<Order> {
  abstract findById(id: string): Promise<Order>;
  abstract findAll(): Promise<Order[]>;
}
