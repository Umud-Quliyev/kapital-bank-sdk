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
* Full TypeScript Support
* ESM & CommonJS Support

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

* Recurring Payment Examples
* Destination Token Support
* Card Transfer (OCT)
* GitHub Actions CI
* Extended Test Coverage

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
