export const ERROR_CODES = [
    "PmoDecline",
    "InvalidToken",
    "InvalidOrderState",
    "OrderNotFound",
    "SystemError",
  ] as const;
  
  export type KapitalBankErrorCode =
    (typeof ERROR_CODES)[number];