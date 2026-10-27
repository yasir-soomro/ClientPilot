"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Compass, Layers3, ListChecks, ShieldCheck, Sparkles, Target, UsersRound } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const phrases = ["Organize client work.", "Move projects forward.", "Deliver with clarity."] as const;
const headingPhrases = ["a clearer home.", "a steadier rhythm.", "a better view."] as const;
const whyCards = [
  { icon: UsersRound, title: "Centralized client management", text: "Keep the people and work that matter together, so important context is easier to find when you need it." },
  { icon: Layers3, title: "Connected projects, tasks, and deadlines", text: "Make the relationship between a client, a project, and the next task visible from one dependable workspace." },
  { icon: ListChecks, title: "Progress you can see", text: "Turn a long list of responsibilities into a clearer view of what is moving, what is next, and what needs attention." },
] as const;
const principles = [
  { icon: Compass, title: "Simplicity over complexity", text: "The core workflow should feel natural: clients, projects, tasks, and progress without unnecessary layers." },
  { icon: Sparkles, title: "Clarity over clutter", text: "Useful information earns its place. The interface should help you decide what to do next, not compete for attention." },
  { icon: ShieldCheck, title: "Ownership with responsibility", text: "Your workspace is yours. ClientPilot keeps the owner’s records private and the delivery process accountable." },
] as const;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function useTypewriter(words: readonly string[], reduced: boolean) {
  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState<string>(words[0]);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let characterIndex = 0;
    let deleting = false;
    const tick = () => {
      if (cancelled) return;
      const word = words[wordIndex];
      if (!deleting) {
        characterIndex += 1;
        setTyped(word.slice(0, characterIndex));
        if (characterIndex === word.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1400);
          return;
        }
      } else {
        characterIndex -= 1;
        setTyped(word.slice(0, characterIndex));
        if (characterIndex === 0) {
          setWordIndex((current) => (current + 1) % words.length);
          return;
        }
      }
      timeoutId = setTimeout(tick, deleting ? 42 : 72);
    };
    timeoutId = setTimeout(tick, 600);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [reduced, wordIndex, words]);

  return reduced ? words[wordIndex] : typed;
}

function AmbientLayers({ reduced }: { reduced: boolean }) {
  const animation = reduced ? undefined : { x: [0, 18, 0], y: [0, -14, 0], scale: [1, 1.06, 1] };
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"><motion.div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" animate={animation} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} /><motion.div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-sky-300/15 blur-3xl" animate={reduced ? undefined : { x: [0, -20, 0], y: [0, 16, 0], scale: [1, 1.08, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} /></div>;
}

