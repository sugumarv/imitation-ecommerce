import type { PlatingColor, StoneType } from "@/types/product";

export const platingColorLabels: Record<PlatingColor, string> = {
  oxidized: "Oxidized",
  gold_plated: "Gold plated",
  rhodium: "Rhodium",
  rose_gold: "Rose gold",
  silver: "Silver",
};

export const stoneTypeLabels: Record<StoneType, string> = {
  ad: "AD",
  kundan: "Kundan",
  polki: "Polki",
  pearl: "Pearl",
  meenakari: "Meenakari",
  none: "No stone",
};

export const platingSwatches: Record<PlatingColor, string> = {
  oxidized: "#3a342c",
  gold_plated: "#c4a574",
  rhodium: "#c8c8c8",
  rose_gold: "#b76e79",
  silver: "#a8a9ad",
};
