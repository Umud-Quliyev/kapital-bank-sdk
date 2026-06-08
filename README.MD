# Kapital Bank SDK

TypeScript SDK for Kapital Bank Payment Gateway API.

## Features

* Create Order
* Get Order Details
* Refund Transaction
* Reverse Transaction
* TypeScript Support
* ESM & CommonJS Support

## Installation

```bash
npm install kapital-bank-sdk
```

## Configuration

```ts
import { KapitalBank } from "kapital-bank-sdk";

const kb = new KapitalBank({
  username: "YOUR_USERNAME",
  password: "YOUR_PASSWORD",
  environment: "test",
});
```

## Create Order

```ts
const order = await kb.createOrder({
  typeRid: "Order_SMS",
  amount: "1",
  currency: "AZN",
  language: "az",
  description: "Test Order",
  hppRedirectUrl: "https://example.com",
});

console.log(order);
```

## Get Order

```ts
const order = await kb.getOrder(12345);

console.log(order);
```

## Refund

```ts
await kb.refund(12345, {
  phase: "Single",
  amount: "1.00",
  type: "Refund",
});
```

## Reverse

```ts
await kb.reverse(12345, {
  phase: "Single",
  voidKind: "Full",
});
```

## Environments

### Test

```text
https://txpgtst.kapitalbank.az/api
```

### Production

```text
https://e-commerce.kapitalbank.az/api
```

## License

MIT
