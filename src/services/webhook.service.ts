import crypto from "node:crypto";

import { KapitalBankClient } from "../client/KapitalBankClient";

import {
  WebhookPayload,
  WebhookConfig,
  WebhookHandlerOptions,
  WebhookVerificationResult,
} from "../types/webhook";

import { OrderDetails } from "../types/details";
import { KapitalBankError } from "../errors/KapitalBankError";

export interface WebhookPayloadExtended extends WebhookPayload {
  password?: string;
}

export class WebhookService {
  constructor(
    private readonly client: KapitalBankClient,
    private readonly config: WebhookConfig = {}
  ) {}

  verifySignature(
    payload: string,
    signature: string,
    secret: string
  ): WebhookVerificationResult {
    try {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );

      return {
        valid: isValid,
        error: isValid ? undefined : "Signature mismatch",
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async handleWebhook(
    payload: WebhookPayloadExtended,
    options: WebhookHandlerOptions
  ): Promise<void> {
    try {
      const password = payload.password || payload.orderId.toString();

      const order = await this.client.request<OrderDetails>(
        "GET",
        `/order/${payload.orderId}`,
        undefined,
        {
          params: {
            password,
          },
        }
      );

      await options.onStatusChange?.(order);

      switch (order.status) {
        case "FullyPaid":
          await options.onPaymentPaid?.(order);
          break;
        case "Declined":
          await options.onPaymentDeclined?.(order);
          break;
        case "Expired":
          await options.onPaymentExpired?.(order);
          break;
        case "Refunded":
          await options.onPaymentRefunded?.(order);
          break;
        case "Reversed":
          await options.onPaymentReversed?.(order);
          break;
      }
    } catch (error) {
      if (options.onError) {
        await options.onError(
          error instanceof Error ? error : new Error(String(error))
        );
      } else {
        throw error;
      }
    }
  }

  verifyIp(ip: string): boolean {
    if (!this.config.allowedIps || this.config.allowedIps.length === 0) {
      return false; 
    }

    return this.config.allowedIps.includes(ip);
  }

  parsePayload(rawBody: string): WebhookPayload {
    try {
      return JSON.parse(rawBody) as WebhookPayload;
    } catch (error) {
      throw new KapitalBankError(
        "Invalid webhook payload: failed to parse JSON",
        undefined,
        { errorCode: "InvalidPayload" }
      );
    }
  }
}
