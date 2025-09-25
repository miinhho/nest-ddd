import { Test, TestingModule } from '@nestjs/testing';
import { OrderItem } from '../entity/order-item.entity';
import { Order } from '../entity/order.entity';
import { OrderRepository } from '../repository/order.repository';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(async () => {
    const mockOrderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(OrderRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order with items', async () => {
      const items = [
        OrderItem.create({ name: 'Item 1', quantity: 2, price: 10 }),
        OrderItem.create({ name: 'Item 2', quantity: 1, price: 20 }),
      ];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(orderRepository, 'save').mockImplementation((() => {}) as any);

      const result = await service.createOrder(items);

      expect(result).toBeInstanceOf(Order);
      expect(orderRepository['save']).toHaveBeenCalledWith(result);
      expect(result.items).toHaveLength(2);
    });
  });

  describe('payOrder', () => {
    it('should pay an order', async () => {
      const orderId = 'order-1';
      const order = Order.create([
        OrderItem.create({ name: 'Item 1', quantity: 1, price: 10 }),
      ]);

      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(orderRepository, 'save').mockImplementation((() => {}) as any);

      await service.payOrder(orderId);

      expect(orderRepository['findById']).toHaveBeenCalledWith(orderId);
      expect(orderRepository['save']).toHaveBeenCalledWith(order);
      expect(order.status).toBe('paid');
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order', async () => {
      const orderId = 'order-1';
      const order = Order.create([
        OrderItem.create({ name: 'Item 1', quantity: 1, price: 10 }),
      ]);

      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(orderRepository, 'save').mockImplementation((() => {}) as any);

      await service.cancelOrder(orderId);

      expect(orderRepository['findById']).toHaveBeenCalledWith(orderId);
      expect(orderRepository['save']).toHaveBeenCalledWith(order);
      expect(order.status).toBe('canceled');
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      const orderId = 'order-1';

      jest.spyOn(orderRepository, 'delete').mockResolvedValue(undefined);

      await service.deleteOrder(orderId);

      expect(orderRepository['delete']).toHaveBeenCalledWith(orderId);
    });
  });
});
