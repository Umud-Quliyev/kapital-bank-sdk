import { OrderDetails } from "./details";

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  parseMode?: "Markdown" | "MarkdownV2" | "HTML";
  disableNotification?: boolean;
  customMessages?: NotificationMessageTemplates;
  enabledEvents?: NotificationEventToggle;
}

export interface DiscordConfig {
  webhookUrl: string;
  username?: string;
  avatarUrl?: string;
  customMessages?: NotificationMessageTemplates;
  enabledEvents?: NotificationEventToggle;
}

export interface NotificationEventToggle {
  paid?: boolean;
  declined?: boolean;
  expired?: boolean;
  refunded?: boolean;
  reversed?: boolean;
}

export interface NotificationMessageTemplates {
  paid?: string;
  declined?: string;
  expired?: string;
  refunded?: string;
  reversed?: string;
}

export interface NotificationMessage {
  title: string;
  body: string;
  orderId?: number;
  status?: string;
  amount?: string;
  currency?: string;
  timestamp?: string;
}

export interface NotificationService {
  sendPaymentPaid(order: OrderDetails): Promise<void>;
  sendPaymentDeclined(order: OrderDetails): Promise<void>;
  sendPaymentExpired(order: OrderDetails): Promise<void>;
  sendPaymentRefunded(order: OrderDetails): Promise<void>;
  sendPaymentReversed(order: OrderDetails): Promise<void>;
  sendCustom(message: NotificationMessage): Promise<void>;
}
