import { BaseEntity } from '@/common/entity/base.entity';
import { EntityMapper } from '@/common/entity/mapper';
import { OrderItemPrice, OrderItemQuantity } from '@/modules/order/entity/order-item.vo';
import { OrderItemEntity } from '@/modules/order/entity/orm/order-item.orm-entity';
import { v4 as uuidv4 } from 'uuid';

export class OrderItem implements BaseEntity, EntityMapper {
  readonly id: string;
  readonly name: string;
  private quantity: OrderItemQuantity;
  private price: OrderItemPrice;
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
    this.quantity = new OrderItemQuantity(quantity);
    this.price = new OrderItemPrice(price);
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
    orderItemEntity.quantity = this.quantity.getQuantity();
    orderItemEntity.price = this.price.getPrice().toString();
    orderItemEntity.createdAt = this.createdAt;
    return orderItemEntity;
  }

  getQuantity(): number {
    return this.quantity.getQuantity();
  }

  getPrice(): number {
    return this.price.getPrice();
  }

  getTotalPrice(): number {
    return this.quantity.getQuantity() * this.price.getPrice();
  }

  update(updates: Partial<{ name: string; quantity: number; price: number }>): OrderItem {
    return new OrderItem({
      id: this.id,
      name: updates.name ?? this.name,
      quantity: updates.quantity ?? this.quantity.getQuantity(),
      price: updates.price ?? this.price.getPrice(),
      createdAt: this.createdAt,
    });
  }
}
