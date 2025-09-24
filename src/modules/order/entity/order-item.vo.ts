import {
  OrderItemNegativePriceError,
  OrderItemNegativeQuantityError,
} from '@/modules/order/error/order-item.bad-argument.error';

export class OrderItemPrice {
  private price: number;

  constructor(price: number) {
    this.setPrice(price);
  }

  getPrice(): number {
    return this.price;
  }

  setPrice(price: number) {
    if (price < 0) {
      throw new OrderItemNegativePriceError(price);
    }
    this.price = price;
  }
}

export class OrderItemQuantity {
  private quantity: number;

  constructor(quantity: number) {
    this.setQuantity(quantity);
  }

  getQuantity(): number {
    return this.quantity;
  }

  setQuantity(quantity: number) {
    if (quantity < 0) {
      throw new OrderItemNegativeQuantityError(this.quantity);
    }
    this.quantity = quantity;
  }
}
