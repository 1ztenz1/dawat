import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { ShopGrid } from "./ShopGrid";

export const metadata: Metadata = {
  title: "Shop All Meals",
  description: "All Dawat Halal Meals plans in one place: thali, regular and large meal subscriptions, weekly or monthly, plus trial meals.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const { category } = await searchParams;
  return (
    <>
      <PageHero eyebrow="Shop" title="All meals & plans">
        <p>13 ways to eat well: every subscription plus a no-commitment trial.</p>
      </PageHero>
      <section className="container-x py-10 sm:py-14">
        <ShopGrid initialCategory={typeof category === "string" ? category : "all"} />
      </section>
    </>
  );
}