function Reveal({ children, className = "", delay = 0, reduced }: { children: ReactNode; className?: string; delay?: number; reduced: boolean }) {
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function SectionIntro({ eyebrow, title, copy, headingId, reduced }: { eyebrow: string; title: ReactNode; copy: string; headingId?: string; reduced: boolean }) {
  return <Reveal reduced={reduced} className="max-w-2xl"><p className="cp-eyebrow">{eyebrow}</p><h2 id={headingId} className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2><p className="mt-5 text-lg leading-8 text-slate-600">{copy}</p></Reveal>;
}

export function AboutExperience() {
  const reduced = useReducedMotion();
  const typedPhrase = useTypewriter(phrases, reduced);
  const typedHeading = useTypewriter(headingPhrases, reduced);

  return <div>
    <section aria-labelledby="about-heading" className="relative isolate overflow-hidden border-b border-slate-200/80 bg-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(99,102,241,0.12),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8faff_100%)]" /><AmbientLayers reduced={reduced} />
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:px-10 lg:py-28">
        <Reveal reduced={reduced} className="max-w-2xl">
          <p className="cp-eyebrow">ABOUT CLIENTPILOT</p>
          <h1 id="about-heading" className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-0.05em] text-slate-950 sm:text-6xl sm:leading-[1.02]">Bringing <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-sky-500 bg-clip-text text-transparent">clarity</span> to every client relationship.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">ClientPilot brings clients, projects, tasks, deadlines, and delivery progress into one private workspace—so owners can spend less time searching and more time moving work forward.</p>
          <div className="mt-7 flex min-h-8 items-center gap-3 text-sm font-semibold text-indigo-700" aria-live="polite"><span className="h-2 w-2 rounded-full bg-indigo-500" aria-hidden="true" /><span>{typedPhrase}</span><span className="h-5 w-px animate-pulse bg-indigo-400 motion-reduce:animate-none" aria-hidden="true" /></div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 motion-reduce:transform-none">Get started <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/how-it-works" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50/60 px-6 text-sm font-semibold text-indigo-800 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 motion-reduce:transform-none">See how it works</Link></div>
        </Reveal>
        <Reveal reduced={reduced} delay={0.1} className="relative"><div className="absolute -inset-5 rounded-[2rem] bg-indigo-100/60 blur-2xl" aria-hidden="true" /><div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-slate-100 p-2 shadow-2xl shadow-indigo-950/10"><Image src="/Collaborative Office Dashboard Meeting.png" alt="A team discussing client work around a laptop displaying a workspace dashboard." width={1536} height={1024} priority sizes="(max-width: 1024px) 100vw, 52vw" className="aspect-[4/3] w-full rounded-2xl object-cover" /><div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur sm:left-8 sm:right-8"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">One clear view</p><p className="mt-1 text-sm font-semibold text-slate-900">Clients · Projects · Tasks</p></div><CheckCircle2 className="text-indigo-600" size={22} aria-hidden="true" /></div></div></Reveal>
      </div>
    </section>

    <section className="relative isolate mx-auto max-w-7xl overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-10" aria-labelledby="story-heading"><AmbientLayers reduced={reduced} /><div className="relative z-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24"><SectionIntro reduced={reduced} headingId="story-heading" eyebrow="OUR STORY" title={<>The work behind the work deserves <span className="text-indigo-600">{typedHeading}</span></>} copy="Client relationships often start with good intentions, then spread across conversations, notes, task lists, and half-remembered follow-ups." /><Reveal reduced={reduced} className="space-y-6 text-lg leading-8 text-slate-600"><p>When client information is scattered, small details become difficult to find. Tasks get forgotten, deadlines become harder to see, and project progress starts to feel like something you have to reconstruct.</p><p>ClientPilot exists to bring that everyday owner workflow into one focused place. It keeps the connection between a client, their projects, and the tasks that move delivery forward easy to understand.</p></Reveal></div></section>

    <section className="relative isolate overflow-hidden border-y border-indigo-100 bg-indigo-50/60" aria-labelledby="mission-heading"><AmbientLayers reduced={reduced} /><div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-10"><Reveal reduced={reduced}><p className="cp-eyebrow">OUR MISSION</p><h2 id="mission-heading" className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">More clarity, less mental overhead.</h2></Reveal><Reveal reduced={reduced} delay={0.1}><p className="text-xl leading-9 text-slate-700">Our goal is to help freelancers and small agencies manage client work with greater clarity, organization, and confidence—without turning a simple delivery process into a complicated system.</p></Reveal></div></section>

    <section id="why-clientpilot" className="relative isolate mx-auto max-w-7xl overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-10" aria-labelledby="why-heading"><AmbientLayers reduced={reduced} /><div className="relative z-10"><SectionIntro reduced={reduced} headingId="why-heading" eyebrow="WHY CLIENTPILOT EXISTS" title="A calmer way to stay close to the details." copy="ClientPilot focuses on the parts of client delivery that need to stay connected and visible." /><div className="mt-12 grid gap-5 md:grid-cols-3">{whyCards.map((card, index) => { const Icon = card.icon; return <Reveal key={card.title} reduced={reduced} delay={index * 0.08} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5 motion-reduce:transform-none"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white" aria-hidden="true"><Icon size={22} /></div><h3 className="mt-7 text-xl font-semibold text-slate-950">{card.title}</h3><p className="mt-3 leading-7 text-slate-600">{card.text}</p></Reveal>; })}</div></div></section>

    <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white" aria-labelledby="principles-heading"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10"><div className="text-white"><p className="cp-eyebrow text-indigo-300">HOW WE THINK</p><h2 id="principles-heading" className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Principles for a product that stays useful.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Good tools should make the important things easier to see and the next action easier to choose.</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{principles.map((principle, index) => { const Icon = principle.icon; return <Reveal key={principle.title} reduced={reduced} delay={index * 0.08} className="rounded-3xl border border-white/15 bg-white/[0.07] p-7 shadow-xl shadow-indigo-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-indigo-300/40 hover:bg-white/[0.1] motion-reduce:transform-none"><Icon className="text-indigo-300" size={24} aria-hidden="true" /><h3 className="mt-8 text-xl font-semibold">{principle.title}</h3><p className="mt-3 leading-7 text-slate-300">{principle.text}</p></Reveal>; })}</div></div></section>

    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10" aria-labelledby="creator-heading"><div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20"><Reveal reduced={reduced} className="relative order-2 lg:order-1"><div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100 p-2 shadow-xl shadow-slate-900/10"><Image src="/Collaborative Office Dashboard Meeting.png" alt="People collaborating around a laptop in a shared work session." width={1536} height={1024} sizes="(max-width: 1024px) 100vw, 46vw" className="aspect-[4/3] w-full rounded-2xl object-cover" /></div><div className="absolute -bottom-5 -right-2 rounded-2xl border border-white bg-white px-5 py-4 shadow-xl shadow-slate-900/10 sm:right-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Created by</p><p className="mt-1 font-semibold text-slate-950">Muhammad Afzal Soomro</p></div></Reveal><Reveal reduced={reduced} className="order-1 lg:order-2"><p className="cp-eyebrow">MEET THE CREATOR</p><h2 id="creator-heading" className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">A product shaped around the owner’s view of delivery.</h2><p className="mt-6 text-lg leading-8 text-slate-600">ClientPilot is created by Muhammad Afzal Soomro. It is built around a straightforward idea: when the owner has a clear view of the work, they can make better decisions for every client relationship.</p><p className="mt-5 text-lg leading-8 text-slate-600">The product keeps that perspective at the center—practical, focused, and grounded in the details that make client work move forward.</p></Reveal></div></section>

    <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10" aria-labelledby="closing-heading"><Reveal reduced={reduced} className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-6 py-14 text-center shadow-2xl shadow-indigo-900/25 sm:px-12 sm:py-20"><Target className="mx-auto text-indigo-100" size={30} aria-hidden="true" /><h2 id="closing-heading" className="mx-auto mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Bring a clearer rhythm to your client work.</h2><p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-indigo-100">Start with the workflow you already understand, then keep every client, project, and task connected as the work grows.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-indigo-700 shadow-lg shadow-indigo-950/10 transition hover:-translate-y-0.5 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 motion-reduce:transform-none">Get started <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/how-it-works" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 motion-reduce:transform-none">See how it works</Link></div></Reveal></section>
  </div>;
}
