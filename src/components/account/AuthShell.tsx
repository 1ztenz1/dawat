import { CalendarDays, Repeat, Truck } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { images } from "@/components/plans/images";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children: ReactNode }) {
  return (
    <div className="container-x grid min-h-[calc(100dvh-8rem)] items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 text-text-2">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
      <aside className="relative hidden overflow-hidden rounded-[2rem] bg-deep p-10 text-on-deep shadow-lift lg:block">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_300px_at_100%_0%,rgb(230_162_60/0.3),transparent_60%)]" />
        <div className="relative mx-auto aspect-square w-3/4 overflow-hidden rounded-full shadow-[0_0_0_12px_rgb(230_162_60/0.12)]">
          <Image src={images.biryani} alt="" sizes="360px" className="size-full object-cover" />
        </div>
        <ul className="relative mt-10 grid gap-4">
          {[
            [Repeat, "Pause, skip days or cancel your plan anytime"],
            [CalendarDays, "See upcoming deliveries and this week's menu"],
            [Truck, "Save your address for one-tap reorders"],
          ].map(([Icon, t]) => {
            const I = Icon as typeof Repeat;
            return (
              <li key={t as string} className="flex items-center gap-3 font-semibold"><span className="grid size-10 place-items-center rounded-xl bg-white/10 text-gold-300"><I size={20} /></span>{t as string}</li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
