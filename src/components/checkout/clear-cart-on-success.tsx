"use client";

import { useEffect } from "react";

import { useCart } from "@/store/useCart";

/** Clears the persisted bag after a successful Razorpay payment redirect. */
export function ClearCartOnSuccess() {
  const clearCart = useCart((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
