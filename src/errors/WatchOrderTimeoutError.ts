export class WatchOrderTimeoutError
  extends Error {
  constructor(
    timeout: number
  ) {
    super(
      `Order monitoring timeout exceeded (${timeout}ms)`
    );

    this.name =
      "WatchOrderTimeoutError";
  }
}