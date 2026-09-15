import type { Metadata } from "next";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

export default function CartPage() {
  return <CartView />;
}
