"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BriefcaseBusiness, LayoutDashboard, LogOut, Plus, Users } from "lucide-react";
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
    <main className="min-h-screen bg-[var(--cp-background)] lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <Link href="#workspace-content" className="cp-skip-link">
        Skip to workspace
      </Link>
      <aside className="border-b border-slate-200/80 bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col px-4 py-4 sm:px-6 lg:px-5 lg:py-6">
          <Link href="/dashboard" className="group flex items-center gap-3 px-2 focus-visible:rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25">
            <span className="transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transform-none">
            <BrandMark />
            </span>
            <span className="text-[15px] font-bold tracking-[-0.045em] text-slate-950">Client<span className="text-gray-600">Pilot</span></span>
          </Link>
          <Link href="/projects" className="mt-6 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#343a40] bg-[#343a40] px-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(52,58,64,0.2)] transition duration-200 hover:-translate-y-0.5 hover:border-[#212529] hover:bg-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30 lg:mt-9 motion-reduce:transform-none">
            <Plus size={16} aria-hidden="true" /> New project
          </Link>
          <p className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 lg:mb-3 lg:mt-9">Workspace</p>
          <nav aria-label="Workspace" className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-visible lg:pb-0">
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
                  className={`flex min-h-10 items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
                    active
                        ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-950/[0.03]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto hidden border-t border-slate-100 pt-4 lg:block">
            {owner ? (
              <div className="mb-3 flex items-center gap-3 px-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200/70">{(owner.full_name ?? owner.email).slice(0, 1).toUpperCase()}</span>
                <span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-700">{owner.full_name ?? "Your workspace"}</span><span className="block truncate text-xs text-slate-400">{owner.email}</span></span>
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleLogout}
              disabled={signingOut || !owner}
              className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#495057] transition hover:bg-[#f1f3f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 disabled:opacity-60"
            >
              <LogOut aria-hidden="true" size={17} />{signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
      <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl sm:h-[76px] sm:px-8 lg:px-10">
        <div><p className="text-[11px] font-medium text-slate-400">Private workspace</p><p className="mt-0.5 text-sm font-semibold text-slate-700">{navigation.find((item) => item.href === (pathname.startsWith("/clients") ? "/clients" : pathname.startsWith("/projects") ? "/projects" : "/dashboard"))?.label}</p></div>
        <div className="flex items-center gap-3 lg:hidden">
          {owner ? <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200/70">{(owner.full_name ?? owner.email).slice(0, 1).toUpperCase()}</span> : null}
          <button type="button" onClick={handleLogout} disabled={signingOut || !owner} aria-label="Sign out" className="rounded-xl p-2 text-[#495057] transition hover:bg-[#f1f3f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 disabled:opacity-60"><LogOut size={17} aria-hidden="true" /></button>
        </div>
      </header>
      <section id="workspace-content" tabIndex={-1} className="mx-auto w-full max-w-[1440px] px-5 py-7 outline-none sm:px-8 sm:py-9 lg:px-10 lg:py-11">
        {loading ? (
          <div
            className="cp-panel p-6 text-sm text-slate-600 sm:p-8"
            role="status"
          >
            Verifying your private workspace…
          </div>
        ) : error ? (
          <div
            className="cp-panel max-w-xl border-rose-200 p-6 sm:p-8"
            role="alert"
          >
            <h1 className="text-xl font-semibold tracking-tight text-slate-950">
              Workspace unavailable
            </h1>
            <p className="mt-2 text-sm leading-6 text-rose-700">{error}</p>
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
              <p role="alert" className="cp-alert-error mt-6 px-4 py-3 text-sm">
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
