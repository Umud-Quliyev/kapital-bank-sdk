import { KapitalBank } from "../src";

async function main() {
  const kb = KapitalBank.fromEnv();

  kb.on("payment:paid", (order) => {
    console.log("Paid:", order.id, order.status);
  });

  kb.on("payment:declined", (order) => {
    console.log("Declined:", order.id, order.status);
  });

  kb.on("payment:status", (order) => {
    console.log("Status update:", order.status);
  });

  const session = await kb.createHostedPayment({
    amount: "1",
    description: "Event demo",
  });

  console.log("Open:", session.paymentUrl);

  await kb.waitForPayment(session.orderId, {
    password: session.password,
    timeout: 300000,
  });
}

main().catch(console.error);
