import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons/brand";
import { CtaBand, FaqList, PageHero } from "@/components/sections";
import { faqs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about Dawat Halal Meals delivery days, plans, renewals, packaging, payment, allergies and refunds.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero eyebrow="Help centre" title="Frequently asked questions" />
      <section className="container-x section max-w-3xl">
        <FaqList />
        <div className="card mt-10 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xl font-semibold">Still have questions?</p>
            <p className="text-text-2">Our team is happy to help.</p>
          </div>
          <div className="flex gap-2">
            <a href={site.whatsapp.href} target="_blank" rel="noopener" className="btn btn-primary"><WhatsAppIcon size={18} /> WhatsApp</a>
            <Link href="/contact" className="btn btn-outline">Contact us</Link>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
