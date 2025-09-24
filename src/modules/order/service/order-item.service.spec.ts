import { Test, TestingModule } from '@nestjs/testing';
import { OrderItem } from '../entity/order-item.entity';
import { OrderItemRepository } from '../repository/order-item.repository';
import { OrderItemService } from './order-item.service';

describe('OrderItemService', () => {
  let service: OrderItemService;
  let orderItemRepository: jest.Mocked<OrderItemRepository>;

  beforeEach(async () => {
    const mockOrderItemRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        {
          provide: OrderItemRepository,
          useValue: mockOrderItemRepository,
        },
      ],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);
    orderItemRepository = module.get(OrderItemRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrderItem', () => {
    it('should create an order item', async () => {
      const name = 'Item 1';
      const quantity = 2;
      const price = 10;

      jest.spyOn(orderItemRepository, 'save').mockImplementation(() => {});

      const result = await service.createOrderItem({ name, quantity, price });

      expect(result).toBeInstanceOf(OrderItem);
      expect(result.name).toBe(name);
      expect(result.quantity).toBe(quantity);
      expect(result.price).toBe(price);
      expect(orderItemRepository['save']).toHaveBeenCalledWith(result);
    });
  });

  describe('updateOrderItem', () => {
    it('should update an order item', async () => {
      const id = 'item-1';
      const existingItem = OrderItem.create({ name: 'Item 1', quantity: 1, price: 10 });
      const updates = { quantity: 3, price: 15 };

      jest.spyOn(orderItemRepository, 'findById').mockResolvedValue(existingItem);
      jest.spyOn(orderItemRepository, 'save').mockImplementation(() => {});

      const result = await service.updateOrderItem(id, updates);

      expect(result).toBeInstanceOf(OrderItem);
      expect(result.quantity).toBe(3);
      expect(result.price).toBe(15);
      expect(orderItemRepository['findById']).toHaveBeenCalledWith(id);
      expect(orderItemRepository['save']).toHaveBeenCalledWith(result);
    });
  });

  describe('deleteOrderItem', () => {
    it('should delete an order item', async () => {
      const id = 'item-1';

      jest.spyOn(orderItemRepository, 'delete').mockResolvedValue(undefined);

      await service.deleteOrderItem(id);

      expect(orderItemRepository['delete']).toHaveBeenCalledWith(id);
    });
  });
});
