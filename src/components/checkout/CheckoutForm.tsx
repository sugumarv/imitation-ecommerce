"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PriceDisplay } from "@/components/shop/price-display";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { loadRazorpayScript } from "@/lib/razorpay/load-script";
import type { CreateOrderResponse } from "@/lib/validations/checkout";
import {
  shippingDetailsSchema,
  type ShippingDetails,
} from "@/lib/validations/shipping";
import {
  selectCartItemCount,
  selectCartSubtotalPaise,
  useCart,
} from "@/store/useCart";
import type { ApiErrorBody } from "@/lib/api/errors";
import type { RazorpayOptions } from "@/types/razorpay";

const fieldClassName =
  "h-11 rounded-none border-border bg-background px-3 text-sm md:text-sm";

type CreateOrderApiResult = CreateOrderResponse | ApiErrorBody;

function isApiError(payload: CreateOrderApiResult): payload is ApiErrorBody {
  return "code" in payload && "message" in payload && !("orderId" in payload);
}

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const itemCount = useCart(selectCartItemCount);
  const subtotalPaise = useCart(selectCartSubtotalPaise);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const form = useForm<ShippingDetails>({
    resolver: zodResolver(shippingDetailsSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const onSubmit = async (values: ShippingDetails) => {
    if (items.length === 0) {
      setPaymentError("Your bag is empty.");
      return;
    }

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!key) {
      setPaymentError("Payment is not configured. Missing Razorpay key.");
      return;
    }

    setIsPaying(true);
    setPaymentError(null);

    try {
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const payload = (await orderResponse.json()) as CreateOrderApiResult;

      if (!orderResponse.ok || isApiError(payload)) {
        const message = isApiError(payload)
          ? payload.message
          : "Unable to create payment order.";
        throw new Error(message);
      }

      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout failed to initialize.");
      }

      const options: RazorpayOptions = {
        key,
        amount: payload.amount,
        currency: payload.currency,
        name: "AURELIA",
        description: `${itemCount} ${itemCount === 1 ? "piece" : "pieces"} · imitation jewellery`,
        order_id: payload.orderId,
        prefill: {
          name: values.fullName,
          email: values.email,
          contact: values.phone,
        },
        notes: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2 ?? "",
          city: values.city,
          state: values.state,
          pincode: values.pincode,
        },
        theme: {
          color: "#c4a574",
          backdrop_color: "#141210",
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
        handler: (response) => {
          const params = new URLSearchParams({
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
          });
          router.push(`/checkout/success?${params.toString()}`);
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", () => {
        setPaymentError("Payment failed. Please try again.");
        setIsPaying(false);
      });

      razorpay.open();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while starting payment.";
      setPaymentError(message);
      setIsPaying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-border px-6 py-12">
        <p className="font-heading text-2xl text-ink">Your bag is empty</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a piece before checking out.
        </p>
        <Button
          type="button"
          className="mt-6 rounded-none bg-ink text-ivory hover:bg-ink/90"
          onClick={() => router.push("/shop")}
        >
          Browse shop
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 pb-28 lg:pb-0"
        noValidate
      >
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl text-ink">Shipping details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Where should we send your pieces?
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="name"
                      className={fieldClassName}
                      disabled={isPaying}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      className={fieldClassName}
                      disabled={isPaying}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="10-digit mobile"
                      className={fieldClassName}
                      disabled={isPaying}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      autoComplete="address-line1"
                      className="min-h-24 rounded-none border-border bg-background px-3 text-sm md:text-sm"
                      disabled={isPaying}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Apartment, suite (optional)</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="address-line2"
                      className={fieldClassName}
                      disabled={isPaying}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="address-level2"
                      className={fieldClassName}
                      disabled={isPaying}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="address-level1"
                      className={fieldClassName}
                      disabled={isPaying}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      autoComplete="postal-code"
                      className={fieldClassName}
                      disabled={isPaying}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {paymentError ? (
          <p
            role="alert"
            className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {paymentError}
          </p>
        ) : null}

        <div className="hidden items-center justify-between gap-4 border-t border-border pt-6 lg:flex">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Order total
            </p>
            <PriceDisplay
              pricePaise={subtotalPaise}
              className="mt-1 [&_span:first-child]:text-lg"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Final amount is confirmed by the server before payment.
            </p>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isPaying}
            className="h-12 min-w-44 rounded-none bg-ink px-8 text-ivory hover:bg-ink/90 disabled:opacity-60"
          >
            {isPaying ? "Processing…" : "Pay Now"}
          </Button>
        </div>

        {/* Mobile sticky Pay Now — checkout UI rule */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-4">
            <PriceDisplay
              pricePaise={subtotalPaise}
              className="min-w-20 shrink-0"
            />
            <Button
              type="submit"
              size="lg"
              disabled={isPaying}
              className="h-12 flex-1 rounded-none bg-ink text-ivory hover:bg-ink/90 disabled:opacity-60"
            >
              {isPaying ? "Processing…" : "Pay Now"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
