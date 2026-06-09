import {
  encodeGooglePayToken,
  GOOGLE_PAY_GATEWAY,
  KapitalBankError,
} from "../src";
import { createExampleClient } from "./client";

async function main() {
  const kb = createExampleClient();

  console.log("Google Pay gateway config:", GOOGLE_PAY_GATEWAY);

  const order = await kb.createGooglePayOrder({
    amount: "10",
    description: "Google Pay Native Test",
  });

  console.log("Order created:", order.id);

  // In production, obtain this JSON from the Google Pay API on your frontend:
  // paymentData.paymentMethodData.tokenizationData.token
  const googlePayTokenJson = process.env.GOOGLE_PAY_TOKEN_JSON;

  if (!googlePayTokenJson) {
    console.log(
      "Set GOOGLE_PAY_TOKEN_JSON to run the token + execute steps."
    );
    console.log(
      "Next: setGooglePayToken() then executeTransaction({ phase: 'Single' })"
    );
    return;
  }

  const googlePayBlock =
    encodeGooglePayToken(googlePayTokenJson);

  await kb.setGooglePayToken(order.id, order.password, {
    googlePayBlock,
  });

  const transaction = await kb.executeTransaction(
    order.id,
    { phase: "Single" }
  );

  console.log("Transaction:", transaction);
}

main().catch((error) => {
  if (
    error instanceof KapitalBankError &&
    error.details?.errorCode === "OrderTypeNotFound"
  ) {
    console.error(
      "Google Pay is not enabled on this merchant terminal.",
      "Contact your Kapital Bank curator to enable GN3D/GSMS on your login."
    );
    return;
  }

  console.error(error);
});
