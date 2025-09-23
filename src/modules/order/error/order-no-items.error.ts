import { BadRequestException } from '@nestjs/common';

export class OrderNoItemsError extends BadRequestException {
  constructor(id: string) {
    super(`Order ${id} has no items`);
  }
}
