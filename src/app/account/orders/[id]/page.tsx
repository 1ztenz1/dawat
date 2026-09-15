"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { OrderDetails } from "@/components/account/OrderDetails";
import { toast } from "@/components/ui/toast";
import { orders } from "@/lib/api";
import { earliestStartDate, toISO } from "@/lib/dates";
import { cart } from "@/lib/store/cart";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const order = orders.useMine().find((o) => o.id === id);

  if (!order)
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-2xl font-semibold">Order not found</p>
        <Link href="/account/orders" className="btn btn-primary mt-5">Back to orders</Link>
      </div>
    );

  const reorder = () => {
    const start = toISO(earliestStartDate());
    order.items.forEach((i) => cart.add(i.slug, { ...i.config, startDate: start }, i.qty));
    toast("Added to your cart with the earliest start date");
    router.push("/cart");
  };

  return (
    <div className="grid gap-5">
      <Link href="/account/orders" className="flex items-center gap-1.5 text-sm font-bold text-muted hover:text-text"><ArrowLeft size={16} /> All orders</Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Order {order.number}</h1>
        <button onClick={reorder} className="btn btn-accent btn-sm"><RotateCcw size={16} /> Order again</button>
      </div>
      <OrderDetails order={order} />
      {order.subscriptionIds.length > 0 && (
        <p className="text-sm text-text-2">This order started {order.subscriptionIds.length} subscription{order.subscriptionIds.length > 1 ? "s" : ""}. <Link href="/account/subscriptions" className="font-bold text-brand-text underline">Manage subscriptions</Link></p>
      )}
    </div>
  );
}
