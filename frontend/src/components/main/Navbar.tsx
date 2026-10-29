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
import { startNavigationProgress } from "@/components/layout/navigation-progress";
import { useAuth } from "@/features/auth/session-context";

const links = [
  ["Why ClientPilot", "/why-clientpilot"],
  ["How it works", "/how-it-works"],
  ["About", "/about"],
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { state, refresh, logout } = useAuth();
  const owner = state.status === "authenticated" ? state.owner : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktopViewport = window.matchMedia("(min-width: 1024px)");
    function closeMenuOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) setMenuOpen(false);
    }

    desktopViewport.addEventListener("change", closeMenuOnDesktop);
    return () => {
      desktopViewport.removeEventListener("change", closeMenuOnDesktop);
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      setMenuOpen(false);
      startNavigationProgress("/");
      router.replace("/");
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
        className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 ${
          pathname.startsWith("/dashboard")
            ? "bg-[#f1f3f5] text-[#212529]"
            : "text-[#495057] hover:bg-[#f1f3f5] hover:text-[#212529]"
        }`}
      >
        <LayoutDashboard size={16} aria-hidden="true" />
        Dashboard
      </Link>
      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={loggingOut}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#495057] transition-colors hover:bg-[#f1f3f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 disabled:opacity-50"
      >
        <LogOut size={16} aria-hidden="true" />
        {loggingOut ? "Signing out…" : "Log out"}
      </button>
    </>
  ) : state.status === "unauthenticated" ? (
    <>
      <Link
        href="/login"
        className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-[#495057] transition-colors hover:bg-[#f1f3f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#343a40] bg-[#343a40] px-4 text-sm font-semibold text-white shadow-sm shadow-[#343a40]/20 transition duration-200 hover:-translate-y-0.5 hover:border-[#212529] hover:bg-[#212529] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30 motion-reduce:transform-none"
      >
        Get started
        <ArrowUpRight
          size={16}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </>
  ) : null;

  return (
    <MotionConfig reducedMotion="user">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-[64px] max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-7 lg:px-10"
        >
          <Link
            href="/"
            aria-label="ClientPilot home"
            className="group flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25"
          >
            <span className="transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none">
              <BrandMark className="!shadow-none !ring-0" />
            </span>
            <span className="text-[17px] font-bold tracking-[-0.05em] text-[#212529]">
              Client<span className="text-[#495057]">Pilot</span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {links.map(([label, href]) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 xl:px-3.5 ${
                    active
                      ? "bg-[#f1f3f5] text-[#212529]"
                      : "text-[#495057] hover:bg-[#f8f9fa] hover:text-[#212529]"
                  }`}
                >
                  {label}
                  {active ? (
                    <motion.span
                      layoutId="public-nav-indicator"
                      className="absolute inset-x-4 -bottom-[13px] h-0.5 rounded-full bg-[#495057]"
                      aria-hidden="true"
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-1.5 lg:flex">
            {desktopAuthLinks}
          </div>

          <div className="relative lg:hidden" ref={menuRef}>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-10 items-center justify-center rounded-xl border border-[#c6cbd1] bg-white text-[#495057] transition-colors hover:border-[#6c757d] hover:bg-[#f1f3f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25"
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
                  className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(21rem,calc(100vw-2rem))] origin-top-right rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[var(--cp-shadow-popover)]"
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
                          className={`flex min-h-11 items-center rounded-xl px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 ${
                            active
                              ? "bg-[#f1f3f5] text-[#212529]"
                              : "text-[#495057] hover:bg-[#f8f9fa] hover:text-[#212529]"
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
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold text-[#495057] transition-colors hover:bg-[#f8f9fa] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25"
                        >
                          <LayoutDashboard size={16} aria-hidden="true" />
                          Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleLogout()}
                          disabled={loggingOut}
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-left text-sm font-semibold text-[#495057] transition hover:bg-[#f1f3f5] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 disabled:opacity-50"
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
                          className="flex min-h-11 items-center rounded-xl px-3.5 text-sm font-semibold text-[#495057] transition-colors hover:bg-[#f8f9fa] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25"
                        >
                          Sign in
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setMenuOpen(false)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#343a40] bg-[#343a40] px-4 text-sm font-semibold text-white shadow-sm transition hover:border-[#212529] hover:bg-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30"
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
        {logoutError || state.status === "error" ? (
          <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 px-5 pb-2 text-right text-xs text-rose-700" role="alert">
            <span>
              {logoutError ||
                (state.status === "error" ? state.message : "")}
            </span>
            {state.status === "error" ? (
              <button
                type="button"
                onClick={() => void refresh()}
                className="font-semibold underline underline-offset-2"
              >
                Retry
              </button>
            ) : null}
          </div>
        ) : null}
      </header>
    </MotionConfig>
  );
}
