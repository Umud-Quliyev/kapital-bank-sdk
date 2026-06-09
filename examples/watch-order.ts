import {
  KapitalBank,
  getPaymentUrl,
} from "../src";

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
      description: "Watch Test",
      hppRedirectUrl:
        "https://example.com/callback",
    });

  console.log(
    "Payment URL:",
    getPaymentUrl(order)
  );
  console.log(
    "Waiting payment..."
  );

  const result =
    await kb.watchOrder(
      order.id,
      {
        password: order.password,
      }
    );

  console.log(result);
}

main();