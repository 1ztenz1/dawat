import type { Metadata } from "next";
import { AuthShell } from "@/components/account/AuthShell";
import { ResetForm } from "./ResetForm";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  return (
    <AuthShell title="Choose a new password" subtitle="Make it at least 8 characters.">
      <ResetForm token={typeof token === "string" ? token : ""} />
    </AuthShell>
  );
}
