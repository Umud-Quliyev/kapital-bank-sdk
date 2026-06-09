import { config } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { KapitalBank } from "../src";

config({
  path: resolve(
    fileURLToPath(new URL(".", import.meta.url)),
    "..",
    ".env"
  ),
});
const TEST_DEFAULTS = {
  currency: "AZN" as const,
  language: "az" as const,
  hppRedirectUrl: "https://example.com/callback",
  googlePayOrderType: "GSMS" as const,
};

export function createExampleClient(): KapitalBank {
  if (
    process.env.KAPITALBANK_USERNAME &&
    process.env.KAPITALBANK_PASSWORD
  ) {
    return KapitalBank.fromEnv();
  }

  console.log(
    "Using Kapital Bank test credentials (set KAPITALBANK_USERNAME and KAPITALBANK_PASSWORD to use env config)."
  );

  return new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
    defaults: TEST_DEFAULTS,
  });
}
