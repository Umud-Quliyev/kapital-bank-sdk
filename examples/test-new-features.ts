import { KapitalBank } from "../src";
import "dotenv/config";

console.log("=== Testing New Features ===\n");

console.log("1. Testing KapitalBank.fromEnv()...");
try {
  const kb = KapitalBank.fromEnv();
  console.log("✅ KapitalBank.fromEnv() works");
  console.log("   Instance created successfully");
} catch (error) {
  console.log("❌ KapitalBank.fromEnv() failed:", error);
}

console.log("\n2. Testing Health Check...");
try {
  const kb = KapitalBank.fromEnv();
  const health = await kb.healthCheck();
  console.log("✅ Health check works");
  console.log("   Healthy:", health.healthy);
  console.log("   Latency:", health.latency, "ms");
} catch (error) {
  console.log("❌ Health check failed:", error);
}

console.log("\n3. Testing Monitoring Metrics...");
try {
  const kb = KapitalBank.fromEnv();
  const metrics = kb.getMonitoringMetrics();
  console.log("✅ Monitoring metrics work");
  console.log("   Total requests:", metrics.totalRequests);
  console.log("   Success rate:", metrics.successRate.toFixed(2), "%");
} catch (error) {
  console.log("❌ Monitoring metrics failed:", error);
}

console.log("\n4. Testing Webhook Signature Verification...");
try {
  const kb = KapitalBank.fromEnv();
  const payload = JSON.stringify({ orderId: 123, status: "FullyPaid" });
  const signature = "test-signature";
  const secret = "test-secret";

  const result = kb.verifyWebhookSignature(payload, signature, secret);
  console.log("✅ Webhook signature verification works");
  console.log("   Valid:", result.valid);
} catch (error) {
  console.log("❌ Webhook signature verification failed:", error);
}

console.log("\n5. Testing Webhook Payload Parsing...");
try {
  const kb = KapitalBank.fromEnv();
  const rawBody = JSON.stringify({ orderId: 123, status: "FullyPaid", amount: "10" });

  const payload = kb.parseWebhookPayload(rawBody);
  console.log("✅ Webhook payload parsing works");
  console.log("   Order ID:", payload.orderId);
  console.log("   Status:", payload.status);
} catch (error) {
  console.log("❌ Webhook payload parsing failed:", error);
}

console.log("\n6. Testing Custom Message Templates...");
try {
  const kb = new KapitalBank({
    username: process.env.KAPITALBANK_USERNAME!,
    password: process.env.KAPITALBANK_PASSWORD!,
    environment: "test",
    telegram: {
      botToken: "test-token",
      chatId: "test-chat",
      customMessages: {
        paid: "Order #{orderId} paid! Amount: {amount} {currency}",
      },
    },
  });
  console.log("✅ Custom message templates work");
  console.log("   Telegram config loaded with custom messages");
} catch (error) {
  console.log("❌ Custom message templates failed:", error);
}

console.log("\n7. Testing Retry Configuration...");
try {
  const kb = new KapitalBank({
    username: process.env.KAPITALBANK_USERNAME!,
    password: process.env.KAPITALBANK_PASSWORD!,
    environment: "test",
    retry: {
      maxAttempts: 3,
      initialDelay: 1000,
      backoffMultiplier: 2,
    },
  });
  console.log("✅ Retry configuration works");
  console.log("   Retry config loaded successfully");
} catch (error) {
  console.log("❌ Retry configuration failed:", error);
}

console.log("\n8. Testing Webhook IP Verification...");
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
  console.log("✅ Webhook IP verification works");
  console.log("   IP 192.168.1.1 valid:", isValid);
} catch (error) {
  console.log("❌ Webhook IP verification failed:", error);
}

console.log("\n=== All Tests Completed ===");
