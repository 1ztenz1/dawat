"use client";

import { CalendarDays, House, ShoppingBag, UserRound, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/api";
import { cn } from "@/lib/format";
import { cartSummary, useCart } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/persisted";
import { ui } from "@/lib/store/ui";

/* App-style bottom navigation for phones. Hidden where a page has its own
   sticky action bar (product, cart, checkout). */
export function MobileTabBar() {
  const pathname = usePathname();
  const lines = useCart((s) => s.lines);
  const hydrated = useHydrated();
  const user = useUser();
  const count = hydrated ? cartSummary(lines).count : 0;

  if (pathname.startsWith("/checkout") || pathname.startsWith("/product/") || pathname === "/cart" || pathname === "/trial") return null;

  const tabs = [
    { href: "/", label: "Home", Icon: House, match: (p: string) => p === "/" },
    { href: "/menu", label: "Menu", Icon: CalendarDays, match: (p: string) => p.startsWith("/menu") },
    { href: "/plans", label: "Plans", Icon: UtensilsCrossed, match: (p: string) => p.startsWith("/plans") || p.startsWith("/thali") },
  ];

  return (
    <>
      <div className="h-[calc(4.25rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden />
      <nav
        aria-label="Quick navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto grid h-[4.25rem] max-w-md grid-cols-5">
          {tabs.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            return (
              <li key={href}>
                <Link href={href} className={cn("flex h-full flex-col items-center justify-center gap-1 text-[11px] font-bold", active ? "text-brand-text" : "text-muted")} aria-current={active ? "page" : undefined}>
                  <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", active && "bg-brand-soft")}>
                    <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
          <li>
            <button onClick={() => ui.set({ cartOpen: true })} className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-bold text-muted">
              <span className="relative grid h-7 w-12 place-items-center">
                <ShoppingBag size={20} />
                {count > 0 && <span className="absolute -top-1 right-1.5 grid min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-extrabold leading-[18px] text-on-accent">{count}</span>}
              </span>
              Cart
            </button>
          </li>
          <li>
            <Link href={user ? "/account" : "/login"} className={cn("flex h-full flex-col items-center justify-center gap-1 text-[11px] font-bold", pathname.startsWith("/account") || pathname === "/login" ? "text-brand-text" : "text-muted")}>
              <span className={cn("grid h-7 w-12 place-items-center rounded-full", (pathname.startsWith("/account") || pathname === "/login") && "bg-brand-soft")}>
                <UserRound size={20} />
              </span>
              {user ? "Account" : "Log in"}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
