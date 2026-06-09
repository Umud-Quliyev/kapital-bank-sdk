import { KapitalBank, TelegramService } from "../src";
import "dotenv/config";

const kb = new KapitalBank({
  username: process.env.KAPITALBANK_USERNAME!,
  password: process.env.KAPITALBANK_PASSWORD!,
  environment: "test",
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
    chatId: process.env.TELEGRAM_CHAT_ID!,
    parseMode: "Markdown",
    disableNotification: false,
  },
});

async function automaticNotifications() {
  const session = await kb.createHostedPayment({
    amount: "10",
    description: "Test payment with Telegram notifications",
  });

  console.log("Payment URL:", session.paymentUrl);

  const result = await kb.waitForPayment(session.orderId, {
    password: session.password,
  });

  console.log("Final status:", result.status);
}

async function manualNotifications() {
  const telegramService = kb.getTelegramService();

  if (!telegramService) {
    console.error("Telegram service not configured");
    return;
  }

  await telegramService.sendCustom({
    title: "📢 Custom Notification",
    body: "This is a custom notification sent via Telegram",
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
