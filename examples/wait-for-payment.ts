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
      description:
        "Wait For Payment Test",
      hppRedirectUrl:
        "https://example.com/callback",
    });

  console.log(
    "Order ID:",
    order.id
  );
  console.log(
    "Payment URL:",
    getPaymentUrl(order)
  );
  console.log("Waiting for payment...");
  const result =
    await kb.waitForStatus(
      order.id,
      "FullyPaid",
      {
        password: order.password,
        interval: 5000,
        timeout: 300000,
      }
    );
  console.log(result);
}

main();