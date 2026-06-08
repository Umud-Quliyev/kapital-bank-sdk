export interface GetDetailsRequest {
  orderId: string;
}

export interface DetailsResponse {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}
