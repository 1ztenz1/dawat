import { ArrowRight, BadgeCheck, Banknote, Clock, Flame, Leaf, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MenuTable, TodaysDish } from "@/components/menu/MenuTable";
import { PlanCards } from "@/components/plans/PlanCards";
import { images } from "@/components/plans/images";
import { AreasBand, CtaBand, FaqList, HowItWorks, InsideEveryMeal, SectionHead, WhyUs } from "@/components/sections";
import { TRIAL_PER_DAY } from "@/lib/catalog";
import { menuWeekLabel } from "@/lib/menu";
import { deliveryAreas, faqs, site } from "@/lib/site";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: site.name,
    url: site.url,
    servesCuisine: ["North Indian", "Pakistani", "Halal"],
    telephone: "+1-647-237-7313",
    email: site.email,
    priceRange: "$49.99 – $319.99",
    areaServed: deliveryAreas,
    sameAs: [site.social.facebook, site.social.instagram],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-deep text-on-deep">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_85%_40%,rgb(230_162_60/0.18),transparent_60%),radial-gradient(700px_500px_at_0%_100%,rgb(26_138_76/0.28),transparent_60%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(90deg,#000,transparent_60%)]" />
        <div className="container-x relative grid items-center gap-8 pb-14 pt-8 sm:gap-12 sm:pb-20 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="order-2 lg:order-1">
            <p className="eyebrow !text-gold-300">
              <span className="size-2 rounded-full bg-[#3ddc84] shadow-[0_0_0_4px_rgb(61_220_132/0.2)]" /> 100% Halal · Cooked fresh every morning
            </p>
            <h1 className="text-[clamp(2.35rem,1.3rem+4.2vw,4.4rem)] leading-[1.03] tracking-[-0.025em]">
              Home-style halal meals, <em className="text-gold-300">delivered warm</em> to your door.
            </h1>
            <p className="mt-5 max-w-xl text-[1.08rem] text-on-deep-2 sm:text-lg">
              Authentic North Indian &amp; Pakistani cooking for busy professionals and students across the GTA. A new menu every week, delivered Monday to Friday.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/plans" className="btn btn-accent btn-lg">See meal plans <ArrowRight size={18} /></Link>
              <Link href="/trial" className="btn btn-ghost-light btn-lg">Try from ${TRIAL_PER_DAY - 2}/day</Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/12 pt-6">
              {[
                [site.stats.meals, "meals delivered"],
                [site.stats.customers, "happy regulars"],
                [String(deliveryAreas.length), "GTA areas"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-3xl font-semibold leading-none">{n}</dd>
                  <dd className="mt-1 text-xs text-on-deep-muted sm:text-sm">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative order-1 mx-auto w-[min(78%,500px)] lg:order-2 lg:w-full">
            <div className="aspect-square overflow-hidden rounded-full shadow-[0_0_0_10px_rgb(230_162_60/0.12),0_0_0_22px_rgb(230_162_60/0.06),var(--shadow-lg)]">
              <Image src={images.biryani} alt="Chicken biryani with raita" preload fetchPriority="high" sizes="(max-width: 1024px) 78vw, 500px" className="size-full scale-[1.02] object-cover" />
            </div>
            <div className="animate-bob absolute -left-4 top-[12%] flex items-center gap-2.5 rounded-2xl bg-surface/95 px-3 py-2.5 text-sm text-text shadow-card sm:-left-8 sm:px-4 sm:py-3">
              <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-accent-text"><Flame size={18} /></span>
              <TodaysDish />
            </div>
            <div className="animate-bob absolute -right-3 bottom-[8%] flex items-center gap-2.5 rounded-2xl bg-surface/95 px-3 py-2.5 text-sm text-text shadow-card [animation-delay:-3s] sm:-right-6 sm:px-4 sm:py-3">
              <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand-text"><Truck size={18} /></span>
              <div>
                <small className="block text-[11px] font-bold uppercase tracking-wider text-muted">Free delivery</small>
                <strong>In every plan</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section aria-label="Highlights" className="bg-accent text-on-accent">
        <ul className="container-x grid grid-cols-2 gap-x-4 gap-y-2.5 py-4 text-[0.8rem] font-bold sm:flex sm:justify-between sm:py-3.5 sm:text-sm">
          {[
            [BadgeCheck, "Certified food handler on site"],
            [Leaf, "Less oil, refined vegetable oil"],
            [ShieldCheck, "Microwavable BPA-free containers"],
            [Banknote, "Cards or cash on delivery"],
          ].map(([Icon, t]) => {
            const I = Icon as typeof Leaf;
            return (
              <li key={t as string} className="flex items-center gap-2 leading-tight"><I size={17} className="shrink-0" /> {t as string}</li>
            );
          })}
        </ul>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="container-x section">
        <SectionHead eyebrow="How it works" title="Three steps to a week of great lunches" />
        <HowItWorks />
      </section>

      {/* ============ INSIDE EVERY MEAL ============ */}
      <section className="container-x pb-16 sm:pb-24">
        <SectionHead eyebrow="In every box" title="A proper home-style plate, every weekday">
          Curry, sabzi, rice and fresh roti. Portions shown for our Regular meal.
        </SectionHead>
        <InsideEveryMeal />
      </section>

      {/* ============ MENU ============ */}
      <section className="bg-bg-subtle">
        <div className="container-x section grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <p className="eyebrow">This week&apos;s menu</p>
            <h2 className="h-section">Something new on your plate every day</h2>
            <p className="mt-4 text-text-2">We rotate the menu every week so lunch never gets boring. Every meal comes with the sabzi of the day; veg plans get a second vegetarian dish.</p>
            <p className="mt-6 flex items-center gap-2 font-bold text-brand-text"><Clock size={18} /> {menuWeekLabel()}</p>
            <Link href="/menu" className="btn btn-outline mt-6">Full menu &amp; poster <ArrowRight size={18} /></Link>
          </div>
          <MenuTable />
        </div>
      </section>

      {/* ============ PLANS ============ */}
      <section className="container-x section" id="plans">
        <SectionHead eyebrow="Meal plans" title="Choose the plate that fits your appetite">
          Delivery included. Weekly plans renew every 7 days, monthly every 28 days. Pause or cancel anytime.
        </SectionHead>
        <PlanCards />
        <p className="mt-8 text-center text-sm text-muted">
          Non-veg plans come as Chicken or Beef + Chicken. Veg plans are pure vegetarian. <Link href="/plans" className="font-semibold text-brand-text underline underline-offset-4">Compare all plans</Link>
        </p>
      </section>

      {/* ============ TRIAL ============ */}
      <section className="container-x pb-16 sm:pb-24">
        <div className="relative grid items-center gap-8 overflow-hidden rounded-[2rem] bg-deep p-7 text-on-deep shadow-lift sm:p-12 lg:grid-cols-2 lg:p-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_400px_at_100%_0%,rgb(230_162_60/0.28),transparent_60%)]" />
          <div className="relative">
            <p className="eyebrow !text-gold-300">No subscription</p>
            <h2 className="h-section">Not sure yet? Try us for 1–4 days.</h2>
            <p className="mt-4 max-w-md text-on-deep-2">A one-time order to taste the difference before you commit. Choose Thali, 12 oz or 16 oz, veggie, chicken or beef.</p>
            <Link href="/trial" className="btn btn-accent btn-lg mt-8">Book a trial <ArrowRight size={18} /></Link>
          </div>
          <ul className="relative grid grid-cols-3 gap-3">
            {[
              ["Thali", TRIAL_PER_DAY - 2],
              ["12 oz", TRIAL_PER_DAY],
              ["16 oz", TRIAL_PER_DAY + 5],
            ].map(([name, price]) => (
              <li key={name} className="rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-center sm:p-6">
                <p className="text-sm font-bold text-on-deep-2">{name}</p>
                <p className="mt-1 font-display text-3xl font-semibold sm:text-4xl">${price}</p>
                <p className="text-xs text-on-deep-muted">per day</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ WHY ============ */}
      <section className="bg-bg-subtle">
        <div className="container-x section">
          <SectionHead eyebrow="Why Dawat" title="Tastes like home. Delivered like clockwork." />
          <WhyUs />
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="container-x section grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <Image src={images.thali} alt="A Dawat thali tray with curry, sabzi, rice and roti" sizes="(max-width: 1024px) 92vw, 560px" className="aspect-[4/3.3] w-full rounded-[1.75rem] object-cover shadow-card" />
          <div className="absolute -bottom-6 right-4 grid size-32 place-items-center rounded-full border-4 border-bg bg-deep p-4 text-center text-on-deep shadow-lift sm:size-36">
            <div>
              <p className="font-display text-2xl font-semibold text-gold-300">Halal</p>
              <p className="text-[10px] leading-tight text-on-deep-2">certified food handler on premises</p>
            </div>
          </div>
        </div>
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="h-section">North Indian &amp; Pakistani home cooking, made for busy lives</h2>
          <p className="mt-5 text-text-2">Dawat Halal Meals is a freshly cooked daily meal delivery service across the GTA. Our food is prepared in a fully equipped commercial kitchen with a certified food handler on premises, cooked in refined vegetable oil.</p>
          <p className="mt-4 text-text-2">If you want the best North Indian &amp; Pakistani home-style food in the Greater Toronto Area, look no further.</p>
          <Link href="/about" className="btn btn-outline mt-7">More about us <ArrowRight size={18} /></Link>
        </div>
      </section>

      <AreasBand />

      {/* ============ FAQ ============ */}
      <section className="container-x section grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">FAQ</p>
          <h2 className="h-section">Good to know</h2>
          <p className="mt-4 text-text-2">Still have a question? We&apos;re a message away.</p>
          <Link href="/faq" className="btn btn-outline mt-6">All questions <ArrowRight size={18} /></Link>
        </div>
        <FaqList items={faqs.slice(0, 6)} />
      </section>

      <CtaBand />
    </>
  );
}
