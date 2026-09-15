import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/plans/ProductView";
import { allProducts, frequencies, getProduct, productName, sizes } from "@/lib/catalog";
import { money } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const description =
    p.kind === "trial"
      ? "Try Dawat Halal Meals for 1–4 days. One-time order, no subscription."
      : `${frequencies[p.frequency].meals} freshly cooked ${p.diet === "veg" ? "vegetarian" : "halal"} meals for ${money(p.price)}. ${sizes[p.size].servingNote}`;
  return { title: productName(p), description, alternates: { canonical: `/product/${slug}` } };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductView product={product} />;
}
