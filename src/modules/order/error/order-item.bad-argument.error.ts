import { BadRequestException } from '@nestjs/common';

export class OrderItemNegativePriceError extends BadRequestException {
  constructor(price: number) {
    super(`OrderItem price cannot be negative: ${price}`);
  }
}

export class OrderItemNegativeQuantityError extends BadRequestException {
  constructor(quantity: number) {
    super(`OrderItem quantity cannot be negative: ${quantity}`);
  }
}
