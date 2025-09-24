import { BaseEntity } from '@/common/entity/base.entity';
import { EntityMapper } from '@/common/entity/mapper';
import { OrderItemPrice, OrderItemQuantity } from '@/modules/order/entity/order-item.vo';
import { OrderItemEntity } from '@/modules/order/entity/orm/order-item.orm-entity';
import { randomUUID } from 'crypto';

export class OrderItem implements BaseEntity, EntityMapper {
  readonly id: string;
  readonly name: string;
  private _quantity: OrderItemQuantity;
  private _price: OrderItemPrice;
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
    this.id = id ?? randomUUID();
    this.name = name;
    this._quantity = new OrderItemQuantity(quantity);
    this._price = new OrderItemPrice(price);
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
    orderItemEntity.quantity = this._quantity.getQuantity();
    orderItemEntity.price = this._price.getPrice().toString();
    orderItemEntity.createdAt = this.createdAt;
    return orderItemEntity;
  }

  get quantity(): number {
    return this._quantity.getQuantity();
  }

  get price(): number {
    return this._price.getPrice();
  }

  get totalPrice(): number {
    return this._quantity.getQuantity() * this._price.getPrice();
  }

  update(updates: Partial<{ name: string; quantity: number; price: number }>): OrderItem {
    return new OrderItem({
      id: this.id,
      name: updates.name ?? this.name,
      quantity: updates.quantity ?? this._quantity.getQuantity(),
      price: updates.price ?? this._price.getPrice(),
      createdAt: this.createdAt,
    });
  }
}
