import { describe, it, expect } from "vitest";
import { parseEnvConfig } from "../src/config/env";
import { applyOrderDefaults } from "../src/utils/order-defaults";
import { KapitalBank } from "../src/KapitalBank";

const baseEnv = {
  KAPITALBANK_USERNAME: "TerminalSys/kapital",
  KAPITALBANK_PASSWORD: "kapital123",
};

describe("parseEnvConfig", () => {
  it("parses required credentials", () => {
    const config = parseEnvConfig(baseEnv);

    expect(config).toEqual({
      username: "TerminalSys/kapital",
      password: "kapital123",
    });
  });

  it("parses optional SDK settings", () => {
    const config = parseEnvConfig({
      ...baseEnv,
      KAPITALBANK_MODE: "production",
      KAPITALBANK_TIMEOUT: "45000",
      KAPITALBANK_LOG_ENABLED: "true",
      KAPITALBANK_ORDER_TYPE: "Order_SMS",
      KAPITALBANK_CURRENCY: "USD",
      KAPITALBANK_LANGUAGE: "en",
      KAPITALBANK_REDIRECT_URL: "https://example.com/callback",
    });

    expect(config).toEqual({
      username: "TerminalSys/kapital",
      password: "kapital123",
      environment: "production",
      timeout: 45000,
      logEnabled: true,
      defaults: {
        typeRid: "Order_SMS",
        currency: "USD",
        language: "en",
        hppRedirectUrl: "https://example.com/callback",
      },
    });
  });

  it("throws when username is missing", () => {
    expect(() =>
      parseEnvConfig({
        KAPITALBANK_PASSWORD: "kapital123",
      })
    ).toThrow("KAPITALBANK_USERNAME is required");
  });

  it("throws for invalid mode", () => {
    expect(() =>
      parseEnvConfig({
        ...baseEnv,
        KAPITALBANK_MODE: "staging",
      })
    ).toThrow('KAPITALBANK_MODE must be "test" or "production"');
  });
});

describe("applyOrderDefaults", () => {
  it("applies configured defaults when fields are omitted", () => {
    const request = applyOrderDefaults(
      {
        typeRid: "Order_SMS",
        amount: "10",
        description: "Test",
      },
      {
        currency: "AZN",
        language: "az",
        hppRedirectUrl: "https://example.com/callback",
      }
    );

    expect(request).toEqual({
      typeRid: "Order_SMS",
      amount: "10",
      description: "Test",
      currency: "AZN",
      language: "az",
      hppRedirectUrl: "https://example.com/callback",
    });
  });

  it("lets request values override defaults", () => {
    const request = applyOrderDefaults(
      {
        typeRid: "Order_SMS",
        amount: "10",
        description: "Test",
        currency: "USD",
        language: "en",
        hppRedirectUrl: "https://merchant.com/return",
      },
      {
        currency: "AZN",
        language: "az",
        hppRedirectUrl: "https://example.com/callback",
      }
    );

    expect(request.currency).toBe("USD");
    expect(request.language).toBe("en");
    expect(request.hppRedirectUrl).toBe(
      "https://merchant.com/return"
    );
  });

  it("applies typeRid from defaults", () => {
    const request = applyOrderDefaults(
      {
        amount: "10",
        description: "Test",
        currency: "AZN",
        language: "az",
      },
      {
        typeRid: "Order_SMS",
      }
    );

    expect(request.typeRid).toBe("Order_SMS");
  });

  it("throws when typeRid cannot be resolved", () => {
    expect(() =>
      applyOrderDefaults({
        amount: "10",
        description: "Test",
        currency: "AZN",
        language: "az",
      })
    ).toThrow("createOrder requires typeRid");
  });

  it("throws when currency cannot be resolved", () => {
    expect(() =>
      applyOrderDefaults({
        typeRid: "Order_SMS",
        amount: "10",
        description: "Test",
        language: "az",
      })
    ).toThrow("createOrder requires currency");
  });
});

describe("KapitalBank.fromEnv", () => {
  it("creates an SDK instance from environment variables", () => {
    const kb = KapitalBank.fromEnv(baseEnv);

    expect(kb).toBeInstanceOf(KapitalBank);
  });
});
