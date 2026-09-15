"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { SubmitButton, TextField } from "@/components/ui/form";
import { sendContactMessage } from "@/lib/api";
import { isEmail } from "@/lib/format";

const topics = ["Meal plans & pricing", "My subscription", "Delivery", "Allergies & ingredients", "Corporate or large order", "Something else"];

export function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", phone: "", topic: topics[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  if (done)
    return (
      <div className="grid place-items-center rounded-2xl bg-success-soft p-8 text-center">
        <CircleCheck size={40} className="text-success" />
        <p className="mt-3 text-lg font-bold">Message sent!</p>
        <p className="text-text-2">Thanks, {f.name.split(" ")[0]}. We&apos;ll reply to {f.email} soon.</p>
      </div>
    );

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!f.name.trim()) errs.name = "Please enter your name.";
        if (!isEmail(f.email)) errs.email = "Enter a valid email address.";
        if (f.message.trim().length < 10) errs.message = "Tell us a little more (10+ characters).";
        setErrors(errs);
        if (Object.keys(errs).length) return;
        setPending(true);
        await sendContactMessage(f);
        setPending(false);
        setDone(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" autoComplete="name" value={f.name} onChange={set("name")} error={errors.name} />
        <TextField label="Phone" optional type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} />
      </div>
      <TextField label="Email" type="email" autoComplete="email" value={f.email} onChange={set("email")} error={errors.email} />
      <div>
        <label className="label" htmlFor="topic">Topic</label>
        <select id="topic" className="input" value={f.topic} onChange={set("topic")}>{topics.map((t) => <option key={t}>{t}</option>)}</select>
      </div>
      <div>
        <label className="label" htmlFor="message">Message</label>
        <textarea id="message" className="input" rows={5} value={f.message} onChange={set("message")} aria-invalid={!!errors.message} />
        {errors.message && <p className="field-error">{errors.message}</p>}
      </div>
      <SubmitButton pending={pending} className="btn-primary btn-lg">Send message</SubmitButton>
    </form>
  );
}
