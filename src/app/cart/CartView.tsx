"use client";

import { ArrowRight, CalendarDays, Lock, Pencil, ShoppingBag, Tag, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { productImage } from "@/components/plans/images";
import { Stepper } from "@/components/ui/form";
import { describeConfig, frequencies, productName } from "@/lib/catalog";
import { formatDate } from "@/lib/dates";
import { money } from "@/lib/format";
import { cart, cartSummary, lineTotals, useCart } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/persisted";
import { CouponBox } from "@/components/cart/CouponBox";

export function CartView() {
  const hydrated = useHydrated();
  const { lines } = useCart();
  const summary = cartSummary(lines);

  if (!hydrated) return <div className="container-x section"><div className="h-64 animate-pulse rounded-3xl bg-bg-subtle" /></div>;

  if (!lines.length)
    return (
      <div className="container-x section grid place-items-center text-center">
        <span className="grid size-20 place-items-center rounded-full bg-bg-subtle text-muted"><ShoppingBag size={34} /></span>
        <h1 className="mt-5 text-4xl">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-text-2">Freshly cooked halal meals are a few taps away. Pick a plan, or try us for a few days.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/plans" className="btn btn-accent btn-lg">Browse meal plans</Link>
          <Link href="/trial" className="btn btn-outline btn-lg">Try a meal</Link>
        </div>
      </div>
    );

  return (
    <div className="container-x pb-32 pt-8 sm:pb-20 sm:pt-12">
      <h1 className="text-4xl sm:text-5xl">Your cart</h1>
      <p className="mt-2 text-muted">{summary.count} {summary.count === 1 ? "item" : "items"}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
        <ul className="grid gap-4">
          {lines.map((line) => {
            const t = lineTotals(line);
            if (!t) return null;
            const details = describeConfig(line.config);
            return (
              <li key={line.id} className="card flex gap-4 p-4 sm:p-5">
                <Link href={`/product/${line.slug}`} className="shrink-0">
                  <Image src={productImage(t.product)} alt="" sizes="112px" className="size-20 rounded-2xl object-cover sm:size-28" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/product/${line.slug}`} className="text-lg font-bold leading-tight hover:text-brand-text">{productName(t.product)}</Link>
                      <p className="mt-0.5 text-sm text-muted">
                        {t.product.kind === "subscription" ? `${money(t.price.unit)} every ${frequencies[t.product.frequency].renewDays} days` : `${money(t.price.unit)} one-time`}
                      </p>
                    </div>
                    <p className="font-display text-xl font-semibold tabular-nums">{money(t.total)}</p>
                  </div>
                  <ul className="mt-3 grid gap-1 text-sm text-text-2">
                    <li className="flex items-center gap-2"><CalendarDays size={14} className="text-accent-text" /> Starts {formatDate(line.config.startDate, { weekday: "long", month: "long", day: "numeric" })}</li>
                    {details.map((d) => <li key={d} className="pl-[22px]">{d}</li>)}
                  </ul>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <Stepper size="sm" value={line.qty} min={1} max={10} onChange={(qty) => cart.update(line.id, { qty })} label="quantity" />
                    <div className="flex gap-1">
                      <Link href={`/product/${line.slug}`} onClick={() => cart.remove(line.id)} className="btn btn-sm text-text-2 hover:bg-bg-subtle"><Pencil size={15} /> Edit</Link>
                      <button onClick={() => cart.remove(line.id)} className="btn btn-sm text-danger hover:bg-danger-soft"><Trash2 size={15} /> Remove</button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <li><Link href="/plans" className="text-sm font-semibold text-brand-text underline underline-offset-4">← Continue shopping</Link></li>
        </ul>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="text-2xl">Cart totals</h2>
            <dl className="mt-5 grid gap-3 text-[0.95rem]">
              <div className="flex justify-between"><dt className="text-text-2">Subtotal</dt><dd className="font-bold tabular-nums">{money(summary.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="flex items-center gap-2 text-text-2"><Truck size={16} /> Delivery</dt><dd className="font-bold text-success">Included</dd></div>
            </dl>
            <div className="mt-5 border-t border-line pt-5">
              <p className="mb-2 flex items-center gap-2 text-sm font-bold"><Tag size={15} /> Have a coupon?</p>
              <CouponBox subtotal={summary.subtotal} />
            </div>
            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
              <span className="font-bold">Total</span>
              <span className="font-display text-3xl font-semibold tabular-nums">{money(summary.total)}</span>
            </div>
            {summary.hasSubscription && <p className="mt-2 text-xs text-muted">Subscriptions renew automatically. Recurring totals are shown at checkout.</p>}
            <Link href="/checkout" className="btn btn-accent btn-lg btn-block mt-6">Proceed to checkout <ArrowRight size={18} /></Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted"><Lock size={13} /> Secure checkout powered by Stripe</p>
          </div>
        </aside>
      </div>

      {/* Phone: sticky checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted">Total</p>
            <p className="font-display text-2xl font-semibold leading-none tabular-nums">{money(summary.total)}</p>
          </div>
          <Link href="/checkout" className="btn btn-accent">Checkout <ArrowRight size={18} /></Link>
        </div>
      </div>
    </div>
  );
}
