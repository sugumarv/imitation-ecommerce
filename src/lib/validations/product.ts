import { z } from "zod";

export const platingColorSchema = z.enum([
  "oxidized",
  "gold_plated",
  "rhodium",
  "rose_gold",
  "silver",
]);

export const stoneTypeSchema = z.enum([
  "ad",
  "kundan",
  "polki",
  "pearl",
  "meenakari",
  "none",
]);

export const productDimensionsSchema = z.object({
  lengthMm: z.number().positive(),
  widthMm: z.number().positive(),
  heightMm: z.number().nonnegative(),
});

export const categoryInputSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
  parentId: z.string().uuid().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const productInputSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2).max(160),
  slug: z
    .string()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(10).max(5000),
  material: z.string().min(2).max(120),
  weightGrams: z.number().int().positive(),
  careInstructions: z.string().min(10).max(2000),
  dimensions: productDimensionsSchema,
  imageUrls: z.array(z.string().url()).min(1),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const variantInputSchema = z.object({
  productId: z.string().uuid(),
  sku: z
    .string()
    .min(3)
    .max(64)
    .regex(/^[A-Z0-9-]+$/),
  platingColor: platingColorSchema,
  stoneType: stoneTypeSchema,
  pricePaise: z.number().int().positive(),
  compareAtPricePaise: z.number().int().positive().optional().nullable(),
  inventoryCount: z.number().int().min(0),
  imageUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type VariantInput = z.infer<typeof variantInputSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
