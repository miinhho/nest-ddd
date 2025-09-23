import { BaseOrmEntity } from '@/common/entity/base.entity';
import { DomainMapper } from '@/common/entity/mapper';
import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { OrderEntity } from '@/modules/order/entity/orm/order.orm-entity';
import { Entity, ManyToOne, Property, Ref } from '@mikro-orm/core';

@Entity()
export class OrderItemEntity extends BaseOrmEntity implements DomainMapper {
  @Property({ length: 255 })
  name: string;

  @Property({ columnType: 'int' })
  quantity: number;

  @Property({ columnType: 'decimal', precision: 10, scale: 2 })
  price: string;

  @ManyToOne()
  order: Ref<OrderEntity>;

  toDomain(): OrderItem {
    return new OrderItem({
      id: this.id,
      name: this.name,
      quantity: this.quantity,
      price: Number(this.price),
      createdAt: this.createdAt,
    });
  }
}
