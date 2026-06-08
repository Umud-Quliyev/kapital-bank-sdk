export type OrderType =
  | "Order_SMS"
  | "Order_DMS"
  | "Order_REC"
  | "DMSN3D"
  | "OCT";

export interface CreateOrderRequest {
  typeRid: OrderType;

  amount: string;

  currency: string;

  language: string;

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
  status: string;
  cvv2AuthStatus: string;
  secret: string;
}