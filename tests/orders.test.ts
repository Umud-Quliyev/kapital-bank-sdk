import { describe, it, expect, beforeEach, vi } from "vitest";

const httpMocks = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => httpMocks),
    isAxiosError: (error: unknown) =>
      Boolean(
        error &&
          typeof error === "object" &&
          "isAxiosError" in error &&
          (error as { isAxiosError: boolean }).isAxiosError
      ),
  },
  isAxiosError: (error: unknown) =>
    Boolean(
      error &&
        typeof error === "object" &&
        "isAxiosError" in error &&
        (error as { isAxiosError: boolean }).isAxiosError
    ),
}));

import { KapitalBank } from "../src";
import { ENDPOINTS } from "../src/constants/endpoints";

describe("OrdersService", () => {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
  });

  beforeEach(() => {
    httpMocks.post.mockReset();
    httpMocks.get.mockReset();
  });

  it("should create an order", async () => {
    httpMocks.post.mockResolvedValue({
      data: {
        order: {
          id: 123456,
          hppUrl: "https://txpgtst.kapitalbank.az/flex",
          password: "order-password",
          secret: "order-secret",
          status: "Preparing",
          cvv2AuthStatus: "Required",
        },
      },
    });

    const order = await kb.createOrder({
      typeRid: "Order_SMS",
      amount: "100",
      currency: "AZN",
      language: "az",
      description: "Test order",
    });

    expect(httpMocks.post).toHaveBeenCalledWith(
      ENDPOINTS.CREATE_ORDER,
      {
        order: {
          typeRid: "Order_SMS",
          amount: "100",
          currency: "AZN",
          language: "az",
          description: "Test order",
        },
      }
    );
    expect(order.id).toBe(123456);
    expect(order.status).toBe("Preparing");
  });

  it("should apply configured defaults when creating an order", async () => {
    const kbWithDefaults = new KapitalBank({
      username: "TerminalSys/kapital",
      password: "kapital123",
      environment: "test",
      defaults: {
        typeRid: "Order_SMS",
        currency: "AZN",
        language: "az",
        hppRedirectUrl: "https://example.com/callback",
      },
    });

    httpMocks.post.mockResolvedValue({
      data: {
        order: {
          id: 123457,
          hppUrl: "https://txpgtst.kapitalbank.az/flex",
          password: "order-password",
          secret: "order-secret",
          status: "Preparing",
          cvv2AuthStatus: "Required",
        },
      },
    });

    await kbWithDefaults.createOrder({
      amount: "100",
      description: "Test order",
    });

    expect(httpMocks.post).toHaveBeenCalledWith(
      ENDPOINTS.CREATE_ORDER,
      {
        order: {
          typeRid: "Order_SMS",
          amount: "100",
          description: "Test order",
          currency: "AZN",
          language: "az",
          hppRedirectUrl: "https://example.com/callback",
        },
      }
    );
  });
});
