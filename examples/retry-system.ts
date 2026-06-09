import { KapitalBank, retryWithBackoff } from "../src";
import "dotenv/config";

const kb = new KapitalBank({
  username: process.env.KAPITALBANK_USERNAME!,
  password: process.env.KAPITALBANK_PASSWORD!,
  environment: "test",
  retry: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    retryableErrors: ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED"],
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}:`, error.message);
    },
  },
});

async function automaticRetry() {
  try {
    const order = await kb.createOrder({
      amount: "10",
      description: "Test order with automatic retry",
    });

    console.log("Order created:", order.id);
  } catch (error) {
    console.error("Failed after retries:", error);
  }
}

async function manualRetry() {
  const result = await retryWithBackoff(
    async () => {
      const order = await kb.createOrder({
        amount: "10",
        description: "Test order with manual retry",
      });
      return order;
    },
    {
      maxAttempts: 5,
      initialDelay: 500,
      maxDelay: 10000,
      backoffMultiplier: 1.5,
      onRetry: (attempt, error) => {
        console.log(`Custom retry attempt ${attempt}:`, error.message);
      },
    }
  );

  console.log("Order created after retries:", result.data.id);
  console.log("Total attempts:", result.attempts);
}

automaticRetry().catch(console.error);
manualRetry().catch(console.error);
