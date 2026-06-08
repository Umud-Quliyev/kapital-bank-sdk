import {
  Currency,
  OrderStatus,
  CVV2AuthStatus,
  Language,
  AuthStatus,
  PaymentMethod,
  CardBrand,
} from "./enums";

export interface OrderTypeInfo {
  title: string;
  rid?: string;
}

export interface StoredToken {
  id: number;
}

export interface CardInfo {
  brand?: CardBrand;
  expiration?: string;
}

export interface TokenInfo {
  id: number;

  paymentMethod: PaymentMethod;

  role?: string;

  status?: string;

  displayName?: string;

  regTime?: string;

  card?: CardInfo;
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

  tdsV1AuthStatus?: AuthStatus;
  tdsV2AuthStatus?: AuthStatus;
  otpAutStatus?: AuthStatus;

  authorizedChargeAmount?: number;
  clearedChargeAmount?: number;
  clearedRefundAmount?: number;

  type?: OrderTypeInfo;

  storedTokens?: StoredToken[];

  srcToken?: TokenInfo;
  dstToken?: TokenInfo;

  terminal?: Record<string, unknown>;
  merchant?: Record<string, unknown>;
}

export interface GetOrderDetailsOptions {
  tranDetailLevel?: 0 | 1 | 2;
  tokenDetailLevel?: 0 | 1 | 2;
  orderDetailLevel?: 0 | 1 | 2;
}