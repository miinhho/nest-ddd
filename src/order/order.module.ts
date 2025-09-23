import { OrderItemController } from '@/order/controller/order-item.controller';
import { OrderController } from '@/order/controller/order.controller';
import { OrderItemRepository } from '@/order/repository/order-item.repository';
import { OrderRepository } from '@/order/repository/order.repository';
import { OrderItemService } from '@/order/service/order-item.service';
import { OrderService } from '@/order/service/order.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { OrderItemEntity } from './entity/orm/order-item.orm-entity';
import { OrderEntity } from './entity/orm/order.orm-entity';
import { MikroOrmOrderItemRepository } from '@/order/repository/impl/order-item.repository.impl';
import { MikroOrmOrderRepository } from '@/order/repository/impl/order.repository.impl';

@Module({
  imports: [MikroOrmModule.forFeature([OrderEntity, OrderItemEntity])],
  providers: [
    {
      provide: OrderRepository,
      useClass: MikroOrmOrderRepository,
    },
    {
      provide: OrderItemRepository,
      useClass: MikroOrmOrderItemRepository,
    },
    OrderService,
    OrderItemService,
  ],
  controllers: [OrderController, OrderItemController],
})
export class OrderModule {}
