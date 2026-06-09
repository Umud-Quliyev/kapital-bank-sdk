import { EventEmitter } from "node:events";

import { Method } from "axios";

import { KapitalBankClient } from "./client/KapitalBankClient";
import { parseEnvConfig } from "./config/env";

import { KapitalBankConfig } from "./types/config";

import { OrdersService } from "./services/orders.service";
import { DetailsService } from "./services/details.service";
import { RefundsService } from "./services/refunds.service";
import { ReversalsService } from "./services/reversals.service";
import { DestinationTokenService } from "./services/destination-token.service";
import { TransfersService } from "./services/transfers.service";
import { PreAuthService } from "./services/preauth.service";
import { ClearingService } from "./services/clearing.service";
import { PaymentMonitorService } from "./services/payment-monitor.service";
import { GooglePayService } from "./services/google-pay.service";
import { WebhookService } from "./services/webhook.service";
import { TelegramService } from "./services/telegram.service";
import { DiscordService } from "./services/discord.service";
import { HealthService } from "./services/health.service";
import { MonitoringService, MonitoringMetrics } from "./services/monitoring.service";

import {
  TransferToCardRequest,
  TransferToCardResponse,
} from "./types/transfer";

import {
  WebhookConfig,
  WebhookHandlerOptions,
  WebhookPayload,
  WebhookVerificationResult,
} from "./types/webhook";

import { WebhookPayloadExtended } from "./services/webhook.service";

import {
  TelegramConfig,
  DiscordConfig,
} from "./types/notification";

import {
  HealthCheckResult,
} from "./services/health.service";

import {
  SetDestinationTokenRequest,
  SetDestinationTokenResponse,
} from "./types/destination-token";

import {
  CreateOrderInput,
  CreateOrderResponse,
} from "./types/order";
import { applyOrderDefaults } from "./utils/order-defaults";
import { getPaymentUrl } from "./utils/payment-url";

import {
  GetOrderDetailsOptions,
  OrderDetails,
} from "./types/details";

import {
  RefundRequest,
  RefundResponse,
} from "./types/refund";

import {
  ReversalRequest,
  ReversalResponse,
} from "./types/reversal";

import { TransactionsService } from "./services/transactions.service";

import {
  TransactionRequest,
  TransactionResponse,
} from "./types/transaction";

import { TokensService } from "./services/tokens.service";

import {
  SetGooglePayTokenRequest,
  SetSourceTokenRequest,
  SetSourceTokenResponse,
} from "./types/token";
import { WatchOrderOptions } from "./types/payment-monitor";

import {
  OrderStatus,
} from "./types/enums";

import {
  CreateHostedPaymentInput,
  HostedPaymentSession,
} from "./types/hosted-payment";

import {
  CreateGooglePayOrderInput,
  CreateGooglePayOrderResponse,
  PayWithGooglePayInput,
  PayWithGooglePayResponse,
} from "./types/google-pay";

import { resolveGooglePayOrderType } from "./utils/google-pay-defaults";

import {
  RestoredPaymentSession,
} from "./types/restore-order";

import {
  KapitalBankRequestOptions,
} from "./types/request";

import { KapitalBankError } from "./errors/KapitalBankError";

import { isPreparing } from "./utils/order-status";

import {
  KapitalBankEventMap,
  KapitalBankEventName,
} from "./types/events";

export interface KapitalBank {
  on<E extends KapitalBankEventName>(
    event: E,
    listener: (
      ...args: KapitalBankEventMap[E]
    ) => void
  ): this;

  once<E extends KapitalBankEventName>(
    event: E,
    listener: (
      ...args: KapitalBankEventMap[E]
    ) => void
  ): this;

  off<E extends KapitalBankEventName>(
    event: E,
    listener: (
      ...args: KapitalBankEventMap[E]
    ) => void
  ): this;

  emit<E extends KapitalBankEventName>(
    event: E,
    ...args: KapitalBankEventMap[E]
  ): boolean;
}

export class KapitalBank extends EventEmitter {
  private readonly client: KapitalBankClient;
  private readonly orderDefaults: KapitalBankConfig["defaults"];
  private readonly ordersService: OrdersService;
  private readonly detailsService: DetailsService;
  private readonly refundsService: RefundsService;
  private readonly reversalsService: ReversalsService;
  private readonly transactionsService: TransactionsService;
  private readonly tokensService: TokensService;
  private readonly destinationTokenService: DestinationTokenService;
  private readonly transfersService: TransfersService;
  private readonly preAuthService: PreAuthService;
  private readonly clearingService: ClearingService;
  private readonly paymentMonitorService: PaymentMonitorService;
  private readonly googlePayService: GooglePayService;
  private readonly webhookService: WebhookService;
  private readonly telegramService?: TelegramService;
  private readonly discordService?: DiscordService;
  private readonly healthService: HealthService;

