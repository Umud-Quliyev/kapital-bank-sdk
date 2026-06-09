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
import { encodeGooglePayToken } from "../src/utils/google-pay-token";

const orderResponse = {
  id: 29575,
  hppUrl: "https://txpgtst.kapitalbank.az/flex",
  password: "113bl56jgrz5l",
  secret: "513391",
  status: "Preparing" as const,
  cvv2AuthStatus: "Required" as const,
};

const tokenResponse = {
  status: "Preparing",
  cvv2AuthStatus: "IneligibleOrder",
  srcToken: {
    id: 23516,
    paymentMethod: "GooglePay" as const,
    role: "Src",
    status: "Active",
    regTime: "2024-11-15 10:58:36",
    displayName: "411111******1111",
    card: {
      expiration: "1226",
      brand: "Visa" as const,
    },
  },
};

const tranResponse = {
  approvalCode: "053703",
  pmoResultCode: "1",
};

describe("setGooglePayToken", () => {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
  });

  beforeEach(() => {
    httpMocks.post.mockReset();
    httpMocks.get.mockReset();
    httpMocks.post.mockResolvedValue({
      data: { order: tokenResponse },
    });
  });

  it("sends googlePayBlock in set-src-token request", async () => {
    const googlePayBlock = "7B227369676E617475726522";

    const result = await kb.setGooglePayToken(
      29575,
      "113bl56jgrz5l",
      { googlePayBlock }
    );

    expect(httpMocks.post).toHaveBeenCalledWith(
      ENDPOINTS.SET_SRC_TOKEN(29575, "113bl56jgrz5l"),
      {
        token: { googlePayBlock },
      }
    );
    expect(result.srcToken?.paymentMethod).toBe(
      "GooglePay"
    );
  });
});

describe("payWithGooglePay", () => {
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
    httpMocks.post
      .mockResolvedValueOnce({
        data: { order: orderResponse },
      })
      .mockResolvedValueOnce({
        data: { order: tokenResponse },
      })
      .mockResolvedValueOnce({
        data: { tran: tranResponse },
      });
  });

  it("creates order, sets token, and executes transaction", async () => {
    const tokenJson = '{"signature":"test"}';
    const googlePayBlock =
      encodeGooglePayToken(tokenJson);

    const result = await kb.payWithGooglePay({
      amount: "1.0",
      description: "Testdesc",
      googlePayBlock,
    });

    expect(httpMocks.post).toHaveBeenNthCalledWith(
      1,
      ENDPOINTS.CREATE_ORDER,
      {
        order: {
          typeRid: "GSMS",
          amount: "1.0",
          description: "Testdesc",
          currency: "AZN",
          language: "az",
        },
      }
    );
    expect(httpMocks.post).toHaveBeenNthCalledWith(
      2,
      ENDPOINTS.SET_SRC_TOKEN(
        29575,
        "113bl56jgrz5l"
      ),
      {
        token: { googlePayBlock },
      }
    );
    expect(httpMocks.post).toHaveBeenNthCalledWith(
      3,
      ENDPOINTS.EXEC_TRAN(29575),
      {
        tran: { phase: "Single" },
      }
    );
    expect(result.orderId).toBe(29575);
    expect(result.transaction.approvalCode).toBe(
      "053703"
    );
  });
});

describe("encodeGooglePayToken", () => {
  it("encodes UTF-8 JSON to hex", () => {
    expect(
      encodeGooglePayToken('{"a":1}')
    ).toBe("7b2261223a317d");
  });
});
