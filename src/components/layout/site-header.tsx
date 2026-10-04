import Link from "next/link";

import { CartButton } from "@/components/cart/cart-button";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  variant?: "overlay" | "solid";
};

export function SiteHeader({ variant = "overlay" }: SiteHeaderProps) {
  const isOverlay = variant === "overlay";

  return (
    <header
      className={cn(
        "z-20 w-full",
        isOverlay
          ? "absolute inset-x-0 top-0"
          : "sticky top-0 border-b border-border bg-background/95 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-12">
        <Link
          href="/"
          className={cn(
            "font-heading text-lg tracking-[0.2em]",
            isOverlay ? "text-ivory" : "text-ink",
          )}
        >
          AURELIA
        </Link>
        <nav
          aria-label="Primary"
          className={cn(
            "flex items-center gap-6 text-[11px] uppercase tracking-[0.2em]",
            isOverlay ? "text-ivory/80" : "text-ink/70",
          )}
        >
          <Link
            href="/shop"
            className={cn(
              "transition-colors",
              isOverlay ? "hover:text-ivory" : "hover:text-ink",
            )}
          >
            Shop
          </Link>
          <Link
            href="/#featured"
            className={cn(
              "transition-colors",
              isOverlay ? "hover:text-ivory" : "hover:text-ink",
            )}
          >
            Featured
          </Link>
          <CartButton tone={isOverlay ? "light" : "dark"} />
        </nav>
      </div>
    </header>
  );
}
