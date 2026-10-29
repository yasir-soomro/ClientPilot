"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CircleAlert,
  ClipboardList,
  Layers3,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

const frictionPoints = [
  {
    icon: MessageSquareText,
    title: "Requests arrive in different places",
    description:
      "A detail in a conversation, another in an email, and one more in your notes can leave the full client picture scattered.",
    response:
      "Keep the client record and its related work together in your workspace.",
  },
  {
    icon: ListChecks,
    title: "The next task is easy to lose",
    description:
      "When follow-ups live in your head or an informal list, it takes effort to remember what is still waiting.",
    response:
      "Break a project into tasks and update each one as it moves forward.",
  },
  {
    icon: CalendarDays,
    title: "Deadlines lack their project context",
    description:
      "A date alone is hard to act on when it is separated from the client and delivery work it belongs to.",
    response:
      "Keep optional project and task due dates alongside their work.",
  },
  {
    icon: Layers3,
    title: "Project progress is fragmented",
    description:
      "Switching between a client list, project notes, and task trackers makes it harder to see how delivery is going.",
    response:
      "Connect client, project, task status, and task-based progress in one view.",
  },
] as const;

const workflow = [
  { title: "Client", detail: "Keep relationship context", icon: UsersRound },
  { title: "Project", detail: "Connect agreed work", icon: Layers3 },
  { title: "Tasks", detail: "See next steps", icon: ClipboardList },
  {
    title: "Progress",
    detail: "Review delivery",
    icon: ChartNoAxesColumnIncreasing,
  },
] as const;

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description: string;
  id?: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c757d]">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#212529] sm:text-4xl"
      >
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-[#495057] sm:text-lg">
        {description}
      </p>
    </Reveal>
  );
}

