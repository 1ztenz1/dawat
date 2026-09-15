import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections";
import { refundPolicy, terms } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Refund Policy",
  description: "Terms and conditions and refund policy for Dawat Halal Meals.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions">
        <p>By placing an order or opting for a subscription, you automatically agree to these terms and conditions.</p>
      </PageHero>
      <article className="container-x prose-legal max-w-3xl py-12 sm:py-16">
        <nav aria-label="On this page" className="mb-8 flex flex-wrap gap-2 text-sm">
          {terms.map((t, i) => <a key={t.title} href={`#t${i + 1}`} className="rounded-full border border-line px-3 py-1.5 font-semibold !text-text-2 !no-underline hover:!text-text">{t.title}</a>)}
          <a href="#refunds" className="rounded-full border border-accent bg-accent-soft px-3 py-1.5 font-semibold !text-accent-text !no-underline">Refunds</a>
        </nav>
        <ol className="!list-decimal">
          {terms.map((t, i) => (
            <li key={t.title} id={`t${i + 1}`} className="scroll-mt-28">
              <strong className="text-text">{t.title}.</strong> {t.body}
            </li>
          ))}
        </ol>
        <h2 id="refunds" className="scroll-mt-28">Refunds</h2>
        <p className="rounded-2xl border-l-4 border-accent bg-accent-soft p-5 !text-text">{refundPolicy} Not sure yet? <Link href="/trial">Try a 1–4 day trial</Link> first.</p>
        <h2>Questions?</h2>
        <p>Email <a href={`mailto:${site.email}`}>{site.email}</a> or call <a href={site.phone.href}>{site.phone.display}</a>.</p>
      </article>
    </>
  );
}
