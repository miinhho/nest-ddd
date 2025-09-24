import {
  OrderItemNegativePriceError,
  OrderItemNegativeQuantityError,
} from '../error/order-item.bad-argument.error';
import { OrderItemPrice, OrderItemQuantity } from './order-item.vo';

describe('OrderItemPrice', () => {
  it('should create with positive price', () => {
    const price = new OrderItemPrice(10);

    expect(price.getPrice()).toBe(10);
  });

  it('should throw error for negative price', () => {
    expect(() => new OrderItemPrice(-5)).toThrow(OrderItemNegativePriceError);
  });
});

describe('OrderItemQuantity', () => {
  it('should create with positive quantity', () => {
    const quantity = new OrderItemQuantity(5);

    expect(quantity.getQuantity()).toBe(5);
  });

  it('should throw error for negative quantity', () => {
    expect(() => new OrderItemQuantity(-1)).toThrow(OrderItemNegativeQuantityError);
  });
});
