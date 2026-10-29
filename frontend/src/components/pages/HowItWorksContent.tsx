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
  ChevronDown,
  CircleCheck,
  Clock3,
  ListChecks,
  LockKeyhole,
  Sparkles,
  UsersRound,
} from "lucide-react";

const phrases = [
  "Client context, kept close.",
  "Projects, connected to people.",
  "Delivery progress, easy to follow.",
] as const;

const steps = [
  {
    number: "01",
    title: "Add a client",
    description:
      "Save the contact and company details you need in one private client record.",
    detail:
      "Start with the client relationship. The record gives their project work a clear place to belong.",
    preview: "A home for client context",
    icon: UsersRound,
  },
  {
    number: "02",
    title: "Create a project",
    description:
      "Link the project to its client, set a status, and add an optional due date.",
    detail:
      "Keep each piece of work connected to the client behind it, with status and timing visible together.",
    preview: "Work stays with the right client",
    icon: BriefcaseBusiness,
  },
  {
    number: "03",
    title: "Break work into tasks",
    description:
      "Turn a project into manageable tasks and update them as work moves ahead.",
    detail:
      "Tasks stay inside their project. Move each one from To Do to In Progress and then Done as delivery continues.",
    preview: "Make the next action clear",
    icon: ListChecks,
  },
  {
    number: "04",
    title: "Review delivery",
    description:
      "See progress from completed tasks and keep upcoming or overdue work in view.",
    detail:
      "Project progress is based on completed tasks. Projects with no tasks start at 0%, and overdue work is not hidden from deadline views.",
    preview: "A grounded view of progress",
    icon: CircleCheck,
  },
] as const;

const faqs = [
  {
    question: "Do clients need their own ClientPilot account?",
    answer:
      "No. In V1, your business clients are records in your private workspace. Only the workspace owner signs in.",
  },
  {
    question: "How is project progress calculated?",
    answer:
      "Progress is completed tasks divided by total tasks. A project with no tasks has 0% progress.",
  },
  {
    question: "Can I keep track of due dates?",
    answer:
      "Projects and tasks can have due dates. Overdue items remain visible in deadline views.",
  },
  {
    question: "Which task statuses are available?",
    answer:
      "Tasks use three statuses: To Do, In Progress, and Done. Update a task as it moves through your delivery work.",
  },
] as const;

