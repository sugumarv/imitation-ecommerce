import { inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

import { apiError, validationError } from "@/lib/api/errors";
import { getDb } from "@/lib/db";
import { orders, variants } from "@/lib/db/schema";
import { getRazorpayClient } from "@/lib/razorpay/client";
import {
  createOrderRequestSchema,
  type CreateOrderResponse,
} from "@/lib/validations/checkout";

export const runtime = "nodejs";

type VariantRow = {
  id: string;
  sku: string;
  pricePaise: number;
  inventoryCount: number;
  isActive: boolean;
};

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError(400, "INVALID_JSON", "Request body must be valid JSON.");
    }

    const parsed = createOrderRequestSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const { items } = parsed.data;
    const itemIds = items.map((item) => item.id);
    const quantityById = new Map(
      items.map((item) => [item.id, item.quantity] as const),
    );

    let dbVariants: VariantRow[];
    try {
      const db = getDb();
      dbVariants = await db
        .select({
          id: variants.id,
          sku: variants.sku,
          pricePaise: variants.pricePaise,
          inventoryCount: variants.inventoryCount,
          isActive: variants.isActive,
        })
        .from(variants)
        .where(inArray(variants.id, itemIds));
    } catch (error) {
      console.error("[create-order] database error", error);
      return apiError(
        503,
        "DATABASE_UNAVAILABLE",
        "Unable to fetch product prices. Please try again shortly.",
      );
    }

    if (dbVariants.length !== itemIds.length) {
      const foundIds = new Set(dbVariants.map((variant) => variant.id));
      const missingId = itemIds.find((id) => !foundIds.has(id));
      return apiError(
        404,
        "VARIANT_NOT_FOUND",
        missingId
          ? `Variant ${missingId} was not found.`
          : "One or more variants were not found.",
      );
    }

    let amountPaise = 0;

    for (const variant of dbVariants) {
      const quantity = quantityById.get(variant.id) ?? 0;

      if (!variant.isActive) {
        return apiError(
          409,
          "VARIANT_INACTIVE",
          `Variant ${variant.sku} is no longer available.`,
        );
      }

      if (variant.inventoryCount < quantity) {
        return apiError(
          409,
          "INSUFFICIENT_INVENTORY",
          `Insufficient stock for ${variant.sku}. Requested ${quantity}, available ${variant.inventoryCount}.`,
        );
      }

      if (variant.pricePaise <= 0) {
        return apiError(
          500,
          "INVALID_PRICE",
          `Variant ${variant.sku} has an invalid price configuration.`,
        );
      }

      amountPaise += variant.pricePaise * quantity;
    }

    if (amountPaise <= 0) {
      return apiError(
        400,
        "INVALID_AMOUNT",
        "Order total must be greater than zero.",
      );
    }

    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (error) {
      console.error("[create-order] razorpay config error", error);
      return apiError(
        503,
        "PAYMENT_UNAVAILABLE",
        "Payment service is not configured.",
      );
    }

    try {
      const order = await razorpay.orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt: `aurelia_${Date.now()}`.slice(0, 40),
        notes: {
          item_count: items.length,
          source: "aurelia_storefront",
        },
      });

      const amount =
        typeof order.amount === "string"
          ? Number.parseInt(order.amount, 10)
          : order.amount;

      if (!order.id || !Number.isFinite(amount) || amount <= 0) {
        return apiError(
          502,
          "PAYMENT_PROVIDER_ERROR",
          "Razorpay returned an incomplete order response.",
        );
      }

      try {
        const db = getDb();
        await db.insert(orders).values({
          razorpayOrderId: order.id,
          status: "PENDING",
          amountPaise: amount,
          currency: "INR",
        });
      } catch (error) {
        console.error("[create-order] failed to persist order", error);
        return apiError(
          500,
          "ORDER_PERSIST_FAILED",
          "Payment order was created but could not be saved. Please contact support.",
        );
      }

      const response: CreateOrderResponse = {
        orderId: order.id,
        amount,
        currency: "INR",
      };

      return NextResponse.json(response, { status: 201 });
    } catch (error) {
      console.error("[create-order] razorpay order error", error);
      return apiError(
        502,
        "PAYMENT_PROVIDER_ERROR",
        "Failed to create payment order. Please try again.",
      );
    }
  } catch (error) {
    console.error("[create-order] unexpected error", error);
    return apiError(
      500,
      "INTERNAL_ERROR",
      "An unexpected error occurred while creating the order.",
    );
  }
}
