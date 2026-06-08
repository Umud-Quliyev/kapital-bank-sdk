export interface RefundRequest {
  phase: "Single" | "Auth" | "Clearing";
  amount: string;
  type: "Refund";
}

export interface RefundResponse {
  orderId?: number;
  status?: string;
  approvalCode?: string;
}