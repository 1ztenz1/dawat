import { site } from "./site";

/* All delivery logic is in Toronto time, whatever the visitor's zone. */
const TZ = "America/Toronto";

export function torontoNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour") };
}

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fromISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
};

export const isWeekday = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6;

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function nextWeekday(d: Date) {
  let x = addDays(d, 1);
  while (!isWeekday(x)) x = addDays(x, 1);
  return x;
}

/** Earliest start: the weekday after the processing day. Orders after
 *  6 PM ET are processed the following day. */
export function earliestStartDate(now = new Date()) {
  const t = torontoNow(now);
  let processing = new Date(t.year, t.month - 1, t.day, 12);
  if (t.hour >= site.cutoffHourET) processing = addDays(processing, 1);
  return nextWeekday(processing);
}

export function isPastCutoff(now = new Date()) {
  return torontoNow(now).hour >= site.cutoffHourET;
}

/** The next `count` delivery dates starting on `start` (weekdays only). */
export function deliveryDates(start: string, count: number) {
  const dates: string[] = [];
  let d = fromISO(start);
  if (!isWeekday(d)) d = nextWeekday(d);
  while (dates.length < count) {
    if (isWeekday(d)) dates.push(toISO(d));
    d = addDays(d, 1);
  }
  return dates;
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }) {
  return fromISO(iso).toLocaleDateString("en-CA", opts);
}

export function formatLongDate(iso: string) {
  return formatDate(iso, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
