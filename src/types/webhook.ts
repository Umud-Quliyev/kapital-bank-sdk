import { OrderDetails } from "./details";

export interface WebhookPayload {
  orderId: number;
  status: string;
  amount?: string;
  currency?: string;
  timestamp?: string;
  signature?: string;
}

export interface WebhookConfig {
  secret?: string;
  path?: string;
  allowedIps?: string[];
}

export interface WebhookHandlerOptions {
  onPaymentPaid?: (order: OrderDetails) => void | Promise<void>;
  onPaymentDeclined?: (order: OrderDetails) => void | Promise<void>;
  onPaymentExpired?: (order: OrderDetails) => void | Promise<void>;
  onPaymentRefunded?: (order: OrderDetails) => void | Promise<void>;
  onPaymentReversed?: (order: OrderDetails) => void | Promise<void>;
  onStatusChange?: (order: OrderDetails) => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
}

export interface WebhookVerificationResult {
  valid: boolean;
  error?: string;
}
