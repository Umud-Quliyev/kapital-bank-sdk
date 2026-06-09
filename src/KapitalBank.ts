import { KapitalBankClient } from "./client/KapitalBankClient";

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

import {
  TransferToCardRequest,
  TransferToCardResponse,
} from "./types/transfer";

import {
  SetDestinationTokenRequest,
  SetDestinationTokenResponse,
} from "./types/destination-token";

import {
  CreateOrderRequest,
  CreateOrderResponse,
} from "./types/order";

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
  SetSourceTokenRequest,
  SetSourceTokenResponse,
} from "./types/token";
import { WaitForStatusOptions, WatchOrderOptions } from "./types/payment-monitor";

import {
  OrderStatus,
} from "./types/enums";

export class KapitalBank {
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
  constructor(config: KapitalBankConfig) {
    const client = new KapitalBankClient(config);

    this.ordersService = new OrdersService(client);
    this.detailsService = new DetailsService(client);
    this.refundsService = new RefundsService(client);
    this.reversalsService = new ReversalsService(client);
    this.transactionsService = new TransactionsService(client);
    this.tokensService = new TokensService(client);
    this.destinationTokenService = new DestinationTokenService(client);
    this.transfersService = new TransfersService(client);
    this.preAuthService = new PreAuthService(client);
    this.clearingService = new ClearingService(client);
    this.paymentMonitorService = new PaymentMonitorService(client);
  }

  async createOrder(
    payload: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    return this.ordersService.createOrder(payload);
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
      options
    );
}

async waitForPayment(
  orderId: number | string,
  options: WatchOrderOptions = {}
): Promise<OrderDetails> {
  return this.paymentMonitorService
    .waitForPayment(
      orderId,
      options
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
      options
    );
}
}