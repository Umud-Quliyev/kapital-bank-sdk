import axios from "axios";

import { DiscordConfig, NotificationMessage } from "../types/notification";
import { OrderDetails } from "../types/details";
import { KapitalBankError } from "../errors/KapitalBankError";

export class DiscordService {
  constructor(private readonly config: DiscordConfig) {}

  private formatMessage(message: NotificationMessage): object {
    const {
      title,
      body,
      orderId,
      status,
      amount,
      currency,
      timestamp,
    } = message;

    const fields: { name: string; value: string; inline?: boolean }[] = [];

    if (orderId) fields.push({ name: "Order ID", value: String(orderId), inline: true });
    if (status) fields.push({ name: "Status", value: status, inline: true });
    if (amount && currency) fields.push({ name: "Amount", value: `${amount} ${currency}`, inline: true });
    if (timestamp) fields.push({ name: "Time", value: timestamp, inline: false });

    return {
      username: this.config.username || "Kapital Bank SDK",
      avatar_url: this.config.avatarUrl,
      embeds: [
        {
          title,
          description: body,
          fields,
          color: this.getStatusColor(status),
          timestamp: timestamp || new Date().toISOString(),
        },
      ],
    };
  }

  private getStatusColor(status?: string): number {
    const colors: Record<string, number> = {
      FullyPaid: 0x57f287,
      Declined: 0xed4245,
      Expired: 0xfaa61a,
      Refunded: 0x5865f2,
      Reversed: 0xeb459e,
    };

    return status ? colors[status] || 0x5865f2 : 0x5865f2;
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
      const payload = this.formatMessage(message);

      await axios.post(this.config.webhookUrl, payload);
    } catch (error) {
      throw new KapitalBankError(
        `Failed to send Discord message: ${error instanceof Error ? error.message : "Unknown error"}`,
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
