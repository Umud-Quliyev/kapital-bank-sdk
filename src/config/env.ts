import {
  Environment,
  KapitalBankConfig,
  KapitalBankOrderDefaults,
} from "../types/config";
import { Currency, Language } from "../types/enums";
import { isValidGooglePayOrderType } from "../utils/google-pay-defaults";
import { isValidOrderType } from "../utils/order-defaults";
import { WebhookConfig } from "../types/webhook";
import { TelegramConfig, DiscordConfig, NotificationMessageTemplates, NotificationEventToggle } from "../types/notification";
import { RetryOptions } from "../utils/retry";

const ENV_PREFIX = "KAPITALBANK_";

const CURRENCIES: readonly Currency[] = ["AZN", "USD", "EUR"];
const LANGUAGES: readonly Language[] = ["az", "en", "ru"];

function readEnv(
  env: NodeJS.ProcessEnv,
  key: string
): string | undefined {
  const value = env[`${ENV_PREFIX}${key}`];
  if (value === undefined || value === "") {
    return undefined;
  }
  return value;
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  if (["true", "1", "yes"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no"].includes(normalized)) {
    return false;
  }

  throw new Error(
    `KAPITALBANK_LOG_ENABLED must be "true" or "false", received "${value}"`
  );
}

function parseEnvironment(value: string): Environment {
  if (value === "test" || value === "production") {
    return value;
  }

  throw new Error(
    `KAPITALBANK_MODE must be "test" or "production", received "${value}"`
  );
}

function parseCurrency(value: string): Currency {
  if (CURRENCIES.includes(value as Currency)) {
    return value as Currency;
  }

  throw new Error(
    `KAPITALBANK_CURRENCY must be one of ${CURRENCIES.join(", ")}, received "${value}"`
  );
}

function parseLanguage(value: string): Language {
  if (LANGUAGES.includes(value as Language)) {
    return value as Language;
  }

  throw new Error(
    `KAPITALBANK_LANGUAGE must be one of ${LANGUAGES.join(", ")}, received "${value}"`
  );
}

function parseOrderType(value: string) {
  if (isValidOrderType(value)) {
    return value;
  }

  throw new Error(
    `KAPITALBANK_ORDER_TYPE must be a valid order type, received "${value}"`
  );
}

function parseGooglePayOrderType(value: string) {
  if (isValidGooglePayOrderType(value)) {
    return value;
  }

  throw new Error(
    `KAPITALBANK_GOOGLE_PAY_ORDER_TYPE must be "GN3D" or "GSMS", received "${value}"`
  );
}

function parseWebhookConfig(env: NodeJS.ProcessEnv): WebhookConfig | undefined {
  const secret = readEnv(env, "WEBHOOK_SECRET");
  const path = readEnv(env, "WEBHOOK_PATH");
  const allowedIps = readEnv(env, "WEBHOOK_ALLOWED_IPS");

  const config: WebhookConfig = {};

  if (secret !== undefined) {
    config.secret = secret;
  }

  if (path !== undefined) {
    config.path = path;
  }

  if (allowedIps !== undefined) {
    config.allowedIps = allowedIps.split(",").map((ip) => ip.trim());
  }

  return Object.keys(config).length > 0 ? config : undefined;
}

function parseNotificationTemplates(env: NodeJS.ProcessEnv, prefix: string): NotificationMessageTemplates | undefined {
  const paid = readEnv(env, `${prefix}_MESSAGE_PAID`);
  const declined = readEnv(env, `${prefix}_MESSAGE_DECLINED`);
  const expired = readEnv(env, `${prefix}_MESSAGE_EXPIRED`);
  const refunded = readEnv(env, `${prefix}_MESSAGE_REFUNDED`);
  const reversed = readEnv(env, `${prefix}_MESSAGE_REVERSED`);

  const templates: NotificationMessageTemplates = {};

  if (paid !== undefined) templates.paid = paid;
  if (declined !== undefined) templates.declined = declined;
  if (expired !== undefined) templates.expired = expired;
  if (refunded !== undefined) templates.refunded = refunded;
  if (reversed !== undefined) templates.reversed = reversed;

  return Object.keys(templates).length > 0 ? templates : undefined;
}

function parseNotificationEventToggle(env: NodeJS.ProcessEnv, prefix: string): NotificationEventToggle | undefined {
  const paid = parseBoolean(readEnv(env, `${prefix}_ENABLE_PAID`));
  const declined = parseBoolean(readEnv(env, `${prefix}_ENABLE_DECLINED`));
  const expired = parseBoolean(readEnv(env, `${prefix}_ENABLE_EXPIRED`));
  const refunded = parseBoolean(readEnv(env, `${prefix}_ENABLE_REFUNDED`));
  const reversed = parseBoolean(readEnv(env, `${prefix}_ENABLE_REVERSED`));

  const toggle: NotificationEventToggle = {};

  if (paid !== undefined) toggle.paid = paid;
  if (declined !== undefined) toggle.declined = declined;
  if (expired !== undefined) toggle.expired = expired;
  if (refunded !== undefined) toggle.refunded = refunded;
  if (reversed !== undefined) toggle.reversed = reversed;

  return Object.keys(toggle).length > 0 ? toggle : undefined;
}

function parseTelegramConfig(env: NodeJS.ProcessEnv): TelegramConfig | undefined {
  const botToken = readEnv(env, "TELEGRAM_BOT_TOKEN");
  const chatId = readEnv(env, "TELEGRAM_CHAT_ID");
  const parseMode = readEnv(env, "TELEGRAM_PARSE_MODE");
  const disableNotification = parseBoolean(readEnv(env, "TELEGRAM_DISABLE_NOTIFICATION"));

  if (!botToken || !chatId) {
    return undefined;
  }

  const config: TelegramConfig = {
    botToken,
    chatId,
  };

  if (parseMode !== undefined) {
    if (["Markdown", "MarkdownV2", "HTML"].includes(parseMode)) {
      config.parseMode = parseMode as "Markdown" | "MarkdownV2" | "HTML";
    }
  }

  if (disableNotification !== undefined) {
    config.disableNotification = disableNotification;
  }

  const customMessages = parseNotificationTemplates(env, "TELEGRAM");
  if (customMessages !== undefined) {
    config.customMessages = customMessages;
  }

  const enabledEvents = parseNotificationEventToggle(env, "TELEGRAM");
  if (enabledEvents !== undefined) {
    config.enabledEvents = enabledEvents;
  }

  return config;
}

function parseDiscordConfig(env: NodeJS.ProcessEnv): DiscordConfig | undefined {
  const webhookUrl = readEnv(env, "DISCORD_WEBHOOK_URL");
  const username = readEnv(env, "DISCORD_USERNAME");
  const avatarUrl = readEnv(env, "DISCORD_AVATAR_URL");

  if (!webhookUrl) {
    return undefined;
  }

  const config: DiscordConfig = {
    webhookUrl,
  };

  if (username !== undefined) {
    config.username = username;
  }

  if (avatarUrl !== undefined) {
    config.avatarUrl = avatarUrl;
  }

  const customMessages = parseNotificationTemplates(env, "DISCORD");
  if (customMessages !== undefined) {
    config.customMessages = customMessages;
  }

  const enabledEvents = parseNotificationEventToggle(env, "DISCORD");
  if (enabledEvents !== undefined) {
    config.enabledEvents = enabledEvents;
  }

  return config;
}

function parseRetryConfig(env: NodeJS.ProcessEnv): RetryOptions | undefined {
  const maxAttempts = readEnv(env, "RETRY_MAX_ATTEMPTS");
  const initialDelay = readEnv(env, "RETRY_INITIAL_DELAY");
  const maxDelay = readEnv(env, "RETRY_MAX_DELAY");
  const backoffMultiplier = readEnv(env, "RETRY_BACKOFF_MULTIPLIER");
  const retryableErrors = readEnv(env, "RETRY_RETRYABLE_ERRORS");

  const config: RetryOptions = {};

  if (maxAttempts !== undefined) {
    const attempts = Number(maxAttempts);
    if (attempts <= 0 || attempts > 10) {
      throw new Error("RETRY_MAX_ATTEMPTS must be between 1 and 10");
    }
    config.maxAttempts = attempts;
  }

  if (initialDelay !== undefined) {
    const delay = Number(initialDelay);
    if (delay < 0) {
      throw new Error("RETRY_INITIAL_DELAY must be non-negative");
    }
    config.initialDelay = delay;
  }

  if (maxDelay !== undefined) {
    const delay = Number(maxDelay);
    if (delay < 0) {
      throw new Error("RETRY_MAX_DELAY must be non-negative");
    }
    config.maxDelay = delay;
  }

  if (backoffMultiplier !== undefined) {
    const multiplier = Number(backoffMultiplier);
    if (multiplier <= 1) {
      throw new Error("RETRY_BACKOFF_MULTIPLIER must be greater than 1");
    }
    config.backoffMultiplier = multiplier;
  }

  if (retryableErrors !== undefined) {
    config.retryableErrors = retryableErrors.split(",").map((e) => e.trim());
  }

  return Object.keys(config).length > 0 ? config : undefined;
}

function parseOrderDefaults(
  env: NodeJS.ProcessEnv
): KapitalBankOrderDefaults | undefined {
  const typeRid = readEnv(env, "ORDER_TYPE");
  const googlePayOrderType = readEnv(
    env,
    "GOOGLE_PAY_ORDER_TYPE"
  );
  const currency = readEnv(env, "CURRENCY");
  const language = readEnv(env, "LANGUAGE");
  const hppRedirectUrl = readEnv(env, "REDIRECT_URL");

  const defaults: KapitalBankOrderDefaults = {};

  if (typeRid !== undefined) {
    defaults.typeRid = parseOrderType(typeRid);
  }

  if (googlePayOrderType !== undefined) {
    defaults.googlePayOrderType =
      parseGooglePayOrderType(googlePayOrderType);
  }

  if (currency !== undefined) {
    defaults.currency = parseCurrency(currency);
  }

  if (language !== undefined) {
    defaults.language = parseLanguage(language);
  }

  if (hppRedirectUrl !== undefined) {
    defaults.hppRedirectUrl = hppRedirectUrl;
  }

  return Object.keys(defaults).length > 0 ? defaults : undefined;
}

export function parseEnvConfig(
  env: NodeJS.ProcessEnv = process.env
): KapitalBankConfig {
  const username = readEnv(env, "USERNAME");
  const password = readEnv(env, "PASSWORD");

  if (!username) {
    throw new Error("KAPITALBANK_USERNAME is required");
  }

  if (!password) {
    throw new Error("KAPITALBANK_PASSWORD is required");
  }

  const mode = readEnv(env, "MODE");
  const timeoutValue = readEnv(env, "TIMEOUT");
  const logEnabled = parseBoolean(readEnv(env, "LOG_ENABLED"));
  const defaults = parseOrderDefaults(env);
  const webhook = parseWebhookConfig(env);
  const telegram = parseTelegramConfig(env);
  const discord = parseDiscordConfig(env);
  const retry = parseRetryConfig(env);

  const config: KapitalBankConfig = {
    username,
    password,
  };

  if (mode !== undefined) {
    config.environment = parseEnvironment(mode);
  }

  if (timeoutValue !== undefined) {
    const timeout = Number(timeoutValue);

    if (!Number.isFinite(timeout) || timeout <= 0) {
      throw new Error(
        `KAPITALBANK_TIMEOUT must be a positive number, received "${timeoutValue}"`
      );
    }

    config.timeout = timeout;
  }

  if (logEnabled !== undefined) {
    config.logEnabled = logEnabled;
  }

  if (defaults !== undefined) {
    config.defaults = defaults;
  }

  if (webhook !== undefined) {
    config.webhook = webhook;
  }

  if (telegram !== undefined) {
    config.telegram = telegram;
  }

  if (discord !== undefined) {
    config.discord = discord;
  }

  if (retry !== undefined) {
    config.retry = retry;
  }

  return config;
}
