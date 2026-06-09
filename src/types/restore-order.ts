import { OrderDetails } from "./details";

export interface RestoredPaymentSession {
  orderId: number;
  password: string;
  paymentUrl: string;
  order: OrderDetails;
}
