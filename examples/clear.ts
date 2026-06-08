import { KapitalBank } from "../src";

const kb = new KapitalBank({
  username: "TerminalSys/kapital",
  password: "kapital123",
  environment: "test",
});

async function main() {
  const result = await kb.clear(
    123456 // test order id
  );

  console.log(result);
}

main().catch(console.error);