import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Checkout | AURELIA",
  description: "Enter shipping details and pay securely with Razorpay.",
};

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader variant="solid" />
      <main className="flex-1 bg-background">
        <div className="border-b border-border px-6 py-10 md:px-10 md:py-12">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">
              Checkout
            </p>
            <h1 className="mt-3 font-heading text-4xl text-ink md:text-5xl">
              Almost yours
            </h1>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-10 md:px-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:py-14">
          <CheckoutForm />
          <CheckoutSummary />
        </div>
      </main>
    </>
  );
}
