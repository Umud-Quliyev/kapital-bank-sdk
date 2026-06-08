import axios from "axios";

import { KapitalBankClient } from "../client/KapitalBankClient";
import { ENDPOINTS } from "../constants/endpoints";
import { KapitalBankError } from "../errors/KapitalBankError";
import {
  RefundRequest,
  RefundResponse,
} from "../types/refund";

export class RefundsService {
  constructor(
    private readonly client: KapitalBankClient
  ) {}

  async refund(
    orderId: number | string,
    payload: RefundRequest
  ): Promise<RefundResponse> {
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