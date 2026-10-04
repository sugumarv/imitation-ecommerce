import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PlatingColor, StoneType } from "@/types/product";

export type CartItem = {
  sku: string;
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  platingColor: PlatingColor;
  stoneType: StoneType;
  /** Display price only — server must recalculate before payment. */
  pricePaise: number;
  imageUrl: string;
  quantity: number;
};

export type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: ({ quantity, ...item }) => {
        const quantityToAdd = Math.max(1, quantity ?? 1);

        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItem.sku === item.sku,
          );

          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((cartItem) =>
                cartItem.sku === item.sku
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + quantityToAdd,
                      // Refresh display fields in case catalog data changed.
                      pricePaise: item.pricePaise,
                      imageUrl: item.imageUrl,
                      productName: item.productName,
                    }
                  : cartItem,
              ),
            };
          }

          return {
            isOpen: true,
            items: [...state.items, { ...item, quantity: quantityToAdd }],
          };
        });
      },

      removeItem: (sku) =>
        set((state) => ({
          items: state.items.filter((item) => item.sku !== sku),
        })),

      updateQuantity: (sku, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.sku !== sku),
            };
          }

          return {
            items: state.items.map((item) =>
              item.sku === sku ? { ...item, quantity } : item,
            ),
          };
        }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "aurelia-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function selectCartItemCount(state: CartState): number {
  return state.items.reduce((total, item) => total + item.quantity, 0);
}

/** Client-side subtotal for UI only — never trust for payment. */
export function selectCartSubtotalPaise(state: CartState): number {
  return state.items.reduce(
    (total, item) => total + item.pricePaise * item.quantity,
    0,
  );
}
