"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Stepper } from "@/components/ui/form";
import { describeConfig, productName } from "@/lib/catalog";
import { formatDate } from "@/lib/dates";
import { money } from "@/lib/format";
import { cart, cartSummary, lineTotals, useCart, type CartLine } from "@/lib/store/cart";
import { ui, useUi } from "@/lib/store/ui";
import { productImage } from "@/components/plans/images";

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const { lines, lastAddedAt } = useCart();
  const pathname = usePathname();
  const summary = cartSummary(lines);
  const mountedAt = useRef(0);

  // Open automatically when something is added during this visit
  // (not when a stored cart is restored on page load).
  useEffect(() => {
    if (!mountedAt.current) mountedAt.current = Date.now();
    if (lastAddedAt > mountedAt.current) ui.set({ cartOpen: true });
  }, [lastAddedAt]);

  useEffect(() => ui.set({ cartOpen: false }), [pathname]);

  return (
    <Sheet
      open={open}
      onClose={() => ui.set({ cartOpen: false })}
      variant="drawer"
      title={<span className="flex items-center gap-2">Your cart {summary.count > 0 && <span className="rounded-full bg-accent-soft px-2 py-0.5 font-sans text-sm font-bold text-accent-text">{summary.count}</span>}</span>}
      footer={
        lines.length > 0 && (
          <div className="grid gap-3">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-text-2">Subtotal</span>
              <span className="font-display text-2xl font-semibold tabular-nums">{money(summary.subtotal)}</span>
            </div>
            <p className="-mt-2 text-xs text-muted">Delivery included. Taxes and coupons at checkout.</p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/cart" onClick={() => ui.set({ cartOpen: false })} className="btn btn-outline">View cart</Link>
              <Link href="/checkout" onClick={() => ui.set({ cartOpen: false })} className="btn btn-accent">Checkout</Link>
            </div>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="grid place-items-center gap-3 py-12 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-bg-subtle text-muted"><ShoppingBag size={28} /></span>
          <p className="font-display text-xl">Your cart is empty</p>
          <p className="max-w-xs text-sm text-muted">Pick a plan or try a meal for a few days, and it&apos;ll show up here.</p>
          <div className="mt-2 flex gap-2">
            <Link href="/plans" onClick={() => ui.set({ cartOpen: false })} className="btn btn-primary btn-sm">Browse plans</Link>
            <Link href="/trial" onClick={() => ui.set({ cartOpen: false })} className="btn btn-outline btn-sm">Try a meal</Link>
          </div>
        </div>
      ) : (
        <ul className="grid gap-3">
          {lines.map((l) => <MiniLine key={l.id} line={l} />)}
        </ul>
      )}
    </Sheet>
  );
}

function MiniLine({ line }: { line: CartLine }) {
  const t = lineTotals(line);
  if (!t) return null;
  return (
    <li className="flex gap-3 rounded-2xl border border-line bg-surface-2 p-3">
      <Image src={productImage(t.product)} alt="" className="size-16 shrink-0 rounded-xl object-cover" sizes="64px" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold leading-tight">{productName(t.product)}</p>
          <button onClick={() => cart.remove(line.id)} className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-danger-soft hover:text-danger" aria-label="Remove">
            <Trash2 size={16} />
          </button>
        </div>
        <p className="mt-0.5 text-xs text-muted">Starts {formatDate(line.config.startDate)} · {describeConfig(line.config)[0]}</p>
        <div className="mt-2 flex items-center justify-between">
          <Stepper size="sm" value={line.qty} min={1} max={10} onChange={(qty) => cart.update(line.id, { qty })} label="quantity" />
          <span className="font-bold tabular-nums">{money(t.total)}</span>
        </div>
      </div>
    </li>
  );
}
