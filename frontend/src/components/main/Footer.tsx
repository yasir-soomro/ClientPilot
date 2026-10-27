import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#why-clientpilot", label: "Why ClientPilot" },
  { href: "/#about", label: "About" },
  { href: "/#how-it-works", label: "How it works" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-9 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/#home" aria-label="ClientPilot home" className="group flex items-center gap-2.5">
            <BrandMark small />
            <span className="text-sm font-bold tracking-[-0.035em] text-slate-800">ClientPilot</span>
          </Link>
          <p className="text-xs leading-5 text-slate-500 sm:text-right sm:text-sm">A calmer, clearer workspace for client work.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
          {links.map((item) => <Link key={item.href} href={item.href} className="transition hover:text-indigo-600">{item.label}</Link>)}
          <Link href="/login" className="transition hover:text-indigo-600">Sign in</Link>
          <Link href="/register" className="transition hover:text-indigo-600">Create account</Link>
        </div>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} ClientPilot. Built for focused client delivery.</p>
      </div>
    </footer>
  );
}
