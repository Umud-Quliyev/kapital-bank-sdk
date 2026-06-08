import {
  Currency,
  Language,
  OrderStatus,
  CVV2AuthStatus,
} from "./enums";

export type OrderType =
  | "Order_SMS"
  | "Order_DMS"
  | "Order_REC"
  | "DMSN3D"
  | "OCT"
  | "GN3D"
  | "GSMS";
  
export interface CreateOrderRequest {
  typeRid: OrderType;

  amount: string;

  currency: Currency;

  language: Language;

  description: string;

  hppRedirectUrl?: string;

  title?: string;

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

  aut?: {
    purpose: string;
  };

  srcToken?: {
    storedId: number;
  };
}

export interface CreateOrderResponse {
  id: number;

  hppUrl: string;

  password: string;

  secret: string;

  status: OrderStatus;

  cvv2AuthStatus: CVV2AuthStatus;
}