"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginOwner } from "@/features/auth/service";
import { validateLoginInput } from "@/features/auth/schema";
import type { FieldErrors, LoginInput } from "@/features/auth/types";

export function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors<keyof LoginInput>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError("");
    const formData = new FormData(event.currentTarget);
    const input = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    const validationErrors = validateLoginInput(input);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await loginOwner(input);
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell mode="login">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5969e8]">
          Welcome back
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#182230]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Pick up where you left off in your private workspace.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AnimatePresence initial={false}>
          {apiError ? (
            <motion.div
              key="api-error"
              role="alert"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="rounded-xl border border-[#fecdca] bg-[#fff4f2] px-4 py-3 text-sm leading-5 text-[#b42318]"
            >
              {apiError}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <FormField id="email" label="Email address" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </FormField>

        <FormField id="password" label="Password" error={errors.password}>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
        </FormField>

        <Button loading={loading} className="!mt-7">
          Sign in
          {!loading ? (
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="size-4"
              aria-hidden="true"
            >
              <path
                d="M4.2 10h11.6m0 0-4.6-4.6m4.6 4.6-4.6 4.6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-[#667085]">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#4355d9] hover:text-[#3343bc] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5969e8]"
        >
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
