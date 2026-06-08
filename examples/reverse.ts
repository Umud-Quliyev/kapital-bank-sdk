import { KapitalBank } from "../src/KapitalBank";

async function main() {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
  });

  const result = await kb.reverse(
    232699,
    {
      phase: "Single",
      voidKind: "Full",
    }
  );

  console.log(result);
}

main().catch(console.error);