export function WhyClientPilotContent() {
  return (
    <>
      <section
        aria-labelledby="why-clientpilot-heading"
        className="relative isolate overflow-hidden border-b border-[#dee2e6] bg-[#f8f9fa] px-5 py-14 sm:px-8 sm:py-20 lg:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 -top-40 -z-10 size-[34rem] rounded-full bg-[#dee2e6]/60 blur-[110px]"
        />
        <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
          <Reveal className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#dee2e6] bg-white px-3.5 py-2 text-xs font-bold tracking-[0.13em] text-[#495057]">
              <CircleAlert size={14} aria-hidden="true" />
              WHY CLIENTPILOT
            </p>
            <h1
              id="why-clientpilot-heading"
              className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.055em] text-[#212529] sm:text-5xl lg:text-[3.55rem]"
            >
              Client work is connected. Your tools should be too.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#495057] sm:text-lg sm:leading-8">
              Requests arrive in conversations. Tasks wait for follow-through.
              Dates need context. ClientPilot brings the pieces of delivery
              into one private workspace, so you can spend less time
              reconstructing the work and more time moving it forward.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#343a40] bg-[#343a40] px-6 text-sm font-semibold text-white shadow-sm shadow-[#343a40]/15 transition duration-200 hover:-translate-y-0.5 hover:border-[#212529] hover:bg-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30 motion-reduce:transform-none motion-reduce:transition-none"
              >
                Create your workspace
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#c6cbd1] bg-white px-6 text-sm font-semibold text-[#343a40] transition duration-200 hover:-translate-y-0.5 hover:border-[#6c757d] hover:bg-[#f1f3f5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 motion-reduce:transform-none motion-reduce:transition-none"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-[#495057]">
              <LockKeyhole size={16} aria-hidden="true" />
              Your workspace stays private to your account.
            </p>
          </Reveal>

          <Reveal className="relative" delay={0.08}>
            <div className="rounded-[1.5rem] border border-[#dee2e6] bg-white p-5 shadow-xl shadow-[#212529]/[0.06] sm:rounded-[2rem] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6c757d]">
                    THE CLIENT-DELIVERY THREAD
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#212529] sm:text-2xl">
                    One thing leads to the next.
                  </h2>
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f3f5] text-[#343a40]">
                  <ChartNoAxesColumnIncreasing size={20} aria-hidden="true" />
                </span>
              </div>
              <ol className="mt-6 space-y-3">
                {workflow.map(({ title, detail, icon: Icon }, index) => (
                  <li
                    key={title}
                    className="relative flex items-center gap-3 rounded-xl border border-[#dee2e6] bg-[#f8f9fa] p-3 sm:gap-4 sm:p-4"
                  >
                    {index < workflow.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-3 left-[1.35rem] z-10 h-3 w-px bg-[#adb5bd]"
                      />
                    ) : null}
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#dee2e6] bg-white text-[#343a40]">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#212529]">
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-[#495057] sm:text-sm">
                        {detail}
                      </p>
                    </div>
                    <span className="ml-auto shrink-0 text-[10px] font-bold tracking-[0.12em] text-[#6c757d]">
                      0{index + 1}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 border-t border-[#dee2e6] pt-4 text-sm leading-6 text-[#495057]">
                A clearer view of the work—without adding another layer to it.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="bg-white px-5 py-16 sm:px-8 sm:py-24"
        aria-labelledby="friction-heading"
      >
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            id="friction-heading"
            eyebrow="THE EVERYDAY FRICTION"
            title="Small gaps add up across a client relationship."
            description="When information and follow-through are spread around, the owner becomes the link between every detail. ClientPilot makes those connections easier to see."
          />
          <div className="mt-9 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-2">
            {frictionPoints.map(
              ({ icon: Icon, title, description, response }, index) => (
                <Reveal key={title} delay={index * 0.04} className="h-full">
                  <article className="group h-full rounded-2xl border border-[#dee2e6] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-[#adb5bd] hover:shadow-lg hover:shadow-[#212529]/[0.05] sm:p-6 motion-reduce:transform-none motion-reduce:transition-none">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-[#f1f3f5] text-[#343a40] transition-colors group-hover:bg-[#e9ecef]">
                        <Icon size={21} aria-hidden="true" />
                      </span>
                      <span className="text-xs font-bold tracking-[0.14em] text-[#6c757d]">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-[#212529]">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#495057]">
                      {description}
                    </p>
                    <p className="mt-4 border-t border-[#dee2e6] pt-4 text-sm font-medium leading-6 text-[#343a40]">
                      {response}
                    </p>
                  </article>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        className="border-y border-[#dee2e6] bg-[#f8f9fa] px-5 py-16 sm:px-8 sm:py-24"
        aria-labelledby="benefits-heading"
      >
        <div className="mx-auto grid grid-cols-1 max-w-7xl gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <SectionIntro
            id="benefits-heading"
            eyebrow="THE CLIENTPILOT APPROACH"
            title="One workspace. A more complete view."
            description="Keep the relationship and its delivery work together, from the first client record to the tasks that shape progress."
          />
          <Reveal className="rounded-2xl border border-[#dee2e6] bg-white p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  icon: UsersRound,
                  title: "Clients",
                  copy: "Keep contact and company context together.",
                },
                {
                  icon: Layers3,
                  title: "Projects",
                  copy: "See which work belongs to each relationship.",
                },
                {
                  icon: ListChecks,
                  title: "Tasks",
                  copy: "Follow work through To Do, In Progress, and Done.",
                },
                {
                  icon: CalendarDays,
                  title: "Deadlines & progress",
                  copy: "Review dates and progress grounded in task completion.",
                },
              ].map(({ icon: Icon, title, copy }) => (
                <article
                  key={title}
                  className="rounded-xl border border-[#dee2e6] bg-[#f8f9fa] p-4"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white text-[#343a40]">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-[#212529]">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#495057]">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="px-5 py-16 sm:px-8 sm:py-24"
        aria-labelledby="owner-heading"
      >
        <Reveal className="mx-auto grid max-w-7xl grid-cols-1 gap-6 rounded-[1.75rem] bg-[#212529] p-6 text-white sm:p-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12 lg:p-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ced4da]">
              DESIGNED AROUND THE OWNER
            </p>
            <h2
              id="owner-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl"
            >
              Your client relationships. Your private workspace.
            </h2>
          </div>
          <div>
            <p className="text-base leading-7 text-[#e9ecef] sm:text-lg sm:leading-8">
              ClientPilot is for the freelancer or small-agency owner doing the
              work. Your business clients are records in your workspace—they
              do not need a separate login or portal.
            </p>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/15 bg-white/[0.06] p-4">
              <LockKeyhole
                size={18}
                className="mt-0.5 shrink-0 text-[#dee2e6]"
                aria-hidden="true"
              />
              <p className="text-sm leading-6 text-[#e9ecef]">
                Backend authentication and ownership rules protect private
                workspace data.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <Reveal className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-[#dee2e6] bg-white px-6 py-10 sm:px-10 sm:py-12">
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c757d]">
                A CLEARER WAY TO WORK
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.05em] text-[#212529] sm:text-4xl">
                Keep the important parts of delivery in view.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#495057]">
                Discover the workflow, or create a private workspace for your
                client work.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/how-it-works"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#c6cbd1] bg-white px-4 text-sm font-semibold text-[#343a40] transition-colors hover:border-[#6c757d] hover:bg-[#f1f3f5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 motion-reduce:transition-none"
              >
                Explore how it works
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#343a40] bg-[#343a40] px-4 text-sm font-semibold text-white transition-colors hover:border-[#212529] hover:bg-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30 motion-reduce:transition-none"
              >
                Create your workspace
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
