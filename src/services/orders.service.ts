import axios from "axios";
import { KapitalBankClient } from "../client/KapitalBankClient";
import { ENDPOINTS } from "../constants/endpoints";
import { KapitalBankError } from "../errors/KapitalBankError";
import {
  CreateOrderRequest,
  CreateOrderResponse,
} from "../types/order";

export class OrdersService {
  constructor(
    private readonly client: KapitalBankClient
  ) {}

  async createOrder(
    payload: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    try {
      const response = await this.client
        .getHttp()
        .post(ENDPOINTS.CREATE_ORDER, {
          order: payload,
        });

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