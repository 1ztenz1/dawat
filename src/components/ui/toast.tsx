"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/format";

type Toast = { id: number; text: string; tone: "success" | "error" | "info" };
let toasts: Toast[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
let seq = 0;

export function toast(text: string, tone: Toast["tone"] = "success") {
  const t = { id: ++seq, text, tone };
  toasts = [...toasts, t].slice(-3);
  emit();
  setTimeout(() => dismiss(t.id), 3800);
}
function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}
const EMPTY: Toast[] = [];

export function Toaster() {
  const list = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => toasts,
    () => EMPTY,
  );
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex flex-col items-center gap-2 px-4 lg:bottom-6">
      {list.map((t) => (
        <div
          key={t.id}
          className={cn(
            "animate-rise pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-card",
            "border-line bg-surface text-text",
          )}
        >
          {t.tone === "error" ? <CircleAlert className="text-danger" size={20} /> : <CircleCheck className="text-success" size={20} />}
          <span className="flex-1">{t.text}</span>
          <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="grid size-8 place-items-center rounded-full text-muted hover:bg-bg-subtle">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
