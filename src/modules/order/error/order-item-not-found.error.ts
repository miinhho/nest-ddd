import { NotFoundException } from '@nestjs/common';

export class OrderItemNotFoundError extends NotFoundException {
  constructor(id: string) {
    super(`OrderItem with ID ${id} not found`);
  }
}
