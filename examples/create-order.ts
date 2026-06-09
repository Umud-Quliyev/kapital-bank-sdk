import {
  KapitalBank,
  getPaymentUrl,
} from "../src";

async function main() {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
  });

  const order = await kb.createOrder({
    typeRid: "Order_SMS",
    amount: "1",
    currency: "AZN",
    language: "az",
    description: "SDK Test Order",
    hppRedirectUrl: "https://example.com/callback",
  });

  console.log(order);
  console.log(
    "Payment URL:",
    getPaymentUrl(order)
  );
}

main().catch(console.error);