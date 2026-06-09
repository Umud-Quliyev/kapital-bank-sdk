import { KapitalBank } from "../src";
import "dotenv/config";

console.log("=== Testing Security Fixes ===\n");

console.log("1. Testing Webhook IP Validation (Deny by Default)...");
try {
  const kb = new KapitalBank({
    username: process.env.KAPITALBANK_USERNAME!,
    password: process.env.KAPITALBANK_PASSWORD!,
    environment: "test",
    webhook: {},
  });

  const isValid = kb.verifyWebhookIp("192.168.1.1");
  console.log("✅ IP validation denies by default:", !isValid);
  if (isValid) {
    console.error("❌ FAIL: IP should be denied when no allowedIps configured");
  } else {
    console.log("   Security fix working correctly");
  }
} catch (error) {
  console.log("❌ Webhook IP validation test failed:", error);
}

console.log("\n2. Testing Webhook IP Validation (Allow Configured IPs)...");
try {
  const kb = new KapitalBank({
    username: process.env.KAPITALBANK_USERNAME!,
    password: process.env.KAPITALBANK_PASSWORD!,
    environment: "test",
    webhook: {
      allowedIps: ["192.168.1.1", "192.168.1.2"],
    },
  });

  const isValid = kb.verifyWebhookIp("192.168.1.1");
  console.log("✅ IP validation allows configured IP:", isValid);
  if (!isValid) {
    console.error("❌ FAIL: IP should be allowed when in allowedIps");
  } else {
    console.log("   Security fix working correctly");
  }
} catch (error) {
  console.log("❌ Webhook IP validation test failed:", error);
}

console.log("\n3. Testing Retry Configuration Validation...");
try {
  const kb = new KapitalBank({
    username: process.env.KAPITALBANK_USERNAME!,
    password: process.env.KAPITALBANK_PASSWORD!,
    environment: "test",
    retry: {
      maxAttempts: 15,
    },
  });
  console.log("❌ FAIL: Should throw error for maxAttempts > 10");
} catch (error) {
  console.log("✅ Retry validation rejects maxAttempts > 10:", error instanceof Error ? error.message : error);
}

try {
  const kb = new KapitalBank({
    username: process.env.KAPITALBANK_USERNAME!,
    password: process.env.KAPITALBANK_PASSWORD!,
    environment: "test",
    retry: {
      maxAttempts: 0,
    },
  });
  console.log("❌ FAIL: Should throw error for maxAttempts <= 0");
} catch (error) {
  console.log("✅ Retry validation rejects maxAttempts <= 0:", error instanceof Error ? error.message : error);
}

try {
  const kb = new KapitalBank({
    username: process.env.KAPITALBANK_USERNAME!,
    password: process.env.KAPITALBANK_PASSWORD!,
    environment: "test",
    retry: {
      backoffMultiplier: 1,
    },
  });
  console.log("❌ FAIL: Should throw error for backoffMultiplier <= 1");
} catch (error) {
  console.log("✅ Retry validation rejects backoffMultiplier <= 1:", error instanceof Error ? error.message : error);
}

try {
  const kb = new KapitalBank({
    username: process.env.KAPITALBANK_USERNAME!,
    password: process.env.KAPITALBANK_PASSWORD!,
    environment: "test",
    retry: {
      maxAttempts: 3,
      backoffMultiplier: 2,
    },
  });
  console.log("✅ Retry validation accepts valid configuration");
} catch (error) {
  console.log("❌ FAIL: Should accept valid retry configuration:", error);
}

console.log("\n4. Testing Notification Event Toggles...");
try {
  const kb = new KapitalBank({
    username: process.env.KAPITALBANK_USERNAME!,
    password: process.env.KAPITALBANK_PASSWORD!,
    environment: "test",
    telegram: {
      botToken: "test-token",
      chatId: "test-chat",
      enabledEvents: {
        paid: true,
        declined: false,
        expired: false,
        refunded: false,
        reversed: false,
      },
    },
  });
  console.log("✅ Notification event toggles loaded successfully");
} catch (error) {
  console.log("❌ Notification event toggles test failed:", error);
}

console.log("\n=== All Security Tests Completed ===");
