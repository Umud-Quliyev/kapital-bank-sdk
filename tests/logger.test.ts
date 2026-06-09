import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const httpMocks = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
    },
  },
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

import { KapitalBankClient } from "../src/client/KapitalBankClient";
import {
  logRequest,
  sanitizeLogPath,
  sanitizeLogData,
} from "../src/utils/logger";

describe("debug logger", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("logs requests in KapitalBank format", () => {
    logRequest("POST", "/order");

    expect(consoleSpy).toHaveBeenCalledWith(
      "[KapitalBank]\nPOST /order"
    );
  });

  it("attaches logging interceptors when logEnabled is true", () => {
    new KapitalBankClient({
      username: "TerminalSys/kapital",
      password: "kapital123",
      logEnabled: true,
    });

    expect(
      httpMocks.interceptors.request.use
    ).toHaveBeenCalled();
  });

  it("does not attach logging interceptors by default", () => {
    httpMocks.interceptors.request.use.mockClear();

    new KapitalBankClient({
      username: "TerminalSys/kapital",
      password: "kapital123",
    });

    expect(
      httpMocks.interceptors.request.use
    ).not.toHaveBeenCalled();
  });

  it("redacts sensitive query params from log paths", () => {
    expect(
      sanitizeLogPath(
        "/order/123/set-src-token?password=secret123"
      )
    ).toBe(
      "/order/123/set-src-token?password=[REDACTED]"
    );
  });

  it("redacts sensitive fields from log data", () => {
    expect(
      sanitizeLogData({
        order: {
          password: "secret",
          pan: "4169741330151778",
          amount: "10",
        },
      })
    ).toEqual({
      order: {
        password: "[REDACTED]",
        pan: "[REDACTED]",
        amount: "10",
      },
    });
  });

  it("never logs authorization headers or credentials in request logs", () => {
    logRequest(
      "POST",
      "/order/1/set-src-token?password=order-secret"
    );

    const logged = String(
      consoleSpy.mock.calls[0]?.[0]
    );

    expect(logged).not.toContain("order-secret");
    expect(logged).toContain("[REDACTED]");
    expect(logged).not.toMatch(/Basic\s+/i);
    expect(logged).not.toContain("kapital123");
  });
});
