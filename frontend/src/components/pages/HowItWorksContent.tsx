"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  ListChecks,
  Sparkles,
  UsersRound,
} from "lucide-react";

const phrases = [
  "Keep every client detail close.",
  "Connect projects to the people behind them.",
  "See what is done and what is next.",
] as const;

const steps = [
  {
    number: "01",
    title: "Add Clients",
    description:
      "Keep names, contact details, and company information together in your private workspace.",
    detail:
      "Create a client record once, then use it as the starting point for the work you do together.",
    icon: UsersRound,
    accent: "from-blue-500 to-indigo-500",
    tint: "bg-blue-50 text-blue-700",
    preview: "Client details, in one place",
  },
  {
    number: "02",
    title: "Create Projects",
    description:
      "Connect each project to one of your clients, then set its status and due date.",
    detail:
      "Keep project context attached to the right client, with status and a due date when you need one.",
    icon: BriefcaseBusiness,
    accent: "from-indigo-500 to-violet-500",
    tint: "bg-indigo-50 text-indigo-700",
    preview: "Projects linked to clients",
  },
  {
    number: "03",
    title: "Organize Tasks",
    description:
      "Break a project into actionable tasks and move each one through To Do, In Progress, and Done.",
    detail:
      "Tasks live inside their project, so the next action stays connected to the work it supports.",
    icon: ListChecks,
    accent: "from-violet-500 to-sky-500",
    tint: "bg-violet-50 text-violet-700",
    preview: "To Do · In Progress · Done",
  },
  {
    number: "04",
    title: "Track Progress",
    description:
      "Review task-based project progress and keep overdue work visible in deadline views.",
    detail:
      "Progress reflects completed tasks. Projects without tasks start at 0%, and overdue items aren't silently hidden from deadline views.",
    icon: ChartNoAxesColumnIncreasing,
    accent: "from-sky-500 to-cyan-500",
    tint: "bg-sky-50 text-sky-700",
    preview: "A clearer view of delivery",
  },
] as const;

const features = [
  {
    icon: CircleCheck,
    eyebrow: "CONNECTED WORK",
    title: "Relationships that stay clear",
    description:
      "See how a client, their projects, and the tasks within each project fit together.",
  },
  {
    icon: CalendarDays,
    eyebrow: "DEADLINES IN CONTEXT",
    title: "Dates attached to the work",
    description:
      "Add optional due dates to projects and tasks, then review deadline items in your workspace.",
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    eyebrow: "VISIBLE PROGRESS",
    title: "Progress grounded in tasks",
    description:
      "Understand project progress from completed tasks, with a clear 0% starting point when there are no tasks.",
  },
] as const;

const faqs = [
  {
    question: "Do my clients need a ClientPilot account?",
    answer:
      "No. In V1, a client is a contact record in your private workspace. Only the workspace owner signs in.",
  },
  {
    question: "How is project progress calculated?",
    answer:
      "Progress is completed tasks divided by total tasks. A project with no tasks has 0% progress.",
  },
  {
    question: "Can I track deadlines and overdue work?",
    answer:
      "Projects and tasks can have due dates. Overdue items should remain visible in deadline views; the exact upcoming window is still being defined.",
  },
  {
    question: "What task statuses can I use?",
    answer:
      "Tasks move through To Do, In Progress, and Done. These are the V1 task statuses.",
  },
] as const;

function useTypewriter(reducedMotion: boolean) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState<string>(phrases[0]);
  const phraseIndexRef = useRef(0);
  const textRef = useRef<string>(phrases[0]);

  useEffect(() => {
    if (reducedMotion) return;

    let characterIndex = textRef.current.length;
    let deleting = characterIndex > 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = phrases[phraseIndexRef.current];

      if (deleting) {
        characterIndex = Math.max(0, characterIndex - 1);
        textRef.current = phrase.slice(0, characterIndex);
        setText(textRef.current);
        if (characterIndex === 0) {
          deleting = false;
          phraseIndexRef.current =
            (phraseIndexRef.current + 1) % phrases.length;
          setPhraseIndex(phraseIndexRef.current);
          timeout = setTimeout(tick, 350);
          return;
        }
      } else {
        characterIndex = Math.min(phrase.length, characterIndex + 1);
        textRef.current = phrase.slice(0, characterIndex);
        setText(textRef.current);
        if (characterIndex === phrase.length) {
          deleting = true;
          timeout = setTimeout(tick, 1600);
          return;
        }
      }

      timeout = setTimeout(tick, deleting ? 34 : 58);
    };

    timeout = setTimeout(tick, deleting ? 1900 : 350);

    return () => clearTimeout(timeout);
  }, [reducedMotion]);

  return reducedMotion ? phrases[phraseIndex] : text;
}

