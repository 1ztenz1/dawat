"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useLayoutEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/format";

export type ThemePref = "system" | "light" | "dark";
const KEY = "dhm.theme";

/* Runs in <head> before first paint: no flash of the wrong theme. */
export const themeScript = `(function(){try{var p=localStorage.getItem("${KEY}")||"system";var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")}catch(e){}})()`;

const listeners = new Set<() => void>();
const readPref = (): ThemePref => {
  try {
    return (localStorage.getItem(KEY) as ThemePref) || "system";
  } catch {
    return "system";
  }
};

function apply(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  root.setAttribute("data-theme", dark ? "dark" : "light");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0b1310" : "#0f3d2c");
}

export function setTheme(pref: ThemePref) {
  try {
    localStorage.setItem(KEY, pref);
  } catch {}
  apply(pref);
  listeners.forEach((l) => l());
}

export function useThemePref() {
  const pref = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      const mq = matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => {
        if (readPref() === "system") apply("system");
        l();
      };
      mq.addEventListener("change", onChange);
      return () => {
        listeners.delete(l);
        mq.removeEventListener("change", onChange);
      };
    },
    readPref,
    () => "system" as ThemePref,
  );
  // React's dev remount can reset <html> attributes; re-apply before paint.
  useLayoutEffect(() => apply(readPref()), []);
  return pref;
}

const options: { id: ThemePref; label: string; Icon: typeof Sun }[] = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "system", label: "System", Icon: Monitor },
];

/** Compact icon button that cycles light → dark → system. */
export function ThemeToggle({ className }: { className?: string }) {
  const pref = useThemePref();
  const idx = options.findIndex((o) => o.id === pref);
  const current = options[idx] ?? options[2];
  const next = options[(idx + 1) % options.length];
  return (
    <button
      type="button"
      onClick={() => setTheme(next.id)}
      className={cn("grid size-11 place-items-center rounded-full text-text-2 transition-colors hover:bg-bg-subtle hover:text-text", className)}
      aria-label={`Theme: ${current.label}. Switch to ${next.label}`}
      title={`Theme: ${current.label}`}
    >
      <current.Icon size={20} />
    </button>
  );
}

/** Three-way segmented control, used in the mobile menu and account settings. */
export function ThemeSegmented() {
  const pref = useThemePref();
  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-1 rounded-full border border-line bg-bg-subtle p-1">
      {options.map(({ id, label, Icon }) => (
        <button
          key={id}
          role="radio"
          aria-checked={pref === id}
          onClick={() => setTheme(id)}
          className={cn(
            "flex min-h-10 items-center justify-center gap-1.5 rounded-full text-sm font-bold transition-colors",
            pref === id ? "bg-surface text-text shadow-soft" : "text-muted hover:text-text",
          )}
        >
          <Icon size={16} /> {label}
        </button>
      ))}
    </div>
  );
}
