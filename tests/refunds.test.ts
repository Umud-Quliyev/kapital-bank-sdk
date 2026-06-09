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

describe("RefundsService", () => {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
  });

  beforeEach(() => {
    httpMocks.post.mockReset();
    httpMocks.get.mockReset();
  });

  it("should create a refund", async () => {
    httpMocks.post.mockResolvedValue({
      data: {
        tran: {
          approvalCode: "007696",
          pmoResultCode: "1",
        },
      },
    });

    const refund = await kb.refund(123456, {
      phase: "Single",
      amount: "50",
      type: "Refund",
    });

    expect(httpMocks.post).toHaveBeenCalledWith(
      ENDPOINTS.EXEC_TRAN(123456),
      {
        tran: {
          phase: "Single",
          amount: "50",
          type: "Refund",
        },
      }
    );
    expect(refund.approvalCode).toBe("007696");
    expect(refund.pmoResultCode).toBe("1");
  });
});
