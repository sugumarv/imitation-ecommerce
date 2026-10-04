"use client";

import { useMemo, useState } from "react";

import { PriceDisplay } from "@/components/shop/price-display";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductInfoAccordion } from "@/components/shop/product-info-accordion";
import { StockBadge } from "@/components/shop/stock-badge";
import { VariantSelector } from "@/components/shop/variant-selector";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import type {
  PlatingColor,
  StoneType,
  StorefrontProduct,
  StorefrontVariant,
} from "@/types/product";

type ProductDetailsProps = {
  product: StorefrontProduct;
};

function findVariant(
  variants: StorefrontVariant[],
  plating: PlatingColor,
  stone: StoneType,
): StorefrontVariant | undefined {
  return variants.find(
    (variant) =>
      variant.isActive &&
      variant.platingColor === plating &&
      variant.stoneType === stone,
  );
}

function getInitialVariant(variants: StorefrontVariant[]): StorefrontVariant {
  const inStock = variants.find(
    (variant) => variant.isActive && variant.inventoryCount > 0,
  );
  return inStock ?? variants.find((variant) => variant.isActive) ?? variants[0];
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const addItem = useCart((state) => state.addItem);
  const initial = getInitialVariant(product.variants);
  const [selectedPlating, setSelectedPlating] = useState<PlatingColor>(
    initial.platingColor,
  );
  const [selectedStone, setSelectedStone] = useState<StoneType>(
    initial.stoneType,
  );

  const selectedVariant = useMemo(
    () => findVariant(product.variants, selectedPlating, selectedStone),
    [product.variants, selectedPlating, selectedStone],
  );

  const handlePlatingChange = (plating: PlatingColor) => {
    setSelectedPlating(plating);
    const stillValid = findVariant(product.variants, plating, selectedStone);
    if (stillValid) return;

    const fallback = product.variants.find(
      (variant) => variant.isActive && variant.platingColor === plating,
    );
    if (fallback) {
      setSelectedStone(fallback.stoneType);
    }
  };

  const inStock = (selectedVariant?.inventoryCount ?? 0) > 0;

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.inventoryCount <= 0) return;

    addItem({
      sku: selectedVariant.sku,
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      platingColor: selectedVariant.platingColor,
      stoneType: selectedVariant.stoneType,
      pricePaise: selectedVariant.pricePaise,
      imageUrl: selectedVariant.imageUrl ?? product.imageUrls[0],
    });
  };

  const galleryImages = useMemo(() => {
    const urls = [...product.imageUrls];
    for (const variant of product.variants) {
      if (variant.imageUrl && !urls.includes(variant.imageUrl)) {
        urls.push(variant.imageUrl);
      }
    }
    return urls;
  }, [product.imageUrls, product.variants]);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-28 pt-8 lg:grid-cols-2 lg:gap-14 lg:pb-20 lg:pt-10">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ProductGallery
          images={galleryImages}
          alt={product.name}
          activeImageUrl={selectedVariant?.imageUrl}
        />
      </div>

      <div className="flex flex-col">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {product.category.name}
        </p>
        <h1 className="mt-3 font-heading text-3xl text-ink md:text-4xl">
          {product.name}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          {product.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {selectedVariant ? (
            <PriceDisplay
              pricePaise={selectedVariant.pricePaise}
              compareAtPricePaise={selectedVariant.compareAtPricePaise}
              className="[&_span:first-child]:text-lg"
            />
          ) : null}
          {selectedVariant ? (
            <StockBadge inventoryCount={selectedVariant.inventoryCount} />
          ) : null}
        </div>

        {selectedVariant ? (
          <p className="mt-2 text-xs text-muted-foreground">
            SKU · {selectedVariant.sku}
          </p>
        ) : null}

        <div className="mt-8">
          <VariantSelector
            variants={product.variants}
            selectedPlating={selectedPlating}
            selectedStone={selectedStone}
            onPlatingChange={handlePlatingChange}
            onStoneChange={setSelectedStone}
          />
        </div>

        <div className="mt-8 hidden lg:block">
          <Button
            size="lg"
            disabled={!selectedVariant || !inStock}
            onClick={handleAddToCart}
            className="h-12 w-full rounded-none bg-ink px-8 text-ivory hover:bg-ink/90 disabled:opacity-40"
          >
            {!selectedVariant
              ? "Unavailable combination"
              : inStock
                ? "Add to cart"
                : "Sold out"}
          </Button>
        </div>

        <div className="mt-8">
          <ProductInfoAccordion
            material={product.material}
            careInstructions={product.careInstructions}
            dimensions={product.dimensions}
            weightGrams={product.weightGrams}
          />
        </div>
      </div>

      {/* Mobile sticky ATC — required by storefront UI rules */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          {selectedVariant ? (
            <PriceDisplay
              pricePaise={selectedVariant.pricePaise}
              compareAtPricePaise={selectedVariant.compareAtPricePaise}
              className="min-w-20 shrink-0"
            />
          ) : null}
          <Button
            size="lg"
            disabled={!selectedVariant || !inStock}
            onClick={handleAddToCart}
            className="h-12 flex-1 rounded-none bg-ink text-ivory hover:bg-ink/90 disabled:opacity-40"
          >
            {!selectedVariant
              ? "Unavailable"
              : inStock
                ? "Add to cart"
                : "Sold out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
