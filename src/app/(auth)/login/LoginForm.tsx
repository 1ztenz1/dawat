"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox, PasswordField, SubmitButton, TextField } from "@/components/ui/form";
import { toast } from "@/components/ui/toast";
import { ApiError, auth } from "@/lib/api";
import { isEmail } from "@/lib/format";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  return (
    <form
      noValidate
      className="grid gap-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!isEmail(email)) errs.email = "Enter a valid email address.";
        if (!password) errs.password = "Enter your password.";
        setErrors(errs);
        if (Object.keys(errs).length) return;
        setPending(true);
        try {
          const u = await auth.login(email, password);
          toast(`Welcome back, ${u.displayName}!`);
          router.replace(next);
        } catch (err) {
          setErrors({ form: err instanceof ApiError ? err.message : "Couldn't log in. Please try again." });
        } finally {
          setPending(false);
        }
      }}
    >
      {errors.form && <p role="alert" className="rounded-2xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">{errors.form}</p>}
      <TextField label="Email address" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <div>
        <PasswordField label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <div className="mt-3 flex items-center justify-between">
          <Checkbox checked={remember} onChange={setRemember}>Remember me</Checkbox>
          <Link href="/forgot-password" className="text-sm font-bold text-brand-text underline underline-offset-4">Lost your password?</Link>
        </div>
      </div>
      <SubmitButton pending={pending} className="btn-primary btn-lg btn-block">Log in</SubmitButton>
      <p className="text-center text-sm text-text-2">
        New to Dawat? <Link href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-brand-text underline underline-offset-4">Create an account</Link>
      </p>
    </form>
  );
}
