"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerOwner } from "@/features/auth/service";
import { validateRegisterInput } from "@/features/auth/schema";
import type { FieldErrors, RegisterInput } from "@/features/auth/types";

export function RegisterForm() {
  const [errors, setErrors] = useState<FieldErrors<keyof RegisterInput>>({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError("");
    setSuccess("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const input = {
      full_name: String(formData.get("full_name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      phone_number: String(formData.get("phone_number") ?? ""),
    };
    const validationErrors = validateRegisterInput(input);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await registerOwner(input);
      setSuccess("Your account is ready. Sign in to open your private workspace.");
      setErrors({});
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell mode="register">
      <div className="mb-7">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5969e8]">
          Make room for your best work
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#182230]">
          Create your account
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Start a private workspace for your clients and projects.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AnimatePresence initial={false}>
          {apiError ? (
            <motion.div
              key="api-error"
              role="alert"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="cp-alert-error px-4 py-3 text-sm leading-5"
            >
              {apiError}
            </motion.div>
          ) : null}
          {success ? (
            <motion.div
              key="success"
              role="status"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="cp-alert-success px-4 py-3 text-sm leading-5"
            >
              {success}{" "}
              <Link
                href="/login"
                className="font-semibold underline underline-offset-2"
              >
                Sign in
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <FormField
          id="full_name"
          label="Full name"
          error={errors.full_name}
        >
          <Input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            maxLength={50}
            placeholder="Your name"
            aria-invalid={Boolean(errors.full_name)}
            aria-describedby={errors.full_name ? "full_name-error" : undefined}
          />
        </FormField>

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

        <FormField
          id="password"
          label="Password"
          error={errors.password}
          hint="Use 12–128 characters."
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            placeholder="Create a secure password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : "password-hint"}
          />
        </FormField>

        <FormField
          id="phone_number"
          label="Phone number"
          error={errors.phone_number}
          hint="Include your country code, for example +14155552671."
        >
          <Input
            id="phone_number"
            name="phone_number"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+14155552671"
            aria-invalid={Boolean(errors.phone_number)}
            aria-describedby={
              errors.phone_number ? "phone_number-error" : "phone_number-hint"
            }
          />
        </FormField>

        <Button loading={loading} className="!mt-6">
          Create account
        </Button>
        <p className="pt-1 text-center text-xs leading-5 text-[#98a2b3]">
          Your account starts with a private workspace only you can access.
        </p>
      </form>
    </AuthShell>
  );
}
