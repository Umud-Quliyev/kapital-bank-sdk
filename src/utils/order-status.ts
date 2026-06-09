import { OrderDetails } from "../types/details";
import { OrderStatus } from "../types/enums";

type OrderWithStatus = Pick<OrderDetails, "status">;

export function isPreparing(
  order: OrderWithStatus
): boolean {
  return order.status === "Preparing";
}

export function isFullyPaid(
  order: OrderWithStatus
): boolean {
  return order.status === "FullyPaid";
}

export function isDeclined(
  order: OrderWithStatus
): boolean {
  return order.status === "Declined";
}

export function isExpired(
  order: OrderWithStatus
): boolean {
  return order.status === "Expired";
}

export function isRefunded(
  order: OrderWithStatus
): boolean {
  return order.status === "Refunded";
}

export function isReversed(
  order: OrderWithStatus
): boolean {
  return order.status === "Reversed";
}

export function isTerminalStatus(
  status: OrderStatus
): boolean {
  return (
    status === "FullyPaid" ||
    status === "Declined" ||
    status === "Expired" ||
    status === "Refunded" ||
    status === "Reversed"
  );
}
