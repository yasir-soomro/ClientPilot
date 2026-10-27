import type { Metadata } from "next";
import { Check, Compass, LockKeyhole, Users } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";

export const metadata: Metadata = {
  title: "About ClientPilot",
  description: "Learn why ClientPilot exists and who it is built for.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About ClientPilot", description: "A focused workspace for freelancers and small agencies managing client delivery.", url: "/about" },
};

const principles = [
  { icon: Compass, title: "Clarity over complexity", text: "The product keeps the core workflow visible: clients, projects, tasks, and progress." },
  { icon: Users, title: "Built for owners", text: "ClientPilot is a private workspace for freelancers and small-agency owners, not a client portal." },
  { icon: LockKeyhole, title: "Private by design", text: "Your workspace belongs to your account, with owner-scoped records and secure access." },
];

export default function AboutPage() {
  return <PublicShell>
    <section className="border-b border-slate-200/70 bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-4xl text-center"><p className="cp-eyebrow">About ClientPilot</p><h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-6xl">A better home for the work behind great client relationships.</h1><p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">ClientPilot helps independent professionals keep client context, project delivery, and daily tasks connected in one calm workspace.</p></div>
    </section>
    <section className="px-5 py-20 sm:px-8 sm:py-24"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><p className="cp-eyebrow">Our purpose</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">Make client work easier to see and easier to finish.</h2></div><div className="space-y-5 text-base leading-8 text-slate-600"><p>Client work often lives across inboxes, notes, spreadsheets, and memory. That makes it harder to know what belongs to whom, what is moving, and what needs attention next.</p><p>ClientPilot gives owners a focused place to keep those relationships and delivery details connected, without adding the overhead of a complex enterprise system.</p><div className="grid gap-3 pt-3 text-sm font-medium text-slate-700 sm:grid-cols-2"><span className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Private owner workspace</span><span className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Client records stay organized</span><span className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Projects linked to clients</span><span className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Tasks tied to delivery</span></div></div></div></section>
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-24"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="cp-eyebrow">What guides us</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">Simple enough to use every day.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{principles.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-slate-200/80 bg-[#fcfcff] p-7"><span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon size={21} aria-hidden="true" /></span><h3 className="mt-6 text-lg font-semibold text-slate-900">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{text}</p></article>)}</div></div></section>
  </PublicShell>;
}
