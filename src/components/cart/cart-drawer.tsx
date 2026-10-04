"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { PriceDisplay } from "@/components/shop/price-display";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { platingColorLabels, stoneTypeLabels } from "@/lib/shop/labels";
import {
  selectCartItemCount,
  selectCartSubtotalPaise,
  useCart,
} from "@/store/useCart";

export function CartDrawer() {
  const items = useCart((state) => state.items);
  const isOpen = useCart((state) => state.isOpen);
  const closeCart = useCart((state) => state.closeCart);
  const removeItem = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const itemCount = useCart(selectCartItemCount);
  const subtotalPaise = useCart(selectCartSubtotalPaise);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeCart();
        else useCart.getState().openCart();
      }}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="font-heading text-2xl tracking-wide text-ink">
            Your bag
          </SheetTitle>
          <SheetDescription className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {itemCount === 0
              ? "Empty"
              : `${itemCount} ${itemCount === 1 ? "piece" : "pieces"}`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6">
            <p className="text-sm text-muted-foreground">
              Your bag is waiting for something that gleams.
            </p>
            <Button
              asChild
              variant="outline"
              className="rounded-none border-ink px-5"
            >
              <Link href="/#featured" onClick={closeCart}>
                Continue shopping
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            {items.map((item) => (
              <li key={item.sku} className="flex gap-4">
                <Link
                  href={`/shop/${item.productSlug}`}
                  onClick={closeCart}
                  className="relative size-20 shrink-0 overflow-hidden bg-secondary"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/shop/${item.productSlug}`}
                        onClick={closeCart}
                        className="font-heading text-lg leading-tight text-ink transition-colors hover:text-gold-deep"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {platingColorLabels[item.platingColor]} ·{" "}
                        {stoneTypeLabels[item.stoneType]}
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.sku}
                      </p>
                    </div>
                    <PriceDisplay pricePaise={item.pricePaise} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center border border-border">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.productName}`}
                        className="flex size-8 items-center justify-center text-ink transition-colors hover:bg-secondary"
                        onClick={() =>
                          updateQuantity(item.sku, item.quantity - 1)
                        }
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.productName}`}
                        className="flex size-8 items-center justify-center text-ink transition-colors hover:bg-secondary"
                        onClick={() =>
                          updateQuantity(item.sku, item.quantity + 1)
                        }
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${item.productName} from bag`}
                      className="text-muted-foreground transition-colors hover:text-ink"
                      onClick={() => removeItem(item.sku)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 ? (
          <SheetFooter className="mt-auto gap-3 border-t border-border px-6 py-5 sm:flex-col">
            <div className="flex w-full items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Subtotal
              </span>
              <PriceDisplay
                pricePaise={subtotalPaise}
                className="[&_span:first-child]:text-base"
              />
            </div>
            <p className="w-full text-xs text-muted-foreground">
              Final total is confirmed at checkout.
            </p>
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-none bg-ink text-ivory hover:bg-ink/90"
            >
              <Link href="/checkout" onClick={closeCart}>
                Checkout
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full rounded-none text-muted-foreground hover:text-ink"
              onClick={closeCart}
            >
              Continue shopping
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
