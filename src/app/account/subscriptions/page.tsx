"use client";

import { ArrowRight, Repeat } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { productImage } from "@/components/plans/images";
import { subscriptionsApi } from "@/lib/api";
import { getProduct } from "@/lib/catalog";
import { formatDate } from "@/lib/dates";
import { money } from "@/lib/format";
import { SubStatus } from "./SubStatus";

export default function SubscriptionsPage() {
  const subs = subscriptionsApi.useMine();

  return (
    <div>
      <h1 className="text-3xl">My subscriptions</h1>
      {subs.length === 0 ? (
        <div className="card mt-6 grid place-items-center p-10 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-bg-subtle text-muted"><Repeat size={28} /></span>
          <p className="mt-4 font-display text-2xl font-semibold">No subscriptions yet</p>
          <p className="mt-1 max-w-sm text-text-2">Weekly and monthly plans show up here, where you can pause, skip days or cancel anytime.</p>
          <Link href="/plans" className="btn btn-accent mt-6">Start a plan <ArrowRight size={18} /></Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4">
          {subs.map((s) => {
            const product = getProduct(s.slug);
            return (
              <li key={s.id}>
                <Link href={`/account/subscriptions/${s.id}`} className="card flex items-center gap-4 p-4 transition-shadow hover:shadow-card sm:p-5">
                  {product && <Image src={productImage(product)} alt="" sizes="80px" className="size-16 shrink-0 rounded-2xl object-cover sm:size-20" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{s.name}</p>
                      <SubStatus status={s.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted">{s.number} · {money(s.price)} every {s.renewDays} days</p>
                    <p className="text-sm text-text-2">
                      {s.status === "paused" && s.pausedUntil ? `Paused until ${formatDate(s.pausedUntil)}` : s.status === "pending-cancel" ? `Ends ${formatDate(s.nextRenewal)}` : `Next renewal ${formatDate(s.nextRenewal)}`}
                    </p>
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-muted" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