  constructor(config: KapitalBankConfig) {
    super();

    const {
      defaults,
      logEnabled,
      webhook,
      telegram,
      discord,
      retry,
      ...clientConfig
    } = config;

    this.orderDefaults = defaults;

    this.client = new KapitalBankClient({
      ...clientConfig,
      logEnabled: logEnabled ?? false,
      retry,
    });

    this.ordersService = new OrdersService(this.client);
    this.detailsService = new DetailsService(this.client);
    this.refundsService = new RefundsService(this.client);
    this.reversalsService = new ReversalsService(this.client);
    this.transactionsService = new TransactionsService(this.client);
    this.tokensService = new TokensService(this.client);
    this.destinationTokenService = new DestinationTokenService(this.client);
    this.transfersService = new TransfersService(this.client);
    this.preAuthService = new PreAuthService(this.client);
    this.clearingService = new ClearingService(this.client);
    this.paymentMonitorService = new PaymentMonitorService(this.client);
    this.googlePayService = new GooglePayService(
      this.client,
      this.orderDefaults
    );
    this.webhookService = new WebhookService(
      this.client,
      webhook ?? {}
    );
    this.telegramService = telegram ? new TelegramService(telegram) : undefined;
    this.discordService = discord ? new DiscordService(discord) : undefined;
    this.healthService = new HealthService(this.client);
  }

  static fromEnv(
    env: NodeJS.ProcessEnv = process.env
  ): KapitalBank {
    return new KapitalBank(parseEnvConfig(env));
  }

  async createOrder(
    payload: CreateOrderInput
  ): Promise<CreateOrderResponse> {
    const order = await this.ordersService.createOrder(
      applyOrderDefaults(payload, this.orderDefaults)
    );

    this.emit("order:created", order);
    return order;
  }

  async createHostedPayment(
    input: CreateHostedPaymentInput
  ): Promise<HostedPaymentSession> {
    const order = await this.createOrder({
      typeRid:
        input.typeRid ??
        this.orderDefaults?.typeRid ??
        "Order_SMS",
      amount: input.amount,
      description: input.description,
      title: input.title,
      hppRedirectUrl: input.hppRedirectUrl,
      initiationEnvKind: input.initiationEnvKind,
      hppCofCapturePurposes:
        input.hppCofCapturePurposes,
    });

    const session: HostedPaymentSession = {
      orderId: order.id,
      password: order.password,
      paymentUrl: getPaymentUrl(order),
      order,
    };

    this.emit("payment:created", session);
    return session;
  }

  async createGooglePayOrder(
    payload: CreateGooglePayOrderInput
  ): Promise<CreateGooglePayOrderResponse> {
    const typeRid = resolveGooglePayOrderType(
      payload.typeRid,
      this.orderDefaults
    );

    const order = await this.ordersService.createOrder(
      applyOrderDefaults(
        { ...payload, typeRid },
        this.orderDefaults
      )
    );

    this.emit("order:created", order);
    return order;
  }


  async setGooglePayToken(
    orderId: number | string,
    password: string,
    payload: SetGooglePayTokenRequest
  ): Promise<SetSourceTokenResponse> {
    return this.tokensService.setGooglePayToken(
      orderId,
      password,
      payload
    );
  }

  async payWithGooglePay(
    payload: PayWithGooglePayInput
  ): Promise<PayWithGooglePayResponse> {
    return this.googlePayService.payWithGooglePay(
      payload
    );
  }

  async restoreOrder(
    orderId: number | string,
    password: string
  ): Promise<RestoredPaymentSession> {
    const order = await this.getOrder(
      orderId,
      {
        password,
        tranDetailLevel: 2,
        tokenDetailLevel: 2,
        orderDetailLevel: 2,
      }
    );

    if (!isPreparing(order)) {
      throw new KapitalBankError(
        `Cannot restore order ${orderId}: status is "${order.status}", expected "Preparing"`,
        undefined,
        { errorCode: "InvalidOrderState" }
      );
    }

    if (!order.hppUrl) {
      throw new KapitalBankError(
        `Cannot restore order ${orderId}: hppUrl is missing from order details`,
        undefined,
        { errorCode: "InvalidOrderState" }
      );
    }

    const orderPassword =
      order.password ?? password;

    const session: RestoredPaymentSession = {
      orderId: order.id,
      password: orderPassword,
      paymentUrl: getPaymentUrl({
        id: order.id,
        hppUrl: order.hppUrl,
        password: orderPassword,
      }),
      order,
    };

    this.emit("payment:created", session);
    return session;
  }

  async request<T>(
    method: Method,
    path: string,
    body?: unknown,
    options?: KapitalBankRequestOptions
  ): Promise<T> {
    return this.client.request<T>(
      method,
      path,
      body,
      options
    );
  }

  async getOrder(
    id: number | string,
    options?: GetOrderDetailsOptions
  ): Promise<OrderDetails> {
    return this.detailsService.getOrder(
      id,
      options
    );
  }

