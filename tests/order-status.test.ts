import { describe, it, expect } from "vitest";

import {
  isPreparing,
  isFullyPaid,
  isDeclined,
  isExpired,
  isRefunded,
  isReversed,
  isTerminalStatus,
} from "../src/utils/order-status";

describe("order status helpers", () => {
  it("detects preparing status", () => {
    expect(
      isPreparing({ status: "Preparing" })
    ).toBe(true);
    expect(
      isPreparing({ status: "FullyPaid" })
    ).toBe(false);
  });

  it("detects fully paid status", () => {
    expect(
      isFullyPaid({ status: "FullyPaid" })
    ).toBe(true);
    expect(
      isFullyPaid({ status: "Preparing" })
    ).toBe(false);
  });

  it("detects declined status", () => {
    expect(
      isDeclined({ status: "Declined" })
    ).toBe(true);
  });

  it("detects expired status", () => {
    expect(
      isExpired({ status: "Expired" })
    ).toBe(true);
  });

  it("detects refunded status", () => {
    expect(
      isRefunded({ status: "Refunded" })
    ).toBe(true);
  });

  it("detects reversed status", () => {
    expect(
      isReversed({ status: "Reversed" })
    ).toBe(true);
  });

  it("detects terminal statuses", () => {
    expect(
      isTerminalStatus("FullyPaid")
    ).toBe(true);
    expect(
      isTerminalStatus("Preparing")
    ).toBe(false);
  });
});
