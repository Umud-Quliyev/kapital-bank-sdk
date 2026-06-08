import { KapitalBank } from "../src";

const kb = new KapitalBank({
  username: "TerminalSys/kapital",
  password: "kapital123",
  environment: "test",
});

async function main() {
  const result = await kb.setSourceToken(
    232748, // test order
    "1q0a1v2ypvcg0", // order password
    {
      initiationEnvKind: "Server",
      storedId: 5125,
    }
  );

  console.log(result);
}

main().catch(console.error);