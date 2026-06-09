import { KapitalBank } from "../src";
import "dotenv/config";

const kb = KapitalBank.fromEnv();

async function handleWebhook() {
  const webhookPayload = {
    orderId: 233302,
    status: "FullyPaid",
    amount: "10",
    currency: "AZN",
    timestamp: new Date().toISOString(),
  };

  await kb.handleWebhook(webhookPayload, {
    onPaymentPaid: async (order) => {
      console.log("Payment paid:", order.id);
    },
    onPaymentDeclined: async (order) => {
      console.log("Payment declined:", order.id);
    },
    onPaymentExpired: async (order) => {
      console.log("Payment expired:", order.id);
    },
    onPaymentRefunded: async (order) => {
      console.log("Payment refunded:", order.id);
    },
    onPaymentReversed: async (order) => {
      console.log("Payment reversed:", order.id);
    },
    onStatusChange: async (order) => {
      console.log("Status changed:", order.status);
    },
    onError: async (error) => {
      console.error("Webhook error:", error);
    },
  });
}

function verifyWebhookSignature() {
  const payload = JSON.stringify({ orderId: 233302, status: "FullyPaid" });
  const signature = "some-signature";
  const secret = "your-webhook-secret";

  const result = kb.verifyWebhookSignature(payload, signature, secret);

  if (result.valid) {
    console.log("Webhook signature is valid");
  } else {
    console.log("Webhook signature is invalid:", result.error);
  }
}

function verifyWebhookIp() {
  const ip = "192.168.1.1";

  const isValid = kb.verifyWebhookIp(ip);

  if (isValid) {
    console.log("IP is allowed");
  } else {
    console.log("IP is not allowed");
  }
}

handleWebhook().catch(console.error);
verifyWebhookSignature();
verifyWebhookIp();
