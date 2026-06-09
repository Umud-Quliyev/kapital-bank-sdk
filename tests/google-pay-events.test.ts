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

const paidDetails = {
  id: 233302,
  status: "FullyPaid" as const,
  amount: 10,
  currency: "AZN" as const,
  createTime: "2026-06-09T12:00:00Z",
  type: {
    title: "Google Pay Purchase",
    rid: "GSMS",
  },
  srcToken: {
    id: 1,
    paymentMethod: "GooglePay" as const,
  },
};

const declinedDetails = {
  ...paidDetails,
  status: "Declined" as const,
};

const expiredDetails = {
  ...paidDetails,
  status: "Expired" as const,
};

describe("Google Pay payment events", () => {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
    defaults: {
      currency: "AZN",
      language: "az",
    },
  });

  beforeEach(() => {
    httpMocks.post.mockReset();
    httpMocks.get.mockReset();
  });

  it("emits payment:paid when Google Pay order is paid", async () => {
    httpMocks.get.mockResolvedValue({
      data: { order: paidDetails },
    });

    const paidHandler = vi.fn();
    const statusHandler = vi.fn();

    kb.on("payment:paid", paidHandler);
    kb.on("payment:status", statusHandler);

    await kb.waitForPayment(233302, {
      password: "gp-events-password",
    });

    expect(paidHandler).toHaveBeenCalledWith(paidDetails);
    expect(statusHandler).toHaveBeenCalledWith(paidDetails);
  });

  it("emits payment:declined for declined Google Pay orders", async () => {
    httpMocks.get.mockResolvedValue({
      data: { order: declinedDetails },
    });

    const declinedHandler = vi.fn();
    kb.on("payment:declined", declinedHandler);

    await kb.waitForPayment(233302);

    expect(declinedHandler).toHaveBeenCalledWith(declinedDetails);
  });

  it("emits payment:expired for expired Google Pay orders", async () => {
    httpMocks.get.mockResolvedValue({
      data: { order: expiredDetails },
    });

    const expiredHandler = vi.fn();
    kb.on("payment:expired", expiredHandler);

    await kb.waitForPayment(233302);

    expect(expiredHandler).toHaveBeenCalledWith(expiredDetails);
  });

  it("watchOrder works for Google Pay orders", async () => {
    httpMocks.get.mockResolvedValue({
      data: { order: paidDetails },
    });

    const result = await kb.watchOrder(233302, {
      password: "gp-events-password",
    });

    expect(result.status).toBe("FullyPaid");
  });
});
