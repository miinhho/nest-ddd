import { BaseEntity } from '@/common/entity/base.entity';
import { EntityMapper } from '@/common/entity/mapper';
import { OrderItemEntity } from '@/modules/order/entity/orm/order-item.orm-entity';
import { v4 as uuidv4 } from 'uuid';

export class OrderItem implements BaseEntity, EntityMapper {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly price: number;
  readonly createdAt: Date = new Date();

  constructor({
    id,
    name,
    quantity,
    price,
    createdAt,
  }: {
    id?: string;
    name: string;
    quantity: number;
    price: number;
    createdAt?: Date;
  }) {
    this.id = id ?? uuidv4();
    this.name = name;
    this.quantity = quantity;
    this.price = price;
    this.createdAt = createdAt ?? new Date();
  }

  static create({
    name,
    quantity,
    price,
  }: {
    name: string;
    quantity: number;
    price: number;
  }): OrderItem {
    return new OrderItem({
      name,
      quantity,
      price,
    });
  }

  toEntity(): OrderItemEntity {
    const orderItemEntity = new OrderItemEntity();
    orderItemEntity.id = this.id;
    orderItemEntity.name = this.name;
    orderItemEntity.quantity = this.quantity;
    orderItemEntity.price = this.price.toString();
    orderItemEntity.createdAt = this.createdAt;
    return orderItemEntity;
  }

  getTotalPrice(): number {
    return this.quantity * this.price;
  }

  update(updates: Partial<{ name: string; quantity: number; price: number }>): OrderItem {
    return new OrderItem({
      id: this.id,
      name: updates.name ?? this.name,
      quantity: updates.quantity ?? this.quantity,
      price: updates.price ?? this.price,
      createdAt: this.createdAt,
    });
  }
}
