import { NotFoundException } from '@nestjs/common';

export class OrderNotFoundError extends NotFoundException {
  constructor(id: string) {
    super(`Order with ID ${id} not found`);
  }
}
