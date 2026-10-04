import { z } from "zod";

export const razorpayPaymentCapturedSchema = z.object({
  event: z.literal("payment.captured"),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string().min(1),
        order_id: z.string().min(1),
        amount: z.union([z.number(), z.string()]),
        currency: z.string().min(1),
        status: z.string().min(1),
      }),
    }),
  }),
});

export type RazorpayPaymentCapturedEvent = z.infer<
  typeof razorpayPaymentCapturedSchema
>;
