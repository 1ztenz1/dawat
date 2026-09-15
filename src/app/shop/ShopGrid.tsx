"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { productImage } from "@/components/plans/images";
import { allProducts, frequencies, productName, sizes, type Product } from "@/lib/catalog";
import { cn, money } from "@/lib/format";

const categories = [
  { id: "all", label: "All" },
  { id: "meal-subscription", label: "Meal subscriptions" },
  { id: "thali-meals", label: "Thali meals" },
  { id: "trial", label: "Trial" },
] as const;

const sorts = [
  { id: "default", label: "Default sorting" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "per-meal", label: "Price per meal" },
] as const;

const startPrice = (p: Product) => (p.kind === "trial" ? 13 : p.price);
const perMeal = (p: Product) => (p.kind === "trial" ? 13 : p.price / frequencies[p.frequency].meals);

export function ShopGrid({ initialCategory }: { initialCategory: string }) {
  const [cat, setCat] = useState<string>(categories.some((c) => c.id === initialCategory) ? initialCategory : "all");
  const [sort, setSort] = useState<(typeof sorts)[number]["id"]>("default");
  const [diet, setDiet] = useState<"any" | "veg" | "nonveg">("any");

  const list = useMemo(() => {
    let l = allProducts.filter((p) => {
      if (cat === "trial") return p.kind === "trial";
      if (cat === "thali-meals") return p.kind === "subscription" && p.size === "thali";
      if (cat === "meal-subscription") return p.kind === "subscription" && p.size !== "thali";
      return true;
    });
    if (diet !== "any") l = l.filter((p) => p.kind === "trial" || p.diet === diet);
    if (sort === "price-asc") l = [...l].sort((a, b) => startPrice(a) - startPrice(b));
    if (sort === "price-desc") l = [...l].sort((a, b) => startPrice(b) - startPrice(a));
    if (sort === "per-meal") l = [...l].sort((a, b) => perMeal(a) - perMeal(b));
    return l;
  }, [cat, sort, diet]);

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Category">
          {categories.map((c) => (
            <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)} className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors", cat === c.id ? "border-brand-text bg-brand-soft text-brand-text" : "border-line text-text-2 hover:text-text")}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="diet">Diet</label>
          <select id="diet" className="input min-h-11 flex-1 lg:w-40" value={diet} onChange={(e) => setDiet(e.target.value as typeof diet)}>
            <option value="any">Veg & non-veg</option>
            <option value="nonveg">Non-veg only</option>
            <option value="veg">Veg only</option>
          </select>
          <label className="sr-only" htmlFor="sort">Sort</label>
          <select id="sort" className="input min-h-11 flex-1 lg:w-52" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <p className="mt-5 text-sm text-muted">Showing {list.length === 1 ? "the single result" : `all ${list.length} results`}</p>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {list.map((p) => (
          <li key={p.slug}>
            <Link href={p.kind === "trial" ? "/trial" : `/product/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card">
              <div className="relative aspect-square overflow-hidden bg-[#fec53a]">
                <Image src={productImage(p)} alt="" fill sizes="(max-width: 1024px) 46vw, 280px" className={cn("object-cover transition-transform duration-500 group-hover:scale-105", p.kind === "subscription" && p.size === "large" && "scale-110")} />
                {p.kind === "subscription" && (
                  <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-surface/95 px-2.5 py-1 text-[11px] font-bold text-text">
                    <span className={p.diet === "veg" ? "veg-mark" : "nonveg-mark"} /> {p.diet === "veg" ? "Veg" : "Non-veg"}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-accent-text">{p.kind === "trial" ? "1–4 days" : `${frequencies[p.frequency].label} · ${frequencies[p.frequency].meals} meals`}</p>
                <h2 className="mt-1 flex-1 font-sans text-[0.95rem] font-bold leading-snug sm:text-base">{productName(p)}</h2>
                <p className="mt-2 font-display text-xl font-semibold sm:text-2xl">
                  {p.kind === "trial" ? "From $13" : money(p.price)}
                  <span className="ml-1 font-sans text-xs font-semibold text-muted">{p.kind === "trial" ? "/day" : `/ ${frequencies[p.frequency].renewDays} days`}</span>
                </p>
                {p.kind === "subscription" && <p className="text-xs text-muted">{sizes[p.size].includes[0].amount} curry · {money(perMeal(p))}/meal</p>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
