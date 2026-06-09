import { CreateOrderResponse }
  from "../types/order";

export function getPaymentUrl(
  order: Pick<
    CreateOrderResponse,
    "id" | "hppUrl" | "password"
  >
): string {
  return (
    `${order.hppUrl}` +
    `?id=${order.id}` +
    `&password=${order.password}`
  );
}