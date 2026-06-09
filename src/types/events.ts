import { OrderDetails } from "./details";
import { CreateOrderResponse } from "./order";
import { HostedPaymentSession } from "./hosted-payment";
import { RestoredPaymentSession } from "./restore-order";

export interface KapitalBankEventMap {
  "order:created": [CreateOrderResponse];
  "payment:created": [HostedPaymentSession | RestoredPaymentSession];
  "payment:status": [OrderDetails];
  "payment:paid": [OrderDetails];
  "payment:declined": [OrderDetails];
  "payment:expired": [OrderDetails];
  "payment:refunded": [OrderDetails];
  "payment:reversed": [OrderDetails];
}

export type KapitalBankEventName = keyof KapitalBankEventMap;
