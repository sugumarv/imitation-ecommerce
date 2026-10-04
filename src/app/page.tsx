import { Hero } from "@/components/home/hero";
import { SiteHeader } from "@/components/layout/site-header";
import { FeaturedProducts } from "@/components/shop/featured-products";
import { getFeaturedProductCards } from "@/lib/data/products";

export default function HomePage() {
  const featuredProducts = getFeaturedProductCards();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts products={featuredProducts} />
      </main>
      <footer className="border-t border-border bg-background px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="font-heading text-lg tracking-[0.18em] text-ink">
            AURELIA
          </p>
          <p className="text-xs text-muted-foreground">
            Imitation jewellery · Plated with care · Designed to gleam
          </p>
        </div>
      </footer>
    </>
  );
}
