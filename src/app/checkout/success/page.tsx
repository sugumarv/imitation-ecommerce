import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { ClearCartOnSuccess } from "@/components/checkout/clear-cart-on-success";

export const metadata: Metadata = {
  title: "Payment successful | AURELIA",
  description: "Your AURELIA order payment was successful.",
};

type SuccessPageProps = {
  searchParams: Promise<{
    payment_id?: string;
    order_id?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;

  return (
    <>
      <SiteHeader variant="solid" />
      <ClearCartOnSuccess />
      <main className="flex flex-1 items-center bg-background px-6 py-20 md:px-10">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">
            Thank you
          </p>
          <h1 className="mt-4 font-heading text-4xl text-ink md:text-5xl">
            Payment successful
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Your order is confirmed. A receipt will arrive by email shortly.
          </p>

          <dl className="mt-8 space-y-2 border border-border px-5 py-4 text-left text-sm">
            {params.order_id ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Order</dt>
                <dd className="font-medium text-ink">{params.order_id}</dd>
              </div>
            ) : null}
            {params.payment_id ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Payment</dt>
                <dd className="font-medium text-ink">{params.payment_id}</dd>
              </div>
            ) : null}
          </dl>

          <Button
            asChild
            size="lg"
            className="mt-8 h-12 rounded-none bg-ink px-8 text-ivory hover:bg-ink/90"
          >
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
