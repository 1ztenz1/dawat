"use client";

import { useState } from "react";
import { ThemeSegmented } from "@/components/theme/theme";
import { Checkbox, PasswordField, SubmitButton, TextField } from "@/components/ui/form";
import { toast } from "@/components/ui/toast";
import { ApiError, account, auth, useUser } from "@/lib/api";
import { isEmail, isPhone } from "@/lib/format";

export default function AccountDetailsPage() {
  const user = useUser()!;
  const [f, setF] = useState({ firstName: user.firstName, lastName: user.lastName, displayName: user.displayName, email: user.email, phone: user.phone });
  const [marketing, setMarketing] = useState(user.marketing);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [pwPending, setPwPending] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="grid gap-5">
      <h1 className="text-3xl">Account details</h1>

      <form
        noValidate
        className="card grid gap-4 p-5 sm:p-7"
        onSubmit={async (e) => {
          e.preventDefault();
          const errs: Record<string, string> = {};
          if (!f.firstName.trim()) errs.firstName = "Required";
          if (!f.lastName.trim()) errs.lastName = "Required";
          if (!f.displayName.trim()) errs.displayName = "Required";
          if (!isEmail(f.email)) errs.email = "Enter a valid email address.";
          if (f.phone && !isPhone(f.phone)) errs.phone = "Enter a 10-digit phone number.";
          setErrors(errs);
          if (Object.keys(errs).length) return;
          setPending(true);
          try {
            await account.updateProfile({ ...f, marketing });
            toast("Account details saved");
          } catch (err) {
            if (err instanceof ApiError && err.field) setErrors({ [err.field]: err.message });
          } finally {
            setPending(false);
          }
        }}
      >
        <h2 className="text-xl">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="First name" autoComplete="given-name" value={f.firstName} onChange={set("firstName")} error={errors.firstName} />
          <TextField label="Last name" autoComplete="family-name" value={f.lastName} onChange={set("lastName")} error={errors.lastName} />
        </div>
        <TextField label="Display name" value={f.displayName} onChange={set("displayName")} error={errors.displayName} hint="This is how your name appears in your account." />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Email address" type="email" autoComplete="email" value={f.email} onChange={set("email")} error={errors.email} />
          <TextField label="Mobile number" optional type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} error={errors.phone} hint="For delivery SMS updates." />
        </div>
        <Checkbox checked={marketing} onChange={setMarketing}>Email me the weekly menu and offers</Checkbox>
        <SubmitButton pending={pending} className="btn-primary justify-self-start">Save changes</SubmitButton>
      </form>

      <form
        noValidate
        className="card grid gap-4 p-5 sm:p-7"
        onSubmit={async (e) => {
          e.preventDefault();
          const errs: Record<string, string> = {};
          if (!pw.current) errs.current = "Enter your current password.";
          if (pw.next.length < 8) errs.next = "Use at least 8 characters.";
          if (pw.next !== pw.confirm) errs.confirm = "Passwords don't match.";
          setPwErrors(errs);
          if (Object.keys(errs).length) return;
          setPwPending(true);
          try {
            await auth.changePassword(pw.current, pw.next);
            setPw({ current: "", next: "", confirm: "" });
            toast("Password changed");
          } catch (err) {
            if (err instanceof ApiError) setPwErrors({ [err.field ?? "current"]: err.message });
          } finally {
            setPwPending(false);
          }
        }}
      >
        <h2 className="text-xl">Password change</h2>
        <PasswordField label="Current password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} error={pwErrors.current} />
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordField label="New password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} error={pwErrors.next} />
          <PasswordField label="Confirm new password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} error={pwErrors.confirm} />
        </div>
        <SubmitButton pending={pwPending} className="btn-outline justify-self-start">Change password</SubmitButton>
      </form>

      <section className="card grid gap-3 p-5 sm:p-7">
        <h2 className="text-xl">Appearance</h2>
        <p className="text-text-2">Choose light, dark, or follow your device setting.</p>
        <div className="max-w-md"><ThemeSegmented /></div>
      </section>
    </div>
  );
}
