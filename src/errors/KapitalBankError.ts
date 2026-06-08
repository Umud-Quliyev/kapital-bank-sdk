import {
  ERROR_CODES,
  KapitalBankErrorCode,
} from "./error-codes";

function isKnownErrorCode(
  value: unknown
): value is KapitalBankErrorCode {
  return (
    typeof value === "string" &&
    ERROR_CODES.includes(
      value as KapitalBankErrorCode
    )
  );
}

export class KapitalBankError extends Error {
  public readonly statusCode?: number;

  public readonly details?: unknown;

  public readonly code?: KapitalBankErrorCode;

  constructor(
    message: string,
    statusCode?: number,
    details?: any
  ) {
    super(message);

    this.name = "KapitalBankError";

    this.statusCode = statusCode;
    this.details = details;

    const errorCode =
      details?.errorCode;

    if (
      isKnownErrorCode(errorCode)
    ) {
      this.code = errorCode;
    }
  }

  isDeclined(): boolean {
    return (
      this.code === "PmoDecline"
    );
  }

  isInvalidToken(): boolean {
    return (
      this.code === "InvalidToken"
    );
  }

  isInvalidOrderState(): boolean {
    return (
      this.code ===
      "InvalidOrderState"
    );
  }

  isOrderNotFound(): boolean {
    return (
      this.code ===
      "OrderNotFound"
    );
  }

  isSystemError(): boolean {
    return (
      this.code ===
      "SystemError"
    );
  }
}