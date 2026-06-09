import { KapitalBank } from "../src";

async function main() {
  const kb = KapitalBank.fromEnv();

  kb.on("payment:created", (session) => {
    console.log("Payment session created:", session);
  });

  const session = await kb.createHostedPayment({
    amount: "1",
    description: "SDK Hosted Payment",
  });

  console.log(session);
}

main().catch(console.error);
