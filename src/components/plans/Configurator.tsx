"use client";

import { Check, ShoppingBag, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";
import { Stepper, Switch } from "@/components/ui/form";
import {
  TRIAL_MAX_DAYS,
  TRIAL_PER_DAY,
  deliverySpots,
  extras,
  findSubscription,
  frequencies,
  noExtras,
  priceLine,
  proteins,
  sizes,
  trialSpots,
  trialTypes,
  trialVariants,
  type DeliverySpot,
  type Diet,
  type ExtrasSelection,
  type Frequency,
  type MealSize,
  type Protein,
  type SubscriptionProduct,
  type TrialType,
  type TrialVariant,
} from "@/lib/catalog";
import { cn, money } from "@/lib/format";
import { cart } from "@/lib/store/cart";
import { StartDatePicker } from "./DatePicker";

/* Shared draft so choices survive switching between sibling products. */
const draft: { spot: DeliverySpot | null; protein: Protein; extras: ExtrasSelection; allergies: string; startDate: string } = {
  spot: null,
  protein: "chicken",
  extras: { ...noExtras },
  allergies: "",
  startDate: "",
};

function Section({ n, title, aside, children, error }: { n: number; title: string; aside?: ReactNode; children: ReactNode; error?: string }) {
  return (
    <fieldset className="min-w-0 border-t border-line pt-6 first:border-0 first:pt-0">
      <legend className="sr-only">{title}</legend>
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2.5 font-bold" aria-hidden>
          <span className={cn("grid size-6 place-items-center rounded-full text-xs", error ? "bg-danger text-white" : "icon-deep")}>{n}</span>
          {title}
        </p>
        {aside}
      </div>
      {children}
      {error && <p className="field-error">{error}</p>}
    </fieldset>
  );
}

function Tile<T extends string>({ name, value, checked, onChange, title, hint, disabled }: { name: string; value: T; checked: boolean; onChange: (v: T) => void; title: ReactNode; hint?: ReactNode; disabled?: boolean }) {
  return (
    <label className="tile">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} disabled={disabled} />
      <span className="tile-body">
        <span className="flex items-center justify-between gap-2 font-bold">
          {title}
          <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border-[1.5px]", checked ? "border-brand-text bg-brand-text text-surface" : "border-line-strong")}>
            {checked && <Check size={12} strokeWidth={3.5} />}
          </span>
        </span>
        {hint && <span className="text-[0.8rem] text-muted">{hint}</span>}
      </span>
    </label>
  );
}

