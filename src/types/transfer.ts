export interface TransferToCardRequest {
  amount: string;
  currency?: string;
  pan: string;
  description?: string;
}

export interface TransferToCardResponse {
  orderId: number;
  destinationTokenId?: number;
  approvalCode?: string;
  pmoResultCode?: string;
}