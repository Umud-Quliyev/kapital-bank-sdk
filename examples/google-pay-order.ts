import { createExampleClient } from "./client";

async function main() {
  const kb = createExampleClient();

  const order = await kb.createGooglePayOrder({
    amount: "10",
    description: "Google Pay Test",
  });

  console.log("Order ID:", order.id);
  console.log("Status:", order.status);
  console.log("HPP base URL:", order.hppUrl);
  console.log("Password:", order.password);
}

main().catch(console.error);
