# Kapital Bank SDK

TypeScript SDK for integrating with Kapital Bank payment services.

## Installation

```bash
npm install kapital-bank-sdk
```

## Usage

```typescript
import { KapitalBankClient } from 'kapital-bank-sdk';

const client = new KapitalBankClient({
  merchantId: 'your-merchant-id',
  password: 'your-password',
  environment: 'production', // or 'test'
});

// Create an order
const order = await client.orders.create({
  amount: 100,
  currency: 'AZN',
  description: 'Payment description',
});
```

## Features

- Order management
- Refund processing
- Transaction reversals
- Payment details retrieval

## License

ISC
