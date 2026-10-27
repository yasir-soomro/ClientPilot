import type { Metadata } from "next";
import { ArrowRight, Check, LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";

export const metadata: Metadata = {
  title: "Why ClientPilot",
  description:
    "See how ClientPilot helps freelancers and small agencies keep client work, projects, and tasks connected.",
  alternates: { canonical: "/why-clientpilot" },
  openGraph: {
    title: "Why ClientPilot",
    description:
      "A clearer way to manage client relationships and project delivery.",
    url: "/why-clientpilot",
  },
};

const problems = [
  ["Client details get scattered", "Keep contact context beside the work it belongs to, instead of searching across notes and inboxes."],
  ["Projects are hard to keep in view", "Link projects to clients and see their status, due dates, and next steps in one workspace."],
  ["Tasks disappear into mental lists", "Break delivery into clear tasks and update progress as work moves from todo to done."],
];

export default function WhyClientPilotPage() {
  return (
    <PublicShell>
      <section id="why-clientpilot" aria-labelledby="why-clientpilot-heading" className="relative overflow-hidden border-b border-slate-200/70 bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-indigo-200/50 blur-[110px]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700"><Sparkles size={14} aria-hidden="true" /> Built around your workflow</span>
          <h1 id="why-clientpilot-heading" className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-6xl">More clarity for the work behind every client relationship.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">ClientPilot gives freelancers and small agencies a focused place to connect client context, project delivery, and the tasks that move work forward.</p>
          <Link href="/register" className="mt-8 inline-flex min-h-[50px] items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700">Create your workspace <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>

      <section aria-labelledby="problems-heading" className="bg-[#fcfcff] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="cp-eyebrow">The problem it solves</p><h2 id="problems-heading" className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">A calmer way to stay close to the details.</h2><p className="mt-4 text-base leading-7 text-slate-600">When client work grows, small gaps in context create unnecessary work. ClientPilot keeps the essential relationships visible.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{problems.map(([title, text], index) => <article key={title} className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm"><span className="text-sm font-semibold tracking-widest text-indigo-400">0{index + 1}</span><h3 className="mt-6 text-lg font-semibold text-slate-900">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{text}</p></article>)}</div></div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-28"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-slate-950 px-6 py-12 text-white sm:rounded-[36px] sm:px-10 sm:py-16 lg:px-16"><div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">Your workspace, your account</p><h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.055em] sm:text-4xl">Spend less time organizing. More time delivering.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">Keep your workspace private to your account. Your clients remain records in your workspace and do not need a separate login.</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 sm:p-7"><ul className="space-y-5">{["Client details stay connected to projects", "Tasks and delivery progress stay organized", "Your clients do not need their own accounts"].map((benefit) => <li key={benefit} className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"><Check size={13} strokeWidth={2.5} aria-hidden="true" /></span><span className="text-sm leading-6 text-slate-200">{benefit}</span></li>)}</ul><div className="mt-7 border-t border-white/10 pt-5"><div className="flex items-center gap-3"><LockKeyhole size={18} className="text-indigo-200" aria-hidden="true" /><span className="text-sm font-semibold">Private by design.</span></div></div></div></div></div></section>
    </PublicShell>
  );
}
