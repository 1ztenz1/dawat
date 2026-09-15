"use client";

import { ArrowRight, CircleCheck, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";
import { isEmail } from "@/lib/format";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "pending" | "done" | "error">("idle");

  if (state === "done")
    return (
      <p className="flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-3 font-semibold text-on-deep">
        <CircleCheck size={18} className="text-gold-300" /> Success! Check your inbox on Sunday.
      </p>
    );

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!isEmail(email)) return setState("error");
        setState("pending");
        await subscribeNewsletter(email);
        setState("done");
      }}
      className="max-w-sm"
    >
      <div className="flex rounded-full bg-white/[0.07] p-1 focus-within:ring-2 focus-within:ring-accent">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input
          id="nl-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          className="min-w-0 flex-1 bg-transparent px-4 text-[16px] text-on-deep placeholder:text-on-deep-muted focus:outline-none"
        />
        <button type="submit" className="btn btn-accent btn-sm" disabled={state === "pending"} aria-label="Subscribe">
          {state === "pending" ? <LoaderCircle size={16} className="animate-spin" /> : <>Subscribe <ArrowRight size={16} /></>}
        </button>
      </div>
      {state === "error" && <p className="mt-2 px-4 text-xs font-semibold text-[#ff9a9f]">Please enter a valid email.</p>}
    </form>
  );
}
