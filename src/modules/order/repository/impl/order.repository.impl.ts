import { Order } from '@/modules/order/entity/order.entity';
import { OrderEntity } from '@/modules/order/entity/orm/order.orm-entity';
import { OrderNotFoundError } from '@/modules/order/error/order.not-found.error';
import { OrderRepository } from '@/modules/order/repository/order.repository';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MikroOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: EntityRepository<OrderEntity>,
    private readonly em: EntityManager,
  ) {}

  async save(order: Order): Promise<void> {
    const existing = await this.orderRepository.findOne(
      { id: order.id },
      { populate: ['items'] },
    );
    const orderEntity = order.toEntity();

    if (existing) {
      existing.status = orderEntity.status;
      existing.createdAt = orderEntity.createdAt;
      existing.items.set(orderEntity.items.getItems());

      await this.em.persistAndFlush(existing);
      return;
    }

    await this.em.persistAndFlush(orderEntity);
  }

  async findById(id: string): Promise<Order> {
    const orderEntity = await this.orderRepository.findOne(
      { id },
      { populate: ['items'] },
    );
    if (!orderEntity) {
      throw new OrderNotFoundError(id);
    }
    return orderEntity.toDomain();
  }

  async findAll(): Promise<Order[]> {
    const orderEntities = await this.orderRepository.findAll({ populate: ['items'] });
    return orderEntities.map((orderEntity) => orderEntity.toDomain());
  }

  async delete(id: string): Promise<void> {
    const orderEntity = await this.orderRepository.findOne(
      { id },
      { populate: ['items'] },
    );
    if (!orderEntity) {
      throw new OrderNotFoundError(id);
    }
    await this.em.removeAndFlush(orderEntity);
  }
}
