import type { Metadata } from "next";
import { AuthShell } from "@/components/account/AuthShell";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your meals, subscriptions and deliveries.">
      <LoginForm next={typeof next === "string" && next.startsWith("/") ? next : "/account"} />
    </AuthShell>
  );
}
