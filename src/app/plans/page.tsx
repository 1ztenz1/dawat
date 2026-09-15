import { ArrowRight, Check, Minus } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sizeImage } from "@/components/plans/images";
import { PlanCards } from "@/components/plans/PlanCards";
import { CtaBand, FaqList, OfferCards, PageHero, SectionHead } from "@/components/sections";
import { findSubscription, frequencies, sizes, type MealSize } from "@/lib/catalog";
import { money } from "@/lib/format";
import { faqs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Meal Subscriptions",
  description: "Weekly and monthly halal meal subscriptions: Thali, Regular (12 oz) and Large (16 oz), veg or non-veg, delivered Monday to Friday across the GTA.",
  alternates: { canonical: "/plans" },
};

const order: MealSize[] = ["thali", "regular", "large"];

export default function PlansPage() {
  return (
    <>
      <PageHero eyebrow="Meal subscriptions" title="Fresh meals on repeat. Your way.">
        <p>Pick a size, choose weekly or monthly, veg or non-veg. Delivery is always included, and you can pause, skip days or cancel anytime.</p>
      </PageHero>

      <section className="container-x section">
        <PlanCards />
        <div className="mt-12"><OfferCards /></div>
      </section>

      {/* Full price matrix: all 12 plans at a glance */}
      <section className="bg-bg-subtle">
        <div className="container-x section">
          <SectionHead eyebrow="Compare" title="Every plan, every price" />
          {/* Phones: one card per size */}
          <div className="grid gap-4 md:hidden">
            {order.map((s) => (
              <div key={s} className="card overflow-hidden">
                <div className="flex items-center gap-3 border-b border-line bg-surface-2 p-4">
                  <Image src={sizeImage(s)} alt="" sizes="56px" className="size-14 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-xl">{sizes[s].name}</h3>
                    <p className="text-xs text-muted">{sizes[s].includes.map((i) => `${i.amount} ${i.item}`).join(" · ")}</p>
                  </div>
                </div>
                <ul className="divide-y divide-line">
                  {(["weekly", "monthly"] as const).flatMap((fr) =>
                    (["nonveg", "veg"] as const).map((diet) => {
                      const p = findSubscription(s, fr, diet);
                      return (
                        <li key={fr + diet}>
                          <Link href={`/product/${p.slug}`} className="flex items-center justify-between gap-3 px-4 py-3 active:bg-bg-subtle">
                            <span className="flex items-center gap-2 text-sm font-bold"><span className={diet === "veg" ? "veg-mark" : "nonveg-mark"} /> {frequencies[fr].label} {diet === "veg" ? "Veg" : "Non-veg"}</span>
                            <span className="text-right">
                              <span className="block font-display text-lg font-semibold tabular-nums">{money(p.price)}</span>
                              <span className="block text-xs text-muted">{money(p.price / frequencies[fr].meals)} / meal</span>
                            </span>
                          </Link>
                        </li>
                      );
                    }),
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <table className="w-full min-w-[640px] overflow-hidden rounded-[1.5rem] border border-line bg-surface text-left text-[0.95rem] shadow-soft">
              <thead className="bg-deep text-on-deep">
                <tr>
                  <th scope="col" className="px-5 py-4 font-sans text-xs font-extrabold uppercase tracking-wider">Plan</th>
                  {order.map((s) => (
                    <th key={s} scope="col" className="px-5 py-4 font-display text-lg font-semibold">{sizes[s].name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(["weekly", "monthly"] as const).flatMap((fr) =>
                  (["nonveg", "veg"] as const).map((diet) => (
                    <tr key={fr + diet} className="border-t border-line">
                      <th scope="row" className="px-5 py-4 font-bold">
                        <span className="flex items-center gap-2"><span className={diet === "veg" ? "veg-mark" : "nonveg-mark"} /> {frequencies[fr].label} {diet === "veg" ? "Veg" : "Non-veg"}</span>
                        <span className="text-xs font-semibold text-muted">{frequencies[fr].meals} meals · every {frequencies[fr].renewDays} days</span>
                      </th>
                      {order.map((s) => {
                        const p = findSubscription(s, fr, diet);
                        return (
                          <td key={s} className="px-5 py-4">
                            <Link href={`/product/${p.slug}`} className="group inline-flex flex-col">
                              <span className="font-display text-xl font-semibold tabular-nums group-hover:text-brand-text">{money(p.price)}</span>
                              <span className="text-xs text-muted">{money(p.price / frequencies[fr].meals)} / meal</span>
                            </Link>
                          </td>
                        );
                      })}
                    </tr>
                  )),
                )}
                <tr className="border-t border-line bg-surface-2">
                  <th scope="row" className="px-5 py-4 font-bold">What&apos;s inside</th>
                  {order.map((s) => (
                    <td key={s} className="px-5 py-4 text-sm text-text-2">{sizes[s].includes.map((i) => `${i.amount} ${i.item}`).join(" · ")}</td>
                  ))}
                </tr>
                {[
                  ["Microwavable, BPA-free container", [true, true, true]],
                  ["3-compartment on-the-go tray", [true, false, false]],
                  ["Enough for two meals", [false, false, true]],
                ].map(([label, vals]) => (
                  <tr key={label as string} className="border-t border-line">
                    <th scope="row" className="px-5 py-3.5 font-semibold text-text-2">{label as string}</th>
                    {(vals as boolean[]).map((v, i) => (
                      <td key={i} className="px-5 py-3.5">{v ? <Check size={18} className="text-success" aria-label="Yes" /> : <Minus size={18} className="text-muted" aria-label="No" />}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="card p-6">
              <h3 className="text-xl">Extras, per delivery day</h3>
              <ul className="mt-3 grid gap-1.5 text-text-2">
                <li>Extra rice (16 oz): <b className="text-text">$1.99</b></li>
                <li>Extra curry (12 oz): <b className="text-text">$5.99</b> · (16 oz): <b className="text-text">$7.99</b></li>
                <li>Extra roti: <b className="text-text">$0.99</b> each</li>
                <li>Delivery to apartment door: <b className="text-text">$1.99</b></li>
              </ul>
            </div>
            <div className="card flex flex-col justify-between gap-4 p-6">
              <div>
                <h3 className="text-xl">Not ready to subscribe?</h3>
                <p className="mt-2 text-text-2">Order a 1–4 day trial first. No subscription, from $13 a day.</p>
              </div>
              <Link href="/trial" className="btn btn-primary self-start">Try a meal <ArrowRight size={18} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x section max-w-3xl">
        <SectionHead eyebrow="FAQ" title="Subscription questions" />
        <FaqList items={faqs.filter((f) => /renew|start|difference|deliver|refund/i.test(f.q))} />
      </section>
      <CtaBand />
    </>
  );
}
