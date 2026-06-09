import {
  KapitalBank,
  getPaymentUrl,
} from "../src";

const REDIRECT_URL =
  "https://example.com/callback";

const kb = new KapitalBank({
  username: "TerminalSys/kapital",
  password: "kapital123",
  environment: "test",
});

async function main() {
  const order =
    await kb.createOrder({
      typeRid: "Order_SMS",
      amount: "1",
      currency: "AZN",
      language: "az",
      description:
        "HPP Wait For Payment Test",
      hppRedirectUrl: REDIRECT_URL,
      initiationEnvKind: "Browser",
      hppCofCapturePurposes: ["Cit"],
    });

  const paymentUrl =
    getPaymentUrl(order);

  console.log("Order ID:", order.id);
  console.log(
    "Payment URL:",
    paymentUrl
  );
  console.log("");
  console.log(
    "Pay only this URL (same order ID), then polling continues here..."
  );

  const result =
    await kb.waitForPayment(
      order.id,
      {
        password: order.password,
        interval: 5000,
        timeout: 300000,
      }
    );

  console.log("");
  console.log("Payment completed:");
  console.log(result);
}

main().catch(console.error);
