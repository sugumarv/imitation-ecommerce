import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { ShopGridSkeleton } from "@/components/shop/shop-grid-skeleton";
import { products } from "@/lib/data/products";
import { getShopFacets } from "@/lib/shop/catalog-query";

export const metadata: Metadata = {
  title: "Shop | AURELIA",
  description:
    "Browse imitation jewellery by category, plating, and stone — sorted your way.",
};

export default function ShopPage() {
  const facets = getShopFacets(products);

  return (
    <>
      <SiteHeader variant="solid" />
      <main className="flex-1 bg-background">
        <div className="border-b border-border px-6 py-10 md:px-10 md:py-14">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">
              Shop
            </p>
            <h1 className="mt-3 font-heading text-4xl text-ink md:text-5xl">
              The collection
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Filter by category, plating, and stone. Every selection updates
              the URL so you can share the exact view.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 lg:py-14">
              <ShopGridSkeleton />
            </div>
          }
        >
          <ShopCatalog catalog={products} facets={facets} />
        </Suspense>
      </main>
    </>
  );
}
