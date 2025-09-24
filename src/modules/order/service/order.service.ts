import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { Order } from '@/modules/order/entity/order.entity';
import { OrderRepository } from '@/modules/order/repository/order.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(
    @Inject(OrderRepository)
    private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(items: OrderItem[]): Promise<Order> {
    const order = Order.create(items);
    await this.orderRepository.save(order);
    return order;
  }

  async payOrder(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    order.pay();
    await this.orderRepository.save(order);
  }

  async cancelOrder(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    order.cancel();
    await this.orderRepository.save(order);
  }

  async deleteOrder(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
