"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, LogOut, Menu, X } from "lucide-react";
import { AuthApiError, getCurrentOwner, logoutOwner } from "@/features/auth/service";
import type { Owner } from "@/features/auth/types";
import { BrandMark } from "@/components/ui/brand-mark";

type AuthState = "checking" | "guest" | "owner";
const links = [
  { href: "/#home", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#about", label: "About" },
];

export default function Navbar() {
  const router = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  useEffect(() => {
    let active = true;
    getCurrentOwner()
      .then((currentOwner) => {
        if (!active) return;
        setOwner(currentOwner);
        setAuthState("owner");
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof AuthApiError && error.status === 401) {
          setOwner(null);
          setAuthState("guest");
          return;
        }
        // Keep the marketing site usable while the API is temporarily unavailable.
        setOwner(null);
        setAuthState("guest");
      });
    return () => { active = false; };
  }, []);

  async function handleLogout() {
    setSigningOut(true);
    setSignOutError("");
    try {
      await logoutOwner();
      setOwner(null);
      setAuthState("guest");
      setMobileOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      if (error instanceof AuthApiError && error.status === 401) {
        setOwner(null);
        setAuthState("guest");
        router.replace("/");
        router.refresh();
        return;
      }
      setSignOutError(error instanceof Error ? error.message : "Unable to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/#home" aria-label="ClientPilot home" onClick={() => setMobileOpen(false)} className="group flex shrink-0 items-center gap-2.5">
          <span className="transition-transform duration-300 group-hover:rotate-[-5deg]"><BrandMark /></span>
          <span className="text-base font-bold tracking-[-0.045em] text-slate-950">ClientPilot</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map(({ href, label }) => <Link key={href} href={href} className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">{label}</Link>)}
        </div>

        <div className="hidden items-center gap-2 sm:gap-3 md:flex">
          {authState === "checking" ? (
            <span className="h-10 w-36 animate-pulse rounded-xl bg-slate-100" aria-label="Checking sign-in status" />
          ) : authState === "owner" && owner ? (
            <>
              <span className="hidden max-w-36 truncate text-xs font-medium text-slate-500 lg:block" title={owner.email}>{owner.full_name ?? owner.email}</span>
              <Link href="/dashboard" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700">Dashboard <ArrowUpRight size={15} aria-hidden="true" /></Link>
              <button type="button" onClick={handleLogout} disabled={signingOut} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60">
                <LogOut size={15} aria-hidden="true" /> {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 sm:px-4">Login</Link>
              <Link href="/register" className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25 sm:px-4">
                Register <ArrowUpRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="mobile-public-navigation" className="flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 md:hidden">
          {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </nav>

      {mobileOpen ? (
        <div id="mobile-public-navigation" className="border-t border-slate-100 bg-white px-5 py-4 shadow-lg sm:px-8 md:hidden">
          <div className="space-y-1">
            {links.map(({ href, label }) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">{label}</Link>)}
          </div>
          <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3">
            {authState === "checking" ? <span className="h-10 animate-pulse rounded-xl bg-slate-100" aria-label="Checking sign-in status" /> : authState === "owner" && owner ? (
              <>
                <p className="truncate px-3 py-1 text-xs text-slate-500">{owner.full_name ?? owner.email}</p>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex min-h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white">Open Dashboard</Link>
                <button type="button" onClick={handleLogout} disabled={signingOut} className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 disabled:opacity-60"><LogOut size={15} aria-hidden="true" />{signingOut ? "Signing out…" : "Sign out"}</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700">Login</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex min-h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white">Register</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
      {signOutError ? <p role="alert" className="border-t border-rose-100 bg-rose-50 px-5 py-2 text-center text-xs text-rose-700">{signOutError}</p> : null}
    </header>
  );
}