function StickyBar({ total, sub, onAdd, onBuy, label }: { total: number; sub: string; onAdd: () => void; onBuy: () => void; label: string }) {
  return (
    <>
      {/* Desktop / tablet */}
      <div className="mt-8 hidden gap-3 rounded-3xl border border-line bg-surface-2 p-5 sm:grid">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-muted">Total</p>
            <p className="font-display text-4xl font-semibold tabular-nums">{money(total)}</p>
          </div>
          <p className="text-right text-sm text-muted">{sub}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="btn btn-outline btn-lg" onClick={onAdd}><ShoppingBag size={18} /> {label}</button>
          <button type="button" className="btn btn-accent btn-lg" onClick={onBuy}><Zap size={18} /> Buy now</button>
        </div>
      </div>
      {/* Phone: fixed action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-display text-2xl font-semibold leading-none tabular-nums">{money(total)}</p>
            <p className="mt-1 truncate text-xs text-muted">{sub}</p>
          </div>
          <button type="button" className="btn btn-outline size-12 shrink-0 p-0" onClick={onAdd} aria-label={label}><ShoppingBag size={20} /></button>
          <button type="button" className="btn btn-accent shrink-0" onClick={onBuy}>Buy now</button>
        </div>
      </div>
      <div className="h-24 sm:hidden" aria-hidden />
    </>
  );
}

/* ================= Subscription products ================= */

export function SubscriptionConfigurator({ product }: { product: SubscriptionProduct }) {
  const router = useRouter();
  const f = frequencies[product.frequency];
  const [startDate, setStartDateState] = useState(draft.startDate);
  const [spot, setSpot] = useState<DeliverySpot | null>(draft.spot);
  const [protein, setProtein] = useState<Protein>(product.diet === "veg" ? "veggie" : draft.protein === "veggie" ? "chicken" : draft.protein);
  const [ex, setEx] = useState<ExtrasSelection>(draft.extras);
  const [allergies, setAllergies] = useState(draft.allergies);
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setStartDate = useCallback((v: string) => {
    draft.startDate = v;
    setStartDateState(v);
  }, []);

  const config = { kind: "subscription" as const, startDate, spot: spot ?? "front", protein, allergies, extras: ex };
  const price = priceLine(product, config);
  const total = price.unit * qty;

  const add = (buy: boolean) => {
    const e: Record<string, string> = {};
    if (!startDate) e.date = "Choose a start date.";
    if (!spot) e.spot = "Tell us where to leave your meals.";
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(e.date ? "cfg-date" : "cfg-spot")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    cart.add(product.slug, config, qty);
    if (buy) router.push("/checkout");
  };

  const sibling = (patch: Partial<{ size: MealSize; frequency: Frequency; diet: Diet }>) =>
    `/product/${findSubscription(patch.size ?? product.size, patch.frequency ?? product.frequency, patch.diet ?? product.diet).slug}`;

  return (
    <div className="grid min-w-0 gap-6">
      <Section n={1} title="Your plan">
        <div className="grid gap-2">
          <SwitchRow label="Size">
            {(["thali", "regular", "large"] as MealSize[]).map((s) => (
              <SiblingLink key={s} href={sibling({ size: s })} active={product.size === s}>{sizes[s].name.replace(" Meal", "")}</SiblingLink>
            ))}
          </SwitchRow>
          <SwitchRow label="Length">
            {(["weekly", "monthly"] as Frequency[]).map((fr) => (
              <SiblingLink key={fr} href={sibling({ frequency: fr })} active={product.frequency === fr}>{frequencies[fr].label}</SiblingLink>
            ))}
          </SwitchRow>
          <SwitchRow label="Diet">
            <SiblingLink href={sibling({ diet: "nonveg" })} active={product.diet === "nonveg"}><span className="nonveg-mark" /> Non-veg</SiblingLink>
            <SiblingLink href={sibling({ diet: "veg" })} active={product.diet === "veg"}><span className="veg-mark" /> Veg</SiblingLink>
          </SwitchRow>
        </div>
      </Section>

      {product.diet === "nonveg" && (
        <Section n={2} title="Protein">
          <div className="grid grid-cols-2 gap-2">
            {proteins.nonveg.map((p) => (
              <Tile key={p.id} name="protein" value={p.id} checked={protein === p.id} onChange={(v) => { draft.protein = v; setProtein(v); }} title={p.label} />
            ))}
          </div>
        </Section>
      )}

      <div id="cfg-date" className="min-w-0">
        <Section n={product.diet === "nonveg" ? 3 : 2} title="When should delivery start?" error={undefined}>
          <StartDatePicker value={startDate} onChange={(v) => { setStartDate(v); setErrors((x) => ({ ...x, date: "" })); }} error={errors.date} />
        </Section>
      </div>

      <div id="cfg-spot" className="min-w-0">
        <Section n={product.diet === "nonveg" ? 4 : 3} title="Where should we leave it?" error={errors.spot}>
          <div className="grid grid-cols-2 gap-2">
            {deliverySpots.map((s) => (
              <Tile key={s.id} name="spot" value={s.id} checked={spot === s.id} onChange={(v) => { draft.spot = v; setSpot(v); setErrors((x) => ({ ...x, spot: "" })); }} title={s.label} hint={s.hint} />
            ))}
          </div>
        </Section>
      </div>

      <Section n={product.diet === "nonveg" ? 5 : 4} title="Extras" aside={<span className="text-xs font-semibold text-muted">Charged per delivery day</span>}>
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {extras.map((e) => {
            const v = ex[e.id];
            const set = (n: number) => { const next = { ...ex, [e.id]: n }; draft.extras = next; setEx(next); };
            return (
              <div key={e.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-bold">{e.label} <span className="font-semibold text-muted">· {e.detail}</span></p>
                  <p className="text-xs text-muted">
                    {money(e.perDay)} / day{e.max > 1 ? " each" : ""} · {money(e.perDay * f.meals)} per {f.per}
                  </p>
                </div>
                {e.max === 1 ? <Switch checked={v > 0} onChange={(on) => set(on ? 1 : 0)} label={`${e.label} ${e.detail}`} /> : <Stepper value={v} onChange={set} max={e.max} label={`${e.label} ${e.detail}`} size="sm" />}
              </div>
            );
          })}
        </div>
      </Section>

      <Section n={product.diet === "nonveg" ? 6 : 5} title="Allergies or special instructions">
        <label htmlFor="allergies" className="sr-only">Allergies or special instructions</label>
        <textarea
          id="allergies"
          className="input"
          rows={3}
          maxLength={400}
          placeholder="Please state allergies if any, or delivery notes (buzzer code, etc.)"
          value={allergies}
          onChange={(e) => { draft.allergies = e.target.value; setAllergies(e.target.value); }}
        />
        <p className="hint">We can&apos;t accommodate dairy, egg, nut or fish allergies. <Link href="/terms" className="underline">Read why</Link>.</p>
      </Section>

      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        <div>
          <p className="font-bold">Quantity</p>
          <p className="text-xs text-muted">Ordering for more than one person?</p>
        </div>
        <Stepper value={qty} onChange={setQty} min={1} max={10} label="quantity" />
      </div>

      <dl className="grid gap-2 rounded-2xl bg-bg-subtle p-4 text-sm">
        <div className="flex justify-between"><dt className="text-text-2">Base subscription</dt><dd className="font-bold tabular-nums">{money(price.base)}</dd></div>
        <div className="flex justify-between"><dt className="text-text-2">Options &amp; extras</dt><dd className="font-bold tabular-nums">{price.options ? `+${money(price.options)}` : money(0)}</dd></div>
        {qty > 1 && <div className="flex justify-between"><dt className="text-text-2">Quantity</dt><dd className="font-bold">× {qty}</dd></div>}
        <div className="flex justify-between border-t border-line pt-2"><dt className="text-text-2">Per meal</dt><dd className="font-bold tabular-nums">{money(price.perMeal)}</dd></div>
      </dl>

      <StickyBar total={total} sub={`${f.meals} meals · renews every ${f.renewDays} days`} onAdd={() => add(false)} onBuy={() => add(true)} label="Add to cart" />
    </div>
  );
}

function SwitchRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-sm font-semibold text-muted">{label}</span>
      <div className="flex flex-1 flex-wrap gap-1.5 rounded-full border border-line bg-bg-subtle p-1">{children}</div>
    </div>
  );
}

function SiblingLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      replace
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex min-h-9 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-bold transition-colors",
        active ? "bg-surface text-text shadow-soft" : "text-muted hover:text-text",
      )}
    >
      {children}
    </Link>
  );
}

