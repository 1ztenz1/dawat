"use client";

import { ArrowRight, CalendarDays, Check, MessageSquareText, Package, Repeat } from "lucide-react";
import Link from "next/link";
import { orders, useUser } from "@/lib/api";
import { formatLongDate } from "@/lib/dates";
import { money } from "@/lib/format";
import { useHydrated } from "@/lib/store/persisted";
import { OrderDetails } from "@/components/account/OrderDetails";

export function OrderReceived({ id }: { id: string | null }) {
  const hydrated = useHydrated();
  const order = orders.useOne(id);
  const user = useUser();

  if (!hydrated) return <div className="container-x section"><div className="h-96 animate-pulse rounded-3xl bg-bg-subtle" /></div>;

  if (!order)
    return (
      <div className="container-x section text-center">
        <h1 className="text-4xl">We couldn&apos;t find that order</h1>
        <p className="mt-3 text-text-2">If you just placed it, check your email for the confirmation.</p>
        <Link href={user ? "/account/orders" : "/"} className="btn btn-primary mt-8">{user ? "View my orders" : "Back to home"}</Link>
      </div>
    );

  const firstStart = order.items.map((i) => i.config.startDate).sort()[0];

  return (
    <div className="container-x max-w-4xl pb-16 pt-10 sm:pt-16">
      <div className="text-center">
        <span className="animate-pop mx-auto grid size-20 place-items-center rounded-full bg-success text-white shadow-lift"><Check size={40} strokeWidth={3} /></span>
        <p className="eyebrow mt-6 justify-center">Order {order.number}</p>
        <h1 className="text-[clamp(2.2rem,1.6rem+2.5vw,3.5rem)]">Thank you, {order.billing.firstName}!</h1>
        <p className="mx-auto mt-3 max-w-lg text-lg text-text-2">Your order has been received. A confirmation is on its way to <b className="text-text">{order.email}</b>.</p>
      </div>

      <ol className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          { Icon: Package, title: "We're preparing", text: order.payment.method === "cod" ? "Cash on delivery: have the exact amount ready." : "Your payment was successful." },
          { Icon: CalendarDays, title: "First delivery", text: formatLongDate(firstStart) },
          { Icon: MessageSquareText, title: "Track by SMS", text: `Updates and a tracking link go to ${order.shipping.phone || "your phone"}.` },
        ].map(({ Icon, title, text }) => (
          <li key={title} className="card flex items-start gap-3 p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text"><Icon size={20} /></span>
            <div><p className="font-bold">{title}</p><p className="text-sm text-text-2">{text}</p></div>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <OrderDetails order={order} />
      </div>

      {order.subscriptionIds.length > 0 && (
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-[1.75rem] bg-deep p-6 text-on-deep sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <Repeat className="mt-1 shrink-0 text-gold-300" />
            <div>
              <p className="font-bold">Your subscription is active</p>
              <p className="text-sm text-on-deep-2">Pause, skip days, change your protein or cancel anytime.</p>
            </div>
          </div>
          <Link href="/account/subscriptions" className="btn btn-accent shrink-0">Manage subscription <ArrowRight size={18} /></Link>
        </div>
      )}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/menu" className="btn btn-outline">See this week&apos;s menu</Link>
        {user ? <Link href="/account/orders" className="btn btn-primary">View my orders</Link> : <Link href="/" className="btn btn-primary">Back to home</Link>}
      </div>
      <p className="mt-6 text-center text-sm text-muted">Total paid {money(order.total)} · {order.payment.label}</p>
    </div>
  );
}
