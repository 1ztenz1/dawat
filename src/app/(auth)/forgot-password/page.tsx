"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/account/AuthShell";
import { SubmitButton, TextField } from "@/components/ui/form";
import { auth } from "@/lib/api";
import { isEmail } from "@/lib/format";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<{ token: string | null } | null>(null);

  return (
    <AuthShell title="Reset your password" subtitle="Enter your email and we'll send you a link to create a new password.">
      {sent ? (
        <div className="card p-6 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success"><MailCheck size={26} /></span>
          <p className="mt-4 text-lg font-bold">Check your inbox</p>
          <p className="mt-1 text-text-2">If an account exists for <b>{email}</b>, a reset link is on its way.</p>
          {sent.token && (
            <Link href={`/reset-password?token=${sent.token}`} className="btn btn-outline btn-sm mt-5">Preview mode: open reset link</Link>
          )}
          <p className="mt-5 text-sm"><Link href="/login" className="font-bold text-brand-text underline">Back to log in</Link></p>
        </div>
      ) : (
        <form
          noValidate
          className="grid gap-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!isEmail(email)) return setError("Enter a valid email address.");
            setError("");
            setPending(true);
            const r = await auth.requestPasswordReset(email);
            setPending(false);
            setSent({ token: r.demoToken });
          }}
        >
          <TextField label="Email address" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <SubmitButton pending={pending} className="btn-primary btn-lg btn-block">Send reset link</SubmitButton>
          <p className="text-center text-sm"><Link href="/login" className="font-bold text-brand-text underline underline-offset-4">Back to log in</Link></p>
        </form>
      )}
    </AuthShell>
  );
}
