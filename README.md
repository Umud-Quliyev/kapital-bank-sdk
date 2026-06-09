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

- Environment-based configuration with `KapitalBank.fromEnv()`
- Default order settings from config or environment variables
- `createHostedPayment()` — one-call HPP session (`orderId`, `password`, `paymentUrl`, `order`)
- Google Pay via `GN3D` / `GSMS` — `createGooglePayOrder()`, `setGooglePayToken()`, `payWithGooglePay()`
- `restoreOrder()` — resume an unfinished HPP order in `Preparing` status
- Order status helpers (`isPreparing`, `isFullyPaid`, and more)
- Low-level `request()` escape hatch for undocumented API endpoints
- EventEmitter support (`payment:paid`, `payment:declined`, and more)
- Debug request logging via `KAPITALBANK_LOG_ENABLED`
- Hosted Payment Page (HPP) with `getPaymentUrl()`
- Payment monitoring (`waitForPayment`, `waitForStatus`, `watchOrder`)
- Create Order & Get Order Details
- Execute, Refund, and Reverse Transactions
- Set Source / Destination Token
- Recurring Payment Support
- Card Transfer Helper (OCT)
- PreAuthorization & Clearing Helpers
- Typed Error Handling (`KapitalBankError`, `WatchOrderTimeoutError`)
- Full TypeScript Support
- ESM & CommonJS Support

---

## Quick Start

Create an order, open the payment page, wait until the customer pays.

### Option A — Environment Variables

Copy the template and edit your credentials:

```bash
cp .env.example .env   # Linux/macOS
copy .env.example .env # Windows
```

```env
KAPITALBANK_MODE=test
KAPITALBANK_USERNAME=TerminalSys/kapital
KAPITALBANK_PASSWORD=kapital123

KAPITALBANK_ORDER_TYPE=Order_SMS
KAPITALBANK_GOOGLE_PAY_ORDER_TYPE=GSMS
KAPITALBANK_CURRENCY=AZN
KAPITALBANK_LANGUAGE=az
KAPITALBANK_REDIRECT_URL=https://your-site.com/callback
KAPITALBANK_LOG_ENABLED=true
```

Examples load `.env` automatically via `examples/client.ts`.

```ts
import { KapitalBank } from "kapital-bank-sdk";

const kb = KapitalBank.fromEnv();

const session = await kb.createHostedPayment({
  amount: "1",
  description: "Payment",
});

console.log(session.paymentUrl);

const result = await kb.waitForPayment(session.orderId, {
  password: session.password,
});
```

When env defaults are set, `createOrder()` and `createHostedPayment()` apply `typeRid`, `currency`, `language`, and `hppRedirectUrl` automatically.

### Option B — Constructor Config

```ts
import { KapitalBank, getPaymentUrl } from "kapital-bank-sdk";

const kb = new KapitalBank({
  username: "TerminalSys/kapital",
  password: "kapital123",
  environment: "test",
  defaults: {
    currency: "AZN",
    language: "az",
    hppRedirectUrl: "https://your-site.com/callback",
  },
});

const order = await kb.createOrder({
  typeRid: "Order_SMS",
  amount: "1",
  description: "Payment",
  initiationEnvKind: "Browser",
  hppCofCapturePurposes: ["Cit"],
});

const paymentUrl = getPaymentUrl(order);

console.log(paymentUrl);

const result = await kb.waitForPayment(order.id, {
  password: order.password,
});

console.log(result.status);
```

> **Important:** Each `createOrder()` call creates a new order. Redirect the customer to the URL from the same order you are monitoring.

---

## Google Pay

Kapital Bank Google Pay uses dedicated order types on the same `POST /order` endpoint:

| Type   | Description                   | Auth method            |
| ------ | ----------------------------- | ---------------------- |
| `GSMS` | Google Pay purchase (default) | `PAN_ONLY` cards       |
| `GN3D` | Google Pay with 3D Secure     | `CRYPTOGRAM_3DS` cards |

Your curator may configure different `typeRid` mappings per terminal. Contact Kapital Bank to enable Google Pay on your merchant login.

### Payment Flow

Google Pay uses a token-based server-side flow (not HPP):

```
Google Pay Button (Frontend)
        ↓
createGooglePayOrder() (Backend)
        ↓
Customer pays via Google Pay API
        ↓
Receive payment token JSON
        ↓
encodeGooglePayToken() - Convert to HEX
        ↓
setGooglePayToken() - Set token on order
        ↓
executeTransaction() - Process payment
        ↓
waitForPayment() - Monitor status (optional)
```

