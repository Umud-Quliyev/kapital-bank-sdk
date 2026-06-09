import {
  KapitalBank,
  getPaymentUrl,
} from "../src";

async function main() {
  const kb = KapitalBank.fromEnv();

  const order = await kb.createOrder({
    typeRid: "Order_SMS",
    amount: "1",
    description: "SDK Test Order",
  });

  console.log(order);
  console.log(
    "Payment URL:",
    getPaymentUrl(order)
  );
}

main().catch(console.error);
