import { KapitalBankClient } from "./client/KapitalBankClient";
import { KapitalBankConfig } from "./types/config";
import { OrdersService } from "./services/orders.service";
import {
  CreateOrderRequest,
  CreateOrderResponse,
} from "./types/order";

export class KapitalBank {
  private readonly ordersService: OrdersService;

  constructor(config: KapitalBankConfig) {
    const client = new KapitalBankClient(config);

    this.ordersService = new OrdersService(client);
  }

  async createOrder(
    payload: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    return this.ordersService.createOrder(payload);
  }
}