



import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <Link
          href="/"
          aria-label="ClientPilot home"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="transition-transform duration-300 group-hover:rotate-[-5deg]">
            <BrandMark />
          </span>
          <span className="text-base font-bold tracking-[-0.045em] text-slate-950">
            ClientPilot
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">Home</Link>
          <Link
            href="/why-clientpilot"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
          >
            Why ClientPilot
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">About</Link>
          <Link href="/how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">How it works</Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 sm:px-4"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25 sm:px-4"
          >
            Get started
            <ArrowUpRight
              aria-hidden="true"
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <details className="relative md:hidden">
          <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open navigation</span><Menu size={20} aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
            <Link href="/" className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Home</Link>
            <Link href="/why-clientpilot" className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Why ClientPilot</Link>
            <Link href="/about" className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">About</Link>
            <Link href="/how-it-works" className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">How it works</Link>
          </div>
        </details>
      </nav>
    </header>
  );
}
