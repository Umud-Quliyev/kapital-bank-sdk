import { describe, it, expect, beforeEach, vi } from "vitest";

const httpMocks = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
  request: vi.fn(),
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

describe("KapitalBank.request", () => {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
  });

  beforeEach(() => {
    httpMocks.request.mockReset();
  });

  it("reuses SDK auth and base URL via axios instance", async () => {
    httpMocks.request.mockResolvedValue({
      data: { ok: true },
    });

    const result = await kb.request<{ ok: boolean }>(
      "POST",
      "/custom-endpoint",
      { foo: "bar" }
    );

    expect(httpMocks.request).toHaveBeenCalledWith({
      method: "POST",
      url: "/custom-endpoint",
      data: { foo: "bar" },
      params: undefined,
      headers: undefined,
    });
    expect(result).toEqual({ ok: true });
  });

  it("supports query params and custom headers", async () => {
    httpMocks.request.mockResolvedValue({
      data: { id: 1 },
    });

    await kb.request(
      "GET",
      "/order/123",
      undefined,
      {
        params: { password: "secret" },
        headers: { "X-Custom": "1" },
      }
    );

    expect(httpMocks.request).toHaveBeenCalledWith({
      method: "GET",
      url: "/order/123",
      data: undefined,
      params: { password: "secret" },
      headers: { "X-Custom": "1" },
    });
  });
});
