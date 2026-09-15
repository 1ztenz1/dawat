import type { SubscriptionStatus } from "@/lib/api";
import { cn } from "@/lib/format";

const map: Record<SubscriptionStatus, { label: string; cls: string }> = {
  active: { label: "Active", cls: "bg-success-soft text-success" },
  paused: { label: "Paused", cls: "bg-warning-soft text-accent-text" },
  "pending-cancel": { label: "Ending", cls: "bg-danger-soft text-danger" },
  cancelled: { label: "Cancelled", cls: "bg-bg-subtle text-muted" },
};

export function SubStatus({ status, className }: { status: SubscriptionStatus; className?: string }) {
  return <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold", map[status].cls, className)}><span className="size-1.5 rounded-full bg-current" />{map[status].label}</span>;
}
