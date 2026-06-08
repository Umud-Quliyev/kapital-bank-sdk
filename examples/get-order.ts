import { KapitalBank } from "../src/KapitalBank";

async function main() {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
  });

  const order = await kb.getOrder(
    232699
  );

  console.log(order);
}

main().catch(console.error);