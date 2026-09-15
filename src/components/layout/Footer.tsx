import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/icons/brand";
import { site } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";

const groups = [
  {
    title: "Order",
    links: [
      { href: "/plans", label: "Meal subscriptions" },
      { href: "/thali", label: "Thali meals" },
      { href: "/trial", label: "Trial meals" },
      { href: "/menu", label: "This week's menu" },
      { href: "/shop", label: "Shop all" },
      { href: "/subscribe", label: "Offers" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/delivery-areas", label: "Delivery areas" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "My account" },
      { href: "/account/subscriptions", label: "My subscriptions" },
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/terms", label: "Terms & refund policy" },
      { href: "/newsletter", label: "Email preferences" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-deep-2 text-[0.93rem] text-on-deep-muted">
      <div className="container-x grid gap-10 pb-10 pt-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo onDark />
          <p className="mt-5 max-w-sm">Freshly cooked, home-style North Indian &amp; Pakistani halal meals, delivered daily across the Greater Toronto Area.</p>
          <div className="mt-6">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-gold-300">Get the weekly menu</p>
            <NewsletterForm />
          </div>
          <div className="mt-6 flex gap-2">
            {[
              { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
              { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
              { href: site.whatsapp.href, label: "WhatsApp", Icon: WhatsAppIcon },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener" aria-label={label} className="grid size-11 place-items-center rounded-full bg-white/[0.07] text-on-deep transition-colors hover:bg-accent hover:text-on-accent">
                <Icon size={19} />
              </a>
            ))}
          </div>
        </div>

        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="mb-4 font-sans text-xs font-extrabold uppercase tracking-[0.14em] text-gold-300">{g.title}</h2>
            <ul className="grid gap-2.5">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-on-deep">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-x">
        <ul className="grid gap-3 border-t border-white/10 py-6 sm:grid-cols-2 lg:grid-cols-4">
          <li><a href={site.phone.href} className="flex items-center gap-2.5 hover:text-on-deep"><Phone size={16} className="text-gold-300" /> {site.phone.display}</a></li>
          <li><a href={site.tollFree.href} className="flex items-center gap-2.5 hover:text-on-deep"><Phone size={16} className="text-gold-300" /> {site.tollFree.display} (toll-free)</a></li>
          <li><a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-on-deep"><Mail size={16} className="text-gold-300" /> {site.email}</a></li>
          <li className="flex items-center gap-2.5"><Clock size={16} className="text-gold-300" /> Deliveries Mon–Fri · <MapPin size={16} className="text-gold-300" /> GTA</li>
        </ul>
        <div className="flex flex-wrap justify-between gap-2 border-t border-white/10 py-5 text-xs">
          <p>© {new Date().getFullYear()} Dawat Halal Meals. All rights reserved.</p>
          <p>100% Halal · Prices in CAD · Secure payments by Stripe</p>
        </div>
      </div>
    </footer>
  );
}
