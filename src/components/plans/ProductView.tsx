import { BadgeCheck, ChevronRight, Clock, Leaf, Repeat, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaqList } from "@/components/sections";
import { MenuTable } from "@/components/menu/MenuTable";
import { TRIAL_PER_DAY, frequencies, monthlySavings, productName, sizes, type Product } from "@/lib/catalog";
import { money } from "@/lib/format";
import { faqs } from "@/lib/site";
import { SubscriptionConfigurator, TrialConfigurator } from "./Configurator";
import { productImage } from "./images";

export function ProductView({ product }: { product: Product }) {
  const name = productName(product);
  const isTrial = product.kind === "trial";
  const info = isTrial ? null : sizes[product.size];
  const f = isTrial ? null : frequencies[product.frequency];
  const save = !isTrial && product.frequency === "monthly" ? monthlySavings(product.size, product.diet) : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: "Dawat Halal Meals" },
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: isTrial ? TRIAL_PER_DAY - 2 : product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="container-x pb-10 pt-4 sm:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-muted sm:mb-6">
        <Link href="/" className="hover:text-text">Home</Link>
        <ChevronRight size={14} />
        <Link href={isTrial ? "/plans" : product.size === "thali" ? "/thali" : "/plans"} className="hover:text-text">{isTrial || product.size !== "thali" ? "Plans" : "Thali"}</Link>
        <ChevronRight size={14} />
        <span className="truncate text-text">{name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        {/* Visual column */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="relative -mx-4 overflow-hidden bg-[#fec53a] sm:mx-0 sm:rounded-[1.75rem]">
            <Image src={productImage(product)} alt={name} preload sizes="(max-width: 1024px) 100vw, 560px" className={`aspect-[4/3] w-full object-cover ${!isTrial && product.size === "large" ? "scale-110" : ""}`} />
            {!isTrial && (
              <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1.5 text-xs font-bold text-text shadow-soft">
                <span className={product.diet === "veg" ? "veg-mark" : "nonveg-mark"} /> {product.diet === "veg" ? "Pure veg" : "Non-veg"}
              </span>
            )}
          </div>
          <ul className="mt-4 hidden grid-cols-2 gap-2 text-sm lg:grid">
            {[
              [Clock, "Cooked fresh every morning"],
              [Truck, "Delivered Mon–Fri, tracked by SMS"],
              [ShieldCheck, "Microwavable, BPA-free containers"],
              [BadgeCheck, "Certified food handler on site"],
            ].map(([Icon, t]) => {
              const I = Icon as typeof Clock;
              return (
                <li key={t as string} className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-3 font-semibold text-text-2"><I size={18} className="shrink-0 text-accent-text" />{t as string}</li>
              );
            })}
          </ul>
        </div>

        {/* Details + options */}
        <div className="min-w-0">
          <p className="eyebrow">{isTrial ? "One-time order · no subscription" : `${f!.label} subscription · ${f!.meals} meals`}</p>
          <h1 className="text-[clamp(2rem,1.5rem+2vw,3rem)]">{name}</h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {isTrial ? (
              <p className="font-display text-4xl font-semibold">From {money(TRIAL_PER_DAY - 2)} <span className="font-sans text-base font-semibold text-muted">/ day</span></p>
            ) : (
              <>
                <p className="font-display text-4xl font-semibold tabular-nums">{money(product.price)} <span className="font-sans text-base font-semibold text-muted">every {f!.renewDays} days</span></p>
                <p className="text-sm text-muted">{money(product.price / f!.meals)} per meal</p>
                {save >= 1 && <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-extrabold text-success">Save {money(save)} vs weekly</span>}
              </>
            )}
          </div>

          <p className="mt-4 text-text-2">
            {isTrial
              ? "Order 1–4 days of trial meals to taste the difference. Cooked fresh daily and hand-delivered to your home. Rice or roti extra if required."
              : `${f!.label === "Weekly" ? "5 meals, delivered daily Monday to Friday" : "20 meals over 4 weeks, delivered daily Monday to Friday"}. ${info!.servingNote}`}
          </p>

          {info && (
            <div className="mt-5 grid grid-cols-4 gap-2">
              {info.includes.map((i) => (
                <div key={i.item} className="rounded-2xl border border-line bg-surface p-3 text-center">
                  <p className="font-display text-xl font-semibold leading-none">{i.amount}</p>
                  <p className="mt-1 text-xs font-semibold capitalize text-muted">{i.item}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-[1.75rem] border border-line bg-surface p-5 shadow-soft sm:p-7">
            {isTrial ? <TrialConfigurator /> : <SubscriptionConfigurator key={product.slug} product={product} />}
          </div>

          {!isTrial && (
            <p className="mt-4 flex items-start gap-2 text-sm text-muted">
              <Repeat size={16} className="mt-0.5 shrink-0" /> Renews automatically every {f!.renewDays} days. Pause, skip days or cancel anytime from your account.
            </p>
          )}
        </div>
      </div>

      {/* Description tabs as stacked sections: faster and better on phones */}
      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <section>
          <h2 className="text-2xl">What&apos;s cooking this week</h2>
          <p className="mb-5 mt-2 text-text-2">{!isTrial && product.diet === "veg" ? "Veg plans get the sabzi of the day plus a vegetarian curry." : "Your curry of the day, with the sabzi of the day."}</p>
          <MenuTable compact />
        </section>
        <section>
          <h2 className="text-2xl">Good to know</h2>
          <div className="mt-4">
            <FaqList items={faqs.filter((q) => /deliver|renew|packag|allerg|pay/i.test(q.q))} />
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted"><Leaf size={16} /> Cooked in refined vegetable oil, with less oil than takeout.</p>
        </section>
      </div>
    </div>
  );
}
