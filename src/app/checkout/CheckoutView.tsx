"use client";

import { Banknote, CalendarDays, ChevronDown, CreditCard, Info, Lock, Repeat, ShieldCheck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CouponBox } from "@/components/cart/CouponBox";
import { AddressFields, emptyAddress, validateAddress } from "@/components/checkout/AddressFields";
import { CardFields, cardBrand, emptyCard, validateCard, type CardInput } from "@/components/checkout/CardFields";
import { productImage } from "@/components/plans/images";
import { Checkbox, PasswordField, SubmitButton, TextField } from "@/components/ui/form";
import { Sheet } from "@/components/ui/Sheet";
import { toast } from "@/components/ui/toast";
import { ApiError, account, orders, useUser, validateCoupon, type Address, type PaymentMethod } from "@/lib/api";
import { describeConfig, frequencies, productName } from "@/lib/catalog";
import { addDays, formatDate, fromISO, toISO } from "@/lib/dates";
import { cn, isEmail, money } from "@/lib/format";
import { terms } from "@/lib/legal";
import { cart, cartSummary, lineTotals, useCart } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/persisted";

type Errors = Record<string, string>;

export function CheckoutView() {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useUser();
  const savedCards = account.useCards();
  const { lines, coupon } = useCart();
  const summary = cartSummary(lines);

  const [email, setEmail] = useState("");
  const [shipping, setShipping] = useState<Address>(emptyAddress);
  const [billingSame, setBillingSame] = useState(true);
  const [billing, setBilling] = useState<Address>(emptyAddress);
  const [notes, setNotes] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [marketing, setMarketing] = useState(true);
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [cardChoice, setSavedCardId] = useState<string | null>(null);
  const [card, setCard] = useState<CardInput>(emptyCard);
  const [saveCard, setSaveCard] = useState(true);
  const [agree, setAgree] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Prefill once from the account (state adjusted during render, no effect needed).
  const [prefilledFor, setPrefilledFor] = useState<string | null>(null);
  if (user && prefilledFor !== user.id) {
    setPrefilledFor(user.id);
    setEmail((e) => e || user.email);
    setShipping((s) => (s.address1 ? s : user.shipping ?? { ...emptyAddress, firstName: user.firstName, lastName: user.lastName, phone: user.phone }));
    if (user.billing) setBilling((b) => (b.address1 ? b : user.billing!));
  }

  // Default to the saved default card until the customer picks something else.
  const savedCardId = cardChoice ?? savedCards.find((c) => c.isDefault)?.id ?? "new";

  // Re-validate the applied coupon so the discount survives reloads.
  useEffect(() => {
    if (!coupon) return;
    validateCoupon(coupon, summary.subtotal).then((r) => setDiscount(r.discount)).catch(() => cart.setCoupon(null));
  }, [coupon, summary.subtotal]);

  const appliedDiscount = coupon ? discount : 0;
  const total = Math.max(0, summary.subtotal - appliedDiscount);
  const mustCreateAccount = !user && summary.hasSubscription;

  const recurring = useMemo(
    () =>
      lines.flatMap((l) => {
        const t = lineTotals(l);
        if (!t || t.product.kind !== "subscription") return [];
        const f = frequencies[t.product.frequency];
        return [{ id: l.id, name: productName(t.product), amount: t.total, every: f.renewDays, first: toISO(addDays(fromISO(l.config.startDate), f.renewDays)) }];
      }),
    [lines],
  );

  if (!hydrated || placed) return <div className="container-x section"><div className="h-96 animate-pulse rounded-3xl bg-bg-subtle" /></div>;

  if (!lines.length)
    return (
      <div className="container-x section grid place-items-center text-center">
        <span className="grid size-20 place-items-center rounded-full bg-bg-subtle text-muted"><ShoppingBag size={34} /></span>
        <h1 className="mt-5 text-4xl">Nothing to check out yet</h1>
        <p className="mt-3 text-text-2">Your cart is empty.</p>
        <Link href="/plans" className="btn btn-accent btn-lg mt-8">Browse meal plans</Link>
      </div>
    );

  const validate = () => {
    const errs: Errors = {};
    if (!isEmail(email)) errs.email = "Enter a valid email address.";
    Object.entries(validateAddress(shipping, { phone: true })).forEach(([k, v]) => (errs[`shipping.${k}`] = v!));
    if (!billingSame) Object.entries(validateAddress(billing)).forEach(([k, v]) => (errs[`billing.${k}`] = v!));
    if ((mustCreateAccount || createAccount) && password.length < 8) errs.password = "Use at least 8 characters.";
    if (payment === "card" && (savedCardId === "new" || !user)) Object.entries(validateCard(card)).forEach(([k, v]) => (errs[`card.${k}`] = v!));
    if (!agree) errs.agree = "Please accept the terms and conditions to continue.";
    return errs;
  };
  // Errors appear after the first submit attempt, then update live as fields are fixed.
  const errors: Errors = attempted ? validate() : {};

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setAttempted(true);
    const errs = validate();
    if (Object.keys(errs).length) {
      setFormError("Please fix the highlighted fields.");
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"], .field-error')?.scrollIntoView({ behavior: "smooth", block: "center" }));
      return;
    }

    setPending(true);
    try {
      let cardLabel: string | undefined;
      if (payment === "card") {
        const saved = savedCards.find((c) => c.id === savedCardId);
        if (saved && user) cardLabel = `${saved.brand.toUpperCase()} •••• ${saved.last4}`;
        else {
          const digits = card.number.replace(/\D/g, "");
          cardLabel = `${(cardBrand(digits) ?? "card").toUpperCase()} •••• ${digits.slice(-4)}`;
        }
      }
      const order = await orders.place(lines, {
        email,
        shipping,
        billing: billingSame ? shipping : billing,
        shipToDifferent: false,
        notes,
        payment,
        cardLabel,
        coupon,
        createAccount: !user && (mustCreateAccount || createAccount) ? { password, marketing } : undefined,
      });
      // Save the new card for renewals (Stripe SetupIntent in production).
      if (payment === "card" && savedCardId === "new" && (saveCard || summary.hasSubscription)) {
        const digits = card.number.replace(/\D/g, "");
        const [mm, yy] = card.expiry.split("/").map((s) => Number(s.trim()));
        await account.addCard({ brand: cardBrand(digits) ?? "visa", last4: digits.slice(-4), expMonth: mm, expYear: 2000 + yy }).catch(() => {});
      }
      setPlaced(true);
      router.push(`/checkout/order-received?id=${order.id}`);
      cart.clear();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Something went wrong placing your order. Please try again.";
      setFormError(msg);
      toast(msg, "error");
    } finally {
      setPending(false);
    }
  };

  const summaryPanel = (
    <div className="grid gap-5">
      <ul className="grid gap-4">
        {lines.map((l) => {
          const t = lineTotals(l);
          if (!t) return null;
          return (
            <li key={l.id} className="flex gap-3">
              <div className="relative shrink-0">
                <Image src={productImage(t.product)} alt="" sizes="64px" className="size-16 rounded-xl object-cover" />
                <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-text text-xs font-bold text-bg">{l.qty}</span>
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-bold">{productName(t.product)}</p>
                <p className="text-muted">Starts {formatDate(l.config.startDate)}</p>
                <p className="truncate text-muted">{describeConfig(l.config).slice(0, 2).join(" · ")}</p>
              </div>
              <p className="text-sm font-bold tabular-nums">{money(t.total)}</p>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-line pt-5">
        <CouponBox subtotal={summary.subtotal} onDiscount={setDiscount} />
      </div>
      <dl className="grid gap-2.5 border-t border-line pt-5 text-[0.95rem]">
        <div className="flex justify-between"><dt className="text-text-2">Subtotal</dt><dd className="font-semibold tabular-nums">{money(summary.subtotal)}</dd></div>
        {appliedDiscount > 0 && <div className="flex justify-between text-success"><dt>Discount ({coupon})</dt><dd className="font-semibold tabular-nums">−{money(appliedDiscount)}</dd></div>}
        <div className="flex justify-between"><dt className="text-text-2">Delivery</dt><dd className="font-semibold text-success">Free</dd></div>
        <div className="flex items-baseline justify-between border-t border-line pt-3"><dt className="font-bold">Total today</dt><dd className="font-display text-3xl font-semibold tabular-nums">{money(total)}</dd></div>
      </dl>
      {recurring.length > 0 && (
        <div className="rounded-2xl bg-bg-subtle p-4 text-sm">
          <p className="mb-2 flex items-center gap-2 font-bold"><Repeat size={15} /> Recurring totals</p>
          <ul className="grid gap-2">
            {recurring.map((r) => (
              <li key={r.id} className="flex justify-between gap-3">
                <span className="text-text-2">{r.name}<br /><span className="text-xs text-muted">First renewal {formatDate(r.first)}</span></span>
                <span className="text-right font-semibold tabular-nums">{money(r.amount)}<br /><span className="text-xs font-normal text-muted">every {r.every} days</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="pb-12">
      {/* Phone: collapsible summary, Shopify-style */}
      <div className="border-b border-line bg-bg-subtle lg:hidden">
        <button type="button" onClick={() => setSummaryOpen((o) => !o)} className="container-x flex w-full items-center justify-between py-4" aria-expanded={summaryOpen}>
          <span className="flex items-center gap-2 font-semibold text-brand-text">
            <ShoppingBag size={18} /> {summaryOpen ? "Hide" : "Show"} order summary <ChevronDown size={16} className={cn("transition-transform", summaryOpen && "rotate-180")} />
          </span>
          <span className="font-display text-xl font-semibold tabular-nums">{money(total)}</span>
        </button>
        {summaryOpen && <div className="container-x animate-fade pb-6">{summaryPanel}</div>}
      </div>

      <div className="container-x mt-6 grid gap-10 sm:mt-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <form onSubmit={submit} noValidate className="grid gap-6">
          <div>
            <h1 className="text-4xl">Checkout</h1>
            <p className="mt-2 flex items-center gap-2 rounded-2xl bg-warning-soft px-4 py-2.5 text-sm text-accent-text">
              <Info size={16} className="shrink-0" /> Preview mode: orders are saved in this browser only and no payment is taken.
            </p>
          </div>

          <Block title="Contact" aside={!user && <span className="text-sm text-muted">Have an account? <Link href="/login?next=/checkout" className="font-bold text-brand-text underline">Log in</Link></span>}>
            <TextField label="Email address" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} hint="Order confirmation and receipts go here." />
          </Block>

          <Block title="Delivery address">
            <AddressFields
              prefix="shipping"
              value={shipping}
              onChange={setShipping}
              deliveryCheck
              errors={Object.fromEntries(Object.entries(errors).filter(([k]) => k.startsWith("shipping.")).map(([k, v]) => [k.slice(9), v]))}
            />
            <div className="mt-5">
              <label className="label" htmlFor="notes">Order notes <span className="font-medium text-muted">(optional)</span></label>
              <textarea id="notes" className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes about your order, e.g. special delivery instructions." />
            </div>
          </Block>

          <Block title="Billing address">
            <Checkbox checked={billingSame} onChange={setBillingSame}>Same as delivery address</Checkbox>
            {!billingSame && (
              <div className="animate-fade mt-5">
                <AddressFields
                  prefix="billing"
                  value={billing}
                  onChange={setBilling}
                  showPhone={false}
                  errors={Object.fromEntries(Object.entries(errors).filter(([k]) => k.startsWith("billing.")).map(([k, v]) => [k.slice(8), v]))}
                />
              </div>
            )}
          </Block>

          {!user && (
            <Block title={mustCreateAccount ? "Create your account" : "Account"}>
              {mustCreateAccount ? (
                <p className="mb-4 text-sm text-text-2">Subscriptions need an account so you can pause, skip days or cancel anytime.</p>
              ) : (
                <Checkbox checked={createAccount} onChange={setCreateAccount}>Create an account for faster checkout next time</Checkbox>
              )}
              {(mustCreateAccount || createAccount) && (
                <div className="mt-4 grid gap-4">
                  <PasswordField label="Create password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} hint="At least 8 characters." />
                  <Checkbox checked={marketing} onChange={setMarketing}>Send me the weekly menu and offers by email</Checkbox>
                </div>
              )}
            </Block>
          )}

          <Block title="Payment" aside={<span className="flex items-center gap-1 text-xs font-semibold text-muted"><Lock size={12} /> Encrypted</span>}>
            <div role="radiogroup" aria-label="Payment method" className="overflow-hidden rounded-2xl border border-line">
              <PayOption checked={payment === "card"} onSelect={() => setPayment("card")} icon={<CreditCard size={20} />} title="Credit / debit card" hint="Visa, Mastercard, Amex">
                {user && savedCards.length > 0 && (
                  <div className="mb-4 grid gap-2">
                    {savedCards.map((c) => (
                      <label key={c.id} className="tile">
                        <input type="radio" name="saved-card" checked={savedCardId === c.id} onChange={() => setSavedCardId(c.id)} />
                        <span className="tile-body flex-row items-center !flex justify-between">
                          <span className="font-bold">{c.brand.toUpperCase()} •••• {c.last4}</span>
                          <span className="text-sm text-muted">Exp {String(c.expMonth).padStart(2, "0")}/{String(c.expYear).slice(-2)}</span>
                        </span>
                      </label>
                    ))}
                    <label className="tile">
                      <input type="radio" name="saved-card" checked={savedCardId === "new"} onChange={() => setSavedCardId("new")} />
                      <span className="tile-body font-bold">Use a new card</span>
                    </label>
                  </div>
                )}
                {(!user || savedCardId === "new" || savedCards.length === 0) && (
                  <>
                    <CardFields value={card} onChange={setCard} errors={Object.fromEntries(Object.entries(errors).filter(([k]) => k.startsWith("card.")).map(([k, v]) => [k.slice(5), v]))} />
                    <div className="mt-4">
                      {summary.hasSubscription ? (
                        <p className="flex items-start gap-2 text-xs text-muted"><ShieldCheck size={14} className="mt-0.5 shrink-0" /> This card will be saved securely and charged automatically at each renewal.</p>
                      ) : (
                        user && <Checkbox checked={saveCard} onChange={setSaveCard}>Save this card for future orders</Checkbox>
                      )}
                    </div>
                  </>
                )}
              </PayOption>
              <PayOption checked={payment === "cod"} onSelect={() => setPayment("cod")} icon={<Banknote size={20} />} title="Cash on delivery" hint="Pay the driver on your first delivery">
                <p className="text-sm text-text-2">Please have the exact amount ready on your first delivery day{summary.hasSubscription ? ", and at the start of each renewal" : ""}.</p>
              </PayOption>
            </div>
          </Block>

          <div className="grid gap-4">
            <div>
              <Checkbox checked={agree} onChange={setAgree}>
                I have read and agree to the{" "}
                <button type="button" onClick={() => setTermsOpen(true)} className="font-bold text-brand-text underline">terms &amp; conditions</button>, including the no-refund policy on food items.
              </Checkbox>
              {errors.agree && <p className="field-error ml-8">{errors.agree}</p>}
            </div>
            <p className="text-xs text-muted">Your personal data will be used to process your order, support your experience on this website, and for other purposes described in our <Link href="/privacy-policy" className="underline">privacy policy</Link>.</p>
            {(formError && (!attempted || Object.keys(errors).length > 0 || !formError.startsWith("Please fix"))) && <p role="alert" className="rounded-2xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">{formError}</p>}
            <SubmitButton pending={pending} className="btn-accent btn-lg btn-block">
              {pending ? "Placing order…" : <><Lock size={18} /> {payment === "cod" ? "Place order" : "Pay"} {money(total)}</>}
            </SubmitButton>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted"><CalendarDays size={13} /> Orders after 6 PM ET are processed the next day.</p>
          </div>
        </form>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[1.75rem] border border-line bg-surface p-6 shadow-soft">
            <h2 className="mb-5 text-2xl">Order summary</h2>
            {summaryPanel}
          </div>
        </aside>
      </div>

      <Sheet open={termsOpen} onClose={() => setTermsOpen(false)} title="Terms & Conditions" footer={<button className="btn btn-primary btn-block" onClick={() => { setAgree(true); setTermsOpen(false); }}>I agree</button>}>
        <div className="prose-legal grid gap-4 text-sm">
          {terms.map((t, i) => (
            <div key={t.title}><p className="font-bold text-text">{i + 1}. {t.title}</p><p className="mt-1">{t.body}</p></div>
          ))}
          <div><p className="font-bold text-text">Refunds</p><p className="mt-1">There are no refunds on food items.</p></div>
        </div>
      </Sheet>
    </div>
  );
}

function Block({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-line bg-surface p-5 shadow-soft sm:p-7">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl sm:text-2xl">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function PayOption({ checked, onSelect, icon, title, hint, children }: { checked: boolean; onSelect: () => void; icon: ReactNode; title: string; hint: string; children: ReactNode }) {
  return (
    <div className={cn("border-b border-line last:border-0", checked && "bg-surface-2")}>
      <label className="flex cursor-pointer items-center gap-3 px-4 py-4">
        <input type="radio" name="payment" checked={checked} onChange={onSelect} className="size-5 accent-[var(--brand-text)]" />
        <span className="grid size-10 place-items-center rounded-xl bg-bg-subtle text-brand-text">{icon}</span>
        <span className="flex-1">
          <span className="block font-bold">{title}</span>
          <span className="block text-xs text-muted">{hint}</span>
        </span>
      </label>
      {checked && <div className="animate-fade px-4 pb-5">{children}</div>}
    </div>
  );
}
