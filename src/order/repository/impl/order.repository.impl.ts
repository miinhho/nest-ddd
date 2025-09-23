import { Order } from '@/order/entity/order.entity';
import { OrderEntity } from '@/order/entity/orm/order.orm-entity';
import { OrderNotFoundError } from '@/order/error/order-not-found.error';
import { OrderRepository } from '@/order/repository/order.repository';
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

  save(order: Order): void {
    const orderEntity = order.toEntity();
    this.em.persist(orderEntity);
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
    const orderEntity = await this.orderRepository.findOne({ id });
    if (!orderEntity) {
      throw new OrderNotFoundError(id);
    }
    this.em.remove(orderEntity);
  }
}
