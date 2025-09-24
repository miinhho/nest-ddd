import { BaseEntity } from '@/common/entity/base.entity';
import { EntityMapper } from '@/common/entity/mapper';
import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { OrderStatus } from '@/modules/order/entity/order.vo';
import { OrderEntity } from '@/modules/order/entity/orm/order.orm-entity';
import { OrderCancelLateError } from '@/modules/order/error/order.cancel-late.error';
import { OrderInPendingError } from '@/modules/order/error/order.in-pending.error';
import { OrderNoItemsError } from '@/modules/order/error/order.no-items.error';
import { randomUUID } from 'crypto';

export class Order implements BaseEntity, EntityMapper {
  readonly id: string;
  private _items: OrderItem[] = [];
  private _status: OrderStatus = OrderStatus.Pending;
  readonly createdAt: Date = new Date();

  constructor({
    id,
    status,
    createdAt,
    items,
  }: {
    id?: string;
    status?: OrderStatus;
    createdAt?: Date;
    items?: OrderItem[];
  } = {}) {
    this.id = id ?? randomUUID();
    this._status = status ?? OrderStatus.Pending;
    this.createdAt = createdAt ?? new Date();
    this._items = items ?? [];
  }

  static create(items: OrderItem[]): Order {
    const order = new Order();
    items.forEach((item) => order.addItem(item));
    return order;
  }

  toEntity(): OrderEntity {
    const orderEntity = new OrderEntity();
    orderEntity.id = this.id;
    orderEntity.createdAt = this.createdAt;
    orderEntity.status = this._status;
    const itemEntities = this._items.map((item) => item.toEntity());
    orderEntity.items.set(itemEntities);
    return orderEntity;
  }

  addItem(item: OrderItem): void {
    const index = this._items.findIndex(
      (i) => i.name === item.name && i.price === item.price,
    );
    if (index === -1) {
      this._items.push(item);
      return;
    }

    const existing = this._items[index];
    const newOrderItem = OrderItem.create({
      name: existing.name,
      quantity: existing.quantity + item.quantity,
      price: existing.price,
    });
    this._items[index] = newOrderItem;
  }

  get items(): OrderItem[] {
    return [...this._items];
  }

  get status(): OrderStatus {
    return this._status;
  }

  get totalPrice(): number {
    return this._items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  pay(): void {
    if (this._status !== OrderStatus.Pending) {
      throw new OrderInPendingError(this.id);
    }
    if (this._items.length === 0) {
      throw new OrderNoItemsError(this.id);
    }
    this._status = OrderStatus.Paid;
  }

  cancel(): void {
    if (this._status === OrderStatus.Shipped || this._status === OrderStatus.Delivered) {
      throw new OrderCancelLateError(this.id);
    }
    this._status = OrderStatus.Canceled;
  }
}
