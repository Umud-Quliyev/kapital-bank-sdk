import { KapitalBank, DiscordService } from "../src";
import "dotenv/config";

const kb = new KapitalBank({
  username: process.env.KAPITALBANK_USERNAME!,
  password: process.env.KAPITALBANK_PASSWORD!,
  environment: "test",
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL!,
    username: "Kapital Bank Bot",
    avatarUrl: "https://example.com/avatar.png",
  },
});

async function automaticNotifications() {
  const session = await kb.createHostedPayment({
    amount: "10",
    description: "Test payment with Discord notifications",
  });

  console.log("Payment URL:", session.paymentUrl);

  const result = await kb.waitForPayment(session.orderId, {
    password: session.password,
  });

  console.log("Final status:", result.status);
}

async function manualNotifications() {
  const discordService = kb.getDiscordService();

  if (!discordService) {
    console.error("Discord service not configured");
    return;
  }

  await discordService.sendCustom({
    title: "📢 Custom Notification",
    body: "This is a custom notification sent via Discord",
    orderId: 12345,
    status: "Custom",
    amount: "100",
    currency: "AZN",
    timestamp: new Date().toISOString(),
  });

  console.log("Custom notification sent");
}

automaticNotifications().catch(console.error);
manualNotifications().catch(console.error);
