import { describe, it, expect } from 'vitest';
import { KapitalBankClient } from '../src';

describe('OrdersService', () => {
  const client = new KapitalBankClient({
    merchantId: 'test-merchant',
    password: 'test-password',
    environment: 'test',
  });

  it('should create an order', async () => {
    const order = await client.orders.create({
      amount: 100,
      currency: 'AZN',
      description: 'Test order',
    });

    expect(order).toBeDefined();
    expect(order.orderId).toBeDefined();
    expect(order.amount).toBe(100);
  });

  it('should get an order', async () => {
    const order = await client.orders.get('test-order-id');
    expect(order).toBeDefined();
  });
});
