import type {
  Category,
  PlatingColor,
  Product,
  ProductDimensions,
  StoneType,
  Variant,
} from "@/lib/db/schema";

export type {
  Category,
  PlatingColor,
  Product,
  ProductDimensions,
  StoneType,
  Variant,
};

/** Product card payload for storefront grids (price from cheapest in-stock variant). */
export type FeaturedProductCard = {
  id: string;
  name: string;
  slug: string;
  material: string;
  imageUrl: string;
  categoryName: string;
  platingColor: PlatingColor;
  stoneType: StoneType;
  pricePaise: number;
  compareAtPricePaise: number | null;
  inventoryCount: number;
};

export type ProductWithVariants = Product & {
  category: Category;
  variants: Variant[];
};

/** Storefront PDP model used before the database is connected. */
export type StorefrontVariant = {
  id: string;
  sku: string;
  platingColor: PlatingColor;
  stoneType: StoneType;
  pricePaise: number;
  compareAtPricePaise: number | null;
  inventoryCount: number;
  imageUrl: string | null;
  isActive: boolean;
};

export type StorefrontProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  material: string;
  weightGrams: number;
  careInstructions: string;
  dimensions: ProductDimensions;
  imageUrls: string[];
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: StorefrontVariant[];
};
