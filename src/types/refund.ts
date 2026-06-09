import { TransactionResponse } from "./transaction";

export interface RefundRequest {
  phase: "Single" | "Auth" | "Clearing";
  amount: string;
  type: "Refund";
}

export interface RefundResponse extends TransactionResponse {
  orderId?: number;
  status?: string;
}