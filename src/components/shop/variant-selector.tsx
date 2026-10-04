"use client";

import {
  platingColorLabels,
  platingSwatches,
  stoneTypeLabels,
} from "@/lib/shop/labels";
import { cn } from "@/lib/utils";
import type { PlatingColor, StoneType, StorefrontVariant } from "@/types/product";

type VariantSelectorProps = {
  variants: StorefrontVariant[];
  selectedPlating: PlatingColor;
  selectedStone: StoneType;
  onPlatingChange: (plating: PlatingColor) => void;
  onStoneChange: (stone: StoneType) => void;
};

function uniqueOrdered<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function VariantSelector({
  variants,
  selectedPlating,
  selectedStone,
  onPlatingChange,
  onStoneChange,
}: VariantSelectorProps) {
  const activeVariants = variants.filter((variant) => variant.isActive);
  const platingOptions = uniqueOrdered(
    activeVariants.map((variant) => variant.platingColor),
  );
  const stoneOptions = uniqueOrdered(
    activeVariants.map((variant) => variant.stoneType),
  );

  const isStoneAvailable = (stone: StoneType) =>
    activeVariants.some(
      (variant) =>
        variant.platingColor === selectedPlating &&
        variant.stoneType === stone,
    );

  const isPlatingAvailable = (plating: PlatingColor) =>
    activeVariants.some((variant) => variant.platingColor === plating);

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Plating · {platingColorLabels[selectedPlating]}
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {platingOptions.map((plating) => {
            const available = isPlatingAvailable(plating);
            const selected = plating === selectedPlating;

            return (
              <button
                key={plating}
                type="button"
                disabled={!available}
                onClick={() => onPlatingChange(plating)}
                aria-label={platingColorLabels[plating]}
                aria-pressed={selected}
                className={cn(
                  "relative size-9 rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                  selected
                    ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-background"
                    : "border-border hover:border-ink/40",
                  !available && "cursor-not-allowed opacity-30",
                )}
                style={{ backgroundColor: platingSwatches[plating] }}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Stone · {stoneTypeLabels[selectedStone]}
        </legend>
        <div className="flex flex-wrap gap-2">
          {stoneOptions.map((stone) => {
            const available = isStoneAvailable(stone);
            const selected = stone === selectedStone;

            return (
              <button
                key={stone}
                type="button"
                disabled={!available}
                onClick={() => onStoneChange(stone)}
                aria-pressed={selected}
                className={cn(
                  "min-w-16 border px-3 py-2 text-xs tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                  selected
                    ? "border-ink bg-ink text-ivory"
                    : "border-border bg-transparent text-ink hover:border-ink/50",
                  !available &&
                    "cursor-not-allowed opacity-35 line-through hover:border-border",
                )}
              >
                {stoneTypeLabels[stone]}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
