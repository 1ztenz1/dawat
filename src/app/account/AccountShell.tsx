"use client";

import { CreditCard, LayoutDashboard, LogOut, MapPin, Receipt, Repeat, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { toast } from "@/components/ui/toast";
import { auth, useUser } from "@/lib/api";
import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/store/persisted";

export const accountNav = [
  { href: "/account", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/account/subscriptions", label: "Subscriptions", Icon: Repeat },
  { href: "/account/orders", label: "Orders", Icon: Receipt },
  { href: "/account/addresses", label: "Addresses", Icon: MapPin },
  { href: "/account/payment-methods", label: "Payment methods", Icon: CreditCard },
  { href: "/account/details", label: "Account details", Icon: UserRound },
];

export function AccountShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [hydrated, user, pathname, router]);

  if (!hydrated || !user)
    return (
      <div className="container-x section">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-bg-subtle" />
        <div className="mt-8 h-72 animate-pulse rounded-3xl bg-bg-subtle" />
      </div>
    );

  const logout = async () => {
    await auth.logout();
    toast("You've been logged out.");
    router.replace("/");
  };

  return (
    <div className="container-x pb-16 pt-6 sm:pt-10">
      <div className="mb-6 flex items-center gap-4 sm:mb-8">
        <span className="grid size-14 shrink-0 place-items-center rounded-full icon-deep font-display text-2xl font-semibold">
          {user.firstName.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="text-sm text-muted">My account</p>
          <p className="truncate font-display text-2xl font-semibold sm:text-3xl">Hello, {user.displayName}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr] lg:gap-10">
        <nav aria-label="Account" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:grid lg:content-start lg:gap-1 lg:overflow-visible lg:px-0">
          {accountNav.map(({ href, label, Icon }) => {
            const active = href === "/account" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors lg:rounded-2xl lg:border-0 lg:px-4 lg:py-3 lg:text-[0.95rem]",
                  active ? "border-brand-text bg-brand-soft text-brand-text" : "border-line text-text-2 hover:bg-bg-subtle hover:text-text",
                )}
              >
                <Icon size={18} /> {label}
              </Link>
            );
          })}
          <button onClick={logout} className="flex shrink-0 items-center gap-2.5 rounded-full border border-line px-4 py-2.5 text-sm font-bold text-danger hover:bg-danger-soft lg:mt-2 lg:rounded-2xl lg:border-0 lg:py-3 lg:text-[0.95rem]">
            <LogOut size={18} /> Log out
          </button>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
