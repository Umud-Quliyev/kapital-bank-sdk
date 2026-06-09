const LOG_PREFIX = "[KapitalBank]";

const SENSITIVE_QUERY_KEYS = new Set([
  "password",
  "pan",
  "cvv",
  "cvv2",
  "token",
  "authorization",
  "secret",
]);

const SENSITIVE_BODY_KEYS = new Set([
  "password",
  "pan",
  "cvv",
  "cvv2",
  "token",
  "authorization",
  "secret",
  "storedId",
  "ridByCofp",
  "displayName",
]);

const REDACTED = "[REDACTED]";

export function sanitizeLogPath(
  path: string
): string {
  const [pathname, queryString] =
    path.split("?", 2);

  if (!queryString) {
    return pathname;
  }

  const sanitizedQuery = queryString
    .split("&")
    .map((pair) => {
      const separatorIndex =
        pair.indexOf("=");

      if (separatorIndex === -1) {
        return pair;
      }

      const key = pair
        .slice(0, separatorIndex)
        .toLowerCase();

      if (SENSITIVE_QUERY_KEYS.has(key)) {
        return `${pair.slice(0, separatorIndex)}=${REDACTED}`;
      }

      return pair;
    })
    .join("&");

  return `${pathname}?${sanitizedQuery}`;
}

export function sanitizeLogData(
  value: unknown
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeLogData);
  }

  if (typeof value !== "object") {
    return value;
  }

  const sanitized: Record<string, unknown> =
    {};

  for (const [key, nested] of Object.entries(
    value as Record<string, unknown>
  )) {
    if (
      SENSITIVE_BODY_KEYS.has(
        key.toLowerCase()
      )
    ) {
      sanitized[key] = REDACTED;
      continue;
    }

    sanitized[key] = sanitizeLogData(nested);
  }

  return sanitized;
}

export function logRequest(
  method: string,
  path: string
): void {
  const sanitizedPath =
    sanitizeLogPath(path);

  console.log(
    `${LOG_PREFIX}\n${method} ${sanitizedPath}`
  );
}
