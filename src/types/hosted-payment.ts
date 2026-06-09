import {
  CreateOrderResponse,
  OrderType,
} from "./order";

export interface CreateHostedPaymentInput {
  amount: string;
  description: string;
  typeRid?: OrderType;
  title?: string;
  hppRedirectUrl?: string;
  initiationEnvKind?: "Browser" | "Server";
  hppCofCapturePurposes?: (
    | "UnspecifiedMit"
    | "Cit"
    | "Recurring"
    | "Instalment"
    | "DelayedCharge"
    | "Resubmission"
    | "PartialShipment"
  )[];
}

export interface HostedPaymentSession {
  orderId: number;
  password: string;
  paymentUrl: string;
  order: CreateOrderResponse;
}
