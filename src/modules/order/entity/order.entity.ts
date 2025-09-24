import { BaseEntity } from '@/common/entity/base.entity';
import { EntityMapper } from '@/common/entity/mapper';
import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { OrderStatus } from '@/modules/order/entity/order.vo';
import { OrderEntity } from '@/modules/order/entity/orm/order.orm-entity';
import { OrderCancelLateError } from '@/modules/order/error/order.cancel-late.error';
import { OrderInPendingError } from '@/modules/order/error/order.in-pending.error';
import { OrderNoItemsError } from '@/modules/order/error/order.no-items.error';
import { v4 as uuidv4 } from 'uuid';

export class Order implements BaseEntity, EntityMapper {
  readonly id: string;
  private items: OrderItem[] = [];
  private status: OrderStatus = OrderStatus.Pending;
  readonly createdAt: Date = new Date();

  constructor({
    id,
    status,
    createdAt,
  }: {
    id?: string;
    status?: OrderStatus;
    createdAt?: Date;
  } = {}) {
    this.id = id ?? uuidv4();
    this.status = status ?? OrderStatus.Pending;
    this.createdAt = createdAt ?? new Date();
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
    orderEntity.status = this.status;
    orderEntity.items.set(this.items.map((item) => item.toEntity()));
    return orderEntity;
  }

  addItem(item: OrderItem): void {
    const index = this.items.findIndex(
      (i) => i.id === item.id && i.getPrice() === item.getPrice(),
    );
    if (index === -1) {
      this.items.push(item);
      return;
    }

    const existing = this.items[index];
    const newOrderItem = OrderItem.create({
      name: existing.name,
      quantity: existing.getQuantity() + item.getQuantity(),
      price: existing.getPrice(),
    });
    this.items[index] = newOrderItem;
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.getTotalPrice(), 0);
  }

  pay(): void {
    if (this.status !== OrderStatus.Pending) {
      throw new OrderInPendingError(this.id);
    }
    if (this.items.length === 0) {
      throw new OrderNoItemsError(this.id);
    }
    this.status = OrderStatus.Paid;
  }

  cancel(): void {
    if (this.status === OrderStatus.Shipped || this.status === OrderStatus.Delivered) {
      throw new OrderCancelLateError(this.id);
    }
    this.status = OrderStatus.Canceled;
  }

  getItems(): OrderItem[] {
    return [...this.items];
  }

  getStatus(): OrderStatus {
    return this.status;
  }
}
