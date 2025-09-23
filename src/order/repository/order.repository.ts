import { BaseRepository } from '@/common/repository/base.repository';
import { Order } from '@/order/entity/order.entity';

export abstract class OrderRepository implements BaseRepository<Order> {
  abstract save(order: Order): void;
  abstract findById(id: string): Promise<Order>;
  abstract findAll(): Promise<Order[]>;
  abstract delete(id: string): Promise<void>;
}
