# Kapital Bank SDK

TypeScript SDK for Kapital Bank Payment Gateway API.

## Installation

```bash
npm install kapital-bank-sdk
```

## Features

* Create Order
* Get Order Details
* Execute Transactions
* Refund Transactions
* Reverse Transactions
* Set Source Token (Saved Cards)
* Set Destination Token
* Recurring Payment Support
* Card Transfer Helper (OCT)
* Full TypeScript Support
* ESM & CommonJS Support

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

Example response:

```ts
{
  id: 232748,
  hppUrl: "https://txpgtst.kapitalbank.az/flex",
  password: "1q0a1v2ypvcg0",
  status: "Preparing"
}
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

## Set Source Token (Saved Card)

```ts
await kb.setSourceToken(
  order.id,
  order.password,
  {
    initiationEnvKind: "Server",
    storedId: 5125,
  }
);
```

Example response:

```ts
{
  status: "Preparing",
  srcToken: {
    id: 144475,
    status: "Active",
    displayName: "416974******1778"
  }
}
```

---

## Set Destination Token

```ts
await kb.setDestinationToken(
  order.id,
  order.password,
  {
    pan: "4169741330151778",
  }
);
```

Example response:

```ts
{
  status: "Preparing",
  dstToken: {
    id: 144494,
    role: "Dst",
    status: "Active",
    displayName: "416974******1778"
  }
}
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

await kb.setSourceToken(
  order.id,
  order.password,
  {
    initiationEnvKind: "Server",
    storedId: 5125,
  }
);

await kb.executeTransaction(
  order.id,
  {
    phase: "Single",
    conditions: {
      cofUsage: "Recurring",
    },
  }
);
```

---

## Card Transfer (OCT)

Transfer funds directly to a card using a single helper.

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
  | "OCT";
```

| Type      | Description                |
| --------- | -------------------------- |
| Order_SMS | Standard Purchase          |
| Order_DMS | Preauthorization           |
| Order_REC | Recurring Payment          |
| DMSN3D    | Recurring Preauthorization |
| OCT       | Account-to-Card            |

---

## Environment

### Test

```ts
environment: "test"
```

Base URL:

```text
https://txpgtst.kapitalbank.az/api
```

### Production

```ts
environment: "production"
```

Base URL:

```text
https://e-commerce.kapitalbank.az/api
```

---

## Roadmap

* Stronger Type Safety
* Additional Payment Helpers
* GitHub Actions CI
* Extended Test Coverage
* Better Error Mapping

---

## Links

GitHub:
https://github.com/Umud-Quliyev/kapital-bank-sdk

NPM:
https://www.npmjs.com/package/kapital-bank-sdk

---

## License

MIT

## Author

Umud Guliyev