function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function HowItWorksContent() {
  const reducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const typedPhrase = useTypewriter(Boolean(reducedMotion));
  const active = steps[activeStep];
  const ActiveIcon = active.icon;

  function handleStepKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let nextIndex = activeStep;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (activeStep + 1) % steps.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (activeStep - 1 + steps.length) % steps.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = steps.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveStep(nextIndex);
    document.getElementById(`workflow-tab-${nextIndex}`)?.focus();
  }

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-indigo-100/80 bg-gradient-to-b from-white via-white to-indigo-50/60 px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 -top-32 -z-10 size-[34rem] rounded-full bg-indigo-200/35 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-40 -z-10 size-[30rem] rounded-full bg-sky-200/30 blur-[110px]"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3.5 py-2 text-xs font-bold tracking-[0.14em] text-indigo-700 shadow-sm shadow-indigo-950/[0.03]">
              <Sparkles size={14} aria-hidden="true" />
              A CLEARER WAY TO DELIVER
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-[3.55rem]">
              From client details to completed work.{" "}
              <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                All in one place.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              ClientPilot connects the people you work with to the projects,
              tasks, and deadlines that move delivery forward—without losing
              sight of what comes next.
            </p>
            <div
              className="mt-6 flex min-h-7 items-center gap-2.5 text-sm font-semibold text-indigo-700"
              aria-live="off"
              aria-atomic="true"
            >
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
              />
              <span>{typedPhrase}</span>
              <span
                aria-hidden="true"
                className="h-5 w-px animate-pulse bg-indigo-400 motion-reduce:animate-none"
              />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#343a40] bg-[#343a40] px-6 text-sm font-semibold text-white shadow-lg shadow-[#343a40]/20 transition duration-200 hover:-translate-y-0.5 hover:border-[#212529] hover:bg-[#212529] hover:shadow-xl hover:shadow-[#212529]/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30 motion-reduce:transform-none"
              >
                Get started <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#c6cbd1] bg-[#f3f4f5] px-6 text-sm font-semibold text-[#343a40] transition duration-200 hover:-translate-y-0.5 hover:border-[#6c757d] hover:bg-[#e9ecef] hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 motion-reduce:transform-none"
              >
                About ClientPilot
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
              <Check size={16} className="text-emerald-600" aria-hidden="true" />
              <span>A private workspace for your client work.</span>
            </div>
          </div>

          <SectionReveal className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-200/70 via-sky-100/70 to-violet-100/70 blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white p-2 shadow-2xl shadow-indigo-950/15 sm:rounded-[2rem] sm:p-3">
              <Image
                src="/ClientPilot Workflow Demo copy.png"
                alt="ClientPilot workflow: add clients, create projects, organize tasks, and track progress."
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="aspect-[3/2] w-full rounded-[1.15rem] object-cover sm:rounded-[1.5rem]"
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg shadow-slate-900/10 backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:rounded-2xl sm:px-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                    YOUR WORKFLOW
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-900 sm:text-base">
                    Client <span className="text-indigo-400">→</span> Project{" "}
                    <span className="text-indigo-400">→</span> Tasks{" "}
                    <span className="text-indigo-400">→</span> Progress
                  </p>
                </div>
                <ArrowDown
                  size={18}
                  className="shrink-0 -rotate-90 text-indigo-600"
                  aria-hidden="true"
                />
              </div>
            </div>
          </SectionReveal>
        </div>
        <Link
          href="#workflow"
          className="mx-auto mt-12 flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-slate-500 transition hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 sm:mt-16"
        >
          Explore the workflow
          <ArrowDown size={14} aria-hidden="true" />
        </Link>
      </section>

      <section
        id="workflow"
        className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
        aria-labelledby="workflow-heading"
      >
        <div className="mx-auto max-w-7xl">
          <SectionReveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              FOUR CONNECTED STEPS
            </p>
            <h2
              id="workflow-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl lg:text-5xl"
            >
              From first detail to finished delivery.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              Each part of the workflow builds on the one before it, keeping
              the details connected as your work moves forward.
            </p>
          </SectionReveal>

          <div className="relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div
              aria-hidden="true"
              className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-blue-200 via-indigo-300 to-sky-200 lg:block"
            />
            {steps.map(({ number, title, description, icon: Icon, tint }, index) => (
              <SectionReveal key={number} delay={index * 0.07} className="h-full">
                <article className="group relative h-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-950/[0.025] transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/[0.07] sm:p-7 motion-reduce:transform-none">
                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`flex size-14 items-center justify-center rounded-2xl ${tint} ring-4 ring-white transition duration-300 group-hover:scale-105`}
                    >
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-bold tracking-[0.16em] text-slate-300">
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-7 text-xl font-semibold tracking-tight text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {description}
                  </p>
                  {index < steps.length - 1 ? (
                    <ArrowRight
                      className="absolute -right-3 top-8 z-20 hidden rounded-full bg-white text-indigo-400 lg:block"
                      size={22}
                      aria-hidden="true"
                    />
                  ) : null}
                </article>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal className="mt-8">
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/80 px-5 py-5 text-center sm:flex-row sm:gap-3 sm:py-4">
              <span className="font-semibold text-indigo-900">Client</span>
              <ArrowRight size={16} className="hidden text-indigo-400 sm:block" aria-hidden="true" />
              <span className="font-semibold text-indigo-900">Project</span>
              <ArrowRight size={16} className="hidden text-indigo-400 sm:block" aria-hidden="true" />
              <span className="font-semibold text-indigo-900">Tasks</span>
              <ArrowRight size={16} className="hidden text-indigo-400 sm:block" aria-hidden="true" />
              <span className="font-semibold text-indigo-900">Progress</span>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section
        className="border-y border-slate-200/70 bg-gradient-to-b from-white to-indigo-50/40 px-5 py-20 sm:px-8 sm:py-24"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-7xl">
          <SectionReveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              BUILT AROUND YOUR WORK
            </p>
            <h2
              id="features-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl"
            >
              Helpful structure, without extra layers.
            </h2>
          </SectionReveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, eyebrow, title, description }, index) => (
              <SectionReveal key={title} delay={index * 0.07}>
                <article className="h-full rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/[0.06] sm:p-8 motion-reduce:transform-none">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <p className="mt-7 text-[10px] font-bold tracking-[0.16em] text-indigo-600">
                    {eyebrow}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {description}
                  </p>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-5 py-20 sm:px-8 sm:py-28"
        aria-labelledby="explorer-heading"
      >
        <div className="mx-auto max-w-7xl">
          <SectionReveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              WORKFLOW EXPLORER
            </p>
            <h2
              id="explorer-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl"
            >
              Take a closer look at each step.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Choose a step to see how it fits into your client delivery.
            </p>
          </SectionReveal>

          <SectionReveal className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-indigo-950/[0.06]">
            <div
              role="tablist"
              aria-label="ClientPilot workflow steps"
              onKeyDown={handleStepKeyDown}
              className="grid border-b border-slate-200 bg-slate-50/80 sm:grid-cols-2 lg:grid-cols-4"
            >
              {steps.map(({ number, title, icon: Icon }, index) => (
                <button
                  key={number}
                  id={`workflow-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={activeStep === index}
                  aria-controls="workflow-panel"
                  tabIndex={activeStep === index ? 0 : -1}
                  onClick={() => setActiveStep(index)}
                  className={`flex min-h-16 items-center gap-3 border-b-2 px-4 text-left transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#6c757d]/30 sm:px-5 ${
                    activeStep === index
                      ? "border-[#495057] bg-white text-[#343a40]"
                      : "border-transparent text-slate-500 hover:bg-white/70 hover:text-[#343a40]"
                  }`}
                >
                  <span className="text-xs font-bold tracking-wider text-gray-500">
                    {number}
                  </span>
                  <Icon size={18} aria-hidden="true" />
                  <span className="text-sm font-semibold">{title}</span>
                </button>
              ))}
            </div>
            <div
              id="workflow-panel"
              role="tabpanel"
              aria-labelledby={`workflow-tab-${activeStep}`}
              tabIndex={0}
              className="grid min-h-64 items-center gap-8 p-6 sm:p-9 lg:grid-cols-[0.75fr_1.25fr] lg:p-12"
            >
              <div>
                <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-600/20">
                  <ActiveIcon size={25} aria-hidden="true" />
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                  STEP {active.number}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {active.title}
                </h3>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-indigo-50/80 to-sky-50/70 p-6 sm:p-8">
                <p className="text-sm font-bold text-indigo-800">{active.preview}</p>
                <p className="mt-3 max-w-2xl text-base leading-8 text-slate-700">
                  {active.detail}
                </p>
                {activeStep === 2 ? (
                  <div className="mt-5 flex flex-wrap gap-2" aria-label="Task statuses">
                    {["To Do", "In Progress", "Done"].map((status) => (
                      <span
                        key={status}
                        className="rounded-full border border-white bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                ) : null}
                {activeStep === 3 ? (
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Clock3 size={16} className="text-indigo-600" aria-hidden="true" />
                    Overdue items remain visible in deadline views.
                  </div>
                ) : null}
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section
        className="border-y border-slate-200/70 bg-slate-50/70 px-5 py-20 sm:px-8 sm:py-24"
        aria-labelledby="faq-heading"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <SectionReveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              GOOD TO KNOW
            </p>
            <h2
              id="faq-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl"
            >
              A few quick answers.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
              The essentials about how your client delivery workflow fits
              together.
            </p>
          </SectionReveal>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map(({ question, answer }, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={question} className="py-1">
                  <h3>
                    <button
                      id={`faq-question-${index}`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold text-slate-900 transition hover:text-[#343a40] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 sm:text-lg"
                    >
                      {question}
                      <ChevronDown
                        size={20}
                        className={`shrink-0 text-[#495057] transition-transform duration-200 motion-reduce:transition-none ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    hidden={!isOpen}
                    className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-slate-600 sm:text-base"
                  >
                    {answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <SectionReveal className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 px-6 py-14 text-center shadow-2xl shadow-indigo-900/20 sm:px-12 sm:py-20">
          <Sparkles
            size={28}
            className="mx-auto text-indigo-100"
            aria-hidden="true"
          />
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Ready to bring your client work together?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-indigo-100 sm:text-lg">
            Start with a client, connect a project, and keep the next task in
            view.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-indigo-700 shadow-lg shadow-indigo-950/10 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 motion-reduce:transform-none"
          >
            Create your account <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </SectionReveal>
      </section>
    </>
  );
}
