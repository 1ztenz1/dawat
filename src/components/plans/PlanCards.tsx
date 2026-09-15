"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Segmented } from "@/components/ui/form";
import { findSubscription, frequencies, monthlySavings, sizes, type Diet, type Frequency, type MealSize } from "@/lib/catalog";
import { cn, money } from "@/lib/format";
import { sizeImage } from "./images";

export function PlanToggles({
  freq,
  diet,
  onFreq,
  onDiet,
}: {
  freq: Frequency;
  diet: Diet;
  onFreq: (f: Frequency) => void;
  onDiet: (d: Diet) => void;
}) {
  return (
    <div className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
      <Segmented
        label="Plan length"
        value={freq}
        onChange={onFreq}
        options={[
          { value: "weekly", label: <>Weekly <span className="text-xs font-semibold opacity-60">5 meals</span></> },
          { value: "monthly", label: <>Monthly <span className="text-xs font-semibold opacity-60">20 meals</span></> },
        ]}
      />
      <Segmented
        label="Diet"
        value={diet}
        onChange={onDiet}
        options={[
          { value: "nonveg", label: <><span className="nonveg-mark" /> Non-veg</> },
          { value: "veg", label: <><span className="veg-mark" /> Veg</> },
        ]}
      />
    </div>
  );
}

export function PlanCards({ only, initialFreq = "weekly", initialDiet = "nonveg" }: { only?: MealSize[]; initialFreq?: Frequency; initialDiet?: Diet }) {
  const [freq, setFreq] = useState<Frequency>(initialFreq);
  const [diet, setDiet] = useState<Diet>(initialDiet);
  const list = only ?? (["thali", "regular", "large"] as MealSize[]);

  return (
    <div>
      <PlanToggles freq={freq} diet={diet} onFreq={setFreq} onDiet={setDiet} />
      <div className={cn("mt-8 grid gap-5 sm:mt-10 lg:gap-6", list.length === 3 ? "md:grid-cols-3" : list.length === 2 ? "md:grid-cols-2 md:max-w-3xl md:mx-auto" : "max-w-md mx-auto")}>
        {list.map((size) => (
          <PlanCard key={size} size={size} freq={freq} diet={diet} featured={list.length === 3 && size === "regular"} />
        ))}
      </div>
    </div>
  );
}

export function PlanCard({ size, freq, diet, featured }: { size: MealSize; freq: Frequency; diet: Diet; featured?: boolean }) {
  const info = sizes[size];
  const product = findSubscription(size, freq, diet);
  const f = frequencies[freq];
  const save = freq === "monthly" ? monthlySavings(size, diet) : 0;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[1.75rem] border transition-[transform,box-shadow] duration-300 hover:-translate-y-1",
        featured ? "border-deep bg-deep text-on-deep shadow-lift dark:border-line" : "border-line bg-surface shadow-soft hover:shadow-card",
      )}
    >
      {featured && <span className="absolute right-3.5 top-3.5 z-10 rounded-full bg-accent px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-on-accent shadow-soft">{info.badge}</span>}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[7/5] overflow-hidden bg-[#fec53a]" tabIndex={-1} aria-hidden>
        <Image
          src={sizeImage(size)}
          alt=""
          fill
          sizes="(max-width: 768px) 92vw, 380px"
          className={cn("object-cover transition-transform duration-700 group-hover:scale-105", size === "large" && "scale-[1.18] group-hover:scale-[1.22]")}
        />
        {size === "large" && <span className="absolute bottom-3 left-3 rounded-lg bg-deep-2 px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-gold-300">Two meals&apos; worth</span>}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-2xl">
            <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">{info.name}</Link>
          </h3>
          {!featured && info.badge && <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-accent-text">{info.badge}</span>}
        </div>
        <p className={cn("mt-1 text-[0.95rem]", featured ? "text-on-deep-2" : "text-text-2")}>{info.servingNote}</p>

        <div className="mt-5 flex items-baseline gap-1 font-display">
          <span className="text-[2.75rem] font-semibold leading-none tracking-tight tabular-nums">{money(product.price)}</span>
          <span className={cn("font-sans text-sm font-semibold", featured ? "text-on-deep-muted" : "text-muted")}>/ {f.per}</span>
        </div>
        <p className={cn("mt-2 flex min-h-6 flex-wrap items-center gap-2 text-sm", featured ? "text-on-deep-muted" : "text-muted")}>
          <span><b className={featured ? "text-on-deep" : "text-text"}>{money(product.price / f.meals)}</b> per meal · {f.meals} meals</span>
          {save >= 1 && <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-extrabold text-success">Save {money(save)}</span>}
        </p>

        <ul className={cn("mt-5 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-dashed pt-4 text-[0.93rem]", featured ? "border-white/20 text-on-deep-2" : "border-line text-text-2")}>
          {info.includes.map((i) => (
            <li key={i.item} className="flex items-baseline gap-1.5">
              <span className="size-1.5 shrink-0 -translate-y-0.5 rounded-full bg-accent" />
              <b className={featured ? "text-on-deep" : "text-text"}>{i.amount}</b> {i.item}
            </li>
          ))}
        </ul>

        <span className={cn("btn btn-block relative z-[1] mt-6 pointer-events-none", featured ? "btn-accent" : "btn-primary")}>
          Choose {info.name.replace(" Meal", "")} <ArrowRight size={18} />
        </span>
      </div>
    </article>
  );
}
