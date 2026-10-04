import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { ProductDetails } from "@/components/shop/product-details";
import {
  getAllProductSlugs,
  getProductBySlug,
} from "@/lib/data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found | AURELIA" };
  }

  return {
    title: `${product.name} | AURELIA`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <SiteHeader variant="solid" />
      <main className="flex-1 bg-background">
        <ProductDetails product={product} />
      </main>
    </>
  );
}
