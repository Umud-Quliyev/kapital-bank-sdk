import { KapitalBankOrderDefaults } from "../types/config";
import {
  CreateOrderInput,
  CreateOrderRequest,
  OrderType,
} from "../types/order";

const ORDER_TYPES: readonly OrderType[] = [
  "Order_SMS",
  "Order_DMS",
  "Order_REC",
  "DMSN3D",
  "OCT",
  "GN3D",
  "GSMS",
];

export function isValidOrderType(
  value: string
): value is OrderType {
  return ORDER_TYPES.includes(value as OrderType);
}

export function applyOrderDefaults(
  payload: CreateOrderInput,
  defaults: KapitalBankOrderDefaults = {}
): CreateOrderRequest {
  const typeRid = payload.typeRid ?? defaults.typeRid;
  const currency = payload.currency ?? defaults.currency;
  const language = payload.language ?? defaults.language;
  const hppRedirectUrl =
    payload.hppRedirectUrl ?? defaults.hppRedirectUrl;

  if (!typeRid) {
    throw new Error(
      "createOrder requires typeRid. Provide it in the request or configure defaults via KapitalBankConfig.defaults or KAPITALBANK_ORDER_TYPE."
    );
  }

  if (!currency) {
    throw new Error(
      "createOrder requires currency. Provide it in the request or configure defaults via KapitalBankConfig.defaults or KAPITALBANK_CURRENCY."
    );
  }

  if (!language) {
    throw new Error(
      "createOrder requires language. Provide it in the request or configure defaults via KapitalBankConfig.defaults or KAPITALBANK_LANGUAGE."
    );
  }

  return {
    ...payload,
    typeRid,
    currency,
    language,
    ...(hppRedirectUrl !== undefined ? { hppRedirectUrl } : {}),
  };
}
