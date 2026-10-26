import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ShieldCheck,
  Users,
} from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";

export const metadata: Metadata = {
  title: "A calmer way to manage client work",
  description:
    "Keep client details, projects, tasks, and delivery progress together in a private workspace made for freelancers and small agencies.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ClientPilot | A calmer way to manage client work",
    description:
      "A private workspace to organize client details, projects, and delivery work.",
    url: "/",
  },
};

const features = [
  {
    icon: Users,
    title: "Client context, close by",
    description:
      "Keep contact details and the work connected to each client together.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Projects with a clear next step",
    description:
      "Track project status, tasks, deadlines, and delivery progress in one view.",
  },
  {
    icon: ShieldCheck,
    title: "Your own private workspace",
    description:
      "Your account is for you. Business clients stay as records in your workspace.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#182230]">
      <header className="border-b border-[#eceef3] bg-white/90">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8"
        >
          <Link href="/" className="flex items-center gap-3" aria-label="ClientPilot home">
            <BrandMark />
            <span className="text-[15px] font-bold tracking-[-0.025em]">ClientPilot</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[#475467] transition hover:bg-[#f6f7fb] hover:text-[#182230]"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25"
            >
              Create account <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative isolate border-b border-[#eceef3]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-32 -top-40 size-[34rem] rounded-full bg-indigo-100/70 blur-3xl" />
          <div className="absolute -bottom-52 left-[34%] size-[28rem] rounded-full bg-sky-100/50 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.94fr] lg:gap-16 lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
              <span className="size-1.5 rounded-full bg-indigo-500" />
              Made for freelancers and small agencies
            </p>
            <h1 className="mt-7 text-[clamp(2.65rem,5vw,4.35rem)] font-bold leading-[1.04] tracking-[-0.06em] text-[#171a2c]">
              Client work, with a clearer way forward.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
              Keep client details, projects, and next steps together in one calm,
              private workspace. Spend less time searching and more time
              delivering good work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(79,70,229,0.2)] transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25"
              >
                Create your workspace <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#dfe2ea] bg-white/80 px-5 text-sm font-semibold text-[#344054] shadow-sm transition hover:border-[#c7cad5] hover:bg-white"
              >
                Sign in
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-[#7b8495]">
              <Check aria-hidden="true" size={14} className="text-emerald-600" />
              Private to your account. Clients don’t need a login.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[540px] rounded-[26px] border border-[#e3e5ed] bg-white/70 p-2.5 shadow-[0_30px_90px_rgba(25,30,60,0.12)] backdrop-blur sm:p-3">
            <Image
              src="/ClientPilot.png"
              alt="ClientPilot workspace dashboard for organizing client projects and tasks."
              width={1536}
              height={1024}
              sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), 540px"
              preload
              className="h-auto w-full rounded-[19px]"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="features-heading" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">One focused workspace</p>
          <h2 id="features-heading" className="mt-3 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">
            The essentials, thoughtfully together.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#667085] sm:text-base">
            Keep the context around your work close at hand, from the client record to the next task.
          </p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-[#e7e9f0] bg-white p-5 shadow-[0_2px_8px_rgba(16,24,40,0.025)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(16,24,40,0.07)] sm:p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 text-sm font-bold text-[#252b3b]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#667085]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#eceef3] bg-[#fafbfc]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-[#7b8495] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold text-[#475467]">
            <BrandMark small /> ClientPilot
          </Link>
          <span>A private workspace for client work.</span>
        </div>
      </footer>
    </main>
  );
}
