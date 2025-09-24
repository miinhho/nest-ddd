import { Test, TestingModule } from '@nestjs/testing';
import { OrderItem } from '../entity/order-item.entity';
import { Order } from '../entity/order.entity';
import { OrderRepository } from '../repository/order.repository';
import { OrderService } from '../service/order.service';
import { OrderController } from './order.controller';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(async () => {
    const mockOrderService = {
      createOrder: jest.fn(),
      payOrder: jest.fn(),
      cancelOrder: jest.fn(),
      deleteOrder: jest.fn(),
    };
    const mockOrderRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
        {
          provide: OrderRepository,
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get(OrderService);
    orderRepository = module.get(OrderRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const body = {
        items: [{ name: 'Item 1', quantity: 2, price: 10 }],
      };
      const order = Order.create([OrderItem.create(body.items[0])]);

      jest.spyOn(orderService, 'createOrder').mockResolvedValue(order);

      const result = await controller.create(body);

      expect(result.id).toBe(order.id);
      expect(result.status).toBe(order.status);
      expect(orderService['createOrder']).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an order', async () => {
      const id = 'order-1';
      const order = Order.create([
        OrderItem.create({ name: 'Item 1', quantity: 1, price: 10 }),
      ]);

      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);

      const result = await controller.findOne(id);

      expect(result.id).toBe(order.id);
      expect(result.status).toBe(order.status);
      expect(orderRepository['findById']).toHaveBeenCalledWith(id);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const orders = [
        Order.create([OrderItem.create({ name: 'Item 1', quantity: 1, price: 10 })]),
      ];

      jest.spyOn(orderRepository, 'findAll').mockResolvedValue(orders);

      const result = await controller.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(orders[0].id);
      expect(orderRepository['findAll']).toHaveBeenCalled();
    });
  });

  describe('pay', () => {
    it('should pay an order', async () => {
      const id = 'order-1';

      jest.spyOn(orderService, 'payOrder').mockResolvedValue(undefined);

      const result = await controller.pay(id);

      expect(result.code).toBeDefined();
      expect(orderService['payOrder']).toHaveBeenCalledWith(id);
    });
  });

  describe('cancel', () => {
    it('should cancel an order', async () => {
      const id = 'order-1';

      jest.spyOn(orderService, 'cancelOrder').mockResolvedValue(undefined);

      const result = await controller.cancel(id);

      expect(result.code).toBeDefined();
      expect(orderService['cancelOrder']).toHaveBeenCalledWith(id);
    });
  });

  describe('delete', () => {
    it('should delete an order', async () => {
      const id = 'order-1';

      jest.spyOn(orderService, 'deleteOrder').mockResolvedValue(undefined);

      await controller.delete(id);

      expect(orderService['deleteOrder']).toHaveBeenCalledWith(id);
    });
  });
});
