"use client";

import { ArrowRight, Receipt } from "lucide-react";
import Link from "next/link";
import { statusLabel } from "@/components/account/OrderDetails";
import { orders } from "@/lib/api";
import { money } from "@/lib/format";

export default function OrdersPage() {
  const list = orders.useMine();
  return (
    <div>
      <h1 className="text-3xl">Orders</h1>
      {list.length === 0 ? (
        <div className="card mt-6 grid place-items-center p-10 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-bg-subtle text-muted"><Receipt size={28} /></span>
          <p className="mt-4 font-display text-2xl font-semibold">No orders yet</p>
          <p className="mt-1 text-text-2">When you place an order, you&apos;ll find it here.</p>
          <Link href="/plans" className="btn btn-accent mt-6">Browse plans <ArrowRight size={18} /></Link>
        </div>
      ) : (
        <>
          {/* Table on desktop, cards on phones */}
          <div className="card mt-6 hidden overflow-hidden md:block">
            <table className="w-full text-left text-[0.95rem]">
              <thead className="bg-surface-2 text-xs font-extrabold uppercase tracking-wider text-muted">
                <tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Total</th><th className="px-5 py-3"><span className="sr-only">Actions</span></th></tr>
              </thead>
              <tbody>
                {list.map((o) => (
                  <tr key={o.id} className="border-t border-line">
                    <td className="px-5 py-4 font-bold">{o.number}</td>
                    <td className="px-5 py-4 text-text-2">{new Date(o.createdAt).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusLabel[o.status].cls}`}>{statusLabel[o.status].label}</span></td>
                    <td className="px-5 py-4 tabular-nums">{money(o.total)} <span className="text-muted">for {o.items.reduce((n, i) => n + i.qty, 0)} item(s)</span></td>
                    <td className="px-5 py-4 text-right"><Link href={`/account/orders/${o.id}`} className="btn btn-outline btn-sm">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-6 grid gap-3 md:hidden">
            {list.map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.id}`} className="card flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-bold">Order {o.number}</p>
                    <p className="text-sm text-muted">{new Date(o.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}</p>
                    <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-extrabold ${statusLabel[o.status].cls}`}>{statusLabel[o.status].label}</span>
                  </div>
                  <div className="text-right"><p className="font-bold tabular-nums">{money(o.total)}</p><ArrowRight size={16} className="ml-auto mt-2 text-muted" /></div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
