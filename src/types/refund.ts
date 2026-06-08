export interface CreateRefundRequest {
  orderId: string;
  amount: number;
  reason?: string;
}

export interface RefundResponse {
  refundId: string;
  orderId: string;
  amount: number;
  status: string;
}
