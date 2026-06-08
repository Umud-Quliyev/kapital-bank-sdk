import axios from "axios";

import { KapitalBankClient } from "../client/KapitalBankClient";
import { ENDPOINTS } from "../constants/endpoints";
import { KapitalBankError } from "../errors/KapitalBankError";

import {
  ReversalRequest,
  ReversalResponse,
} from "../types/reversal";

export class ReversalsService {
  constructor(
    private readonly client: KapitalBankClient
  ) {}

  async reverse(
    orderId: number | string,
    payload: ReversalRequest
  ): Promise<ReversalResponse> {
    try {
      const response = await this.client
        .getHttp()
        .post(
          ENDPOINTS.EXEC_TRAN(orderId),
          {
            tran: payload,
          }
        );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new KapitalBankError(
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