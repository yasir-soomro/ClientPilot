"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  CircleHelp,
  Compass,
  ListChecks,
  LockKeyhole,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

const challenges = [
  {
    icon: UsersRound,
    title: "Client context gets scattered",
    description:
      "Contact details and company information end up across notes, inboxes, and conversations. A client record gives that context one dependable home.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Project relationships get fuzzy",
    description:
      "When work is disconnected from the client behind it, it takes extra effort to understand what is in motion and who it belongs to.",
  },
  {
    icon: ListChecks,
    title: "Progress is hard to reconstruct",
    description:
      "Mental to-do lists make it easy to lose the next step. Tasks and due dates make the work easier to review as it moves forward.",
  },
] as const;

const principles = [
  {
    icon: Compass,
    title: "Keep the workflow clear",
    description:
      "The core path is simple: client, project, tasks, progress. Each part should make the next part easier to follow.",
  },
  {
    icon: CircleHelp,
    title: "Make the useful details visible",
    description:
      "Status, due dates, and task completion help owners understand what is happening without adding unnecessary layers.",
  },
  {
    icon: LockKeyhole,
    title: "Keep ownership with the owner",
    description:
      "ClientPilot is a private workspace for the freelancer or agency owner. Business clients remain records, not account holders.",
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

export function AboutExperience() {
  return (
    <>
      <section
        aria-labelledby="about-heading"
        className="relative isolate overflow-hidden border-b border-[#dee2e6] bg-[#f8f9fa] px-5 py-14 sm:px-8 sm:py-20 lg:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 -top-40 -z-10 size-[34rem] rounded-full bg-[#dee2e6]/60 blur-[110px]"
        />
        <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#dee2e6] bg-white px-3.5 py-2 text-xs font-bold tracking-[0.13em] text-[#495057]">
              <Compass size={14} aria-hidden="true" />
              ABOUT CLIENTPILOT
            </p>
            <h1
              id="about-heading"
              className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.055em] text-[#212529] sm:text-5xl lg:text-[3.55rem]"
            >
              Make room for the work that matters.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#495057] sm:text-lg sm:leading-8">
              ClientPilot is a private workspace for freelancers and small
              agencies to keep client context, project work, tasks, and delivery
              progress connected.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#495057] sm:text-base">
              Less time piecing together what is happening. More clarity on
              what is moving and what comes next.
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
                Explore how it works
              </Link>
            </div>
          </Reveal>

          <Reveal className="relative" delay={0.08}>
            <div className="overflow-hidden rounded-[1.5rem] border border-[#dee2e6] bg-white p-2 shadow-xl shadow-[#212529]/[0.07] sm:rounded-[2rem] sm:p-3">
              <Image
                src="/Collaborative Office Dashboard Meeting.png"
                alt="Freelancers discussing client work around a laptop with a project dashboard."
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="aspect-[4/3] w-full rounded-[1.15rem] object-cover sm:rounded-[1.5rem]"
              />
              <div className="mx-1 mb-1 mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#dee2e6] bg-[#f8f9fa] px-3 py-3 sm:mx-2 sm:mb-2 sm:px-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6c757d]">
                    ONE CONNECTED WORKSPACE
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-[#343a40]">
                    Clients · Projects · Tasks · Progress
                  </p>
                </div>
                <ChartNoAxesColumnIncreasing
                  size={19}
                  className="shrink-0 text-[#495057]"
                  aria-hidden="true"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="bg-white px-5 py-16 sm:px-8 sm:py-24"
        aria-labelledby="purpose-heading"
      >
        <div className="mx-auto grid grid-cols-1 max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionIntro
            id="purpose-heading"
            eyebrow="THE PURPOSE"
            title="Client work should not live in your head."
            description="A client relationship brings details, decisions, deadlines, and follow-through. When those pieces live in different places, the owner has to keep reconnecting them."
          />
          <Reveal className="rounded-2xl border border-[#dee2e6] bg-[#f8f9fa] p-5 sm:p-7">
            <p className="text-base leading-7 text-[#343a40] sm:text-lg sm:leading-8">
              ClientPilot gives that everyday delivery work a clear structure:
              keep a client record, connect a project to it, organize the work
              into tasks, then review progress and due dates in context.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Client", "Keep relationship details"],
                ["Project", "Connect agreed work"],
                ["Tasks", "Follow each next step"],
              ].map(([label, detail], index) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#dee2e6] bg-white p-4"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6c757d]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-sm font-semibold text-[#212529]">
                    {label}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#495057]">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="border-y border-[#dee2e6] bg-[#f8f9fa] px-5 py-16 sm:px-8 sm:py-24"
        aria-labelledby="challenges-heading"
      >
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            id="challenges-heading"
            eyebrow="WHY IT EXISTS"
            title="A little more structure. A lot less searching."
            description="ClientPilot is shaped around the practical gaps that make small-scale client delivery harder to keep in view."
          />
          <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3 sm:mt-12">
            {challenges.map(({ icon: Icon, title, description }, index) => (
              <Reveal
                key={title}
                delay={index * 0.05}
                className="h-full"
              >
                <article className="group h-full rounded-2xl border border-[#dee2e6] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-[#adb5bd] hover:shadow-lg hover:shadow-[#212529]/[0.05] sm:p-6 motion-reduce:transform-none motion-reduce:transition-none">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#f1f3f5] text-[#343a40] transition-colors group-hover:bg-[#e9ecef]">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-[#212529]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#495057]">
                    {description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-5 py-16 sm:px-8 sm:py-24"
        aria-labelledby="mission-heading"
      >
        <Reveal className="mx-auto grid max-w-7xl grid-cols-1 gap-6 rounded-[1.75rem] bg-[#212529] p-6 text-white sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14 lg:p-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ced4da]">
              OUR MISSION
            </p>
            <h2
              id="mission-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl"
            >
              Help good client work move forward with clarity.
            </h2>
          </div>
          <div>
            <p className="text-base leading-7 text-[#e9ecef] sm:text-lg sm:leading-8">
              We believe the tools behind delivery should make the work easier
              to understand—not make a straightforward process feel like
              another project to manage.
            </p>
            <p className="mt-4 text-sm leading-6 text-[#ced4da] sm:text-base">
              ClientPilot focuses on the owner’s day-to-day view: what belongs
              to each client, which tasks are moving, and where deadlines sit.
            </p>
          </div>
        </Reveal>
      </section>

      <section
        className="border-y border-[#dee2e6] bg-[#f8f9fa] px-5 py-16 sm:px-8 sm:py-24"
        aria-labelledby="principles-heading"
      >
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            id="principles-heading"
            eyebrow="WHAT GUIDES THE PRODUCT"
            title="Useful by staying focused."
            description="The product is built around a small set of practical principles for organizing client-focused delivery."
          />
          <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3 sm:mt-12">
            {principles.map(({ icon: Icon, title, description }, index) => (
              <Reveal
                key={title}
                delay={index * 0.05}
                className="h-full"
              >
                <article className="h-full rounded-2xl border border-[#dee2e6] bg-white p-5 sm:p-6">
                  <Icon
                    size={22}
                    className="text-[#495057]"
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-lg font-semibold text-[#212529]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#495057]">
                    {description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-[#dee2e6] bg-white p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c757d]">
                BUILT FOR THE OWNER
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.05em] text-[#212529] sm:text-4xl">
                Your clients are people you work with—not another set of users
                to manage.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#495057]">
                ClientPilot is a private workspace for a freelancer or
                small-agency owner. Business clients stay as records in that
                owner’s workspace; they do not need a ClientPilot login.
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#343a40]">
                <Check size={16} aria-hidden="true" />
                Client and project data stays owner-scoped.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:min-w-52">
              <Link
                href="/how-it-works"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#c6cbd1] bg-white px-4 text-sm font-semibold text-[#343a40] transition-colors hover:border-[#6c757d] hover:bg-[#f1f3f5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 motion-reduce:transition-none"
              >
                How it works <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/why-clientpilot"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#c6cbd1] bg-[#f8f9fa] px-4 text-sm font-semibold text-[#343a40] transition-colors hover:border-[#6c757d] hover:bg-[#e9ecef] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 motion-reduce:transition-none"
              >
                Why ClientPilot <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <Reveal className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#343a40] px-6 py-12 text-center sm:px-12 sm:py-16">
          <CalendarDays
            size={24}
            className="mx-auto text-[#dee2e6]"
            aria-hidden="true"
          />
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Bring the moving parts of client work into one view.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#f1f3f5]">
            Start with a client, connect a project, and keep the next step
            visible.
          </p>
          <Link
            href="/register"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white bg-white px-6 text-sm font-semibold text-[#212529] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f1f3f5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 motion-reduce:transform-none motion-reduce:transition-none"
          >
            Create your workspace
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
