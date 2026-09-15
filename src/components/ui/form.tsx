"use client";

import { Eye, EyeOff, LoaderCircle, Minus, Plus } from "lucide-react";
import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/format";

export function Field({
  label,
  error,
  hint,
  optional,
  children,
  className,
  htmlFor,
}: {
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <div className={className}>
      <label className="label" htmlFor={htmlFor}>
        {label} {optional && <span className="font-medium text-muted">(optional)</span>}
      </label>
      {children}
      {error ? <p className="field-error" role="alert">{error}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: ReactNode; optional?: boolean; wrapClass?: string };

export function TextField({ label, error, hint, optional, wrapClass, id, className, ...rest }: InputProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <Field label={label} error={error} hint={hint} optional={optional} className={wrapClass} htmlFor={inputId}>
      <input id={inputId} className={cn("input", className)} aria-invalid={!!error} {...rest} />
    </Field>
  );
}

export function PasswordField({ label, error, hint, wrapClass, id, ...rest }: InputProps) {
  const [show, setShow] = useState(false);
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <Field label={label} error={error} hint={hint} className={wrapClass} htmlFor={inputId}>
      <div className="relative">
        <input id={inputId} type={show ? "text" : "password"} className="input pr-12" aria-invalid={!!error} {...rest} />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-text"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </Field>
  );
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 10,
  label,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
  size?: "sm" | "md";
}) {
  const btn = size === "sm" ? "size-8" : "size-10";
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-surface-2" role="group" aria-label={label}>
      <button type="button" className={cn(btn, "grid place-items-center rounded-full text-brand-text hover:bg-bg-subtle disabled:opacity-30")} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Decrease ${label}`}>
        <Minus size={16} />
      </button>
      <output className="min-w-7 text-center font-extrabold tabular-nums" aria-live="polite">{value}</output>
      <button type="button" className={cn(btn, "grid place-items-center rounded-full text-brand-text hover:bg-bg-subtle disabled:opacity-30")} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase ${label}`}>
        <Plus size={16} />
      </button>
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-8 w-13 shrink-0 rounded-full transition-colors", checked ? "bg-success" : "bg-line-strong")}
    >
      <span className={cn("absolute left-1 top-1 size-6 rounded-full bg-white shadow-soft transition-transform", checked && "translate-x-5")} />
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
  tone = "light",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  label: string;
  className?: string;
  tone?: "light" | "deep";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex rounded-full border p-1",
        tone === "light" ? "border-line bg-bg-subtle" : "border-white/10 bg-white/5",
        className,
      )}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex min-h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-bold transition-all",
              tone === "light"
                ? on ? "bg-surface text-text shadow-soft" : "text-muted hover:text-text"
                : on ? "bg-accent text-on-accent" : "text-on-deep-2 hover:text-on-deep",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function SubmitButton({ pending, children, className, ...rest }: { pending?: boolean; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="submit" className={cn("btn", className)} disabled={pending || rest.disabled} aria-busy={pending} {...rest}>
      {pending && <LoaderCircle size={18} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Checkbox({ checked, onChange, children, name }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; name?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-text-2">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-md accent-[var(--brand-text)]"
      />
      <span>{children}</span>
    </label>
  );
}
