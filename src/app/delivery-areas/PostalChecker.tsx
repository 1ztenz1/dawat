"use client";

import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { servesPostal } from "@/components/checkout/AddressFields";
import { formatPostal, isPostal } from "@/lib/format";
import { site } from "@/lib/site";

export function PostalChecker() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<null | "yes" | "maybe" | "invalid">(null);

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!isPostal(code)) return setResult("invalid");
          setResult(servesPostal(code) ? "yes" : "maybe");
        }}
      >
        <label htmlFor="postal" className="sr-only">Postal code</label>
        <input id="postal" className="input text-lg font-bold uppercase tracking-wider" placeholder="M5V 2T6" maxLength={7} value={code} onChange={(e) => { setCode(formatPostal(e.target.value)); setResult(null); }} autoComplete="postal-code" />
        <button className="btn btn-primary shrink-0">Check</button>
      </form>
      {result === "invalid" && <p className="field-error">Enter a valid Canadian postal code.</p>}
      {result === "yes" && (
        <div className="animate-rise mt-4 rounded-2xl bg-success-soft p-4">
          <p className="flex items-center gap-2 font-bold text-success"><CircleCheck size={20} /> Great news, we deliver to {code}!</p>
          <Link href="/plans" className="btn btn-accent btn-sm mt-3">Choose a plan <ArrowRight size={16} /></Link>
        </div>
      )}
      {result === "maybe" && (
        <div className="animate-rise mt-4 rounded-2xl bg-warning-soft p-4">
          <p className="flex items-center gap-2 font-bold text-accent-text"><CircleAlert size={20} /> {code} may be outside our current zone</p>
          <p className="mt-1 text-sm text-text-2">Message us and we&apos;ll let you know. We&apos;re expanding regularly.</p>
          <a href={`${site.whatsapp.href}?text=${encodeURIComponent(`Hi! Do you deliver to ${code}?`)}`} target="_blank" rel="noopener" className="btn btn-outline btn-sm mt-3">Ask on WhatsApp</a>
        </div>
      )}
    </div>
  );
}
