import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { CartDrawer } from "@/components/cart/cart-drawer";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURELIA | Imitation Jewellery",
  description:
    "Luxury imitation jewellery — plated finishes and stone-set pieces for everyday radiance.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
