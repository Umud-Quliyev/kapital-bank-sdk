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

const orderResponse = {
  id: 233266,
  hppUrl: "https://txpgtst.kapitalbank.az/flex",
  password: "order-password",
  secret: "order-secret",
  status: "Preparing" as const,
  cvv2AuthStatus: "Required" as const,
};

describe("createHostedPayment", () => {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
    defaults: {
      currency: "AZN",
      language: "az",
      hppRedirectUrl: "https://example.com/callback",
    },
  });

  beforeEach(() => {
    httpMocks.post.mockReset();
    httpMocks.get.mockReset();
    httpMocks.post.mockResolvedValue({
      data: { order: orderResponse },
    });
  });

  it("returns orderId, password, paymentUrl, and order", async () => {
    const session = await kb.createHostedPayment({
      amount: "10",
      description: "Order",
    });

    expect(session).toEqual({
      orderId: 233266,
      password: "order-password",
      paymentUrl:
        "https://txpgtst.kapitalbank.az/flex?id=233266&password=order-password",
      order: orderResponse,
    });
  });

  it("emits payment:created", async () => {
    const handler = vi.fn();
    kb.on("payment:created", handler);

    const session = await kb.createHostedPayment({
      amount: "10",
      description: "Order",
    });

    expect(handler).toHaveBeenCalledWith(session);
  });
});
