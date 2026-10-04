"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import { selectCartItemCount, useCart } from "@/store/useCart";

type CartButtonProps = {
  className?: string;
  tone?: "light" | "dark";
};

export function CartButton({ className, tone = "dark" }: CartButtonProps) {
  const openCart = useCart((state) => state.openCart);
  const itemCount = useCart(selectCartItemCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? itemCount : 0;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={count > 0 ? `Open bag, ${count} items` : "Open bag"}
      className={cn(
        "relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        tone === "light"
          ? "text-ivory/80 hover:text-ivory"
          : "text-ink/70 hover:text-ink",
        className,
      )}
    >
      <ShoppingBag className="size-4" strokeWidth={1.5} />
      {count > 0 ? (
        <span
          className={cn(
            "absolute -right-2 -top-2 flex size-4 items-center justify-center text-[9px] tabular-nums",
            tone === "light" ? "bg-ivory text-ink" : "bg-ink text-ivory",
          )}
        >
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </button>
  );
}
