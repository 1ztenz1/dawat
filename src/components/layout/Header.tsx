"use client";

import { ChevronRight, Clock, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/brand/Logo";
import { WhatsAppIcon } from "@/components/icons/brand";
import { ThemeSegmented, ThemeToggle } from "@/components/theme/theme";
import { Sheet } from "@/components/ui/Sheet";
import { useUser } from "@/lib/api";
import { cn } from "@/lib/format";
import { site } from "@/lib/site";
import { cartSummary, useCart } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/persisted";
import { ui, useUi } from "@/lib/store/ui";

export const navLinks = [
  { href: "/menu", label: "This Week" },
  { href: "/plans", label: "Meal Plans" },
  { href: "/thali", label: "Thali" },
  { href: "/trial", label: "Trial" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = useUi((s) => s.menuOpen);
  const lines = useCart((s) => s.lines);
  const hydrated = useHydrated();
  const user = useUser();
  const count = hydrated ? cartSummary(lines).count : 0;
  const lastAddedAt = useCart((s) => s.lastAddedAt);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after navigating.
  useEffect(() => ui.set({ menuOpen: false }), [pathname]);

  const isCheckout = pathname.startsWith("/checkout");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
          "bg-bg/85 backdrop-blur-xl backdrop-saturate-150",
          scrolled ? "border-line shadow-[0_6px_24px_-18px_rgb(0_0_0/0.4)]" : "border-transparent",
        )}
      >
        <div className="container-x flex h-16 items-center gap-3 sm:h-[4.5rem] lg:gap-6">
          <Logo />

          {!isCheckout && (
            <nav aria-label="Primary" className="mx-auto hidden items-center gap-0.5 lg:flex">
              {navLinks.map((l) => {
                const active = pathname === l.href || pathname.startsWith(l.href + "/");
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[0.93rem] font-semibold transition-colors",
                      active ? "bg-brand-soft text-brand-text" : "text-text-2 hover:bg-bg-subtle hover:text-text",
                    )}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {isCheckout ? (
            <p className="ml-auto flex items-center gap-2 text-sm font-semibold text-muted">
              <span className="hidden sm:inline">Secure checkout</span>
              <Link href="/cart" className="text-brand-text underline underline-offset-4">Back to cart</Link>
            </p>
          ) : (
            <div className="ml-auto flex items-center gap-1 lg:ml-0">
              <ThemeToggle className="hidden sm:grid" />
              <Link
                href={user ? "/account" : "/login"}
                className="hidden size-11 place-items-center rounded-full text-text-2 hover:bg-bg-subtle hover:text-text sm:grid"
                aria-label={user ? "My account" : "Log in"}
                title={user ? `Hi, ${user.displayName}` : "Log in"}
              >
                <UserRound size={21} />
              </Link>
              <button
                onClick={() => ui.set({ cartOpen: true })}
                className="relative grid size-11 place-items-center rounded-full text-text-2 hover:bg-bg-subtle hover:text-text"
                aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
              >
                <ShoppingBag size={21} />
                {count > 0 && (
                  <span key={lastAddedAt} className="animate-pop absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-extrabold leading-5 text-on-accent">
                    {count}
                  </span>
                )}
              </button>
              <Link href="/plans" className="btn btn-primary btn-sm ml-2 hidden md:inline-flex">
                Order now
              </Link>
              <button
                onClick={() => ui.set({ menuOpen: true })}
                className="grid size-11 place-items-center rounded-full text-text hover:bg-bg-subtle lg:hidden"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <Menu size={22} />
              </button>
            </div>
          )}
        </div>
      </header>

      <Sheet open={menuOpen} onClose={() => ui.set({ menuOpen: false })} title="Menu" variant="drawer">
        <nav aria-label="Mobile" className="grid">
          {[{ href: "/", label: "Home" }, ...navLinks, { href: "/shop", label: "Shop all" }, { href: "/subscribe", label: "Offers" }, { href: "/delivery-areas", label: "Delivery areas" }, { href: "/faq", label: "FAQ" }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => ui.set({ menuOpen: false })} className="flex items-center justify-between border-b border-line py-3.5 text-lg font-semibold">
              {l.label} <ChevronRight size={18} className="text-muted" />
            </Link>
          ))}
        </nav>
        <div className="mt-6 grid gap-3">
          <Link href={user ? "/account" : "/login"} onClick={() => ui.set({ menuOpen: false })} className="btn btn-outline btn-block">
            <UserRound size={18} /> {user ? `My account (${user.displayName})` : "Log in / Sign up"}
          </Link>
          <Link href="/plans" onClick={() => ui.set({ menuOpen: false })} className="btn btn-accent btn-block">Order now</Link>
        </div>
        <div className="mt-6">
          <p className="label">Appearance</p>
          <ThemeSegmented />
        </div>
        <div className="mt-6 grid gap-2 rounded-2xl bg-bg-subtle p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold"><Clock size={16} className="text-accent-text" /> Order by 6 PM ET for the next business day</p>
          <a href={site.phone.href} className="font-bold text-brand-text">{site.phone.display}</a>
          <a href={site.whatsapp.href} target="_blank" rel="noopener" className="flex items-center gap-2 font-bold text-brand-text">
            <WhatsAppIcon size={16} /> Chat on WhatsApp
          </a>
        </div>
      </Sheet>
    </>
  );
}

const readDismissed = () => {
  try {
    return sessionStorage.getItem("dhm.announce") === "0";
  } catch {
    return false;
  }
};

export function AnnouncementBar() {
  const stored = useSyncExternalStore(() => () => {}, readDismissed, () => false);
  const [dismissed, setHidden] = useState(false);
  if (stored || dismissed) return null;
  return (
    <div className="bg-deep-2 text-[0.82rem] text-on-deep-2">
      <div className="container-x flex min-h-9 items-center justify-between gap-3 py-1.5">
        <p className="flex items-center gap-2">
          <Clock size={14} className="shrink-0 text-gold-300" />
          <span className="sm:hidden">Orders after <strong className="text-gold-300">6 PM ET</strong> are processed next day</span>
          <span className="hidden sm:inline">
            Orders placed after <strong className="text-gold-300">6 PM Eastern</strong> are processed the next day
          </span>
        </p>
        <div className="flex items-center gap-3">
          <a href={site.phone.href} className="hidden font-bold text-on-deep sm:inline">{site.phone.display}</a>
          <button
            onClick={() => {
              setHidden(true);
              try {
                sessionStorage.setItem("dhm.announce", "0");
              } catch {}
            }}
            className="grid size-7 place-items-center rounded-full hover:bg-white/10"
            aria-label="Dismiss announcement"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
