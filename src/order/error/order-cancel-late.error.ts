import { BadRequestException } from '@nestjs/common';

export class OrderCancelLateError extends BadRequestException {
  constructor(id: string) {
    super(`Order with ID ${id} cannot be cancelled as it has been shipped or delivered`);
  }
}
