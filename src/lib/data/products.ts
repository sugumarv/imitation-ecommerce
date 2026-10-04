import type { FeaturedProductCard, StorefrontProduct } from "@/types/product";

/**
 * Full catalog seed for PDP routes until DATABASE_URL is connected.
 * Inventory and pricing live on variants only.
 */
export const products: StorefrontProduct[] = [
  {
    id: "prod_necklace_moonlit",
    name: "Moonlit Cascade Necklace",
    slug: "moonlit-cascade-necklace",
    description:
      "A cascading collar of faceted stones set in a soft gold plate — light enough for day, luminous enough for evening.",
    material: "Brass alloy",
    weightGrams: 42,
    careInstructions:
      "Wipe with a soft dry cloth after wear. Avoid perfume, water, and harsh cleaners. Store flat in the pouch provided.",
    dimensions: { lengthMm: 420, widthMm: 28, heightMm: 6 },
    imageUrls: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80",
    ],
    isFeatured: true,
    category: {
      id: "cat_necklaces",
      name: "Necklaces",
      slug: "necklaces",
    },
    variants: [
      {
        id: "var_moonlit_gold_ad",
        sku: "AUR-NCK-ML-GP-AD",
        platingColor: "gold_plated",
        stoneType: "ad",
        pricePaise: 249900,
        compareAtPricePaise: 299900,
        inventoryCount: 18,
        imageUrl:
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
      {
        id: "var_moonlit_rhodium_ad",
        sku: "AUR-NCK-ML-RH-AD",
        platingColor: "rhodium",
        stoneType: "ad",
        pricePaise: 259900,
        compareAtPricePaise: 309900,
        inventoryCount: 9,
        imageUrl:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
      {
        id: "var_moonlit_gold_polki",
        sku: "AUR-NCK-ML-GP-PK",
        platingColor: "gold_plated",
        stoneType: "polki",
        pricePaise: 279900,
        compareAtPricePaise: null,
        inventoryCount: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
      {
        id: "var_moonlit_rose_kundan",
        sku: "AUR-NCK-ML-RG-KD",
        platingColor: "rose_gold",
        stoneType: "kundan",
        pricePaise: 269900,
        compareAtPricePaise: 289900,
        inventoryCount: 0,
        imageUrl: null,
        isActive: true,
      },
    ],
  },
  {
    id: "prod_earrings_polki_bloom",
    name: "Polki Bloom Earrings",
    slug: "polki-bloom-earrings",
    description:
      "Floral studs with uncut Polki centres framed in a cool rhodium finish — delicate sparkle with everyday comfort.",
    material: "Copper alloy",
    weightGrams: 12,
    careInstructions:
      "Remove before bathing or swimming. Clean gently with a jewellery cloth. Keep away from cosmetics and moisture.",
    dimensions: { lengthMm: 22, widthMm: 18, heightMm: 10 },
    imageUrls: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=80",
    ],
    isFeatured: true,
    category: {
      id: "cat_earrings",
      name: "Earrings",
      slug: "earrings",
    },
    variants: [
      {
        id: "var_polki_rhodium_polki",
        sku: "AUR-EAR-PB-RH-PK",
        platingColor: "rhodium",
        stoneType: "polki",
        pricePaise: 189900,
        compareAtPricePaise: null,
        inventoryCount: 7,
        imageUrl:
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
      {
        id: "var_polki_gold_polki",
        sku: "AUR-EAR-PB-GP-PK",
        platingColor: "gold_plated",
        stoneType: "polki",
        pricePaise: 199900,
        compareAtPricePaise: 219900,
        inventoryCount: 11,
        imageUrl:
          "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
      {
        id: "var_polki_silver_pearl",
        sku: "AUR-EAR-PB-SV-PL",
        platingColor: "silver",
        stoneType: "pearl",
        pricePaise: 169900,
        compareAtPricePaise: null,
        inventoryCount: 15,
        imageUrl:
          "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
    ],
  },
  {
    id: "prod_bangle_oxidized_temple",
    name: "Temple Oxidized Bangle",
    slug: "temple-oxidized-bangle",
    description:
      "Temple-inspired motifs in a deep oxidized finish, punctuated with Kundan accents for a heritage silhouette.",
    material: "German silver",
    weightGrams: 68,
    careInstructions:
      "Oxidized finishes darken naturally. Avoid polishing creams. Wipe dry after wear and store away from humidity.",
    dimensions: { lengthMm: 70, widthMm: 70, heightMm: 18 },
    imageUrls: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
    ],
    isFeatured: true,
    category: {
      id: "cat_bangles",
      name: "Bangles",
      slug: "bangles",
    },
    variants: [
      {
        id: "var_temple_ox_kundan",
        sku: "AUR-BNG-TO-OX-KD",
        platingColor: "oxidized",
        stoneType: "kundan",
        pricePaise: 159900,
        compareAtPricePaise: 179900,
        inventoryCount: 0,
        imageUrl:
          "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
      {
        id: "var_temple_ox_ad",
        sku: "AUR-BNG-TO-OX-AD",
        platingColor: "oxidized",
        stoneType: "ad",
        pricePaise: 149900,
        compareAtPricePaise: null,
        inventoryCount: 6,
        imageUrl:
          "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
      {
        id: "var_temple_gold_kundan",
        sku: "AUR-BNG-TO-GP-KD",
        platingColor: "gold_plated",
        stoneType: "kundan",
        pricePaise: 179900,
        compareAtPricePaise: 199900,
        inventoryCount: 3,
        imageUrl:
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
    ],
  },
  {
    id: "prod_ring_rose_meena",
    name: "Rose Meenakari Ring",
    slug: "rose-meenakari-ring",
    description:
      "A sculpted rose-gold band with Meenakari enamel detail — a quiet statement piece for everyday elegance.",
    material: "Brass alloy",
    weightGrams: 8,
    careInstructions:
      "Enamel is delicate. Avoid knocks and chemicals. Clean with a soft cloth only; do not soak.",
    dimensions: { lengthMm: 20, widthMm: 20, heightMm: 8 },
    imageUrls: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=1200&q=80",
    ],
    isFeatured: true,
    category: {
      id: "cat_rings",
      name: "Rings",
      slug: "rings",
    },
    variants: [
      {
        id: "var_meena_rose_meena",
        sku: "AUR-RNG-RM-RG-MN",
        platingColor: "rose_gold",
        stoneType: "meenakari",
        pricePaise: 99900,
        compareAtPricePaise: null,
        inventoryCount: 24,
        imageUrl:
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
      {
        id: "var_meena_gold_meena",
        sku: "AUR-RNG-RM-GP-MN",
        platingColor: "gold_plated",
        stoneType: "meenakari",
        pricePaise: 109900,
        compareAtPricePaise: 119900,
        inventoryCount: 12,
        imageUrl:
          "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
      {
        id: "var_meena_silver_none",
        sku: "AUR-RNG-RM-SV-NN",
        platingColor: "silver",
        stoneType: "none",
        pricePaise: 89900,
        compareAtPricePaise: null,
        inventoryCount: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
      },
    ],
  },
];

export function getProductBySlug(slug: string): StorefrontProduct | undefined {
  return products.find((product) => product.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((product) => product.slug);
}

/** Derive homepage cards from the shared catalog. */
export function getFeaturedProductCards(): FeaturedProductCard[] {
  return products
    .filter((product) => product.isFeatured)
    .map((product) => {
      const inStock = product.variants.filter(
        (variant) => variant.isActive && variant.inventoryCount > 0,
      );
      const preferred =
        inStock.sort((a, b) => a.pricePaise - b.pricePaise)[0] ??
        product.variants[0];

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        material: product.material,
        imageUrl: preferred.imageUrl ?? product.imageUrls[0],
        categoryName: product.category.name,
        platingColor: preferred.platingColor,
        stoneType: preferred.stoneType,
        pricePaise: preferred.pricePaise,
        compareAtPricePaise: preferred.compareAtPricePaise,
        inventoryCount: preferred.inventoryCount,
      };
    });
}
