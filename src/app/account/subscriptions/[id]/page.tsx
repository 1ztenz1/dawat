"use client";

import { ArrowLeft, Banknote, CalendarDays, CalendarX2, CreditCard, History, MapPin, Pause, Pencil, Play, Repeat, SlidersHorizontal, Undo2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AddressBlock } from "@/components/account/OrderDetails";
import { AddressFields, validateAddress } from "@/components/checkout/AddressFields";
import { Stepper, SubmitButton, Switch } from "@/components/ui/form";
import { Sheet } from "@/components/ui/Sheet";
import { toast } from "@/components/ui/toast";
import { account, subscriptionsApi, type Address, type Subscription } from "@/lib/api";
import { deliverySpots, extras, getProduct, priceLine, proteins, type SubscriptionConfig } from "@/lib/catalog";
import { addDays, earliestStartDate, formatDate, formatLongDate, toISO } from "@/lib/dates";
import { cn, money } from "@/lib/format";
import { SubStatus } from "../SubStatus";

export default function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sub = subscriptionsApi.useMine().find((s) => s.id === id);

  if (!sub)
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-2xl font-semibold">Subscription not found</p>
        <Link href="/account/subscriptions" className="btn btn-primary mt-5">Back to subscriptions</Link>
      </div>
    );

  return <Detail sub={sub} />;
}

