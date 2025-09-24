import { BadRequestException } from '@nestjs/common';

export class OrderInPendingError extends BadRequestException {
  constructor(id: string) {
    super(`Order ${id} is still in pending status`);
  }
}
