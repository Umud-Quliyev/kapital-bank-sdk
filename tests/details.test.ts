import { describe, it, expect } from 'vitest';
import { KapitalBankClient } from '../src';

describe('DetailsService', () => {
  const client = new KapitalBankClient({
    merchantId: 'test-merchant',
    password: 'test-password',
    environment: 'test',
  });

  it('should get order details', async () => {
    const details = await client.details.get({
      orderId: 'test-order-id',
    });

    expect(details).toBeDefined();
    expect(details.orderId).toBe('test-order-id');
  });
});
