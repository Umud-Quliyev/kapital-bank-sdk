import { TransactionsService } from "./transactions.service";

import {
  ReversalRequest,
  ReversalResponse,
} from "../types/reversal";

import { KapitalBankClient } from "../client/KapitalBankClient";

export class ReversalsService {
  private readonly transactionsService: TransactionsService;

  constructor(
    client: KapitalBankClient
  ) {
    this.transactionsService =
      new TransactionsService(client);
  }

  async reverse(
    orderId: number | string,
    payload: ReversalRequest
  ): Promise<ReversalResponse> {
    return this.transactionsService.execute(
      orderId,
      payload
    ) as Promise<ReversalResponse>;
  }
}