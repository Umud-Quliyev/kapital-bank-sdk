import { Currency, Language } from "./enums";
import { GooglePayOrderType } from "./google-pay";
import { OrderType } from "./order";
import { WebhookConfig } from "./webhook";
import { TelegramConfig, DiscordConfig } from "./notification";
import { RetryOptions } from "../utils/retry";

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
  retry?: RetryOptions;
}

export interface KapitalBankConfig {
  username: string;
  password: string;
  environment?: Environment;
  timeout?: number;
  defaults?: KapitalBankOrderDefaults;
  logEnabled?: boolean;
  webhook?: WebhookConfig;
  telegram?: TelegramConfig;
  discord?: DiscordConfig;
  retry?: RetryOptions;
}
