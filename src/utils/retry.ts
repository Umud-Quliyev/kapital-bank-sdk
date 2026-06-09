export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
  onRetry?: (attempt: number, error: Error) => void;
}

export interface RetryResult<T> {
  data: T;
  attempts: number;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    retryableErrors = [],
    onRetry,
  } = options;

  if (maxAttempts <= 0 || maxAttempts > 10) {
    throw new Error("maxAttempts must be between 1 and 10");
  }

  if (initialDelay < 0) {
    throw new Error("initialDelay must be non-negative");
  }

  if (maxDelay < 0) {
    throw new Error("maxDelay must be non-negative");
  }

  if (backoffMultiplier <= 1) {
    throw new Error("backoffMultiplier must be greater than 1");
  }

  let lastError: Error | undefined;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const data = await fn();
      return { data, attempts: attempt };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      const isRetryable =
        retryableErrors.length === 0 ||
        retryableErrors.some((code) =>
          lastError!.message.includes(code)
        );

      if (!isRetryable || attempt === maxAttempts) {
        throw lastError;
      }

      if (onRetry) {
        onRetry(attempt, lastError);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));

      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
}
