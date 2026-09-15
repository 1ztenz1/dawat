import { BadgeCheck, Compass, Target } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { images } from "@/components/plans/images";
import { AreasList, CtaBand, PageHero, SectionHead, WhyUs } from "@/components/sections";
import { deliveryAreas, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: "Dawat Halal Meals: home-style North Indian & Pakistani food, freshly cooked daily and delivered to your doorstep across the Greater Toronto Area.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Home-style North Indian & Pakistani food, delivered daily to your doorstep" />

      <section className="container-x section grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="grid grid-cols-5 gap-3">
            <Image src={images.thali} alt="Dawat thali tray" sizes="(max-width: 1024px) 55vw, 330px" className="col-span-3 aspect-[3/4] rounded-[1.5rem] object-cover shadow-card" />
            <div className="col-span-2 grid gap-3">
              <Image src={images.curry} alt="Curry of the day" sizes="(max-width: 1024px) 36vw, 220px" className="aspect-square rounded-[1.5rem] object-cover shadow-card" />
              <Image src={images.roti} alt="Fresh rotis" sizes="(max-width: 1024px) 36vw, 220px" className="aspect-square rounded-[1.5rem] object-cover shadow-card" />
            </div>
          </div>
        </div>
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="h-section">The foremost freshly cooked daily meal service in the GTA</h2>
          <div className="mt-5 grid gap-4 text-text-2">
            <p>Dawat Halal Meals is a freshly cooked, daily delivery meal service serving the Greater Toronto Area.</p>
            <p>Our food is prepared in a fully equipped commercial kitchen with a certified food handler on premises, and cooked in refined vegetable oil.</p>
            <p>If you want the best North Indian &amp; Pakistani food in the Greater Toronto Area, look no further. We deliver same-day, freshly cooked halal tiffin Monday to Friday.</p>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-3">
            {[[site.stats.meals, "Meals delivered"], [site.stats.customers, "Happy customers"], [String(deliveryAreas.length), "Areas served"]].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-bg-subtle p-4 text-center">
                <dd className="font-display text-3xl font-semibold">{n}</dd>
                <dt className="text-xs font-semibold text-muted">{l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-bg-subtle">
        <div className="container-x section grid gap-5 md:grid-cols-3">
          {[
            { Icon: Target, title: "Our mission", text: "To be the go-to freshly cooked daily halal meal delivery service in North America." },
            { Icon: Compass, title: "Our vision", text: "That every working individual and student has access to freshly cooked tiffin meals delivered to their doorstep, all over North America." },
            { Icon: BadgeCheck, title: "Our promise", text: "Halal, cooked fresh the same morning, with less oil, and delivered on time, every weekday." },
          ].map(({ Icon, title, text }) => (
            <article key={title} className="card p-7">
              <span className="grid size-13 place-items-center rounded-2xl icon-deep"><Icon size={24} /></span>
              <h2 className="mt-5 text-2xl">{title}</h2>
              <p className="mt-2 text-text-2">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-x section">
        <SectionHead eyebrow="Why us?" title="What makes Dawat different" />
        <WhyUs />
      </section>

      <section className="bg-bg-subtle">
        <div className="container-x section">
          <SectionHead eyebrow="Where we deliver" title="Same-day tiffin delivery across the GTA">Monday to Friday.</SectionHead>
          <div className="mx-auto max-w-4xl [&_ul]:justify-center"><AreasList tone="light" /></div>
        </div>
      </section>
      <div className="pt-16 sm:pt-24"><CtaBand /></div>
    </>
  );
}
