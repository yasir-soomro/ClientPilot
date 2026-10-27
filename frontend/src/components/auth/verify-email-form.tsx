"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDevelopmentVerificationCode, resendVerification, verifyEmail } from "@/features/auth/service";

export function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [retrieving, setRetrieving] = useState(false);
  const developmentOtpEnabled = process.env.NEXT_PUBLIC_ENABLE_DEV_OTP === "true";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter the email address used to create your account.");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the six-digit verification code.");
      return;
    }
    setLoading(true);
    try {
      await verifyEmail(normalizedEmail, code);
      router.replace("/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to verify your email.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter the email address used to create your account.");
      return;
    }
    setResending(true);
    try {
      await resendVerification(email.trim());
      setMessage("A new verification code was sent if the address is eligible.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to resend the code.");
    } finally {
      setResending(false);
    }
  }

  async function handleDevelopmentCode() {
    setError("");
    setMessage("");
    setRetrieving(true);
    try {
      setCode(await getDevelopmentVerificationCode(email));
      setMessage("Development code loaded locally. This control is disabled in production.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No development code is available.");
    } finally {
      setRetrieving(false);
    }
  }

  return (
    <AuthShell mode="login">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5969e8]">One quick step</p>
        <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#182230]">Verify your email</h2>
        <p className="mt-2 text-sm leading-6 text-[#667085]">Enter the six-digit code we sent to finish setting up your private workspace.</p>
      </div>
      {error ? <p role="alert" className="mb-4 rounded-xl border border-[#fecdca] bg-[#fff4f2] px-4 py-3 text-sm text-[#b42318]">{error}</p> : null}
      {message ? <p role="status" className="mb-4 rounded-xl border border-[#abefc6] bg-[#ecfdf3] px-4 py-3 text-sm text-[#067647]">{message}</p> : null}
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FormField id="email" label="Email address">
          <Input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </FormField>
        <FormField id="code" label="Verification code" hint="The code expires soon and can only be attempted a limited number of times.">
          <Input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} required />
        </FormField>
        <Button loading={loading}>Verify email</Button>
      </form>
      <button type="button" onClick={handleResend} disabled={resending || !email} className="mt-5 w-full text-center text-sm font-semibold text-[#4355d9] hover:text-[#3343bc] disabled:opacity-50">{resending ? "Sending…" : "Resend verification code"}</button>
      {developmentOtpEnabled ? <button type="button" onClick={handleDevelopmentCode} disabled={retrieving || !email} className="mt-3 w-full text-center text-xs font-semibold text-[#667085] hover:text-[#344054] disabled:opacity-50">{retrieving ? "Loading local code…" : "Retrieve local development code"}</button> : null}
      <p className="mt-6 text-center text-sm text-[#667085]"><Link href="/login" className="font-semibold text-[#4355d9]">Back to sign in</Link></p>
    </AuthShell>
  );
}
