import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieBanner, WhatsAppWidget } from "@/components/layout/Extras";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar, Header } from "@/components/layout/Header";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { themeScript } from "@/components/theme/theme";
import { Toaster } from "@/components/ui/toast";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Fresh Home-Style Halal Tiffin Delivered Daily in the GTA`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_CA",
    title: `${site.name} | Fresh Halal Tiffin, Delivered Daily`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f3d2c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" data-theme="light" suppressHydrationWarning className={`${fraunces.variable} ${manrope.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-text focus:px-4 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <MobileTabBar />
        <CartDrawer />
        <WhatsAppWidget />
        <CookieBanner />
        <Toaster />
      </body>
    </html>
  );
}
