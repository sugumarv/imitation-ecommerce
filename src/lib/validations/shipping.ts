import { z } from "zod";

export const shippingDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  addressLine1: z
    .string()
    .trim()
    .min(5, "Enter your address")
    .max(120, "Address is too long"),
  addressLine2: z.string().trim().max(120, "Address is too long"),
  city: z.string().trim().min(2, "Enter your city").max(60, "City is too long"),
  state: z
    .string()
    .trim()
    .min(2, "Enter your state")
    .max(60, "State is too long"),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

export type ShippingDetails = z.infer<typeof shippingDetailsSchema>;
