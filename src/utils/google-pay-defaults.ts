import { KapitalBankOrderDefaults } from "../types/config";
import { GooglePayOrderType } from "../types/google-pay";

const GOOGLE_PAY_ORDER_TYPES: readonly GooglePayOrderType[] = [
  "GN3D",
  "GSMS",
];

export function isValidGooglePayOrderType(
  value: string
): value is GooglePayOrderType {
  return GOOGLE_PAY_ORDER_TYPES.includes(
    value as GooglePayOrderType
  );
}

export function resolveGooglePayOrderType(
  typeRid: GooglePayOrderType | undefined,
  defaults: KapitalBankOrderDefaults = {}
): GooglePayOrderType {
  const resolved =
    typeRid ??
    defaults.googlePayOrderType ??
    "GSMS";

  if (!isValidGooglePayOrderType(resolved)) {
    throw new Error(
      `Invalid Google Pay order type "${resolved}". Expected "GN3D" or "GSMS".`
    );
  }

  return resolved;
}
