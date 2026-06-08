import { KapitalBank } from "../src/KapitalBank";

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
    hppRedirectUrl: "https://example.com",
  });

  console.log(order);
}

main().catch(console.error);