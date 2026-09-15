"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { Checkbox, SubmitButton, TextField } from "@/components/ui/form";
import { subscribeNewsletter } from "@/lib/api";
import { isEmail } from "@/lib/format";

export function NewsletterPreferences() {
  const [email, setEmail] = useState("");
  const [menu, setMenu] = useState(true);
  const [offers, setOffers] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState<"" | "saved" | "unsubscribed">("");

  const submit = async (unsubscribe: boolean) => {
    if (!isEmail(email)) return setError("Enter a valid email address.");
    setError("");
    setPending(true);
    if (!unsubscribe && (menu || offers)) await subscribeNewsletter(email);
    else await new Promise((r) => setTimeout(r, 400));
    setPending(false);
    setSaved(unsubscribe || (!menu && !offers) ? "unsubscribed" : "saved");
  };

  if (saved)
    return (
      <div className="card grid place-items-center p-8 text-center">
        <CircleCheck size={40} className="text-success" />
        <p className="mt-3 text-xl font-bold">{saved === "saved" ? "Preferences saved" : "You've been unsubscribed"}</p>
        <p className="text-text-2">{saved === "saved" ? `We'll email ${email} with the menu every week.` : "Sorry to see you go. You won't receive marketing emails anymore."}</p>
      </div>
    );

  return (
    <form className="card grid gap-5 p-6 sm:p-8" noValidate onSubmit={(e) => { e.preventDefault(); submit(false); }}>
      <TextField label="Email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
      <div className="grid gap-3">
        <Checkbox checked={menu} onChange={setMenu}><b className="text-text">Weekly menu</b><br />Every Sunday, what&apos;s cooking this week</Checkbox>
        <Checkbox checked={offers} onChange={setOffers}><b className="text-text">Offers & news</b><br />Occasional deals, new plans and holiday schedules</Checkbox>
      </div>
      <SubmitButton pending={pending} className="btn-primary btn-lg">Save preferences</SubmitButton>
      <button type="button" onClick={() => submit(true)} className="text-sm font-bold text-danger underline underline-offset-4">Unsubscribe from all emails</button>
    </form>
  );
}
