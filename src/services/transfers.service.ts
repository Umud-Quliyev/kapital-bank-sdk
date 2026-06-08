import { KapitalBankClient } from "../client/KapitalBankClient";

import { OrdersService } from "./orders.service";
import { DestinationTokenService } from "./destination-token.service";
import { TransactionsService } from "./transactions.service";

import {
  TransferToCardRequest,
  TransferToCardResponse,
} from "../types/transfer";

export class TransfersService {
  private readonly ordersService: OrdersService;
  private readonly destinationTokenService: DestinationTokenService;
  private readonly transactionsService: TransactionsService;

  constructor(
    client: KapitalBankClient
  ) {
    this.ordersService =
      new OrdersService(client);

    this.destinationTokenService =
      new DestinationTokenService(client);

    this.transactionsService =
      new TransactionsService(client);
  }

  async transferToCard(
    payload: TransferToCardRequest
  ): Promise<TransferToCardResponse> {
    const order =
      await this.ordersService.createOrder({
        typeRid: "OCT",
        amount: payload.amount,
        currency:
          payload.currency ?? "AZN",
        language: "az",
        description:
          payload.description ??
          "Card Transfer",
      });

    const token =
      await this.destinationTokenService
        .setDestinationToken(
          order.id,
          order.password,
          {
            pan: payload.pan,
          }
        );

    const transaction =
      await this.transactionsService
        .execute(order.id, {
          phase: "Single",
          type: "Credit",
        });

    return {
      orderId: order.id,
      destinationTokenId:
        token.dstToken?.id,
      approvalCode:
        transaction.approvalCode,
      pmoResultCode:
        transaction.pmoResultCode,
    };
  }
}