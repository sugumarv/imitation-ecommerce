"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopGridSkeleton } from "@/components/shop/shop-grid-skeleton";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";
import {
  createShopQueryKey,
  fetchShopProducts,
  parseShopQuery,
  serializeShopQuery,
  type ShopFacets,
  type ShopProductCard,
  type ShopQuery,
} from "@/lib/shop/catalog-query";
import type { StorefrontProduct } from "@/types/product";

type ShopCatalogProps = {
  catalog: StorefrontProduct[];
  facets: ShopFacets;
};

export function ShopCatalog({ catalog, facets }: ShopCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const query = useMemo(
    () => parseShopQuery(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );
  const queryKey = createShopQueryKey(query);

  const [results, setResults] = useState<ShopProductCard[] | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsFetching(true);

    void fetchShopProducts(catalog, query).then((next) => {
      if (cancelled) return;
      setResults(next);
      setIsFetching(false);
    });

    return () => {
      cancelled = true;
    };
  }, [catalog, query, queryKey]);

  const handleQueryChange = (next: ShopQuery) => {
    const params = serializeShopQuery(next);
    const href = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;

    startTransition(() => {
      router.push(href, { scroll: false });
    });
  };

  const showSkeleton = isFetching || isPending || results === null;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:px-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14 lg:py-14">
      <ShopFilters
        facets={facets}
        query={query}
        isLoading={showSkeleton}
        onChange={handleQueryChange}
      />

      <div className="min-w-0">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-2xl text-ink md:text-3xl">
            All pieces
          </h2>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {showSkeleton
              ? "Loading…"
              : `${results.length} ${results.length === 1 ? "result" : "results"}`}
          </p>
        </div>

        {showSkeleton ? (
          <ShopGridSkeleton />
        ) : (
          <ShopProductGrid products={results} />
        )}
      </div>
    </div>
  );
}
