import { OrderItemController } from '@/modules/order/controller/order-item.controller';
import { OrderController } from '@/modules/order/controller/order.controller';
import { MikroOrmOrderItemRepository } from '@/modules/order/repository/impl/order-item.repository.impl';
import { MikroOrmOrderRepository } from '@/modules/order/repository/impl/order.repository.impl';
import { OrderItemRepository } from '@/modules/order/repository/order-item.repository';
import { OrderRepository } from '@/modules/order/repository/order.repository';
import { OrderItemService } from '@/modules/order/service/order-item.service';
import { OrderService } from '@/modules/order/service/order.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { OrderItemEntity } from './entity/orm/order-item.orm-entity';
import { OrderEntity } from './entity/orm/order.orm-entity';

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
