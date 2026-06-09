import { KapitalBankClient } from "../client/KapitalBankClient";

import { DetailsService } from "./details.service";

import { OrderDetails } from "../types/details";

import {
  WatchOrderOptions,
} from "../types/payment-monitor";

import { WatchOrderTimeoutError }
  from "../errors/WatchOrderTimeoutError";

import { OrderStatus }
  from "../types/enums";

export class PaymentMonitorService {
  private readonly detailsService: DetailsService;

  constructor(
    client: KapitalBankClient
  ) {
    this.detailsService =
      new DetailsService(client);
  }

  async watchOrder(
    orderId: number | string,
    options: WatchOrderOptions = {}
  ): Promise<OrderDetails> {
    const {
      interval = 5000,
      timeout = 300000,
      password,
      onStatusChange,
      stopStatuses = [
        "FullyPaid",
        "Declined",
        "Expired",
        "Refunded",
        "Reversed",
      ],
    } = options;

    const startedAt =
      Date.now();

    while (true) {
      const order =
        await this.detailsService
          .getOrder(
            orderId,
            password
              ? {
                  password,
                  tranDetailLevel: 2,
                  tokenDetailLevel: 2,
                  orderDetailLevel: 2,
                }
              : undefined
          );

      onStatusChange?.(order);

      if (
        stopStatuses.includes(
          order.status
        )
      ) {
        return order;
      }

      const elapsed =
        Date.now() -
        startedAt;

      if (
        elapsed >= timeout
      ) {
        throw new WatchOrderTimeoutError(
          timeout
        );
      }

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            interval
          )
      );
    }
  }

  async waitForPayment(
    orderId: number | string,
    options: WatchOrderOptions = {}
  ): Promise<OrderDetails> {
    return this.watchOrder(
      orderId,
      {
        ...options,
        stopStatuses: [
          "FullyPaid",
          "Declined",
          "Expired",
        ],
      }
    );
  }

  async waitForStatus(
    orderId: number | string,
    status: OrderStatus,
    options: WatchOrderOptions = {}
  ): Promise<OrderDetails> {
    return this.watchOrder(
      orderId,
      {
        ...options,
        stopStatuses: [status],
      }
    );
  }
}