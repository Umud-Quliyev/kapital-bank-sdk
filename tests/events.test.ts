import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { EventEmitter } from "node:events";

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
import { WatchOrderTimeoutError } from "../src/errors/WatchOrderTimeoutError";

const paidOrder = {
  id: 233266,
  status: "FullyPaid" as const,
  amount: 10,
  currency: "AZN" as const,
  createTime: "2026-06-09T12:00:00Z",
};

describe("KapitalBank events", () => {
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
  });

  beforeEach(() => {
    httpMocks.post.mockReset();
    httpMocks.get.mockReset();
  });

  it("emits payment:paid when waitForPayment resolves as paid", async () => {
    httpMocks.get.mockResolvedValue({
      data: { order: paidOrder },
    });

    const paidHandler = vi.fn();
    const statusHandler = vi.fn();

    kb.on("payment:paid", paidHandler);
    kb.on("payment:status", statusHandler);

    await kb.waitForPayment(233266, {
      password: "order-password",
    });

    expect(paidHandler).toHaveBeenCalledWith(paidOrder);
    expect(statusHandler).toHaveBeenCalledWith(paidOrder);
  });

  it("emits payment:declined when order is declined", async () => {
    const declinedOrder = {
      ...paidOrder,
      status: "Declined" as const,
    };

    httpMocks.get.mockResolvedValue({
      data: { order: declinedOrder },
    });

    const declinedHandler = vi.fn();
    kb.on("payment:declined", declinedHandler);

    await kb.waitForPayment(233266);

    expect(declinedHandler).toHaveBeenCalledWith(declinedOrder);
  });
});

function totalListenerCount(
  emitter: EventEmitter
): number {
  return emitter
    .eventNames()
    .reduce(
      (sum, event) =>
        sum +
        emitter.listenerCount(event),
      0
    );
}

describe("EventEmitter listener cleanup", () => {
  const config = {
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test" as const,
  };

  const pendingOrder = {
    id: 233266,
    status: "Preparing" as const,
    amount: 10,
    currency: "AZN" as const,
    createTime: "2026-06-09T12:00:00Z",
  };

  const paidOrder = {
    id: 233266,
    status: "FullyPaid" as const,
    amount: 10,
    currency: "AZN" as const,
    createTime: "2026-06-09T12:00:00Z",
  };

  beforeEach(() => {
    httpMocks.post.mockReset();
    httpMocks.get.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not register internal listeners during repeated watchOrder calls", async () => {
    const kb = new KapitalBank(config);
    const onSpy = vi.spyOn(kb, "on");

    httpMocks.get.mockResolvedValue({
      data: { order: paidOrder },
    });

    for (let i = 0; i < 50; i++) {
      await kb.watchOrder(233266);
    }

    expect(onSpy).not.toHaveBeenCalled();
    expect(totalListenerCount(kb)).toBe(0);
    onSpy.mockRestore();
  });

  it("does not register internal listeners during repeated waitForPayment calls", async () => {
    const kb = new KapitalBank(config);
    const onSpy = vi.spyOn(kb, "on");

    httpMocks.get.mockResolvedValue({
      data: { order: paidOrder },
    });

    for (let i = 0; i < 50; i++) {
      await kb.waitForPayment(233266);
    }

    expect(onSpy).not.toHaveBeenCalled();
    expect(totalListenerCount(kb)).toBe(0);
    onSpy.mockRestore();
  });

  it("keeps user listener count stable across repeated waitForPayment calls", async () => {
    const kb = new KapitalBank(config);
    const paidHandler = vi.fn();
    const statusHandler = vi.fn();

    kb.on("payment:paid", paidHandler);
    kb.on("payment:status", statusHandler);

    const initialPaidCount =
      kb.listenerCount("payment:paid");
    const initialStatusCount =
      kb.listenerCount("payment:status");

    httpMocks.get.mockResolvedValue({
      data: { order: paidOrder },
    });

    for (let i = 0; i < 100; i++) {
      await kb.waitForPayment(233266);
    }

    expect(
      kb.listenerCount("payment:paid")
    ).toBe(initialPaidCount);
    expect(
      kb.listenerCount("payment:status")
    ).toBe(initialStatusCount);
    expect(totalListenerCount(kb)).toBe(
      initialPaidCount + initialStatusCount
    );

    kb.off("payment:paid", paidHandler);
    kb.off("payment:status", statusHandler);
  });

  it("does not add listeners after watchOrder timeout", async () => {
    vi.useFakeTimers();

    const kb = new KapitalBank(config);
    const onSpy = vi.spyOn(kb, "on");

    httpMocks.get.mockResolvedValue({
      data: { order: pendingOrder },
    });

    const watchPromise = kb.watchOrder(
      233266,
      {
        interval: 1000,
        timeout: 2000,
      }
    );

    const rejection = expect(
      watchPromise
    ).rejects.toBeInstanceOf(
      WatchOrderTimeoutError
    );

    await vi.runAllTimersAsync();
    await rejection;

    expect(onSpy).not.toHaveBeenCalled();
    expect(totalListenerCount(kb)).toBe(0);
    onSpy.mockRestore();
  });

  it("does not add listeners during polled watchOrder cycles", async () => {
    vi.useFakeTimers();

    const kb = new KapitalBank(config);
    const onSpy = vi.spyOn(kb, "on");

    httpMocks.get
      .mockResolvedValueOnce({
        data: { order: pendingOrder },
      })
      .mockResolvedValueOnce({
        data: { order: pendingOrder },
      })
      .mockResolvedValue({
        data: { order: paidOrder },
      });

    const watchPromise = kb.watchOrder(
      233266,
      { interval: 5000 }
    );

    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(5000);
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(5000);

    await expect(watchPromise).resolves.toEqual(
      paidOrder
    );

    expect(onSpy).not.toHaveBeenCalled();
    expect(totalListenerCount(kb)).toBe(0);
    onSpy.mockRestore();
  });

  it("does not accumulate listeners across concurrent watchOrder calls", async () => {
    const kb = new KapitalBank(config);
    const onSpy = vi.spyOn(kb, "on");

    httpMocks.get.mockImplementation(
      async (url: string) => {
        const orderId = Number(
          url.split("/").pop()
        );

        return {
          data: {
            order: {
              ...paidOrder,
              id: orderId,
            },
          },
        };
      }
    );

    await Promise.all([
      kb.watchOrder(1),
      kb.watchOrder(2),
      kb.watchOrder(3),
    ]);

    expect(onSpy).not.toHaveBeenCalled();
    expect(totalListenerCount(kb)).toBe(0);
    onSpy.mockRestore();
  });

  it("does not register internal listeners during repeated waitForStatus calls", async () => {
    const kb = new KapitalBank(config);
    const onSpy = vi.spyOn(kb, "on");

    httpMocks.get.mockResolvedValue({
      data: { order: paidOrder },
    });

    for (let i = 0; i < 50; i++) {
      await kb.waitForStatus(
        233266,
        "FullyPaid"
      );
    }

    expect(onSpy).not.toHaveBeenCalled();
    expect(totalListenerCount(kb)).toBe(0);
    onSpy.mockRestore();
  });
});
