import {
  OrderItemCreateBodyDto,
  OrderItemCreateResponseDto,
} from '@/order/dto/order-item.create.dto';
import {
  OrderItemFindAllResponseDto,
  OrderItemFindOneResponseDto,
} from '@/order/dto/order-item.find.dto';
import {
  OrderItemUpdateDto,
  OrderItemUpdateResponseDto,
} from '@/order/dto/order-item.update.dto';
import { OrderItemRepository } from '@/order/repository/order-item.repository';
import { OrderItemService } from '@/order/service/order-item.service';
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

@Controller('order-items')
export class OrderItemController {
  constructor(
    @Inject(OrderItemRepository)
    private readonly orderItemRepository: OrderItemRepository,
    private readonly orderItemService: OrderItemService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: OrderItemCreateBodyDto,
  ): Promise<OrderItemCreateResponseDto> {
    const orderItem = await this.orderItemService.createOrderItem(body);
    return {
      id: orderItem.id,
      name: orderItem.name,
      quantity: orderItem.quantity,
      price: orderItem.price,
      createdAt: orderItem.createdAt,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<OrderItemFindOneResponseDto> {
    const orderItem = await this.orderItemRepository.findById(id);
    return {
      id: orderItem.id,
      name: orderItem.name,
      quantity: orderItem.quantity,
      price: orderItem.price,
      createdAt: orderItem.createdAt,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<OrderItemFindAllResponseDto> {
    const orderItems = await this.orderItemRepository.findAll();
    return orderItems.map((orderItem) => ({
      id: orderItem.id,
      name: orderItem.name,
      quantity: orderItem.quantity,
      price: orderItem.price,
      createdAt: orderItem.createdAt,
    }));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() body: OrderItemUpdateDto,
  ): Promise<OrderItemUpdateResponseDto> {
    const orderItem = await this.orderItemService.updateOrderItem(id, body);
    return {
      id: orderItem.id,
      name: orderItem.name,
      quantity: orderItem.quantity,
      price: orderItem.price,
      createdAt: orderItem.createdAt,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.orderItemService.deleteOrderItem(id);
  }
}
