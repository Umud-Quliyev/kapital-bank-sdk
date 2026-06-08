import {
  Currency,
  OrderStatus,
  CVV2AuthStatus,
  Language,
} from "./enums";



export interface OrderTypeInfo {
  title: string;
  rid?: string;
}

export interface OrderDetails {
  id: number;

  status: OrderStatus;
  prevStatus?: OrderStatus;

  amount: number;
  currency: Currency;

  createTime: string;
  finishTime?: string;

  title?: string;
  description?: string;
  language?: Language;

  hppUrl?: string;
  hppRedirectUrl?: string;
  password?: string;

  cvv2AuthStatus?: CVV2AuthStatus;

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