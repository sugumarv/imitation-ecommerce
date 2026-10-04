/**
 * Browser Checkout.js typings for `window.Razorpay`.
 * Server SDK types come from the `razorpay` npm package.
 */

export type RazorpayPaymentSuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type RazorpayModalDismissResponse = {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id?: string;
      payment_id?: string;
    };
  };
};

export type RazorpayPrefill = {
  name?: string;
  email?: string;
  contact?: string;
  method?: "card" | "netbanking" | "wallet" | "emi" | "upi";
};

export type RazorpayTheme = {
  color?: string;
  backdrop_color?: string;
  hide_topbar?: boolean;
};

export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: RazorpayPrefill;
  notes?: Record<string, string | number>;
  theme?: RazorpayTheme;
  modal?: {
    backdropclose?: boolean;
    escape?: boolean;
    handleback?: boolean;
    confirm_close?: boolean;
    ondismiss?: () => void;
    animation?: boolean;
  };
  handler: (response: RazorpayPaymentSuccessResponse) => void;
  readonly?: {
    contact?: boolean;
    email?: boolean;
    name?: boolean;
  };
  hidden?: {
    contact?: boolean;
    email?: boolean;
  };
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  remember_customer?: boolean;
  timeout?: number;
};

export type RazorpayInstance = {
  open: () => void;
  close: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayModalDismissResponse) => void,
  ) => void;
};

export type RazorpayConstructor = new (
  options: RazorpayOptions,
) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

export {};
