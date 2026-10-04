import { z } from "zod";

/**
 * Checkout line items reference variant IDs (SKU-level), never parent products.
 * Client-sent prices are intentionally omitted — the server recalculates totals.
 */
export const createOrderItemSchema = z.object({
  id: z.string().uuid("Item id must be a valid variant UUID"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

export const createOrderRequestSchema = z.object({
  items: z
    .array(createOrderItemSchema)
    .min(1, "At least one item is required")
    .superRefine((items, ctx) => {
      const seen = new Set<string>();
      for (const [index, item] of items.entries()) {
        if (seen.has(item.id)) {
          ctx.addIssue({
            code: "custom",
            message: "Duplicate item ids are not allowed",
            path: [index, "id"],
          });
        }
        seen.add(item.id);
      }
    }),
});

export const createOrderResponseSchema = z.object({
  orderId: z.string().min(1),
  amount: z.number().int().positive(),
  currency: z.literal("INR"),
});

export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
export type CreateOrderResponse = z.infer<typeof createOrderResponseSchema>;
