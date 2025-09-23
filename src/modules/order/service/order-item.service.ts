import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { OrderItemRepository } from '@/modules/order/repository/order-item.repository';
import { Transactional } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class OrderItemService {
  constructor(
    @Inject(OrderItemRepository)
    private readonly orderItemRepository: OrderItemRepository,
  ) {}

  @Transactional()
  async createOrderItem({
    name,
    quantity,
    price,
  }: {
    name: string;
    quantity: number;
    price: number;
  }): Promise<OrderItem> {
    const orderItem = OrderItem.create({ name, quantity, price });
    this.orderItemRepository.save(orderItem);
    return orderItem;
  }

  @Transactional()
  async updateOrderItem(
    id: string,
    updates: Partial<{ name: string; quantity: number; price: number }>,
  ): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findById(id);
    const updatedOrderItem = orderItem.update(updates);
    this.orderItemRepository.save(updatedOrderItem);
    return updatedOrderItem;
  }

  @Transactional()
  async deleteOrderItem(id: string): Promise<void> {
    await this.orderItemRepository.delete(id);
  }
}
