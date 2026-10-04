"use client";

import Image from "next/image";

import { PriceDisplay } from "@/components/shop/price-display";
import { platingColorLabels, stoneTypeLabels } from "@/lib/shop/labels";
import {
  selectCartItemCount,
  selectCartSubtotalPaise,
  useCart,
} from "@/store/useCart";

export function CheckoutSummary() {
  const items = useCart((state) => state.items);
  const itemCount = useCart(selectCartItemCount);
  const subtotalPaise = useCart(selectCartSubtotalPaise);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold-deep">
          Order summary
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <ul className="space-y-5 border-y border-border py-5">
        {items.map((item) => (
          <li key={item.sku} className="flex gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden bg-secondary">
              <Image
                src={item.imageUrl}
                alt={item.productName}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-lg leading-tight text-ink">
                {item.productName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {platingColorLabels[item.platingColor]} ·{" "}
                {stoneTypeLabels[item.stoneType]}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Qty {item.quantity}
              </p>
            </div>
            <PriceDisplay pricePaise={item.pricePaise * item.quantity} />
          </li>
        ))}
      </ul>

      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Subtotal
        </span>
        <PriceDisplay
          pricePaise={subtotalPaise}
          className="[&_span:first-child]:text-base"
        />
      </div>
    </aside>
  );
}
