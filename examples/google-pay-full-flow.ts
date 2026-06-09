import {
  encodeGooglePayToken,
  GOOGLE_PAY_GATEWAY,
  KapitalBankError,
} from "../src";
import { createExampleClient } from "./client";

async function main() {
  const kb = createExampleClient();

  console.log("=== Google Pay Full Flow Example ===\n");

  // Display gateway configuration
  console.log("Google Pay gateway config:", GOOGLE_PAY_GATEWAY);
  console.log();

  // Step 1: Create Google Pay order
  console.log("Step 1: Creating Google Pay order...");
  const order = await kb.createGooglePayOrder({
    amount: "10",
    description: "Google Pay Full Flow Test",
    typeRid: "GSMS",
  });

  console.log("✓ Order created:", order.id);
  console.log("  Status:", order.status);
  console.log("  Password:", order.password);
  console.log();

  // Step 2: Get Google Pay token from frontend (simulated with env var)
  console.log("Step 2: Getting Google Pay token from frontend...");
  const googlePayTokenJson = process.env.GOOGLE_PAY_TOKEN_JSON;

  if (!googlePayTokenJson) {
    console.log(
      "⚠ Set GOOGLE_PAY_TOKEN_JSON environment variable to complete the flow."
    );
    console.log(
      "  In production, this comes from: paymentData.paymentMethodData.tokenizationData.token"
    );
    console.log();
    console.log("Stopping at order creation. Order ID:", order.id);
    return;
  }

  console.log("✓ Token received from frontend");
  console.log();

  // Step 3: Encode token to HEX
  console.log("Step 3: Encoding token to HEX...");
  const googlePayBlock = encodeGooglePayToken(googlePayTokenJson);
  console.log("✓ Token encoded to HEX");
  console.log();

  // Step 4: Set Google Pay token on order
  console.log("Step 4: Setting Google Pay token on order...");
  await kb.setGooglePayToken(order.id, order.password, {
    googlePayBlock,
  });
  console.log("✓ Token set on order");
  console.log();

  // Step 5: Execute transaction
  console.log("Step 5: Executing transaction...");
  const transaction = await kb.executeTransaction(order.id, {
    phase: "Single",
  });
  console.log("✓ Transaction executed");
  console.log("  Approval Code:", transaction.approvalCode);
  console.log("  Result Code:", transaction.pmoResultCode);
  console.log();

  // Step 6: Wait for payment completion
  console.log("Step 6: Waiting for payment completion...");
  const result = await kb.waitForPayment(order.id, {
    password: order.password,
    interval: 5000,
    timeout: 60000,
  });
  console.log("✓ Payment completed");
  console.log("  Final Status:", result.status);
  console.log();

  console.log("=== Full Flow Complete ===");
  console.log("Order ID:", order.id);
  console.log("Final Status:", result.status);
  console.log("Transaction:", JSON.stringify(transaction, null, 2));
}

main().catch((error) => {
  if (
    error instanceof KapitalBankError &&
    (error.details as any)?.errorCode === "OrderTypeNotFound"
  ) {
    console.error(
      "\n❌ Google Pay is not enabled on this merchant terminal."
    );
    console.error(
      "Contact your Kapital Bank curator to enable GN3D/GSMS on your login."
    );
    process.exit(1);
  }

  console.error("\n❌ Error:", error);
  process.exit(1);
});
