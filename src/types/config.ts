import { Currency, Language } from "./enums";
import { GooglePayOrderType } from "./google-pay";
import { OrderType } from "./order";

export type Environment = "test" | "production";

export interface KapitalBankOrderDefaults {
  typeRid?: OrderType;
  googlePayOrderType?: GooglePayOrderType;
  currency?: Currency;
  language?: Language;
  hppRedirectUrl?: string;
}

export interface KapitalBankClientConfig {
  username: string;
  password: string;
  environment?: Environment;
  timeout?: number;
  logEnabled?: boolean;
}

export interface KapitalBankConfig {
  username: string;
  password: string;
  environment?: Environment;
  timeout?: number;
  defaults?: KapitalBankOrderDefaults;
  logEnabled?: boolean;
}
