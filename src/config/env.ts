import {
  Environment,
  KapitalBankConfig,
  KapitalBankOrderDefaults,
} from "../types/config";
import { Currency, Language } from "../types/enums";
import { isValidOrderType } from "../utils/order-defaults";

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

function parseOrderDefaults(
  env: NodeJS.ProcessEnv
): KapitalBankOrderDefaults | undefined {
  const typeRid = readEnv(env, "ORDER_TYPE");
  const currency = readEnv(env, "CURRENCY");
  const language = readEnv(env, "LANGUAGE");
  const hppRedirectUrl = readEnv(env, "REDIRECT_URL");

  const defaults: KapitalBankOrderDefaults = {};

  if (typeRid !== undefined) {
    defaults.typeRid = parseOrderType(typeRid);
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

  return config;
}
