import type { Metadata } from "next";
import { ProductView } from "@/components/plans/ProductView";
import { trialProduct } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Trial Meals",
  description: "Try Dawat Halal Meals for 1–4 days. Thali, 12 oz or 16 oz meals from $13/day. One-time order, no subscription.",
  alternates: { canonical: "/trial" },
};

export default function TrialPage() {
  return <ProductView product={trialProduct} />;
}
