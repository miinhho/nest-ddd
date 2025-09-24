import { Test, TestingModule } from '@nestjs/testing';
import { OrderItem } from '../entity/order-item.entity';
import { OrderItemRepository } from '../repository/order-item.repository';
import { OrderItemService } from '../service/order-item.service';
import { OrderItemController } from './order-item.controller';

describe('OrderItemController', () => {
  let controller: OrderItemController;
  let orderItemService: jest.Mocked<OrderItemService>;
  let orderItemRepository: jest.Mocked<OrderItemRepository>;

  beforeEach(async () => {
    const mockOrderItemService = {
      createOrderItem: jest.fn(),
      updateOrderItem: jest.fn(),
      deleteOrderItem: jest.fn(),
    };
    const mockOrderItemRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [
        {
          provide: OrderItemService,
          useValue: mockOrderItemService,
        },
        {
          provide: OrderItemRepository,
          useValue: mockOrderItemRepository,
        },
      ],
    }).compile();

    controller = module.get<OrderItemController>(OrderItemController);
    orderItemService = module.get(OrderItemService);
    orderItemRepository = module.get(OrderItemRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order item', async () => {
      const body = {
        name: 'Item 1',
        quantity: 2,
        price: 10,
      };
      const orderItem = OrderItem.create(body);

      jest.spyOn(orderItemService, 'createOrderItem').mockResolvedValue(orderItem);

      const result = await controller.create(body);

      expect(result.id).toBe(orderItem.id);
      expect(result.name).toBe(orderItem.name);
      expect(orderItemService['createOrderItem']).toHaveBeenCalledWith(body);
    });
  });

  describe('findOne', () => {
    it('should return an order item', async () => {
      const id = 'item-1';
      const orderItem = OrderItem.create({ name: 'Item 1', quantity: 1, price: 10 });

      jest.spyOn(orderItemRepository, 'findById').mockResolvedValue(orderItem);

      const result = await controller.findOne(id);

      expect(result.id).toBe(orderItem.id);
      expect(result.name).toBe(orderItem.name);
      expect(orderItemRepository['findById']).toHaveBeenCalledWith(id);
    });
  });

  describe('findAll', () => {
    it('should return all order items', async () => {
      const orderItems = [OrderItem.create({ name: 'Item 1', quantity: 1, price: 10 })];

      jest.spyOn(orderItemRepository, 'findAll').mockResolvedValue(orderItems);

      const result = await controller.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(orderItems[0].id);
      expect(orderItemRepository['findAll']).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an order item', async () => {
      const id = 'item-1';
      const body = { quantity: 3, price: 15 };
      const orderItem = OrderItem.create({ name: 'Item 1', quantity: 3, price: 15 });

      jest.spyOn(orderItemService, 'updateOrderItem').mockResolvedValue(orderItem);

      const result = await controller.update(id, body);

      expect(result.id).toBe(orderItem.id);
      expect(orderItemService['updateOrderItem']).toHaveBeenCalledWith(id, body);
    });
  });

  describe('delete', () => {
    it('should delete an order item', async () => {
      const id = 'item-1';

      jest.spyOn(orderItemService, 'deleteOrderItem').mockResolvedValue(undefined);

      await controller.delete(id);

      expect(orderItemService['deleteOrderItem']).toHaveBeenCalledWith(id);
    });
  });
});
