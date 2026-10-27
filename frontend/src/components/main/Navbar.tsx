"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";
import { getCurrentOwner, logoutOwner } from "@/features/auth/service";
import type { Owner } from "@/features/auth/types";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#why-clientpilot", label: "Why ClientPilot" },
  { href: "/#about", label: "About" },
  { href: "/#how-it-works", label: "How it works" },
];

export default function Navbar() {
  const router = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    let active = true;
    getCurrentOwner()
      .then((currentOwner) => {
        if (active) setOwner(currentOwner);
      })
      .catch(() => {
        if (active) setOwner(null);
      })
      .finally(() => {
        if (active) setAuthChecked(true);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    setLogoutError("");
    try {
      await logoutOwner();
      setOwner(null);
      setMobileOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Unable to sign out. Please try again.");
    }
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/#home" aria-label="ClientPilot home" onClick={closeMobileMenu} className="group flex shrink-0 items-center gap-2.5">
          <span className="transition-transform duration-300 group-hover:rotate-[-5deg]"><BrandMark /></span>
          <span className="text-base font-bold tracking-[-0.045em] text-slate-950">ClientPilot</span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex xl:gap-6">
          {links.map((item) => <Link key={item.href} href={item.href} className="whitespace-nowrap text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">{item.label}</Link>)}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {!authChecked ? (
            <div aria-label="Checking account" className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
          ) : owner ? (
            <>
              <Link href="/dashboard" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/50"><LayoutDashboard size={16} aria-hidden="true" />Dashboard</Link>
              <button type="button" onClick={handleSignOut} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"><LogOut size={16} aria-hidden="true" />Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 sm:px-4">Sign in</Link>
              <Link href="/register" className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25 sm:px-4">Get started<ArrowUpRight aria-hidden="true" size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
            </>
          )}
        </div>

        <button type="button" className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 md:hidden" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="mobile-public-navigation" onClick={() => setMobileOpen((open) => !open)}>
          {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </nav>

      {mobileOpen ? (
        <div id="mobile-public-navigation" className="border-t border-slate-100 bg-white px-5 pb-5 pt-3 shadow-lg md:hidden sm:px-8">
          <div className="grid gap-1">
            {links.map((item) => <Link key={item.href} href={item.href} onClick={closeMobileMenu} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600">{item.label}</Link>)}
          </div>
          <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3">
            {!authChecked ? (
              <div aria-label="Checking account" className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
            ) : owner ? (
              <>
                <Link href="/dashboard" onClick={closeMobileMenu} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 text-sm font-semibold text-slate-700"><LayoutDashboard size={16} aria-hidden="true" />Dashboard</Link>
                <button type="button" onClick={handleSignOut} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"><LogOut size={16} aria-hidden="true" />Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMobileMenu} className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">Sign in</Link>
                <Link href="/register" onClick={closeMobileMenu} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">Get started <ArrowUpRight size={16} aria-hidden="true" /></Link>
              </>
            )}
          </div>
        </div>
      ) : null}
      {logoutError ? <p role="alert" className="border-t border-rose-100 bg-rose-50 px-5 py-2 text-right text-xs text-rose-700 sm:px-8">{logoutError}</p> : null}
    </header>
  );
}
