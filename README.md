# Kapital Bank SDK

Production-ready TypeScript SDK for Kapital Bank Payment Gateway.

[![npm version](https://img.shields.io/npm/v/kapital-bank-sdk.svg)](https://www.npmjs.com/package/kapital-bank-sdk)
[![npm downloads](https://img.shields.io/npm/dm/kapital-bank-sdk.svg)](https://www.npmjs.com/package/kapital-bank-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/kapital-bank-sdk)](LICENSE)
[![CI](https://github.com/Umud-Quliyev/kapital-bank-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/Umud-Quliyev/kapital-bank-sdk/actions/workflows/ci.yml)

Accept card payments, Google Pay transactions, webhooks, notifications, monitoring, and hosted payment flows using a modern TypeScript SDK.

---

## ✨ Features

* 💳 Hosted Payment Page (HPP)
* 📱 Google Pay Integration
* 🔔 Telegram Notifications
* 🎮 Discord Notifications
* 🔐 Webhook Verification
* 📊 Monitoring & Health Checks
* 🔄 Automatic Retry System
* ⚡ EventEmitter Integration
* 🧩 TypeScript First
* 📦 ESM & CommonJS Support
* ⚙️ Environment Configuration
* 🚀 Production-Ready Architecture

---

## 📚 Documentation

> Complete guides, production deployment instructions, examples, and API references are available in the Wiki.

### 👉 **[Open Full Documentation Wiki](../../wiki)**

---

## 🚀 Quick Start

Install:

```bash
npm install kapital-bank-sdk
```

Create your first payment:

```ts
import { KapitalBank } from "kapital-bank-sdk";

const kb = KapitalBank.fromEnv();

const payment = await kb.createHostedPayment({
  amount: "10",
  description: "Test Payment",
});

console.log(payment.paymentUrl);
```

---

## 📖 Documentation Index

### 🚀 Getting Started

| Guide                                                     | Description                                    |
| --------------------------------------------------------- | ---------------------------------------------- |
| [Installation](../../wiki/Installation)                   | Install the SDK and configure your environment |
| [Quick Start](../../wiki/Quick-Start)                     | Create your first payment in minutes           |
| [Environment Variables](../../wiki/Environment-Variables) | Configure the SDK using environment variables  |

### 💳 Payments

| Guide                                                                 | Description                                    |
| --------------------------------------------------------------------- | ---------------------------------------------- |
| [Hosted Payment Page (HPP)](../../wiki/Hosted-Payment-Page-%28HPP%29) | Generate payment URLs and accept card payments |
| [Google Pay](../../wiki/Google-Pay)                                   | Accept Google Pay payments                     |
| [Payment Monitoring](../../wiki/Payment-Monitoring)                   | Track payment status changes                   |

### 🏭 Production

| Guide                                                         | Description                                |
| ------------------------------------------------------------- | ------------------------------------------ |
| [Webhooks](../../wiki/Webhooks)                               | Receive real-time payment updates          |
| [Telegram Notifications](../../wiki/Telegram-Notifications)   | Send payment notifications to Telegram     |
| [Discord Notifications](../../wiki/Discord-Notifications)     | Send payment notifications to Discord      |
| [Monitoring](../../wiki/Monitoring)                           | Health checks and performance metrics      |
| [Retry System](../../wiki/Retry-System)                       | Automatic retries with exponential backoff |
| [Security Best Practices](../../wiki/Security-Best-Practices) | Secure production deployments              |
| [Production Deployment](../../wiki/Production-Deployment)     | Deploy your integration safely             |

### 📖 API Reference

| Reference                                           | Description                      |
| --------------------------------------------------- | -------------------------------- |
| [KapitalBank Class](../../wiki/API-Reference)       | Main SDK entry point             |
| [Orders](../../wiki/API-Reference-%E2%80%93-Orders) | Order and transaction methods    |
| [Events](../../wiki/API-Reference-%E2%80%93-Events) | EventEmitter integration         |
| [Error Handling](../../wiki/Error-Handling)         | Typed errors and troubleshooting |

### 🤝 Community & Guides

| Guide                                   | Description                             |
| --------------------------------------- | --------------------------------------- |
| [Examples](../../wiki/Examples)         | Real-world integration examples         |
| [FAQ](../../wiki/FAQ)                   | Frequently asked questions              |
| [Architecture](../../wiki/Architecture) | SDK architecture and payment flows      |
| [Roadmap](../../wiki/Roadmap)           | Planned features and future development |
| [Contributing](../../wiki/Contributing) | How to contribute to the project        |

---

## 🆘 Support

Need help?

* 🐛 Report bugs via GitHub Issues
* 💡 Request features via GitHub Issues
* 💬 Ask questions via GitHub Discussions
* 📖 Review the Wiki and FAQ before opening an issue

---

## 📄 License

MIT License.

---

Built and maintained by **Umud Guliyev**.

⭐ If this project helps you, consider starring the repository.
