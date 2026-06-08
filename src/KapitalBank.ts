import { KapitalBankClient } from "./client/KapitalBankClient";

import { KapitalBankConfig } from "./types/config";

import { OrdersService } from "./services/orders.service";
import { DetailsService } from "./services/details.service";
import { RefundsService } from "./services/refunds.service";
import { ReversalsService } from "./services/reversals.service";

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

export class KapitalBank {
  private readonly ordersService: OrdersService;
  private readonly detailsService: DetailsService;
  private readonly refundsService: RefundsService;
  private readonly reversalsService: ReversalsService;
  private readonly transactionsService: TransactionsService;
  private readonly tokensService: TokensService;

  constructor(config: KapitalBankConfig) {
    const client = new KapitalBankClient(config);

    this.ordersService = new OrdersService(client);
    this.detailsService = new DetailsService(client);
    this.refundsService = new RefundsService(client);
    this.reversalsService = new ReversalsService(client);
    this.transactionsService = new TransactionsService(client);
    this.tokensService = new TokensService(client);
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
}