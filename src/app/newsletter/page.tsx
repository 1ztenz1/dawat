import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { NewsletterPreferences } from "./NewsletterPreferences";

export const metadata: Metadata = {
  title: "Email Preferences",
  description: "Subscribe to the Dawat weekly menu email, or manage and unsubscribe from our emails.",
  robots: { index: false },
};

export default function NewsletterPage() {
  return (
    <>
      <PageHero eyebrow="Email preferences" title="Manage your subscription">
        <p>Get the new menu every Sunday, plus occasional offers. Change your mind anytime.</p>
      </PageHero>
      <section className="container-x section max-w-xl">
        <NewsletterPreferences />
      </section>
    </>
  );
}
