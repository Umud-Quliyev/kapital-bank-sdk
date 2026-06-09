import { KapitalBank, isPreparing } from "../src";

async function main() {
  const kb = KapitalBank.fromEnv();

  const orderId = 233266;
  const password = "order-password";

  const details = await kb.getOrder(orderId, {
    password,
  });

  if (!isPreparing(details)) {
    console.log(
      "Order is not restorable:",
      details.status
    );
    return;
  }

  const session = await kb.restoreOrder(
    orderId,
    password
  );

  console.log(session.paymentUrl);
}

main().catch(console.error);
