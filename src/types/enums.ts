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
  | "IneligibleOrder";

export type PaymentMethod =
  | "Card";

export type CardBrand =
  | "Visa"
  | "Mastercard";