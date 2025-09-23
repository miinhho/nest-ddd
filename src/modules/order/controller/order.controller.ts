import { APIStatusCode } from '@/common/status-code';
import {
  OrderCreateBodyDto,
  OrderCreateResponseDto,
} from '@/modules/order/dto/order.create.dto';
import {
  OrderFindAllResponseDto,
  OrderFindOneResponseDto,
} from '@/modules/order/dto/order.find.dto';
import {
  OrderCancelResponseDto,
  OrderPayResponseDto,
} from '@/modules/order/dto/order.pay.dto';
import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { OrderRepository } from '@/modules/order/repository/order.repository';
import { OrderService } from '@/modules/order/service/order.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('orders')
export class OrderController {
  constructor(
    @Inject(OrderRepository)
    private readonly orderRepository: OrderRepository,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: OrderCreateBodyDto): Promise<OrderCreateResponseDto> {
    const items = body.items.map((item) => OrderItem.create(item));
    const order = await this.orderService.createOrder(items);
    return {
      id: order.id,
      status: order.getStatus(),
      total: order.total(),
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<OrderFindOneResponseDto> {
    const order = await this.orderRepository.findById(id);
    return {
      id: order.id,
      status: order.getStatus(),
      total: order.total(),
      items: order.getItems(),
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<OrderFindAllResponseDto> {
    const orders = await this.orderRepository.findAll();
    return orders.map((order) => ({
      id: order.id,
      status: order.getStatus(),
      total: order.total(),
    }));
  }

  @Put(':id/pay')
  @HttpCode(HttpStatus.OK)
  async pay(@Param('id') id: string): Promise<OrderPayResponseDto> {
    await this.orderService.payOrder(id);
    return { code: APIStatusCode.ORDER_PAID };
  }

  @Put(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string): Promise<OrderCancelResponseDto> {
    await this.orderService.cancelOrder(id);
    return { code: APIStatusCode.ORDER_CANCELLED };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.orderService.deleteOrder(id);
  }
}
