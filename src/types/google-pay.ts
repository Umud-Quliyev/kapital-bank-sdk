import {
  CreateOrderInput,
  CreateOrderResponse,
} from "./order";
import { HostedPaymentSession } from "./hosted-payment";
import { TransactionResponse } from "./transaction";
import { SetSourceTokenResponse } from "./token";

export type GooglePayOrderType = "GN3D" | "GSMS";

export const GOOGLE_PAY_GATEWAY = {
  gateway: "ecommercekapitalbank",
  testGatewayMerchantId: "testmerch",
} as const;

export type CreateGooglePayOrderInput = Omit<
  CreateOrderInput,
  "typeRid"
> & {
  typeRid?: GooglePayOrderType;
};

export type CreateGooglePayOrderResponse = CreateOrderResponse;

export interface PayWithGooglePayInput {
  amount: string;
  description: string;
  googlePayBlock: string;
  typeRid?: GooglePayOrderType;
  currency?: CreateOrderInput["currency"];
  language?: CreateOrderInput["language"];
}

export interface PayWithGooglePayResponse {
  orderId: number;
  token: SetSourceTokenResponse;
  transaction: TransactionResponse;
}
