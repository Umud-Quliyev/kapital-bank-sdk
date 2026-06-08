import axios from "axios";

import { KapitalBankClient } from "../client/KapitalBankClient";
import { ENDPOINTS } from "../constants/endpoints";
import { KapitalBankError } from "../errors/KapitalBankError";

import {
  SetDestinationTokenRequest,
  SetDestinationTokenResponse,
} from "../types/destination-token";

export class DestinationTokenService {
  constructor(
    private readonly client: KapitalBankClient
  ) {}

  async setDestinationToken(
    orderId: number | string,
    password: string,
    payload: SetDestinationTokenRequest
  ): Promise<SetDestinationTokenResponse> {
    try {
      const response = await this.client
        .getHttp()
        .post(
          ENDPOINTS.SET_DST_TOKEN(
            orderId,
            password
          ),
          {
            token: {
              card: {
                panBlock: {
                  data: payload.pan,
                },
                entryMode: "ECommerce",
              },
            },
          }
        );

      return response.data.order;
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