import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Dawat Halal Meals collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

/* Carries over every section of the original WordPress policy, updated for
   how this site works (accounts, orders, Stripe, SMS). Have it reviewed
   against PIPEDA before launch. */
export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy">
        <p>Last updated September 2026</p>
      </PageHero>
      <article className="container-x prose-legal max-w-3xl py-12 sm:py-16">
        <p>Our website address is {site.url}. This policy explains what personal information we collect when you use our website and services, and how we use it.</p>

        <h2>What we collect</h2>
        <ul>
          <li><strong>Account & order details:</strong> your name, email, phone number, delivery and billing addresses, order history, subscription preferences, and any allergy or delivery notes you give us.</li>
          <li><strong>Payment information:</strong> card payments are processed by Stripe. We never see or store your full card number; we keep only the card brand, last four digits and expiry to show you your saved cards.</li>
          <li><strong>Messages:</strong> anything you send through our contact form, WhatsApp or email.</li>
          <li><strong>Usage data:</strong> with your consent, anonymous analytics about how the site is used.</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To cook, deliver and bill your orders and subscription renewals.</li>
          <li>To send delivery updates and tracking links by SMS, and order confirmations by email.</li>
          <li>To send the weekly menu and offers, only if you opt in. You can unsubscribe anytime.</li>
        </ul>

        <h2>Comments & reviews</h2>
        <p>When you leave a review we collect the data shown in the form, and also your IP address and browser user agent string to help spam detection.</p>

        <h2>Media</h2>
        <p>If you upload images to the website, avoid uploading images with embedded location data (EXIF GPS). Visitors to the website can download and extract any location data from images on the website.</p>

        <h2>Cookies</h2>
        <p>We use essential cookies and local storage to keep your cart, login session and display settings (like dark mode) working. When you log in, we save your login information; if you select &quot;Remember me&quot;, your login persists for two weeks. Logging out removes the login cookies. Analytics and marketing cookies are only set if you accept them in the cookie banner, and you can change your choice at any time.</p>

        <h2>Embedded content from other websites</h2>
        <p>Pages on this site may include embedded content (e.g. videos, images, maps). Embedded content from other websites behaves in the exact same way as if you visited the other website. These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that content.</p>

        <h2>Who we share your data with</h2>
        <ul>
          <li><strong>Stripe</strong>, to process payments securely.</li>
          <li><strong>Our delivery and SMS providers</strong>, to deliver your meals and send tracking updates.</li>
          <li>If you request a password reset, your IP address is included in the reset email.</li>
        </ul>
        <p>We never sell your personal information.</p>

        <h2>How long we retain your data</h2>
        <p>For registered customers, we store the personal information you provide in your account profile. You can see, edit or delete your personal information at any time (except your email address may be kept on past orders for tax records). Order records are kept as long as required for accounting and legal purposes.</p>

        <h2>What rights you have over your data</h2>
        <p>If you have an account on this site, you can request an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.</p>

        <h2>Where your data is sent</h2>
        <p>Reviews and messages may be checked through an automated spam detection service.</p>

        <h2>Contact</h2>
        <p>For privacy questions or requests, email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </article>
    </>
  );
}
