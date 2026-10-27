


import {
  BriefcaseBusiness,
  LockKeyhole,
  Users,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Users,
    title: "Know every client",
    description:
      "Keep client details and related work together, so the context you need is always close by.",
  },
  {
    number: "02",
    icon: BriefcaseBusiness,
    title: "Move projects forward",
    description:
      "See project status, tasks, deadlines, and delivery progress without jumping between tools.",
  },
  {
    number: "03",
    icon: LockKeyhole,
    title: "Work in your own space",
    description:
      "Keep your workspace private to your account. Your clients remain records in your workspace.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-24 bg-[#fcfcff] px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 sm:text-sm">
            <span className="h-px w-6 bg-indigo-300" />
            A better way to work
            <span className="h-px w-6 bg-indigo-300" />
          </span>

          <h2
            id="features-heading"
            className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl"
          >
            Everything connected.
            <span className="block text-slate-400">
              Nothing overcomplicated.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Keep the important parts of client work together, from the first
            conversation to the next task and final delivery.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5 lg:mt-16">
          {features.map(({ number, icon: Icon, title, description }, index) => (
            <article
              key={title}
              className="animate-fade-up group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_3px_12px_rgba(15,23,42,0.025)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_45px_rgba(49,46,129,0.09)] sm:rounded-3xl sm:p-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 transition-transform duration-300 group-hover:scale-105">
                  <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
                </span>

                <span className="text-xs font-semibold tracking-[0.12em] text-slate-300">
                  {number}
                </span>
              </div>

              <h3 className="mt-7 text-lg font-semibold tracking-[-0.035em] text-slate-900">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {description}
              </p>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -right-16 size-40 rounded-full bg-indigo-100/0 blur-3xl transition-colors duration-500 group-hover:bg-indigo-100/80"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
