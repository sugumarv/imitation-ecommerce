"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type {
  ShopFacets,
  ShopQuery,
  ShopSort,
} from "@/lib/shop/catalog-query";
import { platingColorLabels, stoneTypeLabels } from "@/lib/shop/labels";
import { cn } from "@/lib/utils";
import type { PlatingColor, StoneType } from "@/types/product";

type ShopFiltersProps = {
  facets: ShopFacets;
  query: ShopQuery;
  isLoading?: boolean;
  onChange: (next: ShopQuery) => void;
  className?: string;
};

function toggleValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function ShopFilters({
  facets,
  query,
  isLoading = false,
  onChange,
  className,
}: ShopFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasFilters =
    query.categories.length > 0 ||
    query.platings.length > 0 ||
    query.stones.length > 0 ||
    query.sort !== "price-asc";

  const filterPanel = (
    <FilterPanel
      facets={facets}
      query={query}
      hasFilters={hasFilters}
      isLoading={isLoading}
      onChange={onChange}
    />
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Updating…" : "Refine the collection"}
        </p>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="rounded-none border-ink"
            >
              <SlidersHorizontal className="size-3.5" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full border-r border-border bg-background sm:max-w-sm"
          >
            <SheetHeader className="text-left">
              <SheetTitle className="font-heading text-2xl text-ink">
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto px-4 pb-8">{filterPanel}</div>
          </SheetContent>
        </Sheet>
      </div>

      <aside
        className={cn("hidden lg:block", className)}
        aria-label="Product filters"
        data-pending={isLoading || undefined}
      >
        <FilterPanel
          facets={facets}
          query={query}
          hasFilters={hasFilters}
          isLoading={isLoading}
          onChange={onChange}
        />
      </aside>
    </>
  );
}

function FilterPanel({
  facets,
  query,
  hasFilters,
  isLoading,
  onChange,
}: {
  facets: ShopFacets;
  query: ShopQuery;
  hasFilters: boolean;
  isLoading: boolean;
  onChange: (next: ShopQuery) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold-deep">
          Filter & sort
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {isLoading ? "Updating…" : "Shareable via URL"}
        </p>
      </div>

      <FilterGroup title="Category">
        {facets.categories.map((category) => (
          <FilterChip
            key={category.slug}
            label={category.name}
            active={query.categories.includes(category.slug)}
            onClick={() =>
              onChange({
                ...query,
                categories: toggleValue(query.categories, category.slug),
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Plating">
        {facets.platings.map((plating) => (
          <FilterChip
            key={plating}
            label={platingColorLabels[plating as PlatingColor]}
            active={query.platings.includes(plating)}
            onClick={() =>
              onChange({
                ...query,
                platings: toggleValue(query.platings, plating),
              })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Stone">
        {facets.stones.map((stone) => (
          <FilterChip
            key={stone}
            label={stoneTypeLabels[stone as StoneType]}
            active={query.stones.includes(stone)}
            onClick={() =>
              onChange({
                ...query,
                stones: toggleValue(query.stones, stone),
              })
            }
          />
        ))}
      </FilterGroup>

      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Sort by price
        </p>
        <div className="flex flex-col gap-2">
          {(
            [
              { value: "price-asc", label: "Low to high" },
              { value: "price-desc", label: "High to low" },
            ] as const satisfies { value: ShopSort; label: string }[]
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ ...query, sort: option.value })}
              className={cn(
                "border px-3 py-2 text-left text-xs tracking-wide transition-colors",
                query.sort === option.value
                  ? "border-ink bg-ink text-ivory"
                  : "border-border text-ink hover:border-ink/40",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          className="rounded-none px-0 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:bg-transparent hover:text-ink"
          onClick={() =>
            onChange({
              categories: [],
              platings: [],
              stones: [],
              sort: "price-asc",
            })
          }
        >
          Clear all
        </Button>
      ) : null}
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border px-3 py-1.5 text-xs tracking-wide transition-colors",
        active
          ? "border-ink bg-ink text-ivory"
          : "border-border text-ink hover:border-ink/40",
      )}
    >
      {label}
    </button>
  );
}
