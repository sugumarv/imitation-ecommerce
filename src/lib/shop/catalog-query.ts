import {
  platingColorSchema,
  stoneTypeSchema,
} from "@/lib/validations/product";
import type {
  FeaturedProductCard,
  PlatingColor,
  StoneType,
  StorefrontProduct,
} from "@/types/product";

export const shopSortOptions = ["price-asc", "price-desc"] as const;
export type ShopSort = (typeof shopSortOptions)[number];

export type ShopQuery = {
  categories: string[];
  platings: PlatingColor[];
  stones: StoneType[];
  sort: ShopSort;
};

export type ShopProductCard = FeaturedProductCard & {
  categorySlug: string;
};

export type ShopFacets = {
  categories: { slug: string; name: string }[];
  platings: PlatingColor[];
  stones: StoneType[];
};

type SearchParamsInput = Record<string, string | string[] | undefined>;

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value.join(",") : value;
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function parseShopQuery(params: SearchParamsInput): ShopQuery {
  const categories = unique(toArray(params.category));

  const platings = unique(toArray(params.plating)).flatMap((value) => {
    const parsed = platingColorSchema.safeParse(value);
    return parsed.success ? [parsed.data] : [];
  });

  const stones = unique(toArray(params.stone)).flatMap((value) => {
    const parsed = stoneTypeSchema.safeParse(value);
    return parsed.success ? [parsed.data] : [];
  });

  const sortValue = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const sort: ShopSort =
    sortValue === "price-desc" ? "price-desc" : "price-asc";

  return { categories, platings, stones, sort };
}

export function serializeShopQuery(query: ShopQuery): URLSearchParams {
  const params = new URLSearchParams();

  if (query.categories.length) {
    params.set("category", query.categories.join(","));
  }
  if (query.platings.length) {
    params.set("plating", query.platings.join(","));
  }
  if (query.stones.length) {
    params.set("stone", query.stones.join(","));
  }
  if (query.sort !== "price-asc") {
    params.set("sort", query.sort);
  }

  return params;
}

export function createShopQueryKey(query: ShopQuery): string {
  return serializeShopQuery(query).toString();
}

function matchingVariants(product: StorefrontProduct, query: ShopQuery) {
  return product.variants.filter((variant) => {
    if (!variant.isActive) return false;

    const platingOk =
      query.platings.length === 0 ||
      query.platings.includes(variant.platingColor);
    const stoneOk =
      query.stones.length === 0 || query.stones.includes(variant.stoneType);

    return platingOk && stoneOk;
  });
}

export function filterAndSortProducts(
  catalog: StorefrontProduct[],
  query: ShopQuery,
): ShopProductCard[] {
  const filtered = catalog.filter((product) => {
    if (
      query.categories.length > 0 &&
      !query.categories.includes(product.category.slug)
    ) {
      return false;
    }

    return matchingVariants(product, query).length > 0;
  });

  const cards = filtered.map((product) => {
    const matches = matchingVariants(product, query);
    const inStock = matches.filter((variant) => variant.inventoryCount > 0);
    const preferred =
      [...inStock].sort((a, b) => a.pricePaise - b.pricePaise)[0] ??
      [...matches].sort((a, b) => a.pricePaise - b.pricePaise)[0] ??
      product.variants[0];

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      material: product.material,
      imageUrl: preferred.imageUrl ?? product.imageUrls[0],
      categoryName: product.category.name,
      categorySlug: product.category.slug,
      platingColor: preferred.platingColor,
      stoneType: preferred.stoneType,
      pricePaise: preferred.pricePaise,
      compareAtPricePaise: preferred.compareAtPricePaise,
      inventoryCount: preferred.inventoryCount,
    } satisfies ShopProductCard;
  });

  return cards.sort((a, b) =>
    query.sort === "price-desc"
      ? b.pricePaise - a.pricePaise
      : a.pricePaise - b.pricePaise,
  );
}

export function getShopFacets(catalog: StorefrontProduct[]): ShopFacets {
  const categoriesMap = new Map<string, string>();
  const platings = new Set<PlatingColor>();
  const stones = new Set<StoneType>();

  for (const product of catalog) {
    categoriesMap.set(product.category.slug, product.category.name);
    for (const variant of product.variants) {
      if (!variant.isActive) continue;
      platings.add(variant.platingColor);
      stones.add(variant.stoneType);
    }
  }

  return {
    categories: [...categoriesMap.entries()]
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    platings: [...platings].sort(),
    stones: [...stones].sort(),
  };
}

/** Async catalog access — swap for a DB query later. */
export async function fetchShopProducts(
  catalog: StorefrontProduct[],
  query: ShopQuery,
): Promise<ShopProductCard[]> {
  // Simulate network latency so the grid skeleton is visible while loading.
  await new Promise((resolve) => setTimeout(resolve, 220));
  return filterAndSortProducts(catalog, query);
}
