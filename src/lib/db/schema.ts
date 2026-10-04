import { relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Multi-dimensional variant axes required by the jewellery domain.
 * Inventory and price live on variants (SKU), never on the parent product.
 */
export const platingColorEnum = pgEnum("plating_color", [
  "oxidized",
  "gold_plated",
  "rhodium",
  "rose_gold",
  "silver",
]);

export const stoneTypeEnum = pgEnum("stone_type", [
  "ad",
  "kundan",
  "polki",
  "pearl",
  "meenakari",
  "none",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PAID",
  "FAILED",
  "CANCELLED",
]);

export type ProductDimensions = {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
};

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
      onDelete: "set null",
    }),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("categories_slug_uidx").on(table.slug)],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    /** Base metal / alloy composition (e.g. brass, copper, alloy). */
    material: text("material").notNull(),
    /** Shipping weight in grams (integer to avoid float drift). */
    weightGrams: integer("weight_grams").notNull(),
    careInstructions: text("care_instructions").notNull(),
    dimensions: jsonb("dimensions").$type<ProductDimensions>().notNull(),
    imageUrls: text("image_urls").array().notNull().default([]),
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("products_slug_uidx").on(table.slug)],
);

export const variants = pgTable(
  "variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: text("sku").notNull(),
    platingColor: platingColorEnum("plating_color").notNull(),
    stoneType: stoneTypeEnum("stone_type").notNull(),
    /** Price in paise (INR × 100). Never store currency as float. */
    pricePaise: integer("price_paise").notNull(),
    compareAtPricePaise: integer("compare_at_price_paise"),
    /** Stock is tracked per SKU / variant only. */
    inventoryCount: integer("inventory_count").notNull().default(0),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("variants_sku_uidx").on(table.sku),
    uniqueIndex("variants_product_axes_uidx").on(
      table.productId,
      table.platingColor,
      table.stoneType,
    ),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    razorpayOrderId: text("razorpay_order_id").notNull(),
    razorpayPaymentId: text("razorpay_payment_id"),
    status: orderStatusEnum("status").notNull().default("PENDING"),
    amountPaise: integer("amount_paise").notNull(),
    currency: text("currency").notNull().default("INR"),
    customerName: text("customer_name"),
    customerEmail: text("customer_email"),
    customerPhone: text("customer_phone"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("orders_razorpay_order_id_uidx").on(table.razorpayOrderId),
  ],
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_tree",
  }),
  children: many(categories, { relationName: "category_tree" }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(variants),
}));

export const variantsRelations = relations(variants, ({ one }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Variant = typeof variants.$inferSelect;
export type NewVariant = typeof variants.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
export type PlatingColor = (typeof platingColorEnum.enumValues)[number];
export type StoneType = (typeof stoneTypeEnum.enumValues)[number];
