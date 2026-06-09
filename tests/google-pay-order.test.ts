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

const orderResponse = {
  id: 233300,
  hppUrl: "https://txpgtst.kapitalbank.az/flex",
  password: "gp-password",
  secret: "gp-secret",
  status: "Preparing" as const,
  cvv2AuthStatus: "Required" as const,
};

describe("createGooglePayOrder", () => {
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

  it("defaults to GSMS order type", async () => {
    const order = await kb.createGooglePayOrder({
      amount: "10",
      description: "Google Pay Test",
    });

    expect(httpMocks.post).toHaveBeenCalledWith(
      ENDPOINTS.CREATE_ORDER,
      {
        order: {
          typeRid: "GSMS",
          amount: "10",
          description: "Google Pay Test",
          currency: "AZN",
          language: "az",
          hppRedirectUrl: "https://example.com/callback",
        },
      }
    );
    expect(order.id).toBe(233300);
    expect(order.status).toBe("Preparing");
  });

  it("supports GN3D order type", async () => {
    await kb.createGooglePayOrder({
      typeRid: "GN3D",
      amount: "10",
      description: "Google Pay 3DS",
    });

    expect(httpMocks.post).toHaveBeenCalledWith(
      ENDPOINTS.CREATE_ORDER,
      expect.objectContaining({
        order: expect.objectContaining({
          typeRid: "GN3D",
        }),
      })
    );
  });

  it("uses configured googlePayOrderType default", async () => {
    const kbWithDefault = new KapitalBank({
      username: "TerminalSys/kapital",
      password: "kapital123",
      environment: "test",
      defaults: {
        googlePayOrderType: "GN3D",
        currency: "AZN",
        language: "az",
      },
    });

    await kbWithDefault.createGooglePayOrder({
      amount: "10",
      description: "Google Pay Test",
    });

    expect(httpMocks.post).toHaveBeenCalledWith(
      ENDPOINTS.CREATE_ORDER,
      expect.objectContaining({
        order: expect.objectContaining({
          typeRid: "GN3D",
        }),
      })
    );
  });

  it("emits order:created", async () => {
    const handler = vi.fn();
    kb.on("order:created", handler);

    const order = await kb.createGooglePayOrder({
      amount: "10",
      description: "Google Pay Test",
    });

    expect(handler).toHaveBeenCalledWith(order);
  });

  it("does not affect standard createOrder defaults", async () => {
    const kbMixed = new KapitalBank({
      username: "TerminalSys/kapital",
      password: "kapital123",
      environment: "test",
      defaults: {
        typeRid: "Order_SMS",
        googlePayOrderType: "GSMS",
        currency: "AZN",
        language: "az",
      },
    });

    await kbMixed.createOrder({
      amount: "1",
      description: "Card HPP",
    });

    expect(httpMocks.post).toHaveBeenLastCalledWith(
      ENDPOINTS.CREATE_ORDER,
      expect.objectContaining({
        order: expect.objectContaining({
          typeRid: "Order_SMS",
        }),
      })
    );
  });

  it("throws when currency is missing and not configured", async () => {
    const kbBare = new KapitalBank({
      username: "TerminalSys/kapital",
      password: "kapital123",
      environment: "test",
    });

    await expect(
      kbBare.createGooglePayOrder({
        amount: "10",
        description: "Google Pay Test",
      })
    ).rejects.toThrow("createOrder requires currency");
  });
});
