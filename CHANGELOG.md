# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-06-10

### Added

- **Webhook Handler** - Handle webhooks from Kapital Bank with signature verification
  - HMAC-SHA256 signature verification with timing-safe comparison
  - IP filtering (denies by default for security)
  - Password-based order verification (recommended over orderId)
  - JSON parsing with error handling
  - `verifyWebhookSignature()`, `verifyWebhookIp()`, `parseWebhookPayload()`, `handleWebhook()`
  - `WebhookConfig`, `WebhookPayload`, `WebhookHandlerOptions`, `WebhookVerificationResult` types

- **Notification Services** - Automatic notifications to Telegram and Discord
  - Telegram bot integration with custom message templates
  - Discord webhook integration with embed formatting
  - Custom message templates with `{orderId}`, `{amount}`, `{currency}`, `{status}`, `{timestamp}` placeholders
  - Event toggles to prevent notification spam (disable non-terminal events by default)
  - `TelegramService` and `DiscordService` with payment event methods
  - `TelegramConfig`, `DiscordConfig`, `NotificationMessageTemplates`, `NotificationEventToggle` types

- **Retry System** - Automatic retry with exponential backoff
  - Configurable retry options (maxAttempts, initialDelay, maxDelay, backoffMultiplier)
  - Retryable errors filtering
  - Validation to prevent API abuse (max 10 attempts, backoffMultiplier > 1)
  - `retryWithBackoff()` utility function
  - `RetryOptions`, `RetryResult` types

- **Health Check** - API health monitoring
  - Basic health check with latency tracking
  - Timeout-based health check
  - `healthCheck()`, `healthCheckWithTimeout()` methods
  - `HealthCheckResult` type

- **Better Monitoring** - API performance metrics
  - Metrics tracking (total requests, success rate, error rate, average latency)
  - P95/P99 latency percentiles
  - Endpoint-specific metrics
  - `getMonitoringMetrics()`, `clearMonitoringMetrics()` methods
  - `MonitoringService`, `MetricData`, `MonitoringMetrics` types

- **Environment Configuration** - Extended env parsing
  - Webhook config parsing (secret, path, allowedIps)
  - Telegram config parsing (botToken, chatId, parseMode, customMessages, enabledEvents)
  - Discord config parsing (webhookUrl, username, avatarUrl, customMessages, enabledEvents)
  - Retry config parsing with validation
  - New environment variables for all new features

- **Examples** - 7 new example files
  - `webhook-handler.ts` - Webhook handling example
  - `telegram-notifications.ts` - Telegram notifications example
  - `discord-notifications.ts` - Discord notifications example
  - `retry-system.ts` - Retry configuration example
  - `health-check.ts` - Health check example
  - `monitoring.ts` - Metrics tracking example
  - `test-new-features.ts` - Feature testing script
  - `test-security-fixes.ts` - Security validation script

### Security Improvements

- Webhook IP validation now denies by default (was allow-all)
- Retry configuration validated to prevent API abuse (max 10 attempts)
- Notification event toggles prevent spam by disabling non-terminal events
- Webhook password handling improved (supports explicit password field)
- All sensitive credentials must use environment variables

### Changed

- README updated with Production Guides section
- README updated with Security Notes for webhook, notifications, and retry
- `.env.example` updated with all new environment variables
- SDK features list updated with new capabilities
- Roadmap updated (Webhook/Event Integrations completed)

### Fixed

- Webhook IP validation bypass (now denies by default)
- Retry infinite loop risk (validation added)
- Notification spam (event toggles added)
- Webhook password security (explicit password support)

## [1.3.0] - 2026-06-09

### Added

- `createGooglePayOrder()` — create Google Pay orders with `GN3D` or `GSMS` type (defaults to `GSMS`)
- `setGooglePayToken()` — submit Google Pay payment token (`googlePayBlock` in HEX) via Set Source Token
- `payWithGooglePay()` — full native flow: create order → set token → execute transaction
- `encodeGooglePayToken()` and `GOOGLE_PAY_GATEWAY` constants for client-side integration
- `GooglePayOrderType`, `CreateGooglePayOrderInput`, `PayWithGooglePayInput`, and related types
- `KAPITALBANK_GOOGLE_PAY_ORDER_TYPE` env var and `defaults.googlePayOrderType` config option
- `isValidGooglePayOrderType()` and `resolveGooglePayOrderType()` helpers
- Examples: `google-pay-order`, `google-pay-native`, `google-pay-full-flow`
- Test suite expansion: Google Pay order, token flow, events, and env parsing

### Changed

- README updated with Google Pay overview, payment flow diagram, quick start, advanced flow, and configuration
- `PaymentMethod` enum already includes `GooglePay` for order detail responses

### Removed

- `createGooglePaySession()` — Google Pay uses token-based flow, not HPP sessions
- `CreateGooglePaySessionInput` and `GooglePaySession` types
- Examples: `google-pay-session`, `google-pay-monitor`
- Tests: `google-pay-session.test.ts`

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

[1.3.0]: https://github.com/Umud-Quliyev/kapital-bank-sdk/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/Umud-Quliyev/kapital-bank-sdk/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Umud-Quliyev/kapital-bank-sdk/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Umud-Quliyev/kapital-bank-sdk/releases/tag/v1.0.0