  async refund(
    orderId: number | string,
    payload: RefundRequest
  ): Promise<RefundResponse> {
    return this.refundsService.refund(
      orderId,
      payload
    );
  }

  async reverse(
    orderId: number | string,
    payload: ReversalRequest
  ): Promise<ReversalResponse> {
    return this.reversalsService.reverse(
      orderId,
      payload
    );
  }

  async executeTransaction(
    orderId: number | string,
    payload: TransactionRequest
  ): Promise<TransactionResponse> {
    return this.transactionsService.execute(
      orderId,
      payload
    );
  }

  async setSourceToken(
    orderId: number | string,
    password: string,
    payload: SetSourceTokenRequest
  ): Promise<SetSourceTokenResponse> {
    return this.tokensService.setSourceToken(
      orderId,
      password,
      payload
    );
  }

  async setDestinationToken(
    orderId: number | string,
    password: string,
    payload: SetDestinationTokenRequest
  ): Promise<SetDestinationTokenResponse> {
    return this.destinationTokenService.setDestinationToken(
      orderId,
      password,
      payload
    );
  }

  async transferToCard(
    payload: TransferToCardRequest
  ): Promise<TransferToCardResponse> {
    return this.transfersService
      .transferToCard(payload);
  }

  async preAuthorize(
    orderId: number | string,
    amount?: string
  ): Promise<TransactionResponse> {
    return this.preAuthService.preAuthorize(orderId, amount);
  }

  async clear(
    orderId: number | string,
    amount?: string
  ): Promise<TransactionResponse> {
    return this.clearingService.clear(orderId, amount);
  }

  async watchOrder(
    orderId: number | string,
    options: WatchOrderOptions = {}
  ): Promise<OrderDetails> {
    return this.paymentMonitorService
      .watchOrder(
        orderId,
        this.buildWatchOptions(options)
      );
  }

  async waitForPayment(
    orderId: number | string,
    options: WatchOrderOptions = {}
  ): Promise<OrderDetails> {
    return this.paymentMonitorService
      .waitForPayment(
        orderId,
        this.buildWatchOptions(options)
      );
  }

  async waitForStatus(
    orderId: number | string,
    status: OrderStatus,
    options?: WatchOrderOptions
  ): Promise<OrderDetails> {
    return this.paymentMonitorService
      .waitForStatus(
        orderId,
        status,
        this.buildWatchOptions(options ?? {})
      );
  }

  private buildWatchOptions(
    options: WatchOrderOptions
  ): WatchOrderOptions {
    const { onStatusChange } = options;

    return {
      ...options,
      onStatusChange: (order) => {
        onStatusChange?.(order);
        this.emitPaymentEvents(order);
      },
    };
  }

  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): WebhookVerificationResult {
    return this.webhookService.verifySignature(
      payload,
      signature,
      secret
    );
  }

  async handleWebhook(
    payload: WebhookPayloadExtended,
    options: WebhookHandlerOptions
  ): Promise<void> {
    return this.webhookService.handleWebhook(
      payload,
      options
    );
  }

  verifyWebhookIp(ip: string): boolean {
    return this.webhookService.verifyIp(ip);
  }

  parseWebhookPayload(rawBody: string): WebhookPayload {
    return this.webhookService.parsePayload(rawBody);
  }

  getTelegramService(): TelegramService | undefined {
    return this.telegramService;
  }

  getDiscordService(): DiscordService | undefined {
    return this.discordService;
  }

  async healthCheck(): Promise<HealthCheckResult> {
    return this.healthService.check();
  }

  async healthCheckWithTimeout(timeoutMs: number = 5000): Promise<HealthCheckResult> {
    return this.healthService.checkWithTimeout(timeoutMs);
  }

  getMonitoringMetrics(): MonitoringMetrics {
    return this.client.getMonitoringService().getMetrics();
  }

  clearMonitoringMetrics(): void {
    return this.client.getMonitoringService().clearMetrics();
  }

  private emitPaymentEvents(
    order: OrderDetails
  ): void {
    this.emit("payment:status", order);

    switch (order.status) {
      case "FullyPaid":
        this.emit("payment:paid", order);
        this.telegramService?.sendPaymentPaid(order);
        this.discordService?.sendPaymentPaid(order);
        break;
      case "Declined":
        this.emit("payment:declined", order);
        this.telegramService?.sendPaymentDeclined(order);
        this.discordService?.sendPaymentDeclined(order);
        break;
      case "Expired":
        this.emit("payment:expired", order);
        this.telegramService?.sendPaymentExpired(order);
        this.discordService?.sendPaymentExpired(order);
        break;
      case "Refunded":
        this.emit("payment:refunded", order);
        this.telegramService?.sendPaymentRefunded(order);
        this.discordService?.sendPaymentRefunded(order);
        break;
      case "Reversed":
        this.emit("payment:reversed", order);
        this.telegramService?.sendPaymentReversed(order);
        this.discordService?.sendPaymentReversed(order);
        break;
    }
  }
}
