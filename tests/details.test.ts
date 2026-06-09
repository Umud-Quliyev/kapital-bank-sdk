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

describe("DetailsService", () => {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
  });

  beforeEach(() => {
    httpMocks.post.mockReset();
    httpMocks.get.mockReset();
  });

  it("should get order details", async () => {
    httpMocks.get.mockResolvedValue({
      data: {
        order: {
          id: 123456,
          status: "FullyPaid",
          amount: 100,
          currency: "AZN",
          createTime: "2026-06-09T12:00:00Z",
        },
      },
    });

    const details = await kb.getOrder(123456);

    expect(httpMocks.get).toHaveBeenCalledWith(
      ENDPOINTS.GET_ORDER(123456),
      {
        params: undefined,
      }
    );
    expect(details.id).toBe(123456);
    expect(details.status).toBe("FullyPaid");
  });

  it("should pass query options when getting order details", async () => {
    httpMocks.get.mockResolvedValue({
      data: {
        order: {
          id: 123456,
          status: "FullyPaid",
          amount: 100,
          currency: "AZN",
          createTime: "2026-06-09T12:00:00Z",
        },
      },
    });

    await kb.getOrder(123456, {
      password: "order-password",
      tranDetailLevel: 2,
    });

    expect(httpMocks.get).toHaveBeenCalledWith(
      ENDPOINTS.GET_ORDER(123456),
      {
        params: {
          password: "order-password",
          tranDetailLevel: 2,
        },
      }
    );
  });
});
