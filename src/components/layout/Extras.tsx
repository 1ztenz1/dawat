"use client";

import { Cookie, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { WhatsAppIcon } from "@/components/icons/brand";
import { Switch } from "@/components/ui/form";
import { site } from "@/lib/site";
import { cn } from "@/lib/format";

/* ---------------- Cookie consent (replaces CookieYes) ---------------- */

type Consent = { necessary: true; analytics: boolean; marketing: boolean; at: string };
const CONSENT_KEY = "dhm.consent.v1";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        const t = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  const save = (c: Omit<Consent, "necessary" | "at">) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ necessary: true, ...c, at: new Date().toISOString() }));
    } catch {}
    // Hook analytics here once consent is given (e.g. load GA / Site Kit).
    setShow(false);
  };

  if (!show) return null;
  return (
    <div role="dialog" aria-label="Cookie preferences" className="animate-rise fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[70] mx-auto max-w-lg rounded-3xl border border-line bg-surface p-5 shadow-lift sm:bottom-6 lg:left-6 lg:right-auto lg:mx-0">
      <div className="flex gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-text"><Cookie size={20} /></span>
        <div className="text-sm">
          <p className="font-bold text-text">We value your privacy</p>
          <p className="mt-1 text-text-2">We use cookies to keep your cart and login working, and, with your OK, to understand how the site is used. <a href="/privacy-policy" className="font-semibold text-brand-text underline">Privacy policy</a></p>
        </div>
      </div>
      {custom && (
        <div className="mt-4 grid gap-3 rounded-2xl bg-bg-subtle p-4 text-sm">
          <div className="flex items-center justify-between gap-3"><span><b>Necessary</b><br /><span className="text-muted">Cart, login, security</span></span><span className="text-xs font-bold text-muted">Always on</span></div>
          <div className="flex items-center justify-between gap-3"><span><b>Analytics</b><br /><span className="text-muted">Anonymous usage stats</span></span><Switch checked={analytics} onChange={setAnalytics} label="Analytics cookies" /></div>
          <div className="flex items-center justify-between gap-3"><span><b>Marketing</b><br /><span className="text-muted">Personalised offers</span></span><Switch checked={marketing} onChange={setMarketing} label="Marketing cookies" /></div>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {custom ? (
          <button className="btn btn-primary btn-sm col-span-2 sm:col-span-3" onClick={() => save({ analytics, marketing })}>Save preferences</button>
        ) : (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => setCustom(true)}>Customize</button>
            <button className="btn btn-outline btn-sm" onClick={() => save({ analytics: false, marketing: false })}>Reject all</button>
            <button className="btn btn-primary btn-sm col-span-2 sm:col-span-1" onClick={() => save({ analytics: true, marketing: true })}>Accept all</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- WhatsApp chat widget (replaces WP WhatsApp) ---------------- */

export function WhatsAppWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const hideOnMobile = pathname.startsWith("/checkout") || pathname.startsWith("/product/") || pathname === "/cart" || pathname === "/trial";
  if (pathname.startsWith("/checkout")) return null;

  return (
    <div className={cn("fixed right-4 z-[60] bottom-[calc(5.25rem+env(safe-area-inset-bottom))] lg:bottom-6 lg:right-6", hideOnMobile && "hidden lg:block")}>
      {open && (
        <div className="animate-rise absolute bottom-16 right-0 w-[min(88vw,340px)] overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
          <div className="flex items-center gap-3 bg-[#128c4b] p-4 text-white">
            <span className="rounded-xl bg-[#fffcf5] p-1"><Logo className="pointer-events-none [&_img]:h-8" /></span>
            <div className="flex-1">
              <p className="font-bold leading-tight">Dawat Halal Meals</p>
              <p className="text-xs text-white/80">Typically replies within minutes</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="grid size-8 place-items-center rounded-full hover:bg-white/15"><X size={16} /></button>
          </div>
          <div className="bg-bg-subtle p-4">
            <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-surface p-3 text-sm shadow-soft">Assalamu alaikum! 👋 Questions about plans, delivery or this week&apos;s menu? Send us a message.</p>
          </div>
          <form
            className="flex gap-2 border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(`${site.whatsapp.href}?text=${encodeURIComponent(msg || "Hi Dawat, I have a question.")}`, "_blank", "noopener");
            }}
          >
            <label htmlFor="wa-msg" className="sr-only">Message</label>
            <input id="wa-msg" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message…" className="input min-h-11 rounded-full" />
            <button className="grid size-11 shrink-0 place-items-center rounded-full bg-[#128c4b] text-white" aria-label="Send on WhatsApp"><Send size={18} /></button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid size-14 place-items-center rounded-full bg-[#1fae5b] text-white shadow-lift transition-transform hover:scale-105"
        aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
        aria-expanded={open}
      >
        {open ? <X size={24} /> : <WhatsAppIcon size={28} />}
      </button>
    </div>
  );
}
