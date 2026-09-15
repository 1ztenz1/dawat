"use client";

import { Flame } from "lucide-react";
import { weeklyMenu } from "@/lib/menu";
import { addDays, fromISO, toISO } from "@/lib/dates";
import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/store/persisted";

function useTodayIndex() {
  const hydrated = useHydrated();
  if (!hydrated) return -1;
  const today = toISO(new Date());
  const start = fromISO(weeklyMenu.weekStart);
  return weeklyMenu.days.findIndex((_, i) => toISO(addDays(start, i)) === today);
}

export function MenuTable({ compact = false }: { compact?: boolean }) {
  const todayIdx = useTodayIndex();
  const start = fromISO(weeklyMenu.weekStart);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card">
      <div className="hidden grid-cols-[96px_1fr_1fr] gap-4 bg-deep px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.12em] text-on-deep sm:grid">
        <span>Day</span>
        <span className="flex items-center gap-2"><span className="nonveg-mark !text-[#ff8a8f]" /> Non-veg</span>
        <span className="flex items-center gap-2"><span className="veg-mark !text-[#6fe3a2]" /> Sabzi (veg)</span>
      </div>
      <ol>
        {weeklyMenu.days.map((d, i) => {
          const date = addDays(start, i);
          const today = i === todayIdx;
          return (
            <li
              key={d.day}
              className={cn(
                "grid grid-cols-[64px_1fr] gap-x-4 gap-y-1 border-t border-line px-4 py-4 first:border-t-0 sm:grid-cols-[96px_1fr_1fr] sm:items-center sm:px-6 sm:first:border-t",
                today && "bg-gradient-to-r from-accent-soft to-transparent",
                compact && "sm:py-3.5",
              )}
            >
              <div className="row-span-2 sm:row-span-1">
                <p className="font-display text-lg font-semibold leading-tight text-brand-text">{d.short}</p>
                <p className="text-xs font-semibold text-muted">{date.toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</p>
                {today && <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-accent-text"><Flame size={11} /> Today</p>}
              </div>
              <p className="flex items-center gap-2 font-semibold"><span className="nonveg-mark sm:hidden" />{d.nonveg}</p>
              <p className="flex items-center gap-2 text-[0.95rem] text-text-2"><span className="veg-mark sm:hidden" />{d.sabzi}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function TodaysDish() {
  const idx = useTodayIndex();
  const d = weeklyMenu.days[idx >= 0 ? idx : 0];
  return (
    <div suppressHydrationWarning>
      <small className="block text-[11px] font-bold uppercase tracking-wider text-muted">{idx >= 0 ? "Today's special" : "On the menu"}</small>
      <strong className="font-bold">{d.nonveg}</strong>
    </div>
  );
}
