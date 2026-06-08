import { TransactionsService } from "./transactions.service";
import { KapitalBankClient } from "../client/KapitalBankClient";

import { TransactionResponse } from "../types/transaction";

export class ClearingService {
  private readonly transactionsService: TransactionsService;

  constructor(
    client: KapitalBankClient
  ) {
    this.transactionsService =
      new TransactionsService(client);
  }

  async clear(
    orderId: number | string,
    amount?: string
  ): Promise<TransactionResponse> {
    return this.transactionsService.execute(
      orderId,
      {
        phase: "Clearing",
        amount,
      }
    );
  }
}