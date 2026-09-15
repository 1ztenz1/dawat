"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox, PasswordField, SubmitButton, TextField } from "@/components/ui/form";
import { toast } from "@/components/ui/toast";
import { ApiError, auth } from "@/lib/api";
import { cn, isEmail, isPhone } from "@/lib/format";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [marketing, setMarketing] = useState(true);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const s = strength(f.password);

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!f.firstName.trim()) errs.firstName = "Required";
        if (!f.lastName.trim()) errs.lastName = "Required";
        if (!isEmail(f.email)) errs.email = "Enter a valid email address.";
        if (f.phone && !isPhone(f.phone)) errs.phone = "Enter a 10-digit phone number.";
        if (f.password.length < 8) errs.password = "Use at least 8 characters.";
        if (!agree) errs.agree = "Please accept the terms to continue.";
        setErrors(errs);
        if (Object.keys(errs).length) return;
        setPending(true);
        try {
          await auth.register({ ...f, marketing });
          toast("Your account is ready. Welcome to Dawat!");
          router.replace(next);
        } catch (err) {
          if (err instanceof ApiError && err.field) setErrors({ [err.field]: err.message });
          else setErrors({ form: err instanceof Error ? err.message : "Couldn't create your account." });
        } finally {
          setPending(false);
        }
      }}
    >
      {errors.form && <p role="alert" className="rounded-2xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">{errors.form}</p>}
      <div className="grid grid-cols-2 gap-3">
        <TextField label="First name" autoComplete="given-name" value={f.firstName} onChange={set("firstName")} error={errors.firstName} />
        <TextField label="Last name" autoComplete="family-name" value={f.lastName} onChange={set("lastName")} error={errors.lastName} />
      </div>
      <TextField label="Email address" type="email" inputMode="email" autoComplete="email" value={f.email} onChange={set("email")} error={errors.email} />
      <TextField label="Mobile number" optional type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} error={errors.phone} hint="For delivery updates and tracking links by SMS." />
      <div>
        <PasswordField label="Password" autoComplete="new-password" value={f.password} onChange={set("password")} error={errors.password} />
        {f.password && (
          <div className="mt-2 flex items-center gap-2" aria-live="polite">
            <div className="grid flex-1 grid-cols-4 gap-1">
              {[0, 1, 2, 3].map((i) => <span key={i} className={cn("h-1.5 rounded-full", i < s ? (s <= 1 ? "bg-danger" : s <= 2 ? "bg-accent" : "bg-success") : "bg-line")} />)}
            </div>
            <span className="text-xs font-semibold text-muted">{["Too short", "Weak", "Okay", "Good", "Strong"][s]}</span>
          </div>
        )}
      </div>
      <div className="grid gap-3 pt-1">
        <Checkbox checked={marketing} onChange={setMarketing}>Send me the weekly menu and occasional offers</Checkbox>
        <div>
          <Checkbox checked={agree} onChange={setAgree}>I agree to the <Link href="/terms" target="_blank" className="font-bold text-brand-text underline">terms</Link> and <Link href="/privacy-policy" target="_blank" className="font-bold text-brand-text underline">privacy policy</Link></Checkbox>
          {errors.agree && <p className="field-error ml-8">{errors.agree}</p>}
        </div>
      </div>
      <SubmitButton pending={pending} className="btn-primary btn-lg btn-block mt-2">Create account</SubmitButton>
      <p className="text-center text-sm text-text-2">Already have an account? <Link href="/login" className="font-bold text-brand-text underline underline-offset-4">Log in</Link></p>
    </form>
  );
}
