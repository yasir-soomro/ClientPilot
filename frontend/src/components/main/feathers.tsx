"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ListChecks,
  UsersRound,
} from "lucide-react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";

const features = [
  {
    icon: UsersRound,
    number: "01",
    label: "CLIENT CONTEXT",
    title: "Keep client details close to the work.",
    description:
      "Save contact and company information in one owner-managed record, ready to connect with the projects you deliver.",
  },
  {
    icon: BriefcaseBusiness,
    number: "02",
    label: "CONNECTED PROJECTS",
    title: "Know what belongs to each relationship.",
    description:
      "Link projects to your clients and keep project status and optional due dates with the work they describe.",
  },
  {
    icon: ListChecks,
    number: "03",
    label: "ACTIONABLE TASKS",
    title: "Make the next step easier to find.",
    description:
      "Break delivery into project tasks and move each one through To Do, In Progress, and Done.",
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    number: "04",
    label: "DELIVERY IN VIEW",
    title: "Understand progress from completed work.",
    description:
      "Review task-based project progress and keep due dates and overdue work visible in the workspace.",
  },
] as const;

export default function Features() {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="features"
        aria-labelledby="features-heading"
        className="scroll-mt-24 border-y border-[#dee2e6] bg-[#f8f9fa] px-5 py-16 sm:px-8 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-12">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#495057]">
                <span
                  className="h-px w-6 bg-[#6c757d]"
                  aria-hidden="true"
                />
                ONE CONNECTED WORKSPACE
              </p>
              <h2
                id="features-heading"
                className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.05em] text-[#212529] sm:text-4xl lg:text-5xl"
              >
                From client context to delivery progress.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#495057] sm:text-base sm:leading-8 lg:justify-self-end">
              Connect client context to project plans, actionable tasks, and
              deadlines in one clear view—without adding another complicated
              system to manage.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 xl:grid-cols-4">
            {features.map(
              ({ icon: Icon, number, label, title, description }, index) => (
                <motion.article
                  key={number}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={
                    reduceMotion ? undefined : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border p-5 transition-[border-color,background-color,box-shadow] duration-200 hover:shadow-[0_16px_38px_rgba(33,37,41,0.12)] sm:rounded-3xl sm:p-6 ${
                    index === 0
                      ? "border-[#495057] bg-[#343a40] text-white hover:border-[#adb5bd] hover:bg-[#2b3035]"
                      : "border-[#dee2e6] bg-white text-[#212529] hover:border-[#adb5bd]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`flex size-11 items-center justify-center rounded-xl border transition-colors duration-200 ${
                        index === 0
                          ? "border-[#6c757d] bg-[#495057] text-white group-hover:bg-[#6c757d]"
                          : "border-[#dee2e6] bg-[#f8f9fa] text-[#343a40] group-hover:bg-[#e9ecef]"
                      }`}
                    >
                      <Icon
                        aria-hidden="true"
                        size={21}
                        strokeWidth={1.8}
                      />
                    </span>
                    <span
                      className={`text-xs font-bold tracking-[0.14em] ${
                        index === 0 ? "text-[#ced4da]" : "text-[#6c757d]"
                      }`}
                    >
                      {number}
                    </span>
                  </div>
                  <p
                    className={`mt-6 text-[10px] font-bold tracking-[0.15em] ${
                      index === 0 ? "text-[#ced4da]" : "text-[#6c757d]"
                    }`}
                  >
                    {label}
                  </p>
                  <h3
                    className={`mt-2 text-lg font-semibold leading-snug tracking-[-0.025em] ${
                      index === 0 ? "text-white" : "text-[#212529]"
                    }`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`mt-3 flex-1 text-sm leading-6 ${
                      index === 0 ? "text-[#dee2e6]" : "text-[#495057]"
                    }`}
                  >
                    {description}
                  </p>
                </motion.article>
              ),
            )}
          </div>

          <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-[#dee2e6] bg-white p-5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f3f5] text-[#343a40]">
                <CalendarDays size={18} aria-hidden="true" />
              </span>
              <p className="max-w-2xl text-sm leading-6 text-[#495057]">
                Dates stay connected to projects and tasks, while project
                progress reflects completed tasks—not a guess at how work is
                going.
              </p>
            </div>
            <Link
              href="/how-it-works"
              className="group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-1 text-sm font-semibold text-[#343a40] transition-colors hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 motion-reduce:transition-none"
            >
              Explore the workflow
              <ArrowRight
                aria-hidden="true"
                size={16}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
              />
            </Link>
          </div>

          <div className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-sm leading-6 text-[#495057]">
              A private workspace for freelancers and small agencies.
            </p>
            <Link
              href="/register"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#343a40] bg-[#343a40] px-5 text-sm font-semibold text-white transition-colors hover:border-[#212529] hover:bg-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30 motion-reduce:transition-none"
            >
              Create your workspace
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
