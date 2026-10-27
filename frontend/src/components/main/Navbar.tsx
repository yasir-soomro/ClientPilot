"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";
import {
  AuthApiError,
  getCurrentOwner,
  logoutOwner,
} from "@/features/auth/service";
import type { Owner } from "@/features/auth/types";

const links = [
  ["Why ClientPilot", "/why-clientpilot"],
  ["About", "/about"],
  ["How it works", "/how-it-works"],
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    getCurrentOwner()
      .then(setOwner)
      .catch((error: unknown) => {
        if (!(error instanceof AuthApiError && (error.status === 401 || error.status === 403))) {
          setOwner(null);
        }
      });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");
    try {
      await logoutOwner();
      setOwner(null);
      setMenuOpen(false);
      router.refresh();
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Unable to sign out. Please try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  }

  const desktopAuthLinks = owner ? (
    <>
      <Link
        href="/dashboard"
        aria-current={pathname === "/dashboard" ? "page" : undefined}
        className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
          pathname.startsWith("/dashboard")
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        }`}
      >
        <LayoutDashboard size={16} aria-hidden="true" />
        Dashboard
      </Link>
      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={loggingOut}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 disabled:opacity-50"
      >
        <LogOut size={16} aria-hidden="true" />
        {loggingOut ? "Signing out…" : "Log out"}
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25 motion-reduce:transform-none"
      >
        Get started
        <ArrowUpRight
          size={16}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </>
  );

  return (
    <MotionConfig reducedMotion="user">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 shadow-[0_1px_8px_rgba(15,23,42,0.025)] backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:h-[76px] sm:px-7 lg:px-10"
        >
          <Link
            href="/"
            aria-label="ClientPilot home"
            className="group flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
          >
            <span className="transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transform-none">
              <BrandMark />
            </span>
            <span className="text-[17px] font-bold tracking-[-0.05em] text-slate-950">
              Client<span className="text-indigo-600">Pilot</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map(([label, href]) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 lg:px-4 ${
                    active
                      ? "bg-indigo-50/80 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  {label}
                  {active ? (
                    <motion.span
                      layoutId="public-nav-indicator"
                      className="absolute inset-x-4 -bottom-[13px] h-0.5 rounded-full bg-indigo-600"
                      aria-hidden="true"
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-1.5 md:flex">
            {desktopAuthLinks}
          </div>

          <div className="relative md:hidden" ref={menuRef}>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
            >
              {menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
            </button>
            <AnimatePresence>
              {menuOpen ? (
                <motion.div
                  id="mobile-navigation"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(20rem,calc(100vw-2rem))] origin-top-right rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[var(--cp-shadow-popover)]"
                >
                  <div className="space-y-1">
                    {links.map(([label, href]) => {
                      const active = isActive(pathname, href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setMenuOpen(false)}
                          className={`flex min-h-11 items-center rounded-xl px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
                            active
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-slate-700 hover:bg-slate-50 hover:text-indigo-700"
                          }`}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex flex-col gap-1 border-t border-slate-100 pt-2">
                    {owner ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-700"
                        >
                          <LayoutDashboard size={16} aria-hidden="true" />
                          Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleLogout()}
                          disabled={loggingOut}
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-700 disabled:opacity-50"
                        >
                          <LogOut size={16} aria-hidden="true" />
                          {loggingOut ? "Signing out…" : "Log out"}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setMenuOpen(false)}
                          className="flex min-h-11 items-center rounded-xl px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-700"
                        >
                          Sign in
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setMenuOpen(false)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25"
                        >
                          Get started <ArrowUpRight size={16} aria-hidden="true" />
                        </Link>
                      </>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </nav>
        {logoutError ? (
          <p role="alert" className="mx-auto max-w-7xl px-5 pb-2 text-right text-xs text-rose-700">
            {logoutError}
          </p>
        ) : null}
      </header>
    </MotionConfig>
  );
}
