import type { Metadata } from "next";
import { AuthShell } from "@/components/account/AuthShell";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Create an account", robots: { index: false } };

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const { next } = await searchParams;
  return (
    <AuthShell title="Create your account" subtitle="Takes 30 seconds. Manage subscriptions, track deliveries and reorder in a tap.">
      <RegisterForm next={typeof next === "string" && next.startsWith("/") ? next : "/account"} />
    </AuthShell>
  );
}
