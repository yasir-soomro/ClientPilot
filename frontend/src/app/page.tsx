import type { Metadata } from "next";
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

          <div
            aria-label="Sample workspace preview"
            className="relative mx-auto w-full max-w-[540px] rounded-[26px] border border-[#e3e5ed] bg-white/70 p-3 shadow-[0_30px_90px_rgba(25,30,60,0.12)] backdrop-blur sm:p-4"
          >
            <div className="overflow-hidden rounded-[19px] border border-[#eceef3] bg-white">
              <div className="flex items-center justify-between border-b border-[#eceef3] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <BrandMark />
                  <div>
                    <p className="text-xs font-semibold text-[#344054]">My workspace</p>
                    <p className="mt-0.5 text-[11px] text-[#98a2b3]">A clear view of your work</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#f3f4f8] px-2.5 py-1 text-[10px] font-semibold text-[#667085]">Sample</span>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4 sm:p-5">
                <PreviewMetric title="Clients" value="All in one place" icon={Users} />
                <PreviewMetric title="Projects" value="Know what’s moving" icon={BriefcaseBusiness} />
              </div>
              <div className="mx-4 mb-4 rounded-xl border border-[#eceef3] p-4 sm:mx-5 sm:mb-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#344054]">Project progress</p>
                    <p className="mt-1 text-[11px] text-[#98a2b3]">Tasks keep delivery on track</p>
                  </div>
                  <span className="text-sm font-bold text-indigo-700">68%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#eef0f5]">
                  <div className="h-full w-[68%] rounded-full bg-indigo-600" />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#f0f1f5] pt-3 text-[11px] text-[#667085]">
                  <span>Website refresh</span><span>Next: Review layout</span>
                </div>
              </div>
            </div>
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

function PreviewMetric({ title, value, icon: Icon }: { title: string; value: string; icon: typeof Users }) {
  return (
    <div className="rounded-xl border border-[#eceef3] p-3.5 sm:p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#667085]">{title}</span>
        <Icon aria-hidden="true" size={16} className="text-indigo-600" />
      </div>
      <p className="mt-4 text-xs font-bold text-[#344054] sm:text-sm">{value}</p>
    </div>
  );
}
