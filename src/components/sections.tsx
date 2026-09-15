import { ArrowRight, ChefHat, CreditCard, Flame, Leaf, MapPin, Phone, Sparkles, Truck, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { images } from "@/components/plans/images";
import { WhatsAppIcon } from "@/components/icons/brand";
import { cn } from "@/lib/format";
import { deliveryAreas, faqs, site } from "@/lib/site";

export function SectionHead({ eyebrow, title, children, center = true, className }: { eyebrow: string; title: ReactNode; children?: ReactNode; center?: boolean; className?: string }) {
  return (
    <header className={cn("mb-10 max-w-2xl sm:mb-12", center && "mx-auto text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="h-section">{title}</h2>
      {children && <p className="mt-4 text-text-2">{children}</p>}
    </header>
  );
}

export function PageHero({ eyebrow, title, children, className }: { eyebrow: string; title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section className={cn("relative overflow-hidden bg-deep text-on-deep", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_90%_10%,rgb(230_162_60/0.22),transparent_60%),radial-gradient(600px_400px_at_0%_100%,rgb(26_138_76/0.25),transparent_60%)]" />
      <div className="container-x relative py-14 sm:py-20">
        <p className="eyebrow !text-gold-300">{eyebrow}</p>
        <h1 className="max-w-3xl text-[clamp(2.2rem,1.5rem+3vw,3.75rem)] leading-[1.05]">{title}</h1>
        {children && <div className="mt-5 max-w-2xl text-lg text-on-deep-2">{children}</div>}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { Icon: UtensilsCrossed, title: "Pick your plan", text: "Thali, Regular or Large, weekly or monthly, veg or non-veg. Add extras as you like." },
    { Icon: CreditCard, title: "Check out securely", text: "Pay by card through Stripe, or choose cash on delivery. Order any day of the week." },
    { Icon: Truck, title: "Enjoy, Mon to Fri", text: "Freshly cooked meals arrive daily, with delivery updates and a tracking link by text." },
  ];
  return (
    <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
      {steps.map((s, i) => (
        <li key={s.title} className="card relative flex gap-4 p-6 md:block md:p-8">
          <span className="grid size-13 shrink-0 place-items-center rounded-2xl icon-deep md:mb-6">
            <s.Icon size={24} />
          </span>
          <div>
            <p className="text-xs font-extrabold tracking-widest text-accent-text">STEP {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-xl">{s.title}</h3>
            <p className="mt-2 text-text-2">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function WhyUs() {
  const items = [
    { Icon: Flame, title: "Freshly cooked, daily", text: "We cook every morning and deliver the same day, unlike competitors who reheat." },
    { Icon: Leaf, title: "Healthy & balanced", text: "Wholesome meals cooked in refined vegetable oil, with less oil than takeout." },
    { Icon: Truck, title: "Tracked to your door", text: "Delivery updates and a tracking link are texted to your phone every day." },
    { Icon: Sparkles, title: "New menu every week", text: "A rotating menu of classic curries and sabzis keeps your week exciting." },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
      {items.map((it) => (
        <article key={it.title} className="card p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card lg:p-7">
          <span className="mb-5 grid size-13 place-items-center rounded-2xl bg-accent-soft text-accent-text">
            <it.Icon size={24} />
          </span>
          <h3 className="text-lg">{it.title}</h3>
          <p className="mt-2 text-[0.95rem] text-text-2">{it.text}</p>
        </article>
      ))}
    </div>
  );
}

export function AreasBand() {
  return (
    <section className="bg-deep text-on-deep">
      <div className="container-x section grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div>
          <p className="eyebrow !text-gold-300">Delivery areas</p>
          <h2 className="h-section">Same-day delivery across the GTA</h2>
          <p className="mt-4 text-on-deep-2">Delivered Monday to Friday. Don&apos;t see your neighbourhood? Ask us, since we&apos;re growing all the time.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/delivery-areas" className="btn btn-accent">Check your postal code <ArrowRight size={18} /></Link>
            <a href={site.phone.href} className="btn btn-ghost-light"><Phone size={18} /> Call us</a>
          </div>
        </div>
        <AreasList />
      </div>
    </section>
  );
}

export function AreasList({ tone = "deep" }: { tone?: "deep" | "light" }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {deliveryAreas.map((a) => (
        <li
          key={a}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold",
            tone === "deep" ? "border-white/12 bg-white/[0.06]" : "border-line bg-surface",
          )}
        >
          <MapPin size={14} className={tone === "deep" ? "text-gold-300" : "text-accent-text"} />
          {a}
        </li>
      ))}
    </ul>
  );
}

export function FaqList({ items = faqs }: { items?: typeof faqs }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} name="faq" className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1.05rem] font-bold marker:hidden [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-bg-subtle text-brand-text transition-transform duration-300 group-open:rotate-45 group-open:bg-accent group-open:text-on-accent">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
            </span>
          </summary>
          <p className="pb-5 pr-10 text-text-2">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="container-x pb-16 sm:pb-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-deep px-6 py-14 text-center text-on-deep shadow-lift sm:px-12 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_300px_at_50%_0%,rgb(243_207_142/0.25),transparent_70%)]" />
        <ChefHat className="relative mx-auto mb-4 text-gold-300" size={36} />
        <h2 className="relative mx-auto max-w-2xl text-[clamp(2rem,1.3rem+2.6vw,3.2rem)]">Tomorrow&apos;s lunch is already on the stove.</h2>
        <p className="relative mt-4 text-on-deep-2">Join {site.stats.customers} GTA regulars who&apos;ve stopped worrying about what to eat.</p>
        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/plans" className="btn btn-accent btn-lg">Choose my plan <ArrowRight size={18} /></Link>
          <a href={site.whatsapp.href} target="_blank" rel="noopener" className="btn btn-ghost-light btn-lg"><WhatsAppIcon size={20} /> WhatsApp us</a>
        </div>
      </div>
    </section>
  );
}

/* What's in every box: real portions, visual. */
export function InsideEveryMeal({ size = "regular" }: { size?: "thali" | "regular" | "large" }) {
  const portions = {
    thali: ["6 oz", "4 oz", "12 oz", "2"],
    regular: ["12 oz", "4 oz", "12 oz", "2"],
    large: ["16 oz", "8 oz", "12 oz", "3"],
  }[size];
  const items = [
    { img: images.curry, name: "Curry of the day", note: "Chicken, beef or veg", amount: portions[0] },
    { img: images.rajma, name: "Sabzi of the day", note: "Seasonal vegetables & dals", amount: portions[1] },
    { img: images.rice, name: "Basmati rice", note: "Fluffy jeera rice", amount: portions[2] },
    { img: images.roti, name: "Fresh roti", note: "Made the same morning", amount: portions[3] },
  ];
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
      {items.map((it) => (
        <li key={it.name} className="text-center">
          <div className="relative mx-auto aspect-square w-[min(100%,190px)]">
            <Image src={it.img} alt={it.name} sizes="190px" className="size-full rounded-full object-cover shadow-card ring-4 ring-surface" />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-deep px-3 py-1 text-sm font-extrabold text-gold-300 shadow-soft">{it.amount}{it.amount.length === 1 ? (it.name.includes("roti") ? " rotis" : "") : ""}</span>
          </div>
          <p className="mt-5 font-display text-lg font-semibold">{it.name}</p>
          <p className="text-sm text-muted">{it.note}</p>
        </li>
      ))}
    </ul>
  );
}

export function OfferCards() {
  const offers = [
    { code: "WEEKLY5", title: "Weekly subscription", from: "Starting at $49.99", text: "$5 off your first week", href: "/plans" },
    { code: "MONTHLY20", title: "Monthly subscription", from: "Starting at $199.99", text: "$20 off your first month", href: "/plans" },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {offers.map((o) => (
        <Link key={o.code} href={o.href} className="group relative overflow-hidden rounded-[1.75rem] border border-dashed border-accent bg-accent-soft p-6 transition-transform hover:-translate-y-0.5 sm:p-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-text">{o.title} · {o.from}</p>
          <p className="mt-2 font-display text-3xl font-semibold">{o.text}</p>
          <p className="mt-3 text-sm text-text-2">Use code <span className="rounded-lg bg-surface px-2 py-1 font-mono font-bold tracking-wider text-text">{o.code}</span> at checkout</p>
          <ArrowRight className="absolute right-6 top-6 text-accent-text transition-transform group-hover:translate-x-1" />
        </Link>
      ))}
    </div>
  );
}