function Detail({ sub }: { sub: Subscription }) {
  const [sheet, setSheet] = useState<null | "pause" | "cancel" | "prefs" | "address" | "payment">(null);
  const [busy, setBusy] = useState<string | null>(null);
  const close = () => setSheet(null);
  const earliest = toISO(earliestStartDate());
  const upcoming = subscriptionsApi.upcoming(sub, 10);
  const ended = sub.status === "cancelled";

  const run = async (key: string, fn: () => Promise<void>, msg: string) => {
    setBusy(key);
    try {
      await fn();
      toast(msg);
      close();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Something went wrong", "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid gap-5">
      <Link href="/account/subscriptions" className="flex items-center gap-1.5 text-sm font-bold text-muted hover:text-text"><ArrowLeft size={16} /> All subscriptions</Link>

      <header className="card p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-muted">Subscription {sub.number}</p>
            <h1 className="mt-1 text-3xl">{sub.name}</h1>
          </div>
          <SubStatus status={sub.status} className="text-sm" />
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Price" value={`${money(sub.price)}`} sub={`every ${sub.renewDays} days`} />
          <Stat label={sub.status === "pending-cancel" ? "Ends on" : "Next renewal"} value={formatDate(sub.nextRenewal)} sub={`${sub.mealsPerCycle} meals / cycle`} />
          <Stat label="Started" value={formatDate(sub.startDate)} sub="Mon–Fri deliveries" />
          <Stat label="Payment" value={sub.payment.method === "cod" ? "Cash" : "Card"} sub={sub.payment.label} />
        </dl>

        {sub.status === "paused" && sub.pausedUntil && (
          <p className="mt-5 rounded-2xl bg-warning-soft px-4 py-3 text-sm font-semibold text-accent-text">Paused. Deliveries resume on {formatLongDate(sub.pausedUntil)}.</p>
        )}
        {sub.status === "pending-cancel" && (
          <p className="mt-5 rounded-2xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">Cancellation requested. You&apos;ll keep getting meals until {formatLongDate(sub.nextRenewal)}, and it won&apos;t renew.</p>
        )}

        {!ended && (
          <div className="mt-6 flex flex-wrap gap-2">
            {sub.status === "active" && <button className="btn btn-outline btn-sm" onClick={() => setSheet("pause")}><Pause size={16} /> Pause</button>}
            {sub.status === "paused" && (
              <SubmitButton type="button" pending={busy === "resume"} className="btn-primary btn-sm" onClick={() => run("resume", () => subscriptionsApi.resume(sub.id), "Subscription resumed")}><Play size={16} /> Resume now</SubmitButton>
            )}
            {sub.status !== "pending-cancel" ? (
              <button className="btn btn-sm text-danger hover:bg-danger-soft" onClick={() => setSheet("cancel")}><CalendarX2 size={16} /> Cancel subscription</button>
            ) : (
              <SubmitButton type="button" pending={busy === "reactivate"} className="btn-primary btn-sm" onClick={() => run("reactivate", () => subscriptionsApi.reactivate(sub.id), "Your subscription will keep renewing")}><Undo2 size={16} /> Keep my subscription</SubmitButton>
            )}
          </div>
        )}
      </header>

      {/* Upcoming deliveries with skip */}
      <Panel title="Upcoming deliveries" Icon={CalendarDays} aside={<span className="text-xs text-muted">Skip by 6 PM ET the day before</span>}>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {upcoming.map((d) => {
            const skipped = sub.skippedDates.includes(d);
            const locked = d < earliest || sub.status !== "active";
            const pausedDay = sub.status === "paused" && sub.pausedUntil && d < sub.pausedUntil;
            return (
              <li key={d}>
                <button
                  disabled={locked || busy === d}
                  onClick={() => run(d, () => subscriptionsApi.toggleSkip(sub.id, d), skipped ? `Delivery on ${formatDate(d)} restored` : `Skipped ${formatDate(d)}`)}
                  className={cn(
                    "grid w-full gap-0.5 rounded-2xl border-[1.5px] p-3 text-left transition-colors",
                    skipped || pausedDay ? "border-dashed border-line-strong bg-bg-subtle text-muted" : "border-line bg-surface",
                    !locked && "hover:border-brand-text",
                    locked && "cursor-not-allowed",
                  )}
                >
                  <span className={cn("text-sm font-bold", (skipped || pausedDay) && "line-through")}>{formatDate(d)}</span>
                  <span className="text-xs font-semibold">{pausedDay ? "Paused" : skipped ? "Skipped · tap to undo" : locked ? "Being prepared" : "Tap to skip"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>

      <div className="grid gap-5 md:grid-cols-2">
        <Panel title="Meal preferences" Icon={SlidersHorizontal} aside={!ended && <EditBtn onClick={() => setSheet("prefs")} />}>
          {sub.config.kind === "subscription" && (
            <ul className="grid gap-1.5 text-text-2">
              <li><b className="text-text">Protein:</b> {[...proteins.veg, ...proteins.nonveg].find((p) => p.id === (sub.config as SubscriptionConfig).protein)?.label}</li>
              <li><b className="text-text">Drop-off:</b> {deliverySpots.find((s) => s.id === sub.config.spot)?.label}</li>
              <li><b className="text-text">Extras:</b> {extras.filter((e) => (sub.config as SubscriptionConfig).extras[e.id] > 0).map((e) => `${(sub.config as SubscriptionConfig).extras[e.id]}× ${e.label} ${e.detail}`).join(", ") || "None"}</li>
              <li><b className="text-text">Notes:</b> {(sub.config as SubscriptionConfig).allergies || "None"}</li>
            </ul>
          )}
        </Panel>
        <Panel title="Delivery address" Icon={MapPin} aside={!ended && <EditBtn onClick={() => setSheet("address")} />}>
          <AddressBlock a={sub.shipping} />
        </Panel>
        <Panel title="Payment method" Icon={CreditCard} aside={!ended && <EditBtn onClick={() => setSheet("payment")} label="Change" />}>
          <p className="flex items-center gap-2 font-semibold">{sub.payment.method === "cod" ? <Banknote size={18} /> : <CreditCard size={18} />} {sub.payment.label}</p>
          <p className="mt-1 text-sm text-muted">{sub.payment.method === "cod" ? "Pay the driver at the start of each renewal." : "Charged automatically at each renewal."}</p>
        </Panel>
        <Panel title="Activity" Icon={History}>
          <ol className="grid gap-2.5 text-sm">
            {sub.activity.slice(0, 6).map((a, i) => (
              <li key={i} className="flex gap-3"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" /><span><span className="text-text-2">{a.text}</span><br /><span className="text-xs text-muted">{new Date(a.at).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })}</span></span></li>
            ))}
          </ol>
          <Link href={`/account/orders/${sub.orderId}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-text"><Repeat size={14} /> View original order</Link>
        </Panel>
      </div>

      <PauseSheet open={sheet === "pause"} onClose={close} busy={busy === "pause"} onPause={(until) => run("pause", () => subscriptionsApi.pause(sub.id, until), `Paused until ${formatDate(until)}`)} />
      <CancelSheet open={sheet === "cancel"} onClose={close} sub={sub} busy={busy === "cancel"} onCancel={(reason) => run("cancel", () => subscriptionsApi.cancel(sub.id, reason), "Cancellation requested")} />
      {sub.config.kind === "subscription" && sheet === "prefs" && (
        <PrefsSheet sub={sub} onClose={close} busy={busy === "prefs"} onSave={(patch) => run("prefs", () => subscriptionsApi.updatePreferences(sub.id, patch), "Preferences saved")} />
      )}
      {sheet === "address" && <AddressSheet initial={sub.shipping} onClose={close} busy={busy === "address"} onSave={(a) => run("address", () => subscriptionsApi.updateShipping(sub.id, a), "Delivery address updated")} />}
      {sheet === "payment" && <PaymentSheet sub={sub} onClose={close} busy={busy === "payment"} onSave={(m, l) => run("payment", () => subscriptionsApi.updatePayment(sub.id, m, l), "Payment method updated")} />}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-bg-subtle p-3.5">
      <dt className="text-xs font-bold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 font-display text-xl font-semibold">{value}</dd>
      <dd className="truncate text-xs text-muted">{sub}</dd>
    </div>
  );
}

function Panel({ title, Icon, aside, children }: { title: string; Icon: typeof MapPin; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg"><Icon size={18} className="text-accent-text" /> {title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

const EditBtn = ({ onClick, label = "Edit" }: { onClick: () => void; label?: string }) => (
  <button onClick={onClick} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-brand-text hover:bg-brand-soft"><Pencil size={14} /> {label}</button>
);

function PauseSheet({ open, onClose, onPause, busy }: { open: boolean; onClose: () => void; onPause: (until: string) => void; busy: boolean }) {
  const [weeks, setWeeks] = useState(1);
  const base = earliestStartDate();
  const until = toISO(addDays(base, weeks * 7));
  return (
    <Sheet open={open} onClose={onClose} title="Pause deliveries" footer={<SubmitButton type="button" pending={busy} className="btn-primary btn-block" onClick={() => onPause(until)}>Pause until {formatDate(until)}</SubmitButton>}>
      <p className="text-text-2">Going away? Pause and we&apos;ll hold your plan. Remaining meals are kept for when you&apos;re back.</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((w) => (
          <label key={w} className="tile">
            <input type="radio" name="pause" checked={weeks === w} onChange={() => setWeeks(w)} />
            <span className="tile-body"><b>{w} week{w > 1 ? "s" : ""}</b><span className="text-sm text-muted">Back {formatDate(toISO(addDays(base, w * 7)))}</span></span>
          </label>
        ))}
      </div>
    </Sheet>
  );
}

function CancelSheet({ open, onClose, onCancel, busy, sub }: { open: boolean; onClose: () => void; onCancel: (reason: string) => void; busy: boolean; sub: Subscription }) {
  const [reason, setReason] = useState("");
  const reasons = ["Too expensive", "Going on vacation", "Didn't like the food", "Delivery issues", "Moving out of the area", "Other"];
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Cancel subscription?"
      footer={
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-outline" onClick={onClose}>Keep plan</button>
          <SubmitButton type="button" pending={busy} className="btn-danger" onClick={() => onCancel(reason)}>Cancel plan</SubmitButton>
        </div>
      }
    >
      <p className="text-text-2">You&apos;ll keep receiving meals until <b className="text-text">{formatLongDate(sub.nextRenewal)}</b>. After that it won&apos;t renew. Would a pause work instead?</p>
      <p className="label mt-5">Mind telling us why? <span className="font-medium text-muted">(optional)</span></p>
      <div className="grid gap-2">
        {reasons.map((r) => (
          <label key={r} className="tile">
            <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} />
            <span className="tile-body font-semibold">{r}</span>
          </label>
        ))}
      </div>
    </Sheet>
  );
}

function PrefsSheet({ sub, onClose, onSave, busy }: { sub: Subscription; onClose: () => void; onSave: (p: Partial<SubscriptionConfig>) => void; busy: boolean }) {
  const cfg = sub.config as SubscriptionConfig;
  const product = getProduct(sub.slug)!;
  const [protein, setProtein] = useState(cfg.protein);
  const [spot, setSpot] = useState(cfg.spot);
  const [ex, setEx] = useState(cfg.extras);
  const [allergies, setAllergies] = useState(cfg.allergies);
  const newPrice = priceLine(product, { ...cfg, protein, spot, extras: ex, allergies }).unit;
  const isVeg = product.kind === "subscription" && product.diet === "veg";

  return (
    <Sheet open onClose={onClose} title="Meal preferences" footer={<SubmitButton type="button" pending={busy} className="btn-primary btn-block" onClick={() => onSave({ protein, spot, extras: ex, allergies })}>Save · {money(newPrice)} per renewal</SubmitButton>}>
      <div className="grid gap-6">
        {!isVeg && (
          <div>
            <p className="label">Protein</p>
            <div className="grid grid-cols-2 gap-2">
              {proteins.nonveg.map((p) => (
                <label key={p.id} className="tile"><input type="radio" name="p-protein" checked={protein === p.id} onChange={() => setProtein(p.id)} /><span className="tile-body font-bold">{p.label}</span></label>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="label">Drop-off</p>
          <div className="grid grid-cols-2 gap-2">
            {deliverySpots.map((s) => (
              <label key={s.id} className="tile"><input type="radio" name="p-spot" checked={spot === s.id} onChange={() => setSpot(s.id)} /><span className="tile-body"><b>{s.label}</b><span className="text-xs text-muted">{s.hint}</span></span></label>
            ))}
          </div>
        </div>
        <div>
          <p className="label">Extras (per day)</p>
          <div className="divide-y divide-line rounded-2xl border border-line">
            {extras.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-sm"><b>{e.label}</b> {e.detail} · {money(e.perDay)}</span>
                {e.max === 1 ? <Switch checked={ex[e.id] > 0} onChange={(v) => setEx({ ...ex, [e.id]: v ? 1 : 0 })} label={e.label} /> : <Stepper size="sm" value={ex[e.id]} max={e.max} onChange={(v) => setEx({ ...ex, [e.id]: v })} label={`${e.label} ${e.detail}`} />}
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="label" htmlFor="p-notes">Allergies or instructions</label>
          <textarea id="p-notes" className="input" rows={3} value={allergies} onChange={(e) => setAllergies(e.target.value)} />
        </div>
        <p className="text-sm text-muted">Changes apply from your next renewal on {formatDate(sub.nextRenewal)}.</p>
      </div>
    </Sheet>
  );
}

function AddressSheet({ initial, onClose, onSave, busy }: { initial: Address; onClose: () => void; onSave: (a: Address) => void; busy: boolean }) {
  const [a, setA] = useState(initial);
  const [errors, setErrors] = useState({});
  return (
    <Sheet
      open
      onClose={onClose}
      title="Delivery address"
      footer={
        <SubmitButton type="button" pending={busy} className="btn-primary btn-block" onClick={() => { const e = validateAddress(a, { phone: true }); setErrors(e); if (!Object.keys(e).length) onSave(a); }}>
          Save address
        </SubmitButton>
      }
    >
      <AddressFields prefix="sub-shipping" value={a} onChange={setA} errors={errors} deliveryCheck />
    </Sheet>
  );
}

function PaymentSheet({ sub, onClose, onSave, busy }: { sub: Subscription; onClose: () => void; onSave: (m: "card" | "cod", label: string) => void; busy: boolean }) {
  const cards = account.useCards();
  const [choice, setChoice] = useState<string>(sub.payment.method === "cod" ? "cod" : cards.find((c) => `${c.brand.toUpperCase()} •••• ${c.last4}` === sub.payment.label)?.id ?? cards[0]?.id ?? "cod");
  const label = choice === "cod" ? "Cash on delivery" : (() => { const c = cards.find((x) => x.id === choice); return c ? `${c.brand.toUpperCase()} •••• ${c.last4}` : ""; })();
  return (
    <Sheet open onClose={onClose} title="Payment method" footer={<SubmitButton type="button" pending={busy} className="btn-primary btn-block" onClick={() => onSave(choice === "cod" ? "cod" : "card", label)}>Use this method</SubmitButton>}>
      <div className="grid gap-2">
        {cards.map((c) => (
          <label key={c.id} className="tile"><input type="radio" name="pay" checked={choice === c.id} onChange={() => setChoice(c.id)} /><span className="tile-body"><b>{c.brand.toUpperCase()} •••• {c.last4}</b><span className="text-xs text-muted">Expires {String(c.expMonth).padStart(2, "0")}/{c.expYear}</span></span></label>
        ))}
        <label className="tile"><input type="radio" name="pay" checked={choice === "cod"} onChange={() => setChoice("cod")} /><span className="tile-body"><b>Cash on delivery</b><span className="text-xs text-muted">Pay the driver at each renewal</span></span></label>
      </div>
      <Link href="/account/payment-methods" className="mt-4 inline-block text-sm font-bold text-brand-text underline">Add a new card</Link>
    </Sheet>
  );
}
