import { APIStatusCode } from '@/common/status-code';

export class OrderPayResponseDto {
  code: APIStatusCode.ORDER_PAID;
}

export class OrderCancelResponseDto {
  code: APIStatusCode.ORDER_CANCELLED;
}
