import { Currency } from "./enums";

export interface TransferToCardRequest {
  amount: string;

  currency?: Currency;

  pan: string;

  description?: string;
}

export interface TransferToCardResponse {
  orderId: number;
  destinationTokenId?: number;
  approvalCode?: string;
  pmoResultCode?: string;
}