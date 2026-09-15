"use client";

import { CalendarDays, Info } from "lucide-react";
import { useEffect, useRef } from "react";
import { deliveryDates, earliestStartDate, fromISO, isPastCutoff, isWeekday, toISO } from "@/lib/dates";
import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/store/persisted";

/* Weekday-only start date picker: a swipeable strip of the next available
   dates plus a native calendar for anything further out. */
export function StartDatePicker({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const hydrated = useHydrated();
  const earliest = hydrated ? toISO(earliestStartDate()) : "";
  const dates = hydrated ? deliveryDates(earliest, 12) : [];
  const stripRef = useRef<HTMLDivElement>(null);

  // Default to the earliest date once we know it (client clock, Toronto time).
  useEffect(() => {
    if (hydrated && (!value || value < earliest)) onChange(earliest);
  }, [hydrated, earliest, value, onChange]);

  const outsideStrip = value && dates.length > 0 && !dates.includes(value);

  return (
    <div>
      <div ref={stripRef} className="scrollbar-none -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="radiogroup" aria-label="Start date">
        {!hydrated
          ? Array.from({ length: 6 }, (_, i) => <div key={i} className="h-[4.5rem] w-16 shrink-0 animate-pulse rounded-2xl bg-bg-subtle" />)
          : dates.map((iso) => {
              const d = fromISO(iso);
              const on = iso === value;
              return (
                <button
                  key={iso}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => onChange(iso)}
                  className={cn(
                    "grid h-[4.5rem] w-16 shrink-0 snap-start place-items-center content-center gap-0.5 rounded-2xl border-[1.5px] text-center transition-colors",
                    on ? "border-brand-text bg-brand-soft text-brand-text" : "border-line bg-surface hover:border-line-strong",
                  )}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wide opacity-75">{d.toLocaleDateString("en-CA", { weekday: "short" })}</span>
                  <span className="font-display text-xl font-semibold leading-none">{d.getDate()}</span>
                  <span className="text-[11px] font-semibold opacity-75">{d.toLocaleDateString("en-CA", { month: "short" })}</span>
                </button>
              );
            })}
        <label
          className={cn(
            "relative grid h-[4.5rem] w-20 shrink-0 cursor-pointer place-items-center content-center gap-1 rounded-2xl border-[1.5px] border-dashed text-center text-[11px] font-bold",
            outsideStrip ? "border-brand-text bg-brand-soft text-brand-text" : "border-line-strong text-muted hover:text-text",
          )}
        >
          <CalendarDays size={18} />
          {outsideStrip ? fromISO(value).toLocaleDateString("en-CA", { month: "short", day: "numeric" }) : "Later"}
          <input
            type="date"
            min={earliest}
            value={value}
            aria-label="Choose a later start date"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              let d = fromISO(v);
              while (!isWeekday(d)) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12);
              onChange(toISO(d) < earliest ? earliest : toISO(d));
            }}
          />
        </label>
      </div>
      {error ? (
        <p className="field-error">{error}</p>
      ) : (
        <p className="hint flex items-center gap-1.5">
          <Info size={13} /> Weekdays only.{hydrated && isPastCutoff() ? " It's past 6 PM ET, so the earliest start moves a day." : " Order by 6 PM ET for the earliest start."}
        </p>
      )}
    </div>
  );
}
