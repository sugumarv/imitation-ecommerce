import Image from "next/image";
import Link from "next/link";

import { PriceDisplay } from "@/components/shop/price-display";
import { StockBadge } from "@/components/shop/stock-badge";
import { platingColorLabels, stoneTypeLabels } from "@/lib/shop/labels";
import { cn } from "@/lib/utils";
import type { FeaturedProductCard } from "@/types/product";

type ProductCardProps = {
  product: FeaturedProductCard;
  imageAspectClassName?: string;
};

export function ProductCard({
  product,
  imageAspectClassName = "aspect-[4/5]",
}: ProductCardProps) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
    >
      <div
        className={cn(
          "relative overflow-hidden bg-secondary",
          imageAspectClassName,
        )}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3">
          <StockBadge inventoryCount={product.inventoryCount} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 px-0.5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {product.categoryName}
        </p>
        <h3 className="font-heading text-xl leading-snug text-ink transition-colors group-hover:text-gold-deep">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {platingColorLabels[product.platingColor]} ·{" "}
          {stoneTypeLabels[product.stoneType]}
        </p>
        <PriceDisplay
          pricePaise={product.pricePaise}
          compareAtPricePaise={product.compareAtPricePaise}
          className="mt-1"
        />
      </div>
    </Link>
  );
}
