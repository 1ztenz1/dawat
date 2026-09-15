"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordField, SubmitButton } from "@/components/ui/form";
import { toast } from "@/components/ui/toast";
import { ApiError, auth } from "@/lib/api";

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  if (!token)
    return (
      <div className="card p-6">
        <p className="font-bold">This reset link is missing or invalid.</p>
        <Link href="/forgot-password" className="btn btn-primary mt-4">Request a new link</Link>
      </div>
    );

  return (
    <form
      noValidate
      className="grid gap-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (pw.length < 8) errs.pw = "Use at least 8 characters.";
        if (pw !== confirm) errs.confirm = "Passwords don't match.";
        setErrors(errs);
        if (Object.keys(errs).length) return;
        setPending(true);
        try {
          await auth.resetPassword(token, pw);
          toast("Password updated. Please log in.");
          router.replace("/login");
        } catch (err) {
          setErrors({ form: err instanceof ApiError ? err.message : "Couldn't reset your password." });
        } finally {
          setPending(false);
        }
      }}
    >
      {errors.form && <p role="alert" className="rounded-2xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">{errors.form} <Link href="/forgot-password" className="underline">Request a new link</Link></p>}
      <PasswordField label="New password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} error={errors.pw} />
      <PasswordField label="Confirm new password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
      <SubmitButton pending={pending} className="btn-primary btn-lg btn-block">Save password</SubmitButton>
    </form>
  );
}
