"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AuthApiError, getCurrentOwner, logoutOwner } from "@/features/auth/service";
import type { Owner } from "@/features/auth/types";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/dashboard", label: "Overview" },
  { href: "/clients", label: "Clients" },
  { href: "/projects", label: "Projects" },
] as const;

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    getCurrentOwner()
      .then((currentOwner) => {
        if (active) {
          setOwner(currentOwner);
        }
      })
      .catch((requestError: unknown) => {
        if (!active) {
          return;
        }
        if (requestError instanceof AuthApiError && requestError.status === 401) {
          router.replace("/login");
          return;
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to verify your session.",
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
  }, [retry, router]);

  async function handleLogout() {
    setLogoutError("");
    setSigningOut(true);
    try {
      await logoutOwner();
      router.replace("/login");
      router.refresh();
    } catch (requestError) {
      if (requestError instanceof AuthApiError && requestError.status === 401) {
        router.replace("/login");
        router.refresh();
        return;
      }
      setLogoutError(
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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#171a35] text-sm font-bold text-white">
              CP
            </span>
            <span className="font-semibold tracking-tight text-[#182230]">
              ClientPilot
            </span>
          </Link>
          <nav
            aria-label="Workspace"
            className="order-3 flex w-full gap-1 overflow-x-auto sm:order-2 sm:w-auto"
          >
            {navigation.map(({ href, label }) => {
              const active =
                href === "/dashboard"
                  ? pathname === href
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5969e8]/20 ${
                    active
                      ? "bg-[#eef0ff] text-[#3343bc]"
                      : "text-[#667085] hover:bg-[#f2f4f7] hover:text-[#182230]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="order-2 flex items-center gap-3 sm:order-3">
            {owner ? (
              <span className="hidden max-w-40 truncate text-sm text-[#667085] md:block">
                {owner.full_name ?? owner.email}
              </span>
            ) : null}
            <button
              type="button"
              onClick={handleLogout}
              disabled={signingOut || !owner}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#475467] transition hover:bg-[#f2f4f7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5969e8]/20 disabled:opacity-60"
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        {loading ? (
          <div
            className="rounded-2xl border border-[#eaecf0] bg-white p-8 text-sm text-[#667085]"
            role="status"
          >
            Verifying your private workspace…
          </div>
        ) : error ? (
          <div
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
              onClick={() => {
                setLoading(true);
                setError("");
                setRetry((attempt) => attempt + 1);
              }}
            >
              Try again
            </Button>
          </div>
        ) : owner ? (
          <>
            {children}
            {logoutError ? (
              <p role="alert" className="mt-6 text-sm text-[#b42318]">
                {logoutError}
              </p>
            ) : null}
          </>
        ) : null}
      </section>
    </main>
  );
}
