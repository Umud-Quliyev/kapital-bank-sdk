import { KapitalBankClient } from "./client/KapitalBankClient";
import { KapitalBankConfig } from "./types/config";
import { OrdersService } from "./services/orders.service";
import {
  CreateOrderRequest,
  CreateOrderResponse,
} from "./types/order";
import { DetailsService } from "./services/details.service";
import {
  GetOrderDetailsOptions,
  OrderDetails,
} from "./types/details";

export class KapitalBank {
  private readonly ordersService: OrdersService;
  private readonly detailsService: DetailsService;

  constructor(config: KapitalBankConfig) {
    const client = new KapitalBankClient(config);

    this.ordersService = new OrdersService(client);
    this.detailsService = new DetailsService(client);
  }

  async createOrder(
    payload: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    return this.ordersService.createOrder(payload);
  }

  async getOrder(
    id: number | string,
    options?: GetOrderDetailsOptions
  ): Promise<OrderDetails> {
    return this.detailsService.getOrder(
      id,
      options
    );
  }
}
