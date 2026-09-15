import type { Metadata } from "next";
import { OrderReceived } from "./OrderReceived";

export const metadata: Metadata = { title: "Order received", robots: { index: false } };

export default async function OrderReceivedPage({ searchParams }: PageProps<"/checkout/order-received">) {
  const { id } = await searchParams;
  return <OrderReceived id={typeof id === "string" ? id : null} />;
}
