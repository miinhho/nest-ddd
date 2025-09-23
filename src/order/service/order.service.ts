import { OrderItem } from '@/order/entity/order-item.entity';
import { Order } from '@/order/entity/order.entity';
import { OrderRepository } from '@/order/repository/order.repository';
import { Transactional } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(
    @Inject(OrderRepository)
    private readonly orderRepository: OrderRepository,
  ) {}

  @Transactional()
  async createOrder(items: OrderItem[]): Promise<Order> {
    const order = Order.create(items);
    this.orderRepository.save(order);
    return order;
  }

  @Transactional()
  async payOrder(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    order.pay();
    this.orderRepository.save(order);
  }

  @Transactional()
  async cancelOrder(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    order.cancel();
    this.orderRepository.save(order);
  }

  @Transactional()
  async deleteOrder(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
