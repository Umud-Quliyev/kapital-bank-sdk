export interface CreateReversalRequest {
  orderId: string;
  transactionId: string;
  reason?: string;
}

export interface ReversalResponse {
  reversalId: string;
  orderId: string;
  transactionId: string;
  status: string;
}
