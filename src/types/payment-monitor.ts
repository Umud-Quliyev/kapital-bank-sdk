import { OrderStatus } from "./enums";

export interface WatchOrderOptions {
  interval?: number;
  timeout?: number;
  stopStatuses?: OrderStatus[];
  password?: string;
}

export interface WaitForStatusOptions {
  interval?: number;
  timeout?: number;
}