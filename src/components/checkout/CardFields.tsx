"use client";

import { Lock } from "lucide-react";
import { AmexMark, MastercardMark, VisaMark } from "@/components/icons/brand";
import { TextField } from "@/components/ui/form";

/* Stand-in for Stripe's Payment Element. Same fields and validation UX, so
   the swap to <PaymentElement /> keeps the layout. Never send raw card
   numbers to your own server. */

export interface CardInput {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}
export const emptyCard: CardInput = { number: "", expiry: "", cvc: "", name: "" };

export function cardBrand(num: string): "visa" | "mastercard" | "amex" | null {
  const n = num.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return null;
}

function luhn(num: string) {
  const digits = num.replace(/\D/g, "");
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return digits.length >= 13 && sum % 10 === 0;
}

export function validateCard(c: CardInput) {
  const e: Partial<Record<keyof CardInput, string>> = {};
  if (!luhn(c.number)) e.number = "Your card number is incomplete or invalid.";
  const [mm, yy] = c.expiry.split("/").map((s) => Number(s?.trim()));
  const now = new Date();
  const exp = new Date(2000 + (yy || 0), mm || 0, 1);
  if (!mm || mm > 12 || !yy || exp <= new Date(now.getFullYear(), now.getMonth(), 1)) e.expiry = "Enter a valid expiry date.";
  const cvcLen = cardBrand(c.number) === "amex" ? 4 : 3;
  if (c.cvc.replace(/\D/g, "").length !== cvcLen) e.cvc = `Enter the ${cvcLen}-digit security code.`;
  if (!c.name.trim()) e.name = "Enter the name on the card.";
  return e;
}

const fmtNumber = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 19);
  return cardBrand(d) === "amex" ? d.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" ")) : d.replace(/(\d{4})(?=\d)/g, "$1 ");
};
const fmtExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
};

export function CardFields({ value, onChange, errors = {} }: { value: CardInput; onChange: (c: CardInput) => void; errors?: Partial<Record<keyof CardInput, string>> }) {
  const brand = cardBrand(value.number);
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      <div className="relative col-span-2">
        <TextField
          label="Card number"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 1234 1234 1234"
          value={value.number}
          onChange={(e) => onChange({ ...value, number: fmtNumber(e.target.value) })}
          error={errors.number}
          className="pr-28 tabular-nums"
        />
        <span className="pointer-events-none absolute right-3 top-[2.35rem] flex gap-1">
          {(!brand || brand === "visa") && <VisaMark />}
          {(!brand || brand === "mastercard") && <MastercardMark />}
          {(!brand || brand === "amex") && <AmexMark />}
        </span>
      </div>
      <TextField label="Expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={value.expiry} onChange={(e) => onChange({ ...value, expiry: fmtExpiry(e.target.value) })} error={errors.expiry} />
      <TextField label="Security code" inputMode="numeric" autoComplete="cc-csc" placeholder="CVC" maxLength={4} value={value.cvc} onChange={(e) => onChange({ ...value, cvc: e.target.value.replace(/\D/g, "") })} error={errors.cvc} />
      <TextField wrapClass="col-span-2" label="Name on card" autoComplete="cc-name" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} error={errors.name} />
      <p className="col-span-2 flex items-center gap-1.5 text-xs text-muted"><Lock size={12} /> Card details are encrypted and processed by Stripe. We never store your card number.</p>
    </div>
  );
}
