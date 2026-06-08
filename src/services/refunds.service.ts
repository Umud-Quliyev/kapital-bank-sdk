import { TransactionsService } from "./transactions.service";

import {
  RefundRequest,
  RefundResponse,
} from "../types/refund";

import { KapitalBankClient } from "../client/KapitalBankClient";

export class RefundsService {
  private readonly transactionsService: TransactionsService;

  constructor(
    client: KapitalBankClient
  ) {
    this.transactionsService =
      new TransactionsService(client);
  }

  async refund(
    orderId: number | string,
    payload: RefundRequest
  ): Promise<RefundResponse> {
    return this.transactionsService.execute(
      orderId,
      payload
    ) as Promise<RefundResponse>;
  }
}