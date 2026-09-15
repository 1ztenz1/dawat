import type { Order } from "@/lib/api";
import { formatDate } from "@/lib/dates";
import { money } from "@/lib/format";
import { provinces } from "@/lib/site";

export const statusLabel: Record<Order["status"], { label: string; cls: string }> = {
  processing: { label: "Processing", cls: "bg-accent-soft text-accent-text" },
  "on-hold": { label: "On hold (COD)", cls: "bg-warning-soft text-accent-text" },
  completed: { label: "Completed", cls: "bg-success-soft text-success" },
  cancelled: { label: "Cancelled", cls: "bg-danger-soft text-danger" },
};

export function AddressBlock({ a }: { a: Order["shipping"] }) {
  return (
    <address className="not-italic leading-relaxed text-text-2">
      {a.firstName} {a.lastName}
      {a.company && <><br />{a.company}</>}
      <br />{a.address1}{a.address2 && `, ${a.address2}`}
      <br />{a.city}, {provinces.find((p) => p[0] === a.province)?.[0] ?? a.province} {a.postalCode}
      {a.buzzer && <><br />Buzzer: {a.buzzer}</>}
      {a.phone && <><br />{a.phone}</>}
    </address>
  );
}

export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2 px-5 py-4 sm:px-6">
        <div>
          <p className="font-bold">Order {order.number}</p>
          <p className="text-sm text-muted">Placed {new Date(order.createdAt).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusLabel[order.status].cls}`}>{statusLabel[order.status].label}</span>
      </div>
      <ul className="divide-y divide-line px-5 sm:px-6">
        {order.items.map((i, idx) => (
          <li key={idx} className="flex justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="font-bold">{i.name} <span className="font-semibold text-muted">× {i.qty}</span></p>
              <p className="text-sm text-muted">Starts {formatDate(i.config.startDate)}</p>
              <ul className="mt-1 text-sm text-text-2">{i.details.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
            <p className="shrink-0 font-bold tabular-nums">{money(i.total)}</p>
          </li>
        ))}
      </ul>
      <dl className="grid gap-2 border-t border-line px-5 py-4 text-[0.95rem] sm:px-6">
        <div className="flex justify-between"><dt className="text-text-2">Subtotal</dt><dd className="tabular-nums">{money(order.subtotal)}</dd></div>
        {order.discount > 0 && <div className="flex justify-between text-success"><dt>Discount</dt><dd>−{money(order.discount)}</dd></div>}
        <div className="flex justify-between"><dt className="text-text-2">Delivery</dt><dd>Free</dd></div>
        <div className="flex justify-between"><dt className="text-text-2">Payment method</dt><dd>{order.payment.label}</dd></div>
        <div className="flex justify-between border-t border-line pt-2 text-lg font-bold"><dt>Total</dt><dd className="tabular-nums">{money(order.total)}</dd></div>
      </dl>
      {order.notes && <p className="border-t border-line px-5 py-4 text-sm sm:px-6"><b>Note:</b> {order.notes}</p>}
      <div className="grid gap-6 border-t border-line px-5 py-5 sm:grid-cols-2 sm:px-6">
        <div><p className="mb-1 text-sm font-bold">Delivery address</p><AddressBlock a={order.shipping} /></div>
        <div><p className="mb-1 text-sm font-bold">Billing address</p><AddressBlock a={order.billing} /></div>
      </div>
    </div>
  );
}
