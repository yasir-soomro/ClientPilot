"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BriefcaseBusiness, LayoutDashboard, LogOut, Users } from "lucide-react";
import { AuthApiError, getCurrentOwner, logoutOwner } from "@/features/auth/service";
import type { Owner } from "@/features/auth/types";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/brand-mark";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/projects", label: "Projects", icon: BriefcaseBusiness },
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
    <main className="min-h-screen bg-[#f6f7fb] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="border-b border-[#e7e9f0] bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col px-4 py-5 sm:px-6 lg:px-5">
          <Link href="/dashboard" className="flex items-center gap-3 px-2">
            <BrandMark />
            <span className="text-[15px] font-bold tracking-[-0.02em] text-[#182230]">ClientPilot</span>
          </Link>
          <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#98a2b3]">Workspace</p>
          <nav aria-label="Workspace" className="flex gap-1 overflow-x-auto lg:flex-col">
            {navigation.map(({ href, label }) => {
              const Icon = navigation.find((item) => item.href === href)?.icon ?? LayoutDashboard;
              const active =
                href === "/dashboard"
                  ? pathname === href
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-10 items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-[#667085] hover:bg-[#f6f7fb] hover:text-[#182230]"
                  }`}
                >
                  <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto hidden border-t border-[#eef0f4] pt-4 lg:block">
            {owner ? (
              <div className="mb-3 flex items-center gap-3 px-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e9eaff] text-xs font-bold text-indigo-700">{(owner.full_name ?? owner.email).slice(0, 1).toUpperCase()}</span>
                <span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#344054]">{owner.full_name ?? "Your workspace"}</span><span className="block truncate text-xs text-[#98a2b3]">{owner.email}</span></span>
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleLogout}
              disabled={signingOut || !owner}
              className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[#667085] transition hover:bg-[#f6f7fb] hover:text-[#182230] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 disabled:opacity-60"
            >
              <LogOut aria-hidden="true" size={17} />{signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
      <header className="flex h-[68px] items-center justify-between border-b border-[#e7e9f0] bg-white/90 px-5 sm:px-8 lg:px-10">
        <p className="text-sm font-medium text-[#667085]">Private workspace <span className="mx-2 text-[#d0d5dd]">/</span><span className="text-[#344054]">{navigation.find((item) => item.href === (pathname.startsWith("/clients") ? "/clients" : pathname.startsWith("/projects") ? "/projects" : "/dashboard"))?.label}</span></p>
        <div className="flex items-center gap-3 lg:hidden">
          {owner ? <span className="flex size-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">{(owner.full_name ?? owner.email).slice(0, 1).toUpperCase()}</span> : null}
          <button type="button" onClick={handleLogout} disabled={signingOut || !owner} aria-label="Sign out" className="rounded-lg p-2 text-[#667085] hover:bg-[#f6f7fb] disabled:opacity-60"><LogOut size={17} /></button>
        </div>
      </header>
      <section className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
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
      </div>
    </main>
  );
}
