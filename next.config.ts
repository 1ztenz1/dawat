import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async redirects() {
    // Keep old WordPress URLs working after the switch.
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/thali-meals", destination: "/thali", permanent: true },
      { source: "/product-category/meal-subscription", destination: "/plans", permanent: true },
      { source: "/refund_returns", destination: "/terms", permanent: true },
      { source: "/my-account", destination: "/account", permanent: true },
      { source: "/my-account/:path*", destination: "/account/:path*", permanent: true },
      { source: "/product-category/thali-meals", destination: "/thali", permanent: true },
      { source: "/product-category/subscription-base-meal-package", destination: "/trial", permanent: true },
      { source: "/1075-2", destination: "/subscribe", permanent: true },
      { source: "/refund-policy", destination: "/terms#refunds", permanent: true },
      { source: "/sample-page", destination: "/", permanent: true },
      { source: "/lost-password", destination: "/forgot-password", permanent: true },
    ];
  },
};

export default nextConfig;
