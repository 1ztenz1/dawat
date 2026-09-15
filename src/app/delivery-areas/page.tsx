import { Clock, MessageSquareText, Truck } from "lucide-react";
import type { Metadata } from "next";
import { AreasList, CtaBand, PageHero } from "@/components/sections";
import { deliveryAreas } from "@/lib/site";
import { PostalChecker } from "./PostalChecker";

export const metadata: Metadata = {
  title: "Delivery Areas",
  description: `Same-day halal tiffin delivery Monday to Friday across ${deliveryAreas.join(", ")}.`,
  alternates: { canonical: "/delivery-areas" },
};

export default function DeliveryAreasPage() {
  return (
    <>
      <PageHero eyebrow="Delivery areas" title="Do we deliver to you?">
        <p>Freshly cooked, same-day delivery Monday to Friday across the Greater Toronto Area.</p>
      </PageHero>
      <section className="container-x section grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <div className="card p-6 sm:p-8">
            <h2 className="text-2xl">Check your postal code</h2>
            <p className="mt-1 text-text-2">Takes a second.</p>
            <div className="mt-5"><PostalChecker /></div>
          </div>
          <ul className="mt-6 grid gap-3">
            {[
              [Truck, "Delivery included on every plan. Apartment door delivery is $1.99/day."],
              [Clock, "Deliveries run Monday to Friday. Order by 6 PM ET for the earliest start."],
              [MessageSquareText, "You get a tracking link by SMS every delivery day."],
            ].map(([Icon, t]) => {
              const I = Icon as typeof Truck;
              return <li key={t as string} className="flex items-start gap-3 text-text-2"><I size={20} className="mt-0.5 shrink-0 text-accent-text" /> {t as string}</li>;
            })}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl">Areas we serve</h2>
          <p className="mb-5 mt-1 text-text-2">Our same-day freshly cooked halal tiffin delivery covers:</p>
          <AreasList tone="light" />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
