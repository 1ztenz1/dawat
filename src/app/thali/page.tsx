import type { Metadata } from "next";
import Image from "next/image";
import { PlanCards } from "@/components/plans/PlanCards";
import { images } from "@/components/plans/images";
import { CtaBand, InsideEveryMeal, PageHero } from "@/components/sections";
import { sizes } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Thali Meals",
  description: "Thali meals delivered to your home: 6 oz curry, 4 oz sabzi, 2 rotis and 12 oz rice in a 3-compartment microwavable tray. From $49.99/week.",
  alternates: { canonical: "/thali" },
};

export default function ThaliPage() {
  return (
    <>
      <PageHero eyebrow="Thali meals" title="A complete meal in one tray, delivered to your home.">
        <p>Designed to be eaten on the go, in a 3-compartment, microwavable, BPA-free container. The best value on our menu.</p>
      </PageHero>

      <section className="container-x section grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Image src={images.thali} alt="Dawat thali tray" sizes="(max-width: 1024px) 92vw, 560px" className="aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-card" />
        <div>
          <p className="eyebrow">Our thali consists of</p>
          <h2 className="h-section">Everything you need, perfectly portioned</h2>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {sizes.thali.includes.map((i) => (
              <div key={i.item} className="card p-5">
                <p className="font-display text-4xl font-semibold">{i.amount}</p>
                <p className="mt-1 font-semibold capitalize text-text-2">{i.item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x pb-16 sm:pb-24">
        <InsideEveryMeal size="thali" />
      </section>

      <section className="bg-bg-subtle">
        <div className="container-x section">
          <header className="mx-auto mb-10 max-w-xl text-center">
            <p className="eyebrow">Place an order</p>
            <h2 className="h-section">Choose your thali plan</h2>
          </header>
          <PlanCards only={["thali"]} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
