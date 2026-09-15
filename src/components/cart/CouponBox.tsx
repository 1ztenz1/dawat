"use client";

import { LoaderCircle, X } from "lucide-react";
import { useState } from "react";
import { ApiError, validateCoupon } from "@/lib/api";
import { money } from "@/lib/format";
import { cart, useCart } from "@/lib/store/cart";

export function CouponBox({ subtotal, onDiscount }: { subtotal: number; onDiscount?: (d: number) => void }) {
  const applied = useCart((s) => s.coupon);
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [discount, setDiscount] = useState(0);

  if (applied)
    return (
      <div className="flex items-center justify-between rounded-2xl bg-success-soft px-4 py-3 text-sm">
        <span className="font-bold text-success">{applied} applied {discount > 0 && `(−${money(discount)})`}</span>
        <button onClick={() => { cart.setCoupon(null); onDiscount?.(0); }} aria-label="Remove coupon" className="grid size-7 place-items-center rounded-full hover:bg-surface"><X size={14} /></button>
      </div>
    );

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!code.trim()) return setError("Enter a coupon code.");
        setPending(true);
        setError("");
        try {
          const r = await validateCoupon(code, subtotal);
          cart.setCoupon(r.code);
          setDiscount(r.discount);
          onDiscount?.(r.discount);
        } catch (err) {
          setError(err instanceof ApiError ? err.message : "Couldn't apply this coupon.");
        } finally {
          setPending(false);
        }
      }}
    >
      <div className="flex gap-2">
        <label htmlFor="coupon" className="sr-only">Coupon code</label>
        <input id="coupon" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Coupon code" className="input min-h-11 uppercase" aria-invalid={!!error} autoComplete="off" />
        <button className="btn btn-outline min-h-11 shrink-0" disabled={pending}>{pending ? <LoaderCircle size={16} className="animate-spin" /> : "Apply"}</button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </form>
  );
}
