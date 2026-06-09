import axios from "axios";

import { TelegramConfig, NotificationMessage } from "../types/notification";
import { OrderDetails } from "../types/details";
import { KapitalBankError } from "../errors/KapitalBankError";

export class TelegramService {
  constructor(private readonly config: TelegramConfig) {}

  private formatMessage(message: NotificationMessage): string {
    const {
      title,
      body,
      orderId,
      status,
      amount,
      currency,
      timestamp,
    } = message;

    let text = `*${title}*\n\n`;
    text += `${body}\n`;

    if (orderId) text += `Order ID: \`${orderId}\`\n`;
    if (status) text += `Status: ${status}\n`;
    if (amount && currency) text += `Amount: ${amount} ${currency}\n`;
    if (timestamp) text += `Time: ${timestamp}\n`;

    return text;
  }

  private getCustomMessage(
    template: string | undefined,
    order: OrderDetails
  ): string {
    if (!template) return "";

    return template
      .replace(/\{orderId\}/g, String(order.id))
      .replace(/\{amount\}/g, String(order.amount))
      .replace(/\{currency\}/g, order.currency || "")
      .replace(/\{status\}/g, order.status)
      .replace(/\{timestamp\}/g, order.createTime || "");
  }

  async sendMessage(message: NotificationMessage): Promise<void> {
    try {
      const text = this.formatMessage(message);

      await axios.post(
        `https://api.telegram.org/bot${this.config.botToken}/sendMessage`,
        {
          chat_id: this.config.chatId,
          text,
          parse_mode: this.config.parseMode || "Markdown",
          disable_notification: this.config.disableNotification || false,
        }
      );
    } catch (error) {
      throw new KapitalBankError(
        `Failed to send Telegram message: ${error instanceof Error ? error.message : "Unknown error"}`,
        undefined,
        { errorCode: "NotificationError" }
      );
    }
  }

  async sendPaymentPaid(order: OrderDetails): Promise<void> {
    if (this.config.enabledEvents?.paid === false) return;

    const customBody = this.getCustomMessage(
      this.config.customMessages?.paid,
      order
    );

    await this.sendMessage({
      title: "💰 Payment Paid",
      body: customBody || "Payment has been successfully completed",
      orderId: order.id,
      status: order.status,
      amount: String(order.amount),
      currency: order.currency,
      timestamp: order.createTime,
    });
  }

  async sendPaymentDeclined(order: OrderDetails): Promise<void> {
    if (this.config.enabledEvents?.declined === false) return;

    const customBody = this.getCustomMessage(
      this.config.customMessages?.declined,
      order
    );

    await this.sendMessage({
      title: "❌ Payment Declined",
      body: customBody || "Payment has been declined",
      orderId: order.id,
      status: order.status,
      amount: String(order.amount),
      currency: order.currency,
      timestamp: order.createTime,
    });
  }

  async sendPaymentExpired(order: OrderDetails): Promise<void> {
    if (this.config.enabledEvents?.expired === false) return;

    const customBody = this.getCustomMessage(
      this.config.customMessages?.expired,
      order
    );

    await this.sendMessage({
      title: "⏰ Payment Expired",
      body: customBody || "Payment has expired",
      orderId: order.id,
      status: order.status,
      amount: String(order.amount),
      currency: order.currency,
      timestamp: order.createTime,
    });
  }

  async sendPaymentRefunded(order: OrderDetails): Promise<void> {
    if (this.config.enabledEvents?.refunded === false) return;

    const customBody = this.getCustomMessage(
      this.config.customMessages?.refunded,
      order
    );

    await this.sendMessage({
      title: "↩️ Payment Refunded",
      body: customBody || "Payment has been refunded",
      orderId: order.id,
      status: order.status,
      amount: String(order.amount),
      currency: order.currency,
      timestamp: order.createTime,
    });
  }

  async sendPaymentReversed(order: OrderDetails): Promise<void> {
    if (this.config.enabledEvents?.reversed === false) return;

    const customBody = this.getCustomMessage(
      this.config.customMessages?.reversed,
      order
    );

    await this.sendMessage({
      title: "🔄 Payment Reversed",
      body: customBody || "Payment has been reversed",
      orderId: order.id,
      status: order.status,
      amount: String(order.amount),
      currency: order.currency,
      timestamp: order.createTime,
    });
  }

  async sendCustom(message: NotificationMessage): Promise<void> {
    await this.sendMessage(message);
  }
}