function useTypewriter(reducedMotion: boolean) {
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
      characterIndex = deleting
        ? Math.max(0, characterIndex - 1)
        : Math.min(phrase.length, characterIndex + 1);
      textRef.current = phrase.slice(0, characterIndex);
      setText(textRef.current);

      if (deleting && characterIndex === 0) {
        deleting = false;
        phraseIndexRef.current = (phraseIndexRef.current + 1) % phrases.length;
        timeout = setTimeout(tick, 300);
      } else if (!deleting && characterIndex === phrase.length) {
        deleting = true;
        timeout = setTimeout(tick, 1500);
      } else {
        timeout = setTimeout(tick, deleting ? 30 : 52);
      }
    };

    timeout = setTimeout(tick, 1800);
    return () => clearTimeout(timeout);
  }, [reducedMotion]);

  return reducedMotion ? phrases[0] : text;
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
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function HowItWorksContent() {
  const reducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const active = steps[activeStep];
  const ActiveIcon = active.icon;
  const typedPhrase = useTypewriter(Boolean(reducedMotion));

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
      <section className="relative isolate overflow-hidden border-b border-[#dee2e6] bg-[#f8f9fa] px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 -top-40 -z-10 size-[34rem] rounded-full bg-[#dee2e6]/55 blur-[110px]"
        />
        <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#dee2e6] bg-white px-3.5 py-2 text-xs font-bold tracking-[0.13em] text-[#495057]">
              <Sparkles size={14} aria-hidden="true" />
              CLIENT WORK, IN CONTEXT
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.055em] text-[#212529] sm:text-5xl lg:text-[3.55rem]">
              A clear path from client brief to finished delivery.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#495057] sm:text-lg sm:leading-8">
              ClientPilot connects your client records to projects, tasks, and
              due dates, so you can see how the work is moving and what needs
              attention next.
            </p>
            <div className="mt-6 flex min-h-7 items-center gap-2.5 text-sm font-semibold text-[#495057]">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-[#495057]"
              />
              <span aria-hidden="true">{typedPhrase}</span>
              <span className="sr-only">
                Keep client context, projects, and delivery progress together.
              </span>
              <span
                aria-hidden="true"
                className="h-5 w-px animate-pulse bg-[#6c757d] motion-reduce:animate-none"
              />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#343a40] bg-[#343a40] px-6 text-sm font-semibold text-white shadow-sm shadow-[#343a40]/15 transition duration-200 hover:-translate-y-0.5 hover:border-[#212529] hover:bg-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30 motion-reduce:transform-none motion-reduce:transition-none"
              >
                Create your workspace <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="#workflow"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#c6cbd1] bg-white px-6 text-sm font-semibold text-[#343a40] transition duration-200 hover:-translate-y-0.5 hover:border-[#6c757d] hover:bg-[#f1f3f5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 motion-reduce:transform-none motion-reduce:transition-none"
              >
                See the four steps <ArrowDown size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-[#495057]">
              <LockKeyhole
                size={16}
                className="shrink-0 text-[#495057]"
                aria-hidden="true"
              />
              Your workspace is private to your account.
            </p>
          </div>

          <SectionReveal className="relative">
            <div className="overflow-hidden rounded-[1.5rem] border border-[#dee2e6] bg-white p-2 shadow-xl shadow-[#212529]/[0.07] sm:rounded-[2rem] sm:p-3">
              <Image
                src="/ClientPilot Workflow Demo copy.png"
                alt="ClientPilot workflow showing client records connected to projects, tasks, and delivery progress."
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="aspect-[3/2] w-full rounded-[1.15rem] object-cover sm:rounded-[1.5rem]"
              />
              <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-4 sm:px-5 sm:pb-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6c757d]">
                    THE WORKFLOW
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-[#343a40] sm:text-base">
                    A connected view from start to finish
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="shrink-0 text-[#495057]"
                  aria-hidden="true"
                />
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section
        id="workflow"
        className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-24"
        aria-labelledby="workflow-heading"
      >
        <div className="mx-auto max-w-7xl">
          <SectionReveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c757d]">
              FOUR CONNECTED STEPS
            </p>
            <h2
              id="workflow-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#212529] sm:text-4xl lg:text-5xl"
            >
              Keep the work connected as it moves.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#495057] sm:text-lg">
              Start with the client, build a project around the work, then use
              tasks and due dates to follow delivery.
            </p>
          </SectionReveal>

          <ol className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {steps.map(({ number, title, description, icon: Icon }, index) => (
              <li key={number} className="h-full">
                <SectionReveal delay={index * 0.05} className="h-full">
                  <article className="group h-full rounded-2xl border border-[#dee2e6] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-[#adb5bd] hover:shadow-lg hover:shadow-[#212529]/[0.06] sm:p-6 motion-reduce:transform-none motion-reduce:transition-none">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-[#f1f3f5] text-[#343a40] transition-colors group-hover:bg-[#e9ecef]">
                        <Icon size={21} aria-hidden="true" />
                      </span>
                      <span className="text-xs font-bold tracking-[0.14em] text-[#6c757d]">
                        {number}
                      </span>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-[#212529]">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#495057]">
                      {description}
                    </p>
                  </article>
                </SectionReveal>
              </li>
            ))}
          </ol>
          <SectionReveal className="mt-6">
            <div
              aria-label="Client, then project, then tasks, then progress"
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#dee2e6] bg-[#f8f9fa] px-5 py-4 text-center sm:flex-row sm:gap-4"
            >
              {["Client", "Project", "Tasks", "Progress"].map((item, index) => (
                <div key={item} className="flex items-center gap-4">
                  {index > 0 ? (
                    <ArrowRight
                      size={15}
                      className="hidden text-[#6c757d] sm:block"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="text-sm font-semibold text-[#343a40]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      <section
        className="border-y border-[#dee2e6] bg-[#f8f9fa] px-5 py-16 sm:px-8 sm:py-24"
        aria-labelledby="explorer-heading"
      >
        <div className="mx-auto max-w-7xl">
          <SectionReveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c757d]">
              EXPLORE THE DETAILS
            </p>
            <h2
              id="explorer-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#212529] sm:text-4xl"
            >
              See what each step brings together.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#495057]">
              Choose a stage to see how its details support the work that
              follows.
            </p>
          </SectionReveal>

          <SectionReveal className="mt-9 overflow-hidden rounded-2xl border border-[#dee2e6] bg-white shadow-lg shadow-[#212529]/[0.04] sm:mt-12">
            <div
              role="tablist"
              aria-label="ClientPilot workflow steps"
              onKeyDown={handleStepKeyDown}
              className="grid grid-cols-2 border-b border-[#dee2e6] bg-[#f8f9fa] lg:grid-cols-4"
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
                  className={`flex min-h-14 items-center gap-2 border-b-2 px-3 text-left transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#6c757d]/30 sm:min-h-16 sm:gap-3 sm:px-5 ${
                    activeStep === index
                      ? "border-[#343a40] bg-white text-[#212529]"
                      : "border-transparent text-[#495057] hover:bg-white hover:text-[#212529]"
                  }`}
                >
                  <span className="text-[10px] font-bold tracking-wider text-[#6c757d] sm:text-xs">
                    {number}
                  </span>
                  <Icon
                    size={17}
                    className="hidden shrink-0 sm:block"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold sm:text-sm">
                    {title}
                  </span>
                </button>
              ))}
            </div>
            <div
              id="workflow-panel"
              role="tabpanel"
              aria-labelledby={`workflow-tab-${activeStep}`}
              tabIndex={0}
              className="grid grid-cols-1 min-h-64 items-center gap-7 p-5 sm:p-8 lg:grid-cols-[0.75fr_1.25fr] lg:p-10"
            >
              <motion.div
                key={activeStep}
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.22 }}
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-[#343a40] text-white">
                  <ActiveIcon size={22} aria-hidden="true" />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-[#6c757d]">
                  STEP {active.number}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#212529] sm:text-3xl">
                  {active.title}
                </h3>
              </motion.div>
              <div className="rounded-xl border border-[#dee2e6] bg-[#f8f9fa] p-5 sm:p-7">
                <p className="text-sm font-bold text-[#343a40]">
                  {active.preview}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#495057] sm:text-base">
                  {active.detail}
                </p>
                {activeStep === 0 ? (
                  <div className="mt-5 grid gap-3 rounded-lg border border-[#dee2e6] bg-white p-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#6c757d]">
                        CLIENT
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#343a40]">
                        Contact details
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#6c757d]">
                        COMPANY
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#343a40]">
                        Relationship context
                      </p>
                    </div>
                  </div>
                ) : null}
                {activeStep === 1 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-lg border border-[#dee2e6] bg-white px-3 py-2 text-xs font-semibold text-[#343a40]">
                      Linked client
                    </span>
                    <span className="rounded-lg border border-[#dee2e6] bg-white px-3 py-2 text-xs font-semibold text-[#343a40]">
                      Project status
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#dee2e6] bg-white px-3 py-2 text-xs font-semibold text-[#343a40]">
                      <CalendarDays size={14} aria-hidden="true" />
                      Optional due date
                    </span>
                  </div>
                ) : null}
                {activeStep === 2 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["To Do", "In Progress", "Done"].map((status) => (
                      <span
                        key={status}
                        className="rounded-lg border border-[#dee2e6] bg-white px-3 py-2 text-xs font-semibold text-[#343a40]"
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                ) : null}
                {activeStep === 3 ? (
                  <div className="mt-5 rounded-lg border border-[#dee2e6] bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#343a40]">
                        Example: 2 of 3 tasks complete
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#495057]">
                        <Clock3 size={14} aria-hidden="true" />
                        Due dates stay in view
                      </span>
                    </div>
                    <div
                      role="img"
                      aria-label="Example project progress: two of three tasks complete"
                      className="mt-3 h-2 overflow-hidden rounded-full bg-[#e9ecef]"
                    >
                      <div className="h-full w-2/3 rounded-full bg-[#495057]" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section
        className="bg-white px-5 py-16 sm:px-8 sm:py-24"
        aria-labelledby="faq-heading"
      >
        <div className="mx-auto grid grid-cols-1 max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <SectionReveal>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c757d]">
              GOOD TO KNOW
            </p>
            <h2
              id="faq-heading"
              className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#212529] sm:text-4xl"
            >
              A few quick answers.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-[#495057]">
              The essentials about your workspace and the way delivery progress
              is shown.
            </p>
          </SectionReveal>
          <div className="divide-y divide-[#dee2e6] border-y border-[#dee2e6]">
            {faqs.map(({ question, answer }, index) => (
              <details key={question} className="group py-1" open={index === 0}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-semibold text-[#212529] transition-colors hover:text-[#495057] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 sm:text-lg [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown
                    size={20}
                    className="shrink-0 text-[#495057] transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-[#495057] sm:text-base">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <SectionReveal className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#212529] px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ced4da]">
            READY WHEN YOU ARE
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Bring the moving parts of client work into one view.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#e9ecef]">
            Connect a client to a project, organize the tasks, and keep delivery
            progress clear.
          </p>
          <Link
            href="/register"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white bg-white px-6 text-sm font-semibold text-[#212529] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f1f3f5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 motion-reduce:transform-none motion-reduce:transition-none"
          >
            Create your workspace <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </SectionReveal>
      </section>
    </>
  );
}