### Quick Start (One-Call)

The simplest way to process Google Pay:

```ts
import {
  KapitalBank,
  encodeGooglePayToken,
  GOOGLE_PAY_GATEWAY,
} from "kapital-bank-sdk";

const kb = KapitalBank.fromEnv();

// Configure Google Pay on your frontend with:
const gatewayConfig = {
  gateway: GOOGLE_PAY_GATEWAY.gateway,
  gatewayMerchantId: GOOGLE_PAY_GATEWAY.testGatewayMerchantId,
};

// After customer pays, encode the token JSON to HEX:
const googlePayBlock = encodeGooglePayToken(googlePayTokenJson);

// Process payment in one call:
const result = await kb.payWithGooglePay({
  amount: "10",
  description: "Google Pay Test",
  googlePayBlock,
});

console.log("Order ID:", result.orderId);
console.log("Approval Code:", result.transaction.approvalCode);
```

### Advanced Flow (Step-by-Step)

For more control over the payment process:

```ts
import {
  KapitalBank,
  encodeGooglePayToken,
} from "kapital-bank-sdk";

const kb = KapitalBank.fromEnv();

// 1. Create Google Pay order
const order = await kb.createGooglePayOrder({
  amount: "10",
  description: "Google Pay Test",
  typeRid: "GSMS", // or "GN3D" for 3D Secure
});

console.log("Order ID:", order.id);

// 2. Customer pays via Google Pay API on your frontend
//    Receive payment token JSON: paymentData.paymentMethodData.tokenizationData.token

// 3. Encode token to HEX
const googlePayBlock = encodeGooglePayToken(googlePayTokenJson);

// 4. Set the Google Pay token on the order
await kb.setGooglePayToken(order.id, order.password, {
  googlePayBlock,
});

// 5. Execute the transaction
const transaction = await kb.executeTransaction(order.id, {
  phase: "Single",
});

console.log("Transaction:", transaction);

// 6. Optionally wait for payment completion
const result = await kb.waitForPayment(order.id, {
  password: order.password,
});

console.log("Final status:", result.status);
```

### Order Creation Only

If you need just the order (e.g., for custom token handling):

```ts
import { KapitalBank } from "kapital-bank-sdk";

const kb = KapitalBank.fromEnv();

const order = await kb.createGooglePayOrder({
  amount: "10",
  description: "Google Pay Test",
});

console.log("Order ID:", order.id);
console.log("Password:", order.password);
```


### Environment Configuration

```env
KAPITALBANK_GOOGLE_PAY_ORDER_TYPE=GSMS
KAPITALBANK_CURRENCY=AZN
KAPITALBANK_LANGUAGE=az
KAPITALBANK_REDIRECT_URL=https://your-site.com/callback
```

Or via constructor:

```ts
const kb = new KapitalBank({
  username: process.env.KAPITALBANK_USERNAME!,
  password: process.env.KAPITALBANK_PASSWORD!,
  environment: "test",
  defaults: {
    googlePayOrderType: "GSMS",
    currency: "AZN",
    language: "az",
    hppRedirectUrl: "https://your-site.com/callback",
  },
});
```

---

## Restore Order

Kapital Bank does not expose a separate "restore" HTTP endpoint. An unfinished HPP order in `Preparing` status can be resumed by rebuilding the payment URL from stored `orderId` and `password`.

`restoreOrder()` validates the status and returns a ready-to-redirect session:

```ts
import { KapitalBank, isPreparing } from "kapital-bank-sdk";

const kb = KapitalBank.fromEnv();

const details = await kb.getOrder(orderId, {
  password,
});

if (isPreparing(details)) {
  const session = await kb.restoreOrder(orderId, password);

  console.log(session.paymentUrl);
}
```

Only orders with status `Preparing` can be restored. Other statuses throw `KapitalBankError` with code `InvalidOrderState`.

---

## Order Status Helpers

Tree-shakable utilities for common status checks:

```ts
import {
  isPreparing,
  isFullyPaid,
  isDeclined,
  isExpired,
  isRefunded,
  isReversed,
} from "kapital-bank-sdk";

if (isFullyPaid(order)) {
  // fulfill order
}
```

---

## Custom API Requests

Use `request()` when you need an endpoint not yet wrapped by the SDK. Authentication and base URL are reused automatically:

