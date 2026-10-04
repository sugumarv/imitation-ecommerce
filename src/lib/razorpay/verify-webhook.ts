import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies Razorpay webhook signatures with HMAC SHA256.
 * Signature = hex(HMAC_SHA256(webhook_secret, raw_request_body))
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  if (!signature || !secret) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}
