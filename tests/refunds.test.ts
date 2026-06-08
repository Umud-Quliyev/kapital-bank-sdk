import { describe, it, expect } from 'vitest';
import { KapitalBankClient } from '../src';

describe('RefundsService', () => {
  const client = new KapitalBankClient({
    merchantId: 'test-merchant',
    password: 'test-password',
    environment: 'test',
  });

  it('should create a refund', async () => {
    const refund = await client.refunds.create({
      orderId: 'test-order-id',
      amount: 50,
      reason: 'Customer request',
    });

    expect(refund).toBeDefined();
    expect(refund.refundId).toBeDefined();
    expect(refund.amount).toBe(50);
  });

  it('should get a refund', async () => {
    const refund = await client.refunds.get('test-refund-id');
    expect(refund).toBeDefined();
  });
});
