"use client";

import { getProduct, priceLine, type LineConfig } from "@/lib/catalog";
import { createPersistedStore } from "./persisted";

export interface CartLine {
  id: string;
  slug: string;
  qty: number;
  config: LineConfig;
}

interface CartState {
  lines: CartLine[];
  coupon: string | null;
  lastAddedAt: number;
}

export const cartStore = createPersistedStore<CartState>("dhm.cart.v1", { lines: [], coupon: null, lastAddedAt: 0 });
export const useCart = cartStore.useStore;

const uid = () => Math.random().toString(36).slice(2, 10);

export const cart = {
  add(slug: string, config: LineConfig, qty = 1) {
    cartStore.set((s) => ({ ...s, lines: [...s.lines, { id: uid(), slug, qty, config }], lastAddedAt: Date.now() }));
  },
  update(id: string, patch: Partial<Omit<CartLine, "id">>) {
    cartStore.set((s) => ({ ...s, lines: s.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  },
  remove(id: string) {
    cartStore.set((s) => ({ ...s, lines: s.lines.filter((l) => l.id !== id) }));
  },
  setCoupon(code: string | null) {
    cartStore.set((s) => ({ ...s, coupon: code }));
  },
  clear() {
    cartStore.set({ lines: [], coupon: null, lastAddedAt: 0 });
  },
};

export function lineTotals(line: CartLine) {
  const product = getProduct(line.slug);
  if (!product) return null;
  const price = priceLine(product, line.config);
  return { product, price, total: Math.round(price.unit * line.qty * 100) / 100 };
}

export function cartSummary(lines: CartLine[]) {
  let subtotal = 0;
  let count = 0;
  let hasSubscription = false;
  for (const l of lines) {
    const t = lineTotals(l);
    if (!t) continue;
    subtotal += t.total;
    count += l.qty;
    if (t.product.kind === "subscription") hasSubscription = true;
  }
  subtotal = Math.round(subtotal * 100) / 100;
  return { subtotal, count, hasSubscription, delivery: 0, total: subtotal };
}
