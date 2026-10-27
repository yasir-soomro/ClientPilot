"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, LogOut, Menu } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";
import { AuthApiError, getCurrentOwner, logoutOwner } from "@/features/auth/service";
import type { Owner } from "@/features/auth/types";

const links = [["Why ClientPilot", "/why-clientpilot"], ["About", "/about"], ["How it works", "/how-it-works"]] as const;

export default function Navbar() {
  const router = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  useEffect(() => { getCurrentOwner().then(setOwner).catch((error: unknown) => { if (!(error instanceof AuthApiError && (error.status === 401 || error.status === 403))) setOwner(null); }); }, []);
  async function handleLogout() { setLoggingOut(true); try { await logoutOwner(); setOwner(null); router.refresh(); } finally { setLoggingOut(false); } }
  const authLinks = owner ? <><Link href="/dashboard" className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950 sm:px-4">Dashboard</Link><button type="button" onClick={handleLogout} disabled={loggingOut} className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950 disabled:opacity-50 sm:px-4"><LogOut size={16} aria-hidden="true" />{loggingOut ? "Signing out…" : "Log out"}</button></> : <><Link href="/login" className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950 sm:px-4">Sign in</Link><Link href="/register" className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 sm:px-4">Get started <ArrowUpRight size={16} aria-hidden="true" /></Link></>;
  return <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl"><nav aria-label="Main navigation" className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8"><Link href="/" aria-label="ClientPilot home" className="group flex shrink-0 items-center gap-2.5"><span className="transition-transform group-hover:rotate-[-5deg]"><BrandMark /></span><span className="text-base font-bold tracking-[-0.045em] text-slate-950">ClientPilot</span></Link><div className="hidden items-center gap-7 md:flex">{links.map(([label, href]) => <Link key={href} href={href} className="rounded-lg px-1 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20">{label}</Link>)}</div><div className="hidden items-center gap-2 sm:gap-3 md:flex">{authLinks}</div><div className="relative md:hidden"><button type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)} className="flex size-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"><Menu size={20} aria-hidden="true" /><span className="sr-only">Toggle navigation</span></button>{menuOpen ? <div id="mobile-navigation" className="absolute right-0 top-12 z-50 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20">{label}</Link>)}<div className="mt-1 border-t border-slate-100 pt-1">{authLinks}</div></div> : null}</div></nav></header>;
}