```ts
const response = await kb.request<{ order: OrderDetails }>(
  "GET",
  `/order/${orderId}`,
  undefined,
  { params: { password } },
);
```

---

## Hosted Payment Page (HPP)

### `createHostedPayment()`

The simplest way to start an HPP flow:

```ts
const session = await kb.createHostedPayment({
  amount: "10",
  description: "Order",
});

console.log(session.order.status);
```

See [Quick Start](#quick-start) for the full flow. Additional options:

```ts
const result = await kb.waitForStatus(order.id, "FullyPaid", {
  password: order.password,
  interval: 5000,
  timeout: 300000,
});

const result = await kb.watchOrder(order.id, {
  password: order.password,
});
```

### `getPaymentUrl()`

The API returns a base `hppUrl`. Build the full redirect URL with:

```ts
import { getPaymentUrl } from "kapital-bank-sdk";

const url = getPaymentUrl(order);
// https://txpgtst.kapitalbank.az/flex?id=233294&password=...
```

---

## Configuration

### Environment Variables

| Variable                            | Required | Description                                  |
| ----------------------------------- | -------- | -------------------------------------------- |
| `KAPITALBANK_USERNAME`              | Yes      | API username                                 |
| `KAPITALBANK_PASSWORD`              | Yes      | API password                                 |
| `KAPITALBANK_MODE`                  | No       | `test` or `production` (default: `test`)     |
| `KAPITALBANK_TIMEOUT`               | No       | HTTP timeout in milliseconds                 |
| `KAPITALBANK_ORDER_TYPE`            | No       | Default order type (e.g. `Order_SMS`)        |
| `KAPITALBANK_GOOGLE_PAY_ORDER_TYPE` | No       | Default Google Pay type: `GSMS` or `GN3D`    |
| `KAPITALBANK_CURRENCY`              | No       | Default order currency (`AZN`, `USD`, `EUR`) |
| `KAPITALBANK_LANGUAGE`              | No       | Default order language (`az`, `en`, `ru`)    |
| `KAPITALBANK_REDIRECT_URL`          | No       | Default `hppRedirectUrl` for HPP orders      |
| `KAPITALBANK_LOG_ENABLED`           | No       | Log HTTP requests (`true` / `false`)         |

```ts
import { KapitalBank } from "kapital-bank-sdk";

const kb = KapitalBank.fromEnv();
```

You can also parse env vars manually:

```ts
import { KapitalBank, parseEnvConfig } from "kapital-bank-sdk";

const kb = new KapitalBank(parseEnvConfig());
```

### Constructor Defaults

```ts
const kb = new KapitalBank({
  username: process.env.KAPITALBANK_USERNAME!,
  password: process.env.KAPITALBANK_PASSWORD!,
  environment: "test",
  defaults: {
    currency: "AZN",
    language: "az",
    hppRedirectUrl: "https://your-site.com/callback",
  },
});
```

Explicit `createOrder()` values always override configured defaults.

### Debug Logging

When `KAPITALBANK_LOG_ENABLED=true` or `logEnabled: true`:

```text
[KapitalBank]
POST /order

[KapitalBank]
GET /order/233266
```

---

## Events

`KapitalBank` extends Node.js `EventEmitter` with typed payment events:

```ts
kb.on("payment:paid", (order) => {
  console.log("Paid:", order.id);
});

kb.on("payment:declined", (order) => {
  console.log("Declined:", order.id);
});

kb.on("payment:status", (order) => {
  console.log("Status:", order.status);
});

const session = await kb.createHostedPayment({
  amount: "1",
  description: "Bot payment",
});

await kb.waitForPayment(session.orderId, {
  password: session.password,
});
```

| Event              | When                                                        |
| ------------------ | ----------------------------------------------------------- |
| `order:created`    | After `createOrder()`                                       |
| `payment:created`  | After `createHostedPayment()` |
| `payment:status`   | On each poll during monitoring                              |
| `payment:paid`     | Order reaches `FullyPaid`                                   |
| `payment:declined` | Order reaches `Declined`                                    |
| `payment:expired`  | Order reaches `Expired`                                     |
| `payment:refunded` | Order reaches `Refunded`                                    |
| `payment:reversed` | Order reaches `Reversed`                                    |

Ideal for Telegram bots, Discord bots, n8n workflows, and WebSocket bridges.

---

## Create Order

```ts
const order = await kb.createOrder({
  amount: "1",
  description: "SDK Test Order",
});

console.log(order.id);
console.log(getPaymentUrl(order));
```

You can still pass `typeRid`, `currency`, `language`, and `hppRedirectUrl` per order when needed.

---

## Get Order Details

```ts
const details = await kb.getOrder(order.id);

const details = await kb.getOrder(order.id, {
  password: order.password,
  tranDetailLevel: 2,
  tokenDetailLevel: 2,
  orderDetailLevel: 2,
});
```

---

## Payment Monitoring

```ts
await kb.waitForPayment(order.id, {
  password: order.password,
  interval: 5000,
  timeout: 300000,
});

await kb.waitForStatus(order.id, "FullyPaid", {
  password: order.password,
});

await kb.watchOrder(order.id, {
  password: order.password,
});
```

| Method                                | Description                                      |
| ------------------------------------- | ------------------------------------------------ |
| `waitForPayment(id, options?)`        | Poll until `FullyPaid`, `Declined`, or `Expired` |
| `waitForStatus(id, status, options?)` | Poll until the order reaches a specific status   |
| `watchOrder(id, options?)`            | Poll until a terminal status is reached          |

`WatchOrderOptions`:

| Option         | Default           | Description                                |
| -------------- | ----------------- | ------------------------------------------ |
| `password`     | —                 | Order password (recommended for HPP flows) |
| `interval`     | `5000`            | Poll interval in ms                        |
| `timeout`      | `300000`          | Max wait time in ms                        |
| `stopStatuses` | terminal statuses | Statuses that stop polling                 |

Throws `WatchOrderTimeoutError` when `timeout` is exceeded.

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

## Error Handling

```ts
import { KapitalBankError, WatchOrderTimeoutError } from "kapital-bank-sdk";

try {
  await kb.waitForPayment(order.id, {
    password: order.password,
    timeout: 120000,
  });
} catch (error) {
  if (error instanceof WatchOrderTimeoutError) {
    console.log("Payment not completed in time");
  }

  if (error instanceof KapitalBankError) {
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
| Order_SMS | Standard Purchase (HPP)    |
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

Test credentials:

| Field    | Value                 |
| -------- | --------------------- |
| Username | `TerminalSys/kapital` |
| Password | `kapital123`          |

### Test Cards

| PAN              | Exp Date | CVV | Notes                          |
| ---------------- | -------- | --- | ------------------------------ |
| 5239151747183468 | 11/27    | 602 | Use for HPP browser payments   |
| 4169741330151778 | 06/25    | 119 | Expired — OCT/server-side only |

> The `06/25` card may show "expired card" on HPP. Use `5239151747183468` for hosted payment page testing.

### Production

```ts
environment: "production";
```

Base URL:

```text
https://e-commerce.kapitalbank.az/api
```

---

## Examples

Clone the repo and run examples with `tsx`:

```bash
npm install
```

| Script               | Command                      | Description                              |
| -------------------- | ---------------------------- | ---------------------------------------- |
| From env             | `npm run from-env`           | Create order using environment variables |
| Hosted payment       | `npm run hosted-payment`     | `createHostedPayment()` demo             |
| Restore order        | `npm run restore-order`      | Resume a preparing HPP order             |
| Google Pay order     | `npm run google-pay-order`   | Create a Google Pay order                |
| Google Pay native    | `npm run google-pay-native`  | Token-based Google Pay flow              |
| Google Pay full flow | `npm run google-pay-full-flow` | End-to-end Google Pay with monitoring   |
| Payment events       | `npm run payment-events`     | EventEmitter + wait for payment          |
| HPP payment URL      | `npm run hpp-payment`        | Create order and print payment URL       |
| HPP wait for payment | `npm run hpp-wait`           | Create order, print URL, poll until paid |
| Create order         | `npm run example`            | Basic order creation                     |
| Wait for payment     | `npm run wait-for-payment`   | Poll order status                        |
| Watch order          | `npm run watch-order`        | Poll until terminal status               |
| Get order            | `npm run get-order`          | Fetch order details                      |
| Transfer to card     | `npm run transfer`           | OCT card transfer                        |
| Recurring            | `npm run recurring`          | Recurring payment flow                   |
| Preauthorize         | `npm run preauthorize`       | PreAuthorization flow                    |
| Clear                | `npm run clear`              | Clearing flow                            |
| Reverse              | `npm run reverse`            | Reverse transaction                      |
| Error handling       | `npm run error-test`         | Error handling demo                      |

---

## Roadmap

- Webhook/Event Integrations
- Apple Pay Support
- Extended Test Coverage
- Transaction Response Enhancements

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
