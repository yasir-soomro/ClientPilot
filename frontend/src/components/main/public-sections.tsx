import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Compass,
  ListTodo,
  LockKeyhole,
  Users,
} from "lucide-react";

const problems = [
  { number: "01", title: "Client details are scattered", description: "Keep each client's contact details beside the work you deliver for them, instead of searching across notes and inboxes." },
  { number: "02", title: "Projects lose their context", description: "Connect every project to the right client so ownership, status, and deadlines stay easy to understand." },
  { number: "03", title: "Next steps are easy to forget", description: "Turn projects into manageable tasks, update their status, and see which deadline needs attention first." },
];

const principles = [
  { icon: Compass, title: "Clarity over complexity", text: "A focused workflow for the things owners manage every day: clients, projects, tasks, and progress." },
  { icon: Users, title: "Built for owners", text: "A private workspace for freelancers and small-agency owners. Clients are contact records, not separate accounts." },
  { icon: LockKeyhole, title: "Private by design", text: "Workspace records belong to the signed-in owner and are protected by server-side access checks." },
];

const steps = [
  { number: "01", icon: Users, title: "Add your clients", description: "Keep the right contact details together so every piece of work has a clear home." },
  { number: "02", icon: BriefcaseBusiness, title: "Create a project", description: "Link each project to one of your clients and keep the work in the right context." },
  { number: "03", icon: ListTodo, title: "Break work into tasks", description: "Give delivery work clear next steps and add due dates where they help." },
  { number: "04", icon: CheckCircle2, title: "Track and deliver", description: "Update task status, review project progress, and identify overdue work from your dashboard." },
];

export function WhyClientPilotSection() {
  return (
    <section id="why-clientpilot" aria-labelledby="why-clientpilot-heading" className="scroll-mt-24 border-y border-slate-200/70 bg-white px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="cp-eyebrow">Why ClientPilot</p>
            <h2 id="why-clientpilot-heading" className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">More clarity for the work behind every client relationship.</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">Client work grows quickly. ClientPilot keeps the essential relationships and delivery details connected without adding another complicated process.</p>
            <Link href="/register" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25">Get started <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {problems.map((problem) => (
              <article key={problem.number} className="rounded-2xl border border-slate-200/80 bg-[#fcfcff] p-6 transition hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-indigo-950/[0.04] sm:p-7">
                <span className="text-xs font-bold tracking-[0.14em] text-indigo-500">{problem.number}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">{problem.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{problem.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-24 bg-[#fcfcff] px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <p className="cp-eyebrow">About ClientPilot</p>
          <h2 id="about-heading" className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">A better home for the work behind great client relationships.</h2>
          <p className="mt-5 text-base leading-8 text-slate-600">ClientPilot is designed for independent professionals who want to spend less time organizing work and more time delivering it.</p>
        </div>
        <div className="space-y-7">
          <p className="text-base leading-8 text-slate-600">Client details often live in messages, project notes live somewhere else, and daily tasks stay in someone's memory. As work grows, those gaps make it harder to know what belongs to whom and what needs attention next.</p>
          <p className="text-base leading-8 text-slate-600">Our purpose is to make that everyday workflow easier to see: one owner, multiple clients, projects connected to those clients, and tasks that make delivery manageable.</p>
          <div className="grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2">
            {["Private owner workspace", "Clients linked to projects", "Tasks tied to delivery", "Progress and deadlines in view"].map((item) => (
              <p key={item} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check size={13} strokeWidth={2.5} aria-hidden="true" /></span>{item}
              </p>
            ))}
          </div>
          <div className="grid gap-4 pt-2 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon size={19} aria-hidden="true" /></span>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-500">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="scroll-mt-24 border-y border-slate-200/70 bg-white px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="cp-eyebrow">How it works</p>
          <h2 id="how-it-works-heading" className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">From client details to delivered work.</h2>
          <p className="mt-5 text-base leading-8 text-slate-600">Follow one natural sequence. Each step builds on the one before it, so your project and task records stay connected.</p>
        </div>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <li key={number} className="relative rounded-2xl border border-slate-200/80 bg-[#fcfcff] p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/[0.04] sm:p-7">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon size={20} aria-hidden="true" /></span>
                <span className="text-xs font-bold tracking-[0.15em] text-slate-300">{number}</span>
              </div>
              <h3 className="mt-6 text-base font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function PublicCallToAction() {
  return (
    <section id="get-started" className="bg-[#fcfcff] px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[28px] bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">A clearer workday starts here</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Keep client work connected from first task to final delivery.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">Create your private workspace and give every client project a clear next step.</p>
        </div>
        <Link href="/register" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30">Create your workspace <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
