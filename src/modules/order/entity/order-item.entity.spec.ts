import { OrderItem } from './order-item.entity';

describe('OrderItem', () => {
  describe('create', () => {
    it('should create an order item', () => {
      const name = 'Item 1';
      const quantity = 2;
      const price = 10;

      const item = OrderItem.create({ name, quantity, price });

      expect(item).toBeInstanceOf(OrderItem);
      expect(item.name).toBe(name);
      expect(item.quantity).toBe(quantity);
      expect(item.price).toBe(price);
    });
  });

  describe('getTotalPrice', () => {
    it('should calculate total price', () => {
      const item = OrderItem.create({ name: 'Item 1', quantity: 3, price: 5 });

      const total = item.totalPrice;

      expect(total).toBe(15); // 3 * 5
    });
  });

  describe('update', () => {
    it('should update quantity and price', () => {
      const item = OrderItem.create({ name: 'Item 1', quantity: 1, price: 10 });

      const updated = item.update({ quantity: 2, price: 20 });

      expect(updated.quantity).toBe(2);
      expect(updated.price).toBe(20);
      expect(updated.name).toBe('Item 1');
    });
  });
});
