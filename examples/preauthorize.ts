import { KapitalBank } from "../src";

const kb = new KapitalBank({
  username: "TerminalSys/kapital",
  password: "kapital123",
  environment: "test",
});

async function main() {
  const order = await kb.createOrder({
    typeRid: "Order_DMS",
    amount: "1",
    currency: "AZN",
    language: "az",
    description: "PreAuth Test",
  });

  console.log("Order:", order);

  const token = await kb.setSourceToken(
    order.id,
    order.password,
    {
      initiationEnvKind: "Server",
      storedId: 5125, // recurring testdə işləyən id
    }
  );

  console.log("Token:", token);

  const result = await kb.preAuthorize(
    order.id,
    "1.00"
  );

  console.log("PreAuth:", result);
}

main().catch(console.error);