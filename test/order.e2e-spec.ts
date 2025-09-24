/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Order (e2e)', () => {
  let app: INestApplication<App>;
  let orm: MikroORM;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    orm = moduleFixture.get(MikroORM);
    await orm.getSchemaGenerator().createSchema();
    await app.init();
  });

  afterEach(async () => {
    await orm.getSchemaGenerator().dropSchema();
    await app.close();
  });

  describe('/orders (POST)', () => {
    it('should create an order', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          items: [{ name: 'Item 1', quantity: 2, price: 10 }],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.status).toBe('pending');
          expect(res.body.total).toBe(20);
        });
    });
  });

  describe('/orders (GET)', () => {
    it('should return all orders', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({
          items: [{ name: 'Item 1', quantity: 1, price: 10 }],
        });

      return request(app.getHttpServer())
        .get('/orders')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/orders/:id (GET)', () => {
    it('should return an order', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/orders')
        .send({
          items: [{ name: 'Item 1', quantity: 1, price: 10 }],
        });

      const orderId = createRes.body.id;

      return request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(orderId);
          expect(res.body.status).toBe('pending');
        });
    });
  });

  describe('/orders/:id/pay (PUT)', () => {
    it('should pay an order', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/orders')
        .send({
          items: [{ name: 'Item 1', quantity: 1, price: 10 }],
        });

      const orderId = createRes.body.id;

      return request(app.getHttpServer())
        .put(`/orders/${orderId}/pay`)
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBeDefined();
        });
    });
  });

  describe('/orders/:id/cancel (PUT)', () => {
    it('should cancel an order', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/orders')
        .send({
          items: [{ name: 'Item 1', quantity: 1, price: 10 }],
        });

      const orderId = createRes.body.id;

      return request(app.getHttpServer())
        .put(`/orders/${orderId}/cancel`)
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBeDefined();
        });
    });
  });

  describe('/orders/:id (DELETE)', () => {
    it('should delete an order', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/orders')
        .send({
          items: [{ name: 'Item 1', quantity: 1, price: 10 }],
        });

      const orderId = createRes.body.id;

      return request(app.getHttpServer()).delete(`/orders/${orderId}`).expect(204);
    });
  });
});
