import { OrderCancelLateError } from '../error/order.cancel-late.error';
import { OrderInPendingError } from '../error/order.in-pending.error';
import { OrderNoItemsError } from '../error/order.no-items.error';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { OrderStatus } from './order.vo';

describe('Order', () => {
  describe('create', () => {
    it('should create an order with items', () => {
      const items = [
        OrderItem.create({ name: 'Item 1', quantity: 2, price: 10 }),
        OrderItem.create({ name: 'Item 2', quantity: 1, price: 20 }),
      ];

      const order = Order.create(items);

      expect(order).toBeInstanceOf(Order);
      expect(order.items).toHaveLength(2);
      expect(order.status).toBe(OrderStatus.Pending);
    });
  });

  describe('addItem', () => {
    it('should add a new item', () => {
      const order = new Order();
      const item = OrderItem.create({ name: 'Item 1', quantity: 1, price: 10 });

      order.addItem(item);

      expect(order.items).toHaveLength(1);
      expect(order.items[0]).toBe(item);
    });

    it('should merge quantities for same item', () => {
      const order = new Order();
      const item1 = OrderItem.create({ name: 'Item 1', quantity: 1, price: 10 });
      const item2 = OrderItem.create({ name: 'Item 1', quantity: 2, price: 10 });

      order.addItem(item1);
      order.addItem(item2);

      expect(order.items).toHaveLength(1);
      expect(order.items[0].quantity).toBe(3);
    });
  });

  describe('getTotalPrice', () => {
    it('should calculate total price', () => {
      const items = [
        OrderItem.create({ name: 'Item 1', quantity: 2, price: 10 }),
        OrderItem.create({ name: 'Item 2', quantity: 1, price: 20 }),
      ];
      const order = Order.create(items);

      const total = order.totalPrice;

      expect(total).toBe(40); // 2*10 + 1*20
    });
  });

  describe('pay', () => {
    it('should pay a pending order with items', () => {
      const items = [OrderItem.create({ name: 'Item 1', quantity: 1, price: 10 })];
      const order = Order.create(items);

      order.pay();

      expect(order.status).toBe(OrderStatus.Paid);
    });

    it('should throw error if order is not pending', () => {
      const order = new Order({ status: OrderStatus.Paid });

      expect(() => order.pay()).toThrow(OrderInPendingError);
    });

    it('should throw error if order has no items', () => {
      const order = new Order();

      expect(() => order.pay()).toThrow(OrderNoItemsError);
    });
  });

  describe('cancel', () => {
    it('should cancel a pending order', () => {
      const order = new Order();

      order.cancel();

      expect(order.status).toBe(OrderStatus.Canceled);
    });

    it('should throw error if order is shipped or delivered', () => {
      const order = new Order({ status: OrderStatus.Shipped });

      expect(() => order.cancel()).toThrow(OrderCancelLateError);
    });
  });
});
