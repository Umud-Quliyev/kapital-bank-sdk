import { KapitalBank } from "../src";

const kb = new KapitalBank({
  username: "TerminalSys/kapital",
  password: "kapital123",
  environment: "test",
});

async function main() {
  const order = await kb.createOrder({
    typeRid: "OCT",
    amount: "1",
    currency: "AZN",
    language: "az",
    description: "Destination Token Test",
  });

  console.log("Order:", order);

  const result =
    await kb.setDestinationToken(
      order.id,
      order.password,
      {
        pan: "4169741330151778",
      }
    );

  console.log(result);
}

main().catch(console.error);