import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/icons/brand";
import { PageHero } from "@/components/sections";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Dawat Halal Meals by phone, WhatsApp or email. Questions about plans, delivery or catering in the GTA.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const channels = [
    { Icon: Phone, title: "Call or text", value: site.phone.display, href: site.phone.href, note: "Orders & support" },
    { Icon: Phone, title: "Toll-free support", value: site.tollFree.display, href: site.tollFree.href, note: "Across Canada" },
    { Icon: WhatsAppIcon, title: "WhatsApp", value: "Chat with us", href: site.whatsapp.href, note: "Fastest reply" },
    { Icon: Mail, title: "Email", value: site.email, href: `mailto:${site.email}`, note: "We reply within a business day" },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear from you">
        <p>Questions about plans, delivery, allergies or a large order? Reach us however suits you.</p>
      </PageHero>
      <section className="container-x section grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        <div className="grid content-start gap-3">
          {channels.map(({ Icon, title, value, href, note }) => (
            <a key={title} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-card">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-text"><Icon size={22} /></span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-muted">{title}</span>
                <span className="block truncate text-lg font-bold">{value}</span>
                <span className="block text-xs text-muted">{note}</span>
              </span>
            </a>
          ))}
          <div className="card grid gap-3 p-5 text-sm text-text-2">
            <p className="flex items-center gap-2"><Clock size={16} className="text-accent-text" /> Deliveries Monday to Friday. Orders after 6 PM ET are processed the next day.</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-accent-text" /> Serving the Greater Toronto Area</p>
            <div className="flex gap-2 pt-1">
              <a href={site.social.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid size-10 place-items-center rounded-full bg-bg-subtle hover:text-brand-text"><InstagramIcon size={18} /></a>
              <a href={site.social.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="grid size-10 place-items-center rounded-full bg-bg-subtle hover:text-brand-text"><FacebookIcon size={18} /></a>
            </div>
          </div>
        </div>
        <div className="card p-6 sm:p-8">
          <h2 className="text-2xl">Send us a message</h2>
          <p className="mt-1 text-text-2">We&apos;ll get back to you shortly.</p>
          <div className="mt-6"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
