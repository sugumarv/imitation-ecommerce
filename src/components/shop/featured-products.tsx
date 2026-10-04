"use client";

import { motion } from "framer-motion";

import { ProductCard } from "@/components/shop/product-card";
import type { FeaturedProductCard } from "@/types/product";

type FeaturedProductsProps = {
  products: FeaturedProductCard[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section
      id="featured"
      className="relative bg-background px-6 py-20 md:px-10 md:py-28"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 max-w-xl md:mb-16"
        >
          <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-gold-deep">
            Featured pieces
          </p>
          <h2
            id="featured-heading"
            className="font-heading text-3xl text-ink md:text-4xl"
          >
            Crafted to catch the light
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            A curated edit of necklaces, earrings, and bangles — each available
            in plating and stone variants.
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.li
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProductCard product={product} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
