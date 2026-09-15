"use client";

import { CreditCard, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CardFields, cardBrand, emptyCard, validateCard } from "@/components/checkout/CardFields";
import { AmexMark, MastercardMark, VisaMark } from "@/components/icons/brand";
import { SubmitButton } from "@/components/ui/form";
import { Sheet } from "@/components/ui/Sheet";
import { toast } from "@/components/ui/toast";
import { account, subscriptionsApi } from "@/lib/api";

const Mark = ({ brand }: { brand: string }) => (brand === "visa" ? <VisaMark /> : brand === "mastercard" ? <MastercardMark /> : <AmexMark />);

export default function PaymentMethodsPage() {
  const cards = account.useCards();
  const subs = subscriptionsApi.useMine();
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Payment methods</h1>
        <button onClick={() => setAdding(true)} className="btn btn-primary btn-sm"><Plus size={16} /> Add card</button>
      </div>
      <p className="mt-2 text-text-2">Saved cards are stored securely by Stripe and used for subscription renewals.</p>

      {cards.length === 0 ? (
        <div className="card mt-6 grid place-items-center p-10 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-bg-subtle text-muted"><CreditCard size={28} /></span>
          <p className="mt-4 font-display text-2xl font-semibold">No saved cards</p>
          <p className="mt-1 text-text-2">Add a card for faster checkout and automatic renewals.</p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3">
          {cards.map((c) => {
            const inUse = subs.some((s) => s.status !== "cancelled" && s.payment.label === `${c.brand.toUpperCase()} •••• ${c.last4}`);
            return (
              <li key={c.id} className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
                <Mark brand={c.brand} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{c.brand.charAt(0).toUpperCase() + c.brand.slice(1)} ending in {c.last4}</p>
                  <p className="text-sm text-muted">Expires {String(c.expMonth).padStart(2, "0")}/{c.expYear}{inUse && " · Used by a subscription"}</p>
                </div>
                {c.isDefault ? (
                  <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-extrabold text-success">Default</span>
                ) : (
                  <SubmitButton type="button" pending={busy === `d${c.id}`} className="btn-outline btn-sm" onClick={async () => { setBusy(`d${c.id}`); await account.setDefaultCard(c.id); setBusy(null); toast("Default card updated"); }}>Make default</SubmitButton>
                )}
                <SubmitButton
                  type="button"
                  pending={busy === `r${c.id}`}
                  className="btn-sm text-danger hover:bg-danger-soft"
                  aria-label={`Remove card ending in ${c.last4}`}
                  onClick={async () => {
                    if (inUse && !confirm("This card is used by a subscription. Remove it anyway? Update the subscription's payment method afterwards.")) return;
                    setBusy(`r${c.id}`);
                    await account.removeCard(c.id);
                    setBusy(null);
                    toast("Card removed");
                  }}
                >
                  <Trash2 size={16} />
                </SubmitButton>
              </li>
            );
          })}
        </ul>
      )}
      {adding && <AddCardSheet onClose={() => setAdding(false)} />}
    </div>
  );
}

function AddCardSheet({ onClose }: { onClose: () => void }) {
  const [card, setCard] = useState(emptyCard);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  return (
    <Sheet
      open
      onClose={onClose}
      title="Add a card"
      footer={
        <SubmitButton
          type="button"
          pending={pending}
          className="btn-primary btn-block"
          onClick={async () => {
            const e = validateCard(card);
            setErrors(e);
            if (Object.keys(e).length) return;
            setPending(true);
            const digits = card.number.replace(/\D/g, "");
            const [mm, yy] = card.expiry.split("/").map((s) => Number(s.trim()));
            await account.addCard({ brand: cardBrand(digits) ?? "visa", last4: digits.slice(-4), expMonth: mm, expYear: 2000 + yy });
            setPending(false);
            toast("Card saved");
            onClose();
          }}
        >
          Save card
        </SubmitButton>
      }
    >
      <CardFields value={card} onChange={setCard} errors={errors} />
    </Sheet>
  );
}
