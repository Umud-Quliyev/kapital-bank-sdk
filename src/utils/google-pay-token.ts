export function encodeGooglePayToken(
  tokenJson: string
): string {
  return Buffer.from(tokenJson, "utf8").toString("hex");
}
