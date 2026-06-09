export const ERROR_CODES = [
    "PmoDecline",
    "InvalidToken",
    "InvalidOrderState",
    "OrderNotFound",
    "OrderTypeNotFound",
    "SystemError",
  ] as const;
  
  export type KapitalBankErrorCode =
    (typeof ERROR_CODES)[number];