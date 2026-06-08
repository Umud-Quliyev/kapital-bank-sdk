import axios from "axios";

import { KapitalBankClient } from "../client/KapitalBankClient";
import { ENDPOINTS } from "../constants/endpoints";
import { KapitalBankError } from "../errors/KapitalBankError";

import {
  TransactionRequest,
  TransactionResponse,
} from "../types/transaction";

export class TransactionsService {
  constructor(
    private readonly client: KapitalBankClient
  ) {}

  async execute(
    orderId: number | string,
    payload: TransactionRequest
  ): Promise<TransactionResponse> {
    try {
      const response = await this.client
        .getHttp()
        .post(
          ENDPOINTS.EXEC_TRAN(orderId),
          {
            tran: payload,
          }
        );

      return response.data.tran;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new KapitalBankError(
          error.response?.data?.errorDescription ??
          error.response?.data?.message ??
          error.message,
          error.response?.status,
          error.response?.data
        );
      }

      throw error;
    }
  }
}