/* ================= Trial ================= */

export function TrialConfigurator() {
  const router = useRouter();
  const [startDate, setStartDateState] = useState(draft.startDate);
  const [variant, setVariant] = useState<TrialVariant>("chicken");
  const [type, setType] = useState<TrialType>("12oz");
  const [days, setDays] = useState(2);
  const [spot, setSpot] = useState<DeliverySpot | null>(draft.spot === "apartment" ? null : draft.spot);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const setStartDate = useCallback((v: string) => {
    draft.startDate = v;
    setStartDateState(v);
  }, []);

  const config = { kind: "trial" as const, startDate, variant, type, days, spot: spot ?? "front" };
  const price = priceLine({ kind: "trial", slug: "trial-meal" }, config);

  const add = (buy: boolean) => {
    const e: Record<string, string> = {};
    if (!startDate) e.date = "Choose a start date.";
    if (!spot) e.spot = "Tell us where to leave your meals.";
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(e.date ? "cfg-date" : "cfg-spot")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    cart.add("trial-meal", config, 1);
    if (buy) router.push("/checkout");
  };

  return (
    <div className="grid min-w-0 gap-6">
      <Section n={1} title="Which meal?">
        <div className="grid grid-cols-3 gap-2">
          {trialTypes.map((t) => (
            <Tile key={t.id} name="trial-type" value={t.id} checked={type === t.id} onChange={setType} title={t.label.replace(" meal", "")} hint={`${money(TRIAL_PER_DAY + t.adjust)}/day`} />
          ))}
        </div>
      </Section>
      <Section n={2} title="Your choice">
        <div className="grid grid-cols-3 gap-2">
          {trialVariants.map((v) => (
            <Tile key={v.id} name="variant" value={v.id} checked={variant === v.id} onChange={setVariant} title={v.label} hint={"hint" in v ? v.hint : "Vegetarian"} />
          ))}
        </div>
      </Section>
      <Section n={3} title="How many days?">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: TRIAL_MAX_DAYS }, (_, i) => i + 1).map((d) => (
            <Tile key={d} name="days" value={String(d)} checked={days === d} onChange={(v) => setDays(Number(v))} title={`${d} ${d > 1 ? "days" : "day"}`} hint={money((TRIAL_PER_DAY + (trialTypes.find((t) => t.id === type)?.adjust ?? 0)) * d)} />
          ))}
        </div>
      </Section>
      <div id="cfg-date" className="min-w-0">
        <Section n={4} title="When do you want the trial to start?">
          <StartDatePicker value={startDate} onChange={(v) => { setStartDate(v); setErrors((x) => ({ ...x, date: "" })); }} error={errors.date} />
        </Section>
      </div>
      <div id="cfg-spot" className="min-w-0">
        <Section n={5} title="Where should we leave it?" error={errors.spot}>
          <div className="grid grid-cols-3 gap-2">
            {trialSpots.map((s) => (
              <Tile key={s.id} name="trial-spot" value={s.id} checked={spot === s.id} onChange={(v) => { draft.spot = v; setSpot(v); setErrors((x) => ({ ...x, spot: "" })); }} title={s.label} hint={s.hint} />
            ))}
          </div>
        </Section>
      </div>
      <StickyBar total={price.unit} sub={`${days} ${days > 1 ? "days" : "day"} · one-time order, no subscription`} onAdd={() => add(false)} onBuy={() => add(true)} label="Add to cart" />
    </div>
  );
}
