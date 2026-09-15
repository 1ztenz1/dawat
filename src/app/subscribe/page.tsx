import { ArrowRight, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { images } from "@/components/plans/images";
import { CtaBand, HowItWorks, InsideEveryMeal, SectionHead, WhyUs } from "@/components/sections";
import { findSubscription, frequencies, subscriptions } from "@/lib/catalog";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Daily Halal Meals Subscription",
  description: "Freshly cooked halal meals delivered to your home daily. Weekly from $64.99 (code WEEKLY5 for $5 off), monthly from $249.99 (code MONTHLY20 for $20 off), or try 1–4 days.",
  alternates: { canonical: "/subscribe" },
};

export default function SubscribePage() {
  const weekly = findSubscription("regular", "weekly", "veg");
  const monthly = findSubscription("regular", "monthly", "veg");
  const offers = [
    { tag: "Weekly subscription", price: `Starting at ${money(weekly.price)}`, note: <>Use code <Code>WEEKLY5</Code> at checkout for <b>$5 off</b></>, href: `/product/${weekly.slug}`, img: images.plate },
    { tag: "Monthly subscription", price: `Starting at ${money(monthly.price)}`, note: <>Use code <Code>MONTHLY20</Code> at checkout for <b>$20 off</b></>, href: `/product/${monthly.slug}`, img: images.thali, featured: true },
    { tag: "Trial meals", price: "Starting at $15", note: <>Looking to try our meals for 1–4 days? We&apos;ve got you covered.</>, href: "/trial", img: images.biryani },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-deep text-on-deep">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_-10%,rgb(230_162_60/0.25),transparent_60%)]" />
        <div className="container-x relative py-14 text-center sm:py-20">
          <p className="eyebrow justify-center !text-gold-300">Daily halal meals subscription</p>
          <h1 className="mx-auto max-w-3xl text-[clamp(2.3rem,1.5rem+3.4vw,4rem)] leading-[1.04]">Freshly cooked meals delivered to your home daily</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-on-deep-2">Starting at only <b className="text-gold-300">{money(Math.min(...subscriptions.map((p) => p.price / frequencies[p.frequency].meals)))} per serving</b>. Flexible: pick veg or non-veg, your size and your plan length.</p>
        </div>
      </section>

      <section className="container-x -mt-2 pb-16 pt-10 sm:pb-24">
        <div className="grid gap-5 md:grid-cols-3">
          {offers.map((o) => (
            <article key={o.tag} className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border ${o.featured ? "border-accent shadow-lift" : "border-line shadow-soft"} bg-surface`}>
              <div className="relative aspect-[16/10] overflow-hidden bg-[#fec53a]">
                <Image src={o.img} alt="" fill sizes="(max-width: 768px) 92vw, 380px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                {o.featured && <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-on-accent">Best per-meal price</span>}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-text">{o.tag}</p>
                <p className="mt-2 font-display text-3xl font-semibold">{o.price}</p>
                <p className="mt-3 flex-1 text-text-2">{o.note}</p>
                <Link href={o.href} className={`btn btn-block mt-6 ${o.featured ? "btn-accent" : "btn-primary"} after:absolute after:inset-0`}>Book now <ArrowRight size={18} /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-bg-subtle">
        <div className="container-x section">
          <SectionHead eyebrow="Every weekday" title="What's in your box" />
          <InsideEveryMeal />
          <div className="mt-12 text-center">
            <p className="text-text-2">We keep the menu exciting so you never get bored.</p>
            <Link href="/menu" className="btn btn-outline mt-4"><CalendarDays size={18} /> View menu</Link>
          </div>
        </div>
      </section>

      <section className="container-x section">
        <SectionHead eyebrow="How it works" title="Flexible from day one" />
        <HowItWorks />
      </section>

      <section className="bg-bg-subtle">
        <div className="container-x section">
          <SectionHead eyebrow="Why us?" title="Freshly cooked, daily" />
          <WhyUs />
        </div>
      </section>
      <div className="pt-16 sm:pt-24"><CtaBand /></div>
    </>
  );
}

function Code({ children }: { children: string }) {
  return <span className="rounded-lg border border-dashed border-accent bg-accent-soft px-2 py-0.5 font-mono text-sm font-bold tracking-wider text-accent-text">{children}</span>;
}
