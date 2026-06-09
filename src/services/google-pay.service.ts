import { KapitalBankClient } from "../client/KapitalBankClient";
import { OrdersService } from "./orders.service";
import { TokensService } from "./tokens.service";
import { TransactionsService } from "./transactions.service";
import { applyOrderDefaults } from "../utils/order-defaults";
import { resolveGooglePayOrderType } from "../utils/google-pay-defaults";
import { KapitalBankOrderDefaults } from "../types/config";
import {
  PayWithGooglePayInput,
  PayWithGooglePayResponse,
} from "../types/google-pay";

export class GooglePayService {
  private readonly ordersService: OrdersService;
  private readonly tokensService: TokensService;
  private readonly transactionsService: TransactionsService;

  constructor(
    client: KapitalBankClient,
    private readonly orderDefaults: KapitalBankOrderDefaults = {}
  ) {
    this.ordersService = new OrdersService(client);
    this.tokensService = new TokensService(client);
    this.transactionsService = new TransactionsService(client);
  }

  async payWithGooglePay(
    payload: PayWithGooglePayInput
  ): Promise<PayWithGooglePayResponse> {
    const typeRid = resolveGooglePayOrderType(
      payload.typeRid,
      this.orderDefaults
    );

    const order = await this.ordersService.createOrder(
      applyOrderDefaults(
        {
          amount: payload.amount,
          description: payload.description,
          typeRid,
          currency: payload.currency,
          language: payload.language,
        },
        this.orderDefaults
      )
    );

    const token = await this.tokensService.setGooglePayToken(
      order.id,
      order.password,
      {
        googlePayBlock: payload.googlePayBlock,
      }
    );

    const transaction =
      await this.transactionsService.execute(
        order.id,
        { phase: "Single" }
      );

    return {
      orderId: order.id,
      token,
      transaction,
    };
  }
}
