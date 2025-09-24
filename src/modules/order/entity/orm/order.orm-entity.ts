import { BaseOrmEntity } from '@/common/entity/base.entity';
import { DomainMapper } from '@/common/entity/mapper';
import { Order } from '@/modules/order/entity/order.entity';
import { OrderStatus } from '@/modules/order/entity/order.vo';
import { OrderItemEntity } from '@/modules/order/entity/orm/order-item.orm-entity';
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
    const orderItems = this.items.getItems().map((ie) => ie.toDomain());
    return new Order({
      id: this.id,
      status: this.status,
      createdAt: this.createdAt,
      items: orderItems,
    });
  }
}
