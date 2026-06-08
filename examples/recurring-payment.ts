import { KapitalBank } from "../src";

const kb = new KapitalBank({
  username: "TerminalSys/kapital",
  password: "kapital123",
  environment: "test",
});

async function main() {
  const order = await kb.createOrder({
    typeRid: "Order_REC",
    amount: "1",
    currency: "AZN",
    language: "az",
    description: "Recurring Payment Test",
  });

  console.log("Order:", order);

  const token = await kb.setSourceToken(
    order.id,
    order.password,
    {
      initiationEnvKind: "Server",
      storedId: 5125,
    }
  );

  console.log("Token:", token);

  const transaction =
    await kb.executeTransaction(
      order.id,
      {
        phase: "Single",
        conditions: {
          cofUsage: "Recurring",
        },
      }
    );

  console.log(
    "Transaction:",
    transaction
  );
}

main().catch(console.error);