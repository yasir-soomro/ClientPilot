import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#fcfcff]" />}><VerifyEmailForm /></Suspense>;
}
