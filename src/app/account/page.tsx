"use client";

import { ArrowRight, CalendarDays, CreditCard, MapPin, Receipt, Repeat } from "lucide-react";
import Link from "next/link";
import { MenuTable } from "@/components/menu/MenuTable";
import { orders, subscriptionsApi, useUser } from "@/lib/api";
import { formatDate, formatLongDate } from "@/lib/dates";
import { money } from "@/lib/format";
import { SubStatus } from "./subscriptions/SubStatus";

export default function AccountDashboard() {
  const user = useUser()!;
  const subs = subscriptionsApi.useMine();
  const myOrders = orders.useMine();
  const active = subs.filter((s) => s.status === "active" || s.status === "pending-cancel");
  const next = active
    .map((s) => ({ s, date: subscriptionsApi.upcoming(s, 10).find((d) => !s.skippedDates.includes(d)) }))
    .filter((x) => x.date)
    .sort((a, b) => a.date!.localeCompare(b.date!))[0];

  return (
    <div className="grid gap-6">
      <p className="text-text-2">
        From your account dashboard you can manage your <Link href="/account/subscriptions" className="font-bold text-brand-text underline">subscriptions</Link>, view your{" "}
        <Link href="/account/orders" className="font-bold text-brand-text underline">recent orders</Link>, manage your <Link href="/account/addresses" className="font-bold text-brand-text underline">delivery addresses</Link>, and{" "}
        <Link href="/account/details" className="font-bold text-brand-text underline">edit your password and account details</Link>.
      </p>

      {next ? (
        <div className="relative overflow-hidden rounded-[1.75rem] bg-deep p-6 text-on-deep shadow-lift sm:p-8">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(400px_260px_at_100%_0%,rgb(230_162_60/0.3),transparent_60%)]" />
          <p className="relative flex items-center gap-2 text-sm font-bold text-gold-300"><CalendarDays size={16} /> Next delivery</p>
          <p className="relative mt-2 font-display text-3xl font-semibold sm:text-4xl">{formatLongDate(next.date!)}</p>
          <p className="relative mt-1 text-on-deep-2">{next.s.name}</p>
          <div className="relative mt-5 flex flex-wrap gap-2">
            <Link href={`/account/subscriptions/${next.s.id}`} className="btn btn-accent btn-sm">Skip or manage</Link>
            <Link href="/menu" className="btn btn-ghost-light btn-sm">See the menu</Link>
          </div>
        </div>
      ) : (
        <div className="card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-2xl font-semibold">No active plan yet</p>
            <p className="text-text-2">Start a weekly or monthly plan, or try a meal for a few days.</p>
          </div>
          <Link href="/plans" className="btn btn-accent shrink-0">Browse plans <ArrowRight size={18} /></Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { href: "/account/subscriptions", label: "Subscriptions", value: active.length, Icon: Repeat },
          { href: "/account/orders", label: "Orders", value: myOrders.length, Icon: Receipt },
          { href: "/account/addresses", label: "Addresses", value: user.shipping ? "Saved" : "Add", Icon: MapPin },
          { href: "/account/payment-methods", label: "Payment", value: "Manage", Icon: CreditCard },
        ].map(({ href, label, value, Icon }) => (
          <Link key={href} href={href} className="card p-5 transition-shadow hover:shadow-card">
            <Icon size={20} className="text-accent-text" />
            <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>

      {subs.length > 0 && (
        <section className="card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl">Your subscriptions</h2><Link href="/account/subscriptions" className="text-sm font-bold text-brand-text">View all</Link></div>
          <ul className="divide-y divide-line">
            {subs.slice(0, 3).map((s) => (
              <li key={s.id}>
                <Link href={`/account/subscriptions/${s.id}`} className="flex items-center justify-between gap-3 py-3">
                  <div><p className="font-bold">{s.name}</p><p className="text-sm text-muted">{s.number} · renews {formatDate(s.nextRenewal)}</p></div>
                  <SubStatus status={s.status} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {myOrders.length > 0 && (
        <section className="card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl">Recent orders</h2><Link href="/account/orders" className="text-sm font-bold text-brand-text">View all</Link></div>
          <ul className="divide-y divide-line">
            {myOrders.slice(0, 3).map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.id}`} className="flex items-center justify-between gap-3 py-3">
                  <div><p className="font-bold">Order {o.number}</p><p className="text-sm text-muted">{new Date(o.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })} · {o.items.length} item{o.items.length > 1 ? "s" : ""}</p></div>
                  <span className="font-bold tabular-nums">{money(o.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl"><CalendarDays size={20} className="text-accent-text" /> This week&apos;s menu</h2>
        <MenuTable compact />
      </section>
    </div>
  );
}
