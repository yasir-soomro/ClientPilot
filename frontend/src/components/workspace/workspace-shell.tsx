"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BriefcaseBusiness, LayoutDashboard, LogOut, Plus, Users } from "lucide-react";
import { useAuth } from "@/features/auth/session-context";
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
  const { state, refresh, logout } = useAuth();
  const owner: Owner | null =
    state.status === "authenticated" ? state.owner : null;
  const [logoutError, setLogoutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (state.status === "unauthenticated") {
      router.replace("/");
    }
  }, [router, state.status]);

  async function handleLogout() {
    setLogoutError("");
    setSigningOut(true);
    try {
      await logout();
      router.replace("/");
      router.refresh();
    } catch (requestError) {
      setLogoutError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to sign out. Please try again.",
      );
    } finally {
      setSigningOut(false);
    }
  }

  if (state.status !== "authenticated") {
    const hasError = state.status === "error";
    return (
      <main className="min-h-screen bg-[var(--cp-background)] px-5 py-7 sm:px-8 sm:py-9">
        <section className="cp-panel mx-auto max-w-xl p-6 sm:p-8" aria-live="polite">
          {hasError ? (
            <>
              <h1 className="text-xl font-semibold tracking-tight text-slate-950">
                Workspace unavailable
              </h1>
              <p className="mt-2 text-sm leading-6 text-rose-700">
                {state.message}
              </p>
              <Button
                type="button"
                className="mt-6 max-w-48"
                onClick={() => void refresh()}
              >
                Try again
              </Button>
            </>
          ) : (
            <p className="text-sm text-slate-600" role="status">
              {state.status === "unauthenticated"
                ? "Redirecting to the public pages…"
                : "Verifying your private workspace…"}
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--cp-background)] lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <Link href="#workspace-content" className="cp-skip-link">
        Skip to workspace
      </Link>
      <aside className="hidden border-b border-slate-200/80 bg-white lg:sticky lg:top-0 lg:block lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col px-4 py-3 sm:px-6 sm:py-4 lg:px-5 lg:py-6">
          <Link href="/dashboard" className="group flex items-center gap-3 px-2 focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25">
            <span className="transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transform-none">
              <BrandMark />
            </span>
            <span className="text-[15px] font-bold tracking-[-0.045em] text-[#212529]">Client<span className="text-[#495057]">Pilot</span></span>
          </Link>
          <Link href="/projects" className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#343a40] bg-[#343a40] px-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(52,58,64,0.2)] transition duration-200 hover:-translate-y-0.5 hover:border-[#212529] hover:bg-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30 lg:mt-9 motion-reduce:transform-none">
            <Plus size={16} aria-hidden="true" /> New project
          </Link>
          <p className="mb-2 mt-4 hidden px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 lg:mb-3 lg:mt-9 lg:block">Workspace</p>
          <nav aria-label="Workspace" className="hidden gap-1 lg:flex lg:flex-col">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/dashboard"
                  ? pathname === href
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-10 items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 ${
                    active
                      ? "bg-[#f1f3f5] text-[#212529] shadow-sm shadow-slate-950/[0.03]"
                      : "text-[#495057] hover:bg-[#f8f9fa] hover:text-[#212529]"
                  }`}
                >
                  <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto hidden border-t border-slate-200 pt-4 lg:block">
            {owner ? (
              <div className="mb-3 flex items-center gap-3 px-2">
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-xs font-bold text-[#343a40] ring-1 ring-gray-300">{(owner.full_name ?? owner.email).slice(0, 1).toUpperCase()}</span>
                <span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#343a40]">{owner.full_name ?? "Your workspace"}</span><span className="block truncate text-xs text-[#6c757d]">{owner.email}</span></span>
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleLogout}
              disabled={signingOut || !owner}
              className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#495057] transition-colors duration-200 hover:bg-[#f1f3f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 disabled:opacity-60"
            >
              <LogOut aria-hidden="true" size={17} />{signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-3 py-2 backdrop-blur-xl sm:px-8 sm:py-3 lg:px-10 lg:py-0">
        <div className="flex min-h-10 items-center justify-between gap-2 lg:h-[76px]">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              aria-label="ClientPilot dashboard"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 lg:hidden"
            >
              <BrandMark small />
            </Link>
            <div className="min-w-0">
              <p className="hidden text-[11px] font-medium text-[#6c757d] sm:block">Private workspace</p>
              <p className="truncate text-sm font-semibold text-[#343a40]">{navigation.find((item) => item.href === (pathname.startsWith("/clients") ? "/clients" : pathname.startsWith("/projects") ? "/projects" : "/dashboard"))?.label}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:hidden">
            <Link href="/projects" className="hidden min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[#343a40] bg-[#343a40] px-3 text-xs font-semibold text-white shadow-sm transition-colors duration-200 hover:border-[#212529] hover:bg-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30 md:inline-flex">
              <Plus size={15} aria-hidden="true" /> New project
            </Link>
            {owner ? <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-xs font-bold text-[#343a40] ring-1 ring-gray-300">{(owner.full_name ?? owner.email).slice(0, 1).toUpperCase()}</span> : null}
            <button type="button" onClick={handleLogout} disabled={signingOut || !owner} className="inline-flex min-h-10 items-center gap-1 rounded-xl px-2 text-xs font-semibold text-[#495057] transition-colors duration-200 hover:bg-[#f1f3f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 disabled:opacity-60 sm:gap-2 sm:px-3">
              <LogOut size={16} aria-hidden="true" /><span>{signingOut ? "Signing out…" : "Sign out"}</span>
            </button>
          </div>
        </div>
        <nav aria-label="Workspace" className="mt-1 grid grid-cols-3 gap-1 lg:hidden">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-10 min-w-0 items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 sm:gap-2 sm:px-3 sm:text-sm ${
                  active
                    ? "bg-[#f1f3f5] text-[#212529]"
                    : "text-[#495057] hover:bg-[#f8f9fa] hover:text-[#212529]"
                }`}
              >
                <Icon aria-hidden="true" className="shrink-0" size={16} strokeWidth={1.8} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </header>
      <section id="workspace-content" tabIndex={-1} className="mx-auto w-full max-w-[1440px] px-5 py-7 outline-none sm:px-8 sm:py-9 lg:px-10 lg:py-11">
        {children}
        {logoutError ? (
          <p role="alert" className="cp-alert-error mt-6 px-4 py-3 text-sm">
            {logoutError}
          </p>
        ) : null}
      </section>
      </div>
    </main>
  );
}
