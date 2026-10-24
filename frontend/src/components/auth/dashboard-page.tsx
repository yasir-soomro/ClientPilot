"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AuthApiError, getCurrentOwner, logoutOwner } from "@/features/auth/service";
import type { Owner } from "@/features/auth/types";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const router = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentOwner()
      .then((currentOwner) => {
        if (active) {
          setOwner(currentOwner);
          setError("");
        }
      })
      .catch((requestError: unknown) => {
        if (!active) {
          return;
        }
        if (
          requestError instanceof AuthApiError &&
          requestError.status === 401
        ) {
          router.replace("/login");
          return;
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load your workspace.",
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    setError("");
    setSigningOut(true);
    try {
      await logoutOwner();
      router.replace("/login");
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to sign out. Please try again.",
      );
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc]">
      <header className="border-b border-[#eaecf0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#4355d9] text-sm font-bold text-white">
              CP
            </span>
            <span className="font-semibold tracking-tight text-[#182230]">
              ClientPilot
            </span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#475467] transition hover:bg-[#f2f4f7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5969e8]/20 disabled:opacity-60"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-[#eaecf0] bg-white p-8 text-sm text-[#667085]"
              role="status"
            >
              Loading your private workspace…
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl rounded-2xl border border-[#fecdca] bg-white p-8"
              role="alert"
            >
              <h1 className="text-xl font-semibold text-[#182230]">
                Workspace unavailable
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#b42318]">{error}</p>
              <Button
                type="button"
                className="mt-6 max-w-48"
                onClick={() => window.location.reload()}
              >
                Try again
              </Button>
            </motion.div>
          ) : owner ? (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl"
            >
              <p className="text-sm font-semibold text-[#4355d9]">
                Your private workspace
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#182230] sm:text-4xl">
                Welcome, {owner.full_name ?? owner.email}
              </h1>
              <div className="mt-8 rounded-2xl border border-[#eaecf0] bg-white p-6 shadow-[0_8px_28px_rgba(16,24,40,0.04)] sm:p-8">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4355d9]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 19V5m0 14h16M8 15v-4m4 4V7m4 8v-6"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="mt-5 text-lg font-semibold text-[#182230]">
                  Your workspace is ready
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#667085]">
                  You’re signed in as {owner.email}. Client and dashboard
                  workflows will appear here as they become available.
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </main>
  );
}
