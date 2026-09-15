import { ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MenuTable } from "@/components/menu/MenuTable";
import { images } from "@/components/plans/images";
import { CtaBand, PageHero } from "@/components/sections";
import { menuWeekLabel, weeklyMenu } from "@/lib/menu";

export const metadata: Metadata = {
  title: "This Week's Menu",
  description: "This week's rotating halal menu at Dawat: a new curry and sabzi every weekday.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <PageHero eyebrow="Weekly menu" title="What's cooking this week">
        <p className="flex items-center gap-2"><Clock size={18} className="text-gold-300" /> {menuWeekLabel()}</p>
      </PageHero>
      <section className="container-x section grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
        <div>
          <MenuTable />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="card flex items-center gap-4 p-5">
              <Image src={images.chicken} alt="" sizes="88px" className="size-20 shrink-0 rounded-full object-cover" />
              <div>
                <h2 className="flex items-center gap-2 text-xl"><span className="nonveg-mark" /> Non-veg plans</h2>
                <p className="mt-1 text-sm text-text-2">Curry of the day with the sabzi of the day, rice and roti. Chicken or Beef + Chicken.</p>
              </div>
            </div>
            <div className="card flex items-center gap-4 p-5">
              <Image src={images.rajma} alt="" sizes="88px" className="size-20 shrink-0 rounded-full object-cover" />
              <div>
                <h2 className="flex items-center gap-2 text-xl"><span className="veg-mark" /> Veg plans</h2>
                <p className="mt-1 text-sm text-text-2">Sabzi of the day plus a vegetarian curry, with rice and roti. 100% vegetarian.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/plans" className="btn btn-accent btn-lg">Order this week <ArrowRight size={18} /></Link>
            <Link href="/trial" className="btn btn-outline btn-lg">Try for a few days</Link>
          </div>
        </div>
        <figure>
          <Image src={weeklyMenu.poster} alt={`Weekly menu poster, ${menuWeekLabel()}`} width={720} height={900} sizes="(max-width: 1024px) 92vw, 420px" className="w-full rounded-[1.75rem] shadow-card" />
          <figcaption className="mt-3 text-center text-sm text-muted">Share it with your friends 📲</figcaption>
        </figure>
      </section>
      <CtaBand />
    </>
  );
}
