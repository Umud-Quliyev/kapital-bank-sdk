import {
  KapitalBank,
  getPaymentUrl,
} from "../src";

const REDIRECT_URL =
  "https://example.com/callback";

const kb = new KapitalBank({
  username: "TerminalSys/kapital",
  password: "kapital123",
  environment: "test",
});

async function main() {
  const order =
    await kb.createOrder({
      typeRid: "Order_SMS",
      amount: "1",
      currency: "AZN",
      language: "az",
      description: "HPP Payment Test",
      hppRedirectUrl: REDIRECT_URL,
      initiationEnvKind: "Browser",
      hppCofCapturePurposes: ["Cit"],
    });

  const paymentUrl =
    getPaymentUrl(order);

  console.log("Order ID:", order.id);
  console.log("Status:", order.status);
  console.log("");
  console.log(
    "Open this URL in your browser:"
  );
  console.log(paymentUrl);
  console.log("");
  console.log(
    "Test card (valid in 2026):"
  );
  console.log(
    "  PAN: 5239151747183468"
  );
  console.log(
    "  Exp: 11/27  CVV: 602"
  );
}

main().catch(console.error);
