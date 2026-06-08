export type OrderStatus =
  | "Preparing"
  | "FullyPaid"
  | "Refunded"
  | "Expired"
  | "Declined";

export interface OrderTypeInfo {
  title: string;
  rid?: string;
}

export interface OrderDetails {
  id: number;

  status: OrderStatus;
  prevStatus?: OrderStatus;

  amount: number;
  currency: string;

  createTime: string;
  finishTime?: string;

  title?: string;
  description?: string;
  language?: string;

  hppUrl?: string;
  hppRedirectUrl?: string;
  password?: string;

  cvv2AuthStatus?: string;

  authorizedChargeAmount?: number;
  clearedChargeAmount?: number;
  clearedRefundAmount?: number;

  type?: OrderTypeInfo;

  terminal?: Record<string, unknown>;
  merchant?: Record<string, unknown>;
}

export interface GetOrderDetailsOptions {
  tranDetailLevel?: 0 | 1 | 2;
  tokenDetailLevel?: 0 | 1 | 2;
  orderDetailLevel?: 0 | 1 | 2;
}