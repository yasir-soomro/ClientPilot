"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleUserRound,
  ListChecks,
  PanelsTopLeft,
} from "lucide-react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";

const workflow = [
  {
    number: "01",
    title: "Add a client",
    description: "Keep the essential contact context in one private record.",
    icon: CircleUserRound,
  },
  {
    number: "02",
    title: "Create a project",
    description: "Link the work to the client and set a clear direction.",
    icon: PanelsTopLeft,
  },
  {
    number: "03",
    title: "Track the tasks",
    description: "Break delivery into steps and update progress as you go.",
    icon: ListChecks,
  },
];

export function LandingSections() {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="why-clientpilot"
        aria-labelledby="why-heading"
        className="scroll-mt-24 border-y border-[#dee2e6] bg-white px-5 py-20 sm:px-8 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c757d]">
              Why ClientPilot
            </p>
            <h2
              id="why-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#212529] sm:text-4xl"
            >
              Less time piecing it together. More time moving work forward.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#495057]">
              Client details, project plans, and task lists often end up in
              different places. ClientPilot brings them into one owner-only
              workspace, so the next action is easier to find.
            </p>
            <Link
              href="/why-clientpilot"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-semibold text-[#343a40] transition-colors hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25"
            >
              Why this workspace exists
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Client", "Context stays with the relationship."],
              ["Project", "Plans stay connected to the client."],
              ["Progress", "Tasks make delivery visible."],
            ].map(([label, description], index) => (
              <motion.article
                key={label}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="rounded-2xl border border-[#dee2e6] bg-[#f8f9fa] p-5 sm:p-6"
              >
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6c757d]">
                  0{index + 1}
                </span>
                <h3 className="mt-6 text-lg font-semibold text-[#343a40]">
                  {label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#495057]">
                  {description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        aria-labelledby="about-heading"
        className="scroll-mt-24 bg-[#f8f9fa] px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[1.75rem] border border-[#dee2e6] bg-white p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c757d]">
              About ClientPilot
            </p>
            <h2
              id="about-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#212529] sm:text-4xl"
            >
              Built for the person doing the work.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#495057]">
              A focused workspace for freelancers and small agencies to manage
              existing client relationships, organize delivery, and keep
              business clients exactly where they belong: as your records, not
              account holders.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center justify-center gap-2 justify-self-start rounded-xl border border-[#c6cbd1] bg-white px-4 text-sm font-semibold text-[#343a40] transition-colors hover:border-[#6c757d] hover:bg-[#f1f3f5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 lg:justify-self-end"
          >
            Read about our approach
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section
        id="how-it-works"
        aria-labelledby="workflow-heading"
        className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c757d]">
              How it works
            </p>
            <h2
              id="workflow-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#212529] sm:text-5xl"
            >
              A simple path from client to delivery.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#495057]">
              Start with the relationship. Keep the work and its next steps
              connected as the project moves forward.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-12">
            {workflow.map(({ number, title, description, icon: Icon }, index) => (
              <motion.article
                key={number}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="relative rounded-2xl border border-[#dee2e6] bg-white p-5 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.14em] text-[#6c757d]">
                    {number}
                  </span>
                  <Icon
                    aria-hidden="true"
                    size={19}
                    className="text-[#495057]"
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="mt-7 text-lg font-semibold text-[#343a40]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#495057]">
                  {description}
                </p>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-5 rounded-2xl bg-[#212529] px-5 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-start gap-3">
              <CheckCircle2
                aria-hidden="true"
                size={19}
                className="mt-0.5 shrink-0 text-[#dee2e6]"
              />
              <p className="text-sm leading-6 text-[#f1f3f5]">
                Private to your account. Business clients do not need a login.
              </p>
            </div>
            <Link
              href="/how-it-works"
              className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start rounded-lg px-2 text-sm font-semibold text-white transition-colors hover:text-[#dee2e6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:self-auto"
            >
              View the full workflow
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[1.75rem] border border-[#dee2e6] bg-[#f1f3f5] px-6 py-9 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c757d]">
              Make room for the work
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#212529] sm:text-4xl">
              Bring your client work into focus.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#495057] sm:text-base">
              Start a private workspace for the clients, projects, and tasks you
              already manage.
            </p>
          </div>
          <Link
            href="/register"
            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#343a40] bg-[#343a40] px-5 text-sm font-semibold text-white shadow-sm transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#212529] hover:bg-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30 motion-reduce:transform-none"
          >
            Create your workspace
            <ArrowRight
              aria-hidden="true"
              size={16}
              className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
            />
          </Link>
        </div>
      </section>
    </MotionConfig>
  );
}
