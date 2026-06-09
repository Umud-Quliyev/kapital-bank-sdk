# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-06-09

### Added

- `KapitalBank.fromEnv()` — initialize the SDK from environment variables
- Default order settings via config `defaults` or env vars (`KAPITALBANK_ORDER_TYPE`, `KAPITALBANK_CURRENCY`, `KAPITALBANK_LANGUAGE`, `KAPITALBANK_REDIRECT_URL`)
- `createHostedPayment()` — one-call HPP session returning `orderId`, `password`, `paymentUrl`, and full `order`
- `restoreOrder(orderId, password)` — resume an unfinished HPP order in `Preparing` status
- EventEmitter support with typed events (`order:created`, `payment:created`, `payment:status`, `payment:paid`, `payment:declined`, `payment:expired`, `payment:refunded`, `payment:reversed`)
- Debug request logging via `logEnabled` or `KAPITALBANK_LOG_ENABLED`
- `kb.request(method, path, body?, options?)` — low-level escape hatch reusing SDK auth and base URL
- Order status helpers: `isPreparing`, `isFullyPaid`, `isDeclined`, `isExpired`, `isRefunded`, `isReversed`, `isTerminalStatus`
- `parseEnvConfig()` for manual env parsing
- Examples: `from-env`, `create-hosted-payment`, `payment-events`, `restore-order`
- Test suite expansion (44 tests): env, events, hosted payment, logger, order status, request, restore order

### Changed

- `HostedPaymentSession` now includes the full `order` object alongside primitive fields
- `CreateOrderInput` — `typeRid`, `currency`, `language`, and `hppRedirectUrl` are optional when defaults are configured
- README updated with configuration, events, restore order, status helpers, and custom request sections

### Security

- Logger sanitizes sensitive query parameters (`password`, `pan`, `cvv`, `token`, `secret`) in request URLs
- `sanitizeLogData()` utility for redacting sensitive fields in log payloads

### Fixed

- EventEmitter audit: `watchOrder`, `waitForPayment`, and `waitForStatus` do not register internal listeners or leak memory on repeated calls

## [1.1.0] - 2025

### Added

- Payment monitoring: `watchOrder`, `waitForPayment`, `waitForStatus`
- `WatchOrderTimeoutError`
- `getPaymentUrl()` helper for HPP redirect URLs
- HPP examples and documentation

## [1.0.0]

### Added

- Stable public API for Kapital Bank Payment Gateway
- Create order, get order details, refund, reverse, execute transaction
- Set source / destination token
- Recurring payment, preauthorization, clearing
- Card transfer (OCT) helper
- Typed `KapitalBankError` with error code helpers
- ESM and CommonJS builds with TypeScript declarations

[1.2.0]: https://github.com/Umud-Quliyev/kapital-bank-sdk/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Umud-Quliyev/kapital-bank-sdk/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Umud-Quliyev/kapital-bank-sdk/releases/tag/v1.0.0
