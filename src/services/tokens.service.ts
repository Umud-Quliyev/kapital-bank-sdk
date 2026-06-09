import axios from "axios";

import { KapitalBankClient } from "../client/KapitalBankClient";
import { ENDPOINTS } from "../constants/endpoints";
import { KapitalBankError } from "../errors/KapitalBankError";

import {
  SetGooglePayTokenRequest,
  SetSourceTokenRequest,
  SetSourceTokenResponse,
} from "../types/token";

export class TokensService {
  constructor(
    private readonly client: KapitalBankClient
  ) {}

  async setSourceToken(
    orderId: number | string,
    password: string,
    payload: SetSourceTokenRequest
  ): Promise<SetSourceTokenResponse> {
    try {
      const response = await this.client
        .getHttp()
        .post(
          ENDPOINTS.SET_SRC_TOKEN(
            orderId,
            password
          ),
          {
            order: {
              initiationEnvKind:
                payload.initiationEnvKind,
            },
            token: {
              storedId:
                payload.storedId,
            },
          }
        );

      return response.data.order;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new KapitalBankError(
          error.response?.data
            ?.errorDescription ??
            error.response?.data
              ?.message ??
            error.message,
          error.response?.status,
          error.response?.data
        );
      }

      throw error;
    }
  }

  async setGooglePayToken(
    orderId: number | string,
    password: string,
    payload: SetGooglePayTokenRequest
  ): Promise<SetSourceTokenResponse> {
    try {
      const response = await this.client
        .getHttp()
        .post(
          ENDPOINTS.SET_SRC_TOKEN(
            orderId,
            password
          ),
          {
            token: {
              googlePayBlock:
                payload.googlePayBlock,
            },
          }
        );

      return response.data.order;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new KapitalBankError(
          error.response?.data
            ?.errorDescription ??
            error.response?.data
              ?.message ??
            error.message,
          error.response?.status,
          error.response?.data
        );
      }

      throw error;
    }
  }
}