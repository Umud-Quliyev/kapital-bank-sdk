import { KapitalBankClient } from "../client/KapitalBankClient";
import { ENDPOINTS } from "../constants/endpoints";
import { KapitalBankError } from "../errors/KapitalBankError";
import {
  GetOrderDetailsOptions,
  OrderDetails,
} from "../types/details";
import axios from "axios";

export class DetailsService {
  constructor(
    private readonly client: KapitalBankClient
  ) {}

  async getOrder(
    id: number | string,
    options?: GetOrderDetailsOptions
  ): Promise<OrderDetails> {
    try {
      const response = await this.client
        .getHttp()
        .get(
          ENDPOINTS.GET_ORDER(id),
          {
            params: options,
          }
        );

      return response.data.order;
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