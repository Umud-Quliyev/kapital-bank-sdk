import { OrderDetails } from "./details";
import { OrderStatus } from "./enums";

export interface WatchOrderOptions {
  interval?: number;
  timeout?: number;
  stopStatuses?: OrderStatus[];
  password?: string;
  onStatusChange?: (order: OrderDetails) => void;
}

export interface WaitForStatusOptions {
  interval?: number;
  timeout?: number;
}