import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { OrderItemEntity } from '@/modules/order/entity/orm/order-item.orm-entity';
import { OrderItemNotFoundError } from '@/modules/order/error/order-item-not-found.error';
import { OrderItemRepository } from '@/modules/order/repository/order-item.repository';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MikroOrmOrderItemRepository implements OrderItemRepository {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: EntityRepository<OrderItemEntity>,
    private readonly em: EntityManager,
  ) {}

  save(orderItem: OrderItem): void {
    const orderItemEntity = orderItem.toEntity();
    this.em.persist(orderItemEntity);
  }

  async findById(id: string): Promise<OrderItem> {
    const orderItemEntity = await this.orderItemRepository.findOne({ id });
    if (!orderItemEntity) {
      throw new OrderItemNotFoundError(id);
    }
    return orderItemEntity.toDomain();
  }

  async findAll(): Promise<OrderItem[]> {
    const orderItemEntities = await this.orderItemRepository.findAll();
    return orderItemEntities.map((orderItemEntity) => orderItemEntity.toDomain());
  }

  async delete(id: string): Promise<void> {
    const orderItemEntity = await this.orderItemRepository.findOne({ id });
    if (!orderItemEntity) {
      throw new OrderItemNotFoundError(id);
    }
    this.em.remove(orderItemEntity);
  }
}
