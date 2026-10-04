import { ProductCard } from "@/components/shop/product-card";
import type { ShopProductCard } from "@/lib/shop/catalog-query";

const masonryAspects = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[5/6]",
] as const;

type ShopProductGridProps = {
  products: ShopProductCard[];
};

export function ShopProductGrid({ products }: ShopProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-start justify-center gap-2 border border-dashed border-border px-6 py-16">
        <p className="font-heading text-2xl text-ink">No pieces match</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try clearing a filter or browsing another plating and stone
          combination.
        </p>
      </div>
    );
  }

  return (
    <ul className="columns-1 gap-6 sm:columns-2 xl:columns-3">
      {products.map((product, index) => (
        <li key={product.id} className="mb-8 break-inside-avoid">
          <ProductCard
            product={product}
            imageAspectClassName={
              masonryAspects[index % masonryAspects.length]
            }
          />
        </li>
      ))}
    </ul>
  );
}
