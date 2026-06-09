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
import { KapitalBankError } from "../src/errors/KapitalBankError";

const preparingOrder = {
  id: 233266,
  status: "Preparing" as const,
  amount: 10,
  currency: "AZN" as const,
  createTime: "2026-06-09T12:00:00Z",
  hppUrl: "https://txpgtst.kapitalbank.az/flex",
  password: "order-password",
};

describe("restoreOrder", () => {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
  });

  beforeEach(() => {
    httpMocks.get.mockReset();
  });

  it("returns payment session for preparing orders", async () => {
    httpMocks.get.mockResolvedValue({
      data: { order: preparingOrder },
    });

    const session = await kb.restoreOrder(
      233266,
      "order-password"
    );

    expect(session).toEqual({
      orderId: 233266,
      password: "order-password",
      paymentUrl:
        "https://txpgtst.kapitalbank.az/flex?id=233266&password=order-password",
      order: preparingOrder,
    });
  });

  it("throws when order is not preparing", async () => {
    httpMocks.get.mockResolvedValue({
      data: {
        order: {
          ...preparingOrder,
          status: "FullyPaid",
        },
      },
    });

    await expect(
      kb.restoreOrder(233266, "order-password")
    ).rejects.toSatisfy((error: unknown) => {
      return (
        error instanceof KapitalBankError &&
        error.isInvalidOrderState()
      );
    });
  });

  it("emits payment:created", async () => {
    httpMocks.get.mockResolvedValue({
      data: { order: preparingOrder },
    });

    const handler = vi.fn();
    kb.on("payment:created", handler);

    const session = await kb.restoreOrder(
      233266,
      "order-password"
    );

    expect(handler).toHaveBeenCalledWith(session);
  });
});
