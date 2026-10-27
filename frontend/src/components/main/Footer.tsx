import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  LogIn,
  UserRoundPlus,
} from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";

const productLinks = [
  { href: "/#features", label: "Features", icon: Compass },
  { href: "/how-it-works", label: "How it works", icon: BookOpen },
  { href: "/about", label: "About ClientPilot", icon: ArrowUpRight },
] as const;

const accountLinks = [
  { href: "/login", label: "Sign in", icon: LogIn },
  { href: "/register", label: "Create an account", icon: UserRoundPlus },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8 sm:pt-14 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:gap-16">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="ClientPilot home"
              className="group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
            >
              <span className="transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transform-none">
                <BrandMark small />
              </span>
              <span className="text-[15px] font-bold tracking-[-0.05em] text-slate-950">
                Client<span className="text-indigo-600">Pilot</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              A focused private workspace for freelancers and small agencies to
              keep client delivery clear and connected.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-indigo-700 transition hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
            >
              Learn about ClientPilot
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <nav aria-label="Product links">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex min-h-8 items-center gap-2.5 rounded-md text-sm font-medium text-slate-600 transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.8}
                      className="text-slate-400 transition-colors group-hover:text-indigo-600"
                      aria-hidden="true"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account links">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Your workspace
            </h2>
            <ul className="mt-4 space-y-2.5">
              {accountLinks.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex min-h-8 items-center gap-2.5 rounded-md text-sm font-medium text-slate-600 transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.8}
                      className="text-slate-400 transition-colors group-hover:text-indigo-600"
                      aria-hidden="true"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ClientPilot. All rights reserved.</p>
          <p>Private by design. Built for your client work.</p>
        </div>
      </div>
    </footer>
  );
}
