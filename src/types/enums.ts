export type Currency =
  | "AZN"
  | "USD"
  | "EUR";

export type Language =
  | "az"
  | "en"
  | "ru";

export type OrderStatus =
  | "Preparing"
  | "FullyPaid"
  | "Refunded"
  | "Expired"
  | "Declined"
  | "Reversed";

export type CVV2AuthStatus =
  | "Required"
  | "NotRequired"
  | "IneligibleOrder"
  | "Provided";

export type AuthStatus =
  | "Required"
  | "Verified"
  | "Provided"
  | "NotRequired"
  | "IneligibleOrder";

export type PaymentMethod =
  | "Card"
  | "GooglePay";

export type CardBrand =
  | "Visa"
  | "Mastercard";

export type TransactionPhase =
  | "Single"
  | "Auth"
  | "Clearing";

export type TransactionType =
  | "Credit"
  | "Refund";

export type CofUsage =
  | "Recurring";