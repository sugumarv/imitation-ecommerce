import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay/verify-webhook";
import { razorpayPaymentCapturedSchema } from "@/lib/validations/razorpay-webhook";

export const runtime = "nodejs";

/**
 * Razorpay webhook endpoint.
 * Verifies `x-razorpay-signature`, handles `payment.captured`, and marks orders PAID idempotently.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET is not set");
    // Still acknowledge so Razorpay does not retry forever on misconfiguration noise.
    return NextResponse.json(
      { received: true, ignored: true, reason: "webhook_not_configured" },
      { status: 200 },
    );
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json(
      { code: "MISSING_SIGNATURE", message: "Missing x-razorpay-signature." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();

  const isValid = verifyRazorpayWebhookSignature(
    rawBody,
    signature,
    webhookSecret,
  );

  if (!isValid) {
    console.warn("[razorpay-webhook] invalid signature");
    return NextResponse.json(
      { code: "INVALID_SIGNATURE", message: "Webhook signature mismatch." },
      { status: 400 },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    // Signature was valid but body is unusable — acknowledge to avoid retry storms.
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const eventName =
    typeof payload === "object" &&
    payload !== null &&
    "event" in payload &&
    typeof payload.event === "string"
      ? payload.event
      : null;

  // Only payment.captured updates order status; acknowledge everything else with 200.
  if (eventName !== "payment.captured") {
    return NextResponse.json(
      { received: true, ignored: true, event: eventName },
      { status: 200 },
    );
  }

  const parsed = razorpayPaymentCapturedSchema.safeParse(payload);
  if (!parsed.success) {
    console.error(
      "[razorpay-webhook] invalid payment.captured payload",
      parsed.error.flatten(),
    );
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const payment = parsed.data.payload.payment.entity;
  const razorpayOrderId = payment.order_id;
  const razorpayPaymentId = payment.id;

  try {
    const db = getDb();
    const [existing] = await db
      .select({
        id: orders.id,
        status: orders.status,
        razorpayPaymentId: orders.razorpayPaymentId,
      })
      .from(orders)
      .where(eq(orders.razorpayOrderId, razorpayOrderId))
      .limit(1);

    if (!existing) {
      console.error(
        "[razorpay-webhook] order not found for razorpay order",
        razorpayOrderId,
      );
      // Acknowledge so Razorpay stops retrying; ops can reconcile from logs.
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Idempotency: never re-process an already-paid order.
    if (existing.status === "PAID") {
      return NextResponse.json(
        { received: true, alreadyPaid: true },
        { status: 200 },
      );
    }

    await db
      .update(orders)
      .set({
        status: "PAID",
        razorpayPaymentId,
        paidAt: new Date(),
      })
      .where(eq(orders.id, existing.id));

    return NextResponse.json({ received: true, paid: true }, { status: 200 });
  } catch (error) {
    console.error("[razorpay-webhook] database error", error);
    // Non-2xx lets Razorpay retry; idempotent PAID check prevents double updates.
    return NextResponse.json(
      { code: "DATABASE_ERROR", message: "Failed to update order status." },
      { status: 500 },
    );
  }
}
