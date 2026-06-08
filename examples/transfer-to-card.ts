import { KapitalBank } from "../src";

const kb = new KapitalBank({
  username: "TerminalSys/kapital",
  password: "kapital123",
  environment: "test",
});

async function main() {
  const result =
    await kb.transferToCard({
      amount: "1",
      pan: "4169741330151778",
    });

  console.log(result);
}

main().catch(console.error);