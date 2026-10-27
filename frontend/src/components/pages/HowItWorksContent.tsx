
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Users,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Users,
    title: "Create your workspace",
    description:
      "Create your account and set up a central place to organize your client work.",
  },
  {
    number: "02",
    icon: BriefcaseBusiness,
    title: "Organize clients and projects",
    description:
      "Keep client information connected to the projects and work you manage for them.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Track work and next steps",
    description:
      "Use project status and tasks to understand what's in progress and what needs attention.",
  },
];

export default function HowItWorksContent() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-indigo-200/40 blur-[100px]"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold text-indigo-600">
            HOW IT WORKS
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
            From scattered details
            <span className="block bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              to a clearer workflow.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            ClientPilot brings client information, projects, and tasks
            together so you can manage your work with greater clarity.
          </p>
        </div>
      </section>

      <section className="bg-[#fcfcff] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
              Three steps to get organized
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-500">
              A straightforward workflow for your everyday client work.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <article
                key={number}
                className="rounded-3xl border border-slate-200/80 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/[0.05] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold tracking-widest text-slate-300">
                    {number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold tracking-tight text-slate-900">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 rounded-3xl bg-slate-950 p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Make your next project easier to manage.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              Bring your client work into one organized workspace.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50"
          >
            Create account
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
