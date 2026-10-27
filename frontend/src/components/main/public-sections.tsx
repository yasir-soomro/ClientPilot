import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  CircleCheck,
  Compass,
  Layers3,
  ListTodo,
  LockKeyhole,
  ShieldCheck,
  Users,
} from "lucide-react";

const workflow = [
  { number: "01", icon: Users, title: "Add a client", text: "Save the person or business you work with. Keep their details close to the work." },
  { number: "02", icon: BriefcaseBusiness, title: "Create a project", text: "Connect each project to the client it belongs to, with a clear status and due date." },
  { number: "03", icon: ListTodo, title: "Break work into tasks", text: "Turn delivery into small, actionable steps your future self can understand." },
  { number: "04", icon: CalendarClock, title: "Track what is next", text: "Update progress, keep deadlines visible, and spot overdue work early." },
];

const benefits = [
  { icon: Layers3, title: "Everything stays connected", text: "Clients, projects, and tasks follow one clear relationship, instead of becoming scattered lists." },
  { icon: Compass, title: "Know your next step", text: "See outstanding work and due dates so you can decide what deserves attention first." },
  { icon: LockKeyhole, title: "Your private workspace", text: "ClientPilot is for the owner managing the work. Your business clients do not need accounts." },
];

export default function PublicSections() {
  return (
    <>
      <section id="why-clientpilot" aria-labelledby="why-heading" className="scroll-mt-24 border-y border-slate-200/70 bg-[#f7f8ff] px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div className="max-w-xl">
            <p className="cp-eyebrow">Why ClientPilot</p>
            <h2 id="why-heading" className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">
              Your client work deserves more than memory and scattered notes.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              When client details live in chats, projects live in separate documents, and tasks live in your head, important work is easy to miss. ClientPilot gives the whole picture one home.
            </p>
            <Link href="/register" className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-indigo-700 transition hover:gap-3">
              Bring your work together <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className={`rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm ${index === 0 ? "sm:col-span-2 sm:flex sm:items-start sm:gap-5" : ""}`}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon size={20} aria-hidden="true" /></span>
                <div className={index === 0 ? "mt-4 sm:mt-0" : "mt-5"}>
                  <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" aria-labelledby="about-heading" className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <p className="cp-eyebrow">About ClientPilot</p>
            <h2 id="about-heading" className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">
              Built for the people who do the work.
            </h2>
          </div>
          <div>
            <p className="text-base leading-8 text-slate-600">
              ClientPilot is a focused client-to-delivery workspace for freelancers, consultants, and small-agency owners. It connects the client relationship to the projects and tasks needed to deliver the work—without the overhead of an enterprise tool.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["One private owner workspace", "Clients linked to their projects", "Projects broken into tasks", "Progress and deadlines in view"].map((item) => (
                <div key={item} className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-[#fcfcff] p-3.5 text-sm font-medium leading-6 text-slate-700">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check size={12} strokeWidth={2.8} aria-hidden="true" /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-24 bg-[#fcfcff] px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="cp-eyebrow">How it works</p>
            <h2 id="how-heading" className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">A clear path from client to delivery.</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">Keep the workflow simple and predictable, from capturing a client to finishing the next task.</p>
          </div>
          <div className="relative mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {workflow.map(({ number, icon: Icon, title, text }) => (
              <article key={number} className="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/[0.05] sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon size={20} aria-hidden="true" /></span>
                  <span className="text-xs font-bold tracking-[0.16em] text-slate-300">{number}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 text-center sm:flex-row sm:px-7 sm:text-left">
            <div className="flex items-center gap-3"><CircleCheck size={20} className="shrink-0 text-indigo-600" aria-hidden="true" /><p className="text-sm leading-6 text-slate-700">Your client records stay private. Only the account owner can access their workspace.</p></div>
            <Link href="/register" className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">Get started <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="cta-heading" className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-slate-950 px-6 py-12 text-white sm:rounded-[36px] sm:px-10 sm:py-16 lg:px-16">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-28 size-80 rounded-full bg-indigo-500/20 blur-[90px]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300"><ShieldCheck size={15} aria-hidden="true" /> A little more clarity, every day</div><h2 id="cta-heading" className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">Give every client project a clear next step.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">Start a private workspace and bring your client records, projects, and tasks together.</p></div>
            <Link href="/register" className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50">Create your workspace <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
