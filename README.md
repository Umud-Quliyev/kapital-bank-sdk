# Kapital Bank SDK

![npm](https://img.shields.io/npm/v/kapital-bank-sdk)
![license](https://img.shields.io/npm/l/kapital-bank-sdk)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)
![downloads](https://img.shields.io/npm/dm/kapital-bank-sdk)

TypeScript SDK for Kapital Bank Payment Gateway API.
## Installation

```bash
npm install kapital-bank-sdk
```

## Features

- Create Order
- Get Order Details
- Execute Transactions
- Refund Transactions
- Reverse Transactions
- Set Source Token (Saved Cards)
- Set Destination Token
- Recurring Payment Support
- Card Transfer Helper (OCT)
- PreAuthorization Helper
- Clearing Helper
- Typed Error Handling (`KapitalBankError`)
- Full TypeScript Support
- ESM & CommonJS Support

---

## Quick Example

```ts
import { KapitalBank } from "kapital-bank-sdk";

const kb = new KapitalBank({
  username: "TerminalSys/kapital",
  password: "kapital123",
  environment: "test",
});

const result = await kb.transferToCard({
  amount: "1",
  pan: "4169741330151778",
});

console.log(result);
```

---

## Quick Start

```ts
import { KapitalBank } from "kapital-bank-sdk";

const kb = new KapitalBank({
  username: "TerminalSys/kapital",
  password: "kapital123",
  environment: "test",
});
```

---

## Create Order

```ts
const order = await kb.createOrder({
  typeRid: "Order_SMS",
  amount: "1",
  currency: "AZN",
  language: "az",
  description: "SDK Test Order",
  hppRedirectUrl: "https://example.com",
});

console.log(order);
```

---

## Get Order Details

```ts
const details = await kb.getOrder(order.id);

console.log(details);
```

---

## Execute Transaction

```ts
await kb.executeTransaction(order.id, {
  phase: "Single",
});
```

---

## Refund Transaction

```ts
await kb.refund(order.id, {
  phase: "Single",
  amount: "1.00",
  type: "Refund",
});
```

---

## Reverse Transaction

```ts
await kb.reverse(order.id, {
  phase: "Single",
  voidKind: "Full",
});
```

---

## Set Source Token

```ts
await kb.setSourceToken(order.id, order.password, {
  initiationEnvKind: "Server",
  storedId: 5125,
});
```

---

## Set Destination Token

```ts
await kb.setDestinationToken(order.id, order.password, {
  pan: "4169741330151778",
});
```

---

## Recurring Payment

```ts
const order = await kb.createOrder({
  typeRid: "Order_REC",
  amount: "1",
  currency: "AZN",
  language: "az",
  description: "Recurring Payment",
});

await kb.setSourceToken(order.id, order.password, {
  initiationEnvKind: "Server",
  storedId: 5125,
});

await kb.executeTransaction(order.id, {
  phase: "Single",
  conditions: {
    cofUsage: "Recurring",
  },
});
```

---

## PreAuthorization

```ts
await kb.preAuthorize(order.id, "1.00");
```

---

## Clearing

```ts
await kb.clear(order.id, "1.00");
```

---

## Error Handling

```ts
import {
  KapitalBankError,
} from "kapital-bank-sdk";

try {
  await kb.executeTransaction(...);
} catch (error) {
  if (
    error instanceof KapitalBankError
  ) {
    if (error.isDeclined()) {
      console.log("Transaction declined");
    }
  }
}
```

`KapitalBankError` provides helper methods for common API error codes:

| Method                  | Error Code          |
| ----------------------- | ------------------- |
| `isDeclined()`          | `PmoDecline`        |
| `isInvalidToken()`      | `InvalidToken`      |
| `isInvalidOrderState()` | `InvalidOrderState` |
| `isOrderNotFound()`     | `OrderNotFound`     |
| `isSystemError()`       | `SystemError`       |

---

## Card Transfer (OCT)

```ts
const result = await kb.transferToCard({
  amount: "1",
  pan: "4169741330151778",
});

console.log(result);
```

Example response:

```ts
{
  orderId: 232774,
  destinationTokenId: 144495,
  approvalCode: "007696",
  pmoResultCode: "1"
}
```

The SDK automatically:

1. Creates an OCT order
2. Creates a destination token
3. Executes the credit transaction

---

## Supported Order Types

```ts
type OrderType =
  | "Order_SMS"
  | "Order_DMS"
  | "Order_REC"
  | "DMSN3D"
  | "OCT"
  | "GN3D"
  | "GSMS";
```

| Type      | Description                |
| --------- | -------------------------- |
| Order_SMS | Standard Purchase          |
| Order_DMS | PreAuthorization           |
| Order_REC | Recurring Payment          |
| DMSN3D    | Recurring PreAuthorization |
| OCT       | Account-to-Card            |
| GN3D      | Google Pay 3D Secure       |
| GSMS      | Google Pay Purchase        |

---

## Environment

### Test

```ts
environment: "test";
```

Base URL:

```text
https://txpgtst.kapitalbank.az/api
```

### Production

```ts
environment: "production";
```

Base URL:

```text
https://e-commerce.kapitalbank.az/api
```

---

## Roadmap

- Google Pay Support
- Extended Test Coverage
- Transaction Response Enhancements
- v1.0 Stable Release

---

## Links

GitHub:
https://github.com/Umud-Quliyev/kapital-bank-sdk

NPM:
https://www.npmjs.com/package/kapital-bank-sdk

---

## License

MIT

---

## Author

Umud Guliyev
