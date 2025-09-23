import { BaseOrmEntity } from '@/common/entity/base.entity';
import { DomainMapper } from '@/common/entity/mapper';
import { Order, OrderStatus } from '@/order/entity/order.entity';
import { OrderItemEntity } from '@/order/entity/orm/order-item.orm-entity';
import { Cascade, Collection, Entity, Enum, OneToMany } from '@mikro-orm/core';

@Entity()
export class OrderEntity extends BaseOrmEntity implements DomainMapper {
  @OneToMany({
    entity: () => OrderItemEntity,
    mappedBy: (item) => item.order,
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    orphanRemoval: true,
  })
  items = new Collection<OrderItemEntity>(this);

  @Enum(() => OrderStatus)
  status: OrderStatus;

  toDomain(): Order {
    return new Order({
      id: this.id,
      status: this.status,
      createdAt: this.createdAt,
    });
  }
}
