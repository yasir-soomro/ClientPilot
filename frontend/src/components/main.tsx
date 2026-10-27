
// "use client"


// import type { Metadata } from "next";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   ArrowDownRight,
//   ArrowRight,
//   BriefcaseBusiness,
//   Check,
//   ChevronRight,
//   ShieldCheck,
//   Sparkles,
//   Users,
// } from "lucide-react";
// import { BrandMark } from "@/components/ui/brand-mark";

// export const metadata: Metadata = {
//   title: "ClientPilot | A calmer way to manage client work",
//   description:
//     "Manage clients, projects, tasks, and delivery progress in one organized, private workspace built for freelancers and small agencies.",
//   alternates: { canonical: "/" },
//   openGraph: {
//     title: "ClientPilot | A calmer way to manage client work",
//     description:
//       "Keep client relationships, projects, and everyday work organized in one private workspace.",
//     url: "/",
//     type: "website",
//   },
// };

// const features = [
//   {
//     number: "01",
//     icon: Users,
//     title: "Know every client",
//     description:
//       "Keep client details and related work together, so important context is always easy to find.",
//   },
//   {
//     number: "02",
//     icon: BriefcaseBusiness,
//     title: "Move projects forward",
//     description:
//       "Organize projects, manage tasks, and see what needs your attention next.",
//   },
//   {
//     number: "03",
//     icon: ShieldCheck,
//     title: "Work in your own space",
//     description:
//       "Keep your workspace private. Your clients can remain records without needing their own accounts.",
//   },
// ];

// const benefits = [
//   "Clients and projects in one place",
//   "A clearer view of your next steps",
//   "A private workspace for your business",
// ];

// export default function Main() {
//   return (
//     <main className="min-h-screen overflow-hidden bg-[#fcfcff] text-[#17182b]">
//       {/* Navigation */}
//       <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
//         <nav
//           aria-label="Main navigation"
//           className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:h-[76px] sm:px-8 lg:px-10"
//         >
//           <Link
//             href="/"
//             aria-label="ClientPilot home"
//             className="group flex shrink-0 items-center gap-2.5"
//           >
//             <span className="transition-transform duration-300 group-hover:scale-105">
//               <BrandMark />
//             </span>
//             <span className="text-[16px] font-bold tracking-[-0.7px]">
//               ClientPilot
//             </span>
//           </Link>

//           <div className="flex items-center gap-1.5 sm:gap-4">
//             <Link
//               href="/login"
//               className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 sm:px-4"
//             >
//               {/* Sign in */}
//             </Link>

//             <Link
//               href="/register"
//               className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3.5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(79,70,229,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25 sm:min-h-11 sm:px-4 sm:text-sm"
//             >
//               Get started
//               <ArrowRight
//                 aria-hidden="true"
//                 size={15}
//                 className="transition-transform duration-200 group-hover:translate-x-0.5"
//               />
//             </Link>
//           </div>
//         </nav>
//       </header>

//       {/* Hero */}
//       <section
//         aria-labelledby="hero-heading"
//         className="relative isolate border-b border-slate-200/60"
//       >
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
//         >
//           <div className="hero-grid absolute inset-0 opacity-40" />
//           <div className="absolute -top-40 left-1/2 h-[440px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-[100px] sm:h-[550px] sm:w-[850px]" />
//           <div className="absolute -right-32 top-52 h-72 w-72 rounded-full bg-violet-200/25 blur-[90px]" />
//           <div className="absolute -left-40 bottom-0 h-72 w-72 rounded-full bg-sky-200/25 blur-[90px]" />
//         </div>

//         <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:px-10 lg:pb-24 lg:pt-24">
//           {/* Hero copy */}
//           <div className="animate-fade-up relative z-10 mx-auto w-full max-w-2xl lg:mx-0">
//             <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3.5 py-2 text-[11px] font-semibold tracking-[0.01em] text-indigo-700 shadow-[0_2px_10px_rgba(40,40,100,0.04)] sm:text-xs">
//               <Sparkles
//                 aria-hidden="true"
//                 size={14}
//                 className="shrink-0 text-indigo-500"
//               />
//               A better way to manage client work
//               <span
//                 aria-hidden="true"
//                 className="hidden text-indigo-300 sm:inline"
//               >
//                 /
//               </span>
//               <span className="hidden text-slate-500 sm:inline">
//                 Built for small teams
//               </span>
//             </div>

//             <h1
//               id="hero-heading"
//               className="mt-7 max-w-[650px] text-[clamp(2.65rem,7vw,4.85rem)] font-bold leading-[1.04] tracking-[-0.075em] text-[#191a32] sm:mt-8"
//             >
//               Less chasing.
//               <br />
//               More{" "}
//               <span className="relative inline-block text-indigo-600">
//                 getting work
//                 <span className="sr-only"> and projects completed.</span>
//               </span>
//               <br />
//               <span className="text-slate-400">done.</span>
//             </h1>

//             <p className="mt-6 max-w-[490px] text-[15px] leading-7 text-slate-600 sm:mt-7 sm:text-[17px] sm:leading-8">
//               Client details, projects, and tasks — all in one place. Stay
//               organized, know what comes next, and spend more time doing your
//               best work.
//             </p>

//             <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row sm:mt-9">
//               <Link
//                 href="/register"
//                 className="group inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(79,70,229,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-[0_14px_30px_rgba(79,70,229,0.27)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25 sm:min-h-[54px] sm:px-6"
//               >
//                 Create your workspace
//                 <ArrowRight
//                   aria-hidden="true"
//                   size={17}
//                   className="transition-transform duration-200 group-hover:translate-x-1"
//                 />
//               </Link>

//               <Link
//                 href="#features"
//                 className="group inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/85 px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-white hover:text-indigo-700 sm:min-h-[54px] sm:px-5"
//               >
//                 Explore features
//                 <ArrowDownRight
//                   aria-hidden="true"
//                   size={16}
//                   className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
//                 />
//               </Link>
//             </div>

//             <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 sm:mt-7 sm:gap-x-5">
//               <span className="inline-flex items-center gap-1.5">
//                 <Check
//                   aria-hidden="true"
//                   size={14}
//                   className="text-emerald-600"
//                 />
//                 Private workspace
//               </span>
//               <span className="inline-flex items-center gap-1.5">
//                 <Check
//                   aria-hidden="true"
//                   size={14}
//                   className="text-emerald-600"
//                 />
//                 No client accounts required
//               </span>
//             </div>

//             <div className="mt-10 hidden items-center gap-3 border-t border-slate-200/80 pt-6 sm:flex lg:mt-12">
//               <div className="flex -space-x-2">
//                 <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#fcfcff] bg-indigo-100 text-[11px] font-bold text-indigo-700">
//                   C
//                 </span>
//                 <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#fcfcff] bg-sky-100 text-[11px] font-bold text-sky-700">
//                   P
//                 </span>
//                 <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#fcfcff] bg-violet-100 text-[11px] font-bold text-violet-700">
//                   T
//                 </span>
//               </div>
//               <div>
//                 <p className="text-xs font-semibold text-slate-700">
//                   Made for client-focused work
//                 </p>
//                 <p className="mt-1 text-xs text-slate-500">
//                   Freelancers and small agencies
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Dashboard preview */}
//           <div className="animate-fade-up-delay relative mx-auto w-full max-w-[650px] lg:ml-auto lg:mr-0">
//             <div
//               aria-hidden="true"
//               className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-indigo-200/50 via-violet-100/30 to-sky-100/50 blur-2xl sm:-inset-7"
//             />

//             <div className="relative rounded-[22px] border border-white/90 bg-white/80 p-2 shadow-[0_30px_90px_rgba(38,39,84,0.13),0_5px_20px_rgba(38,39,84,0.05)] backdrop-blur-xl sm:rounded-[28px] sm:p-3">
//               <div className="overflow-hidden rounded-[15px] border border-slate-200/80 bg-white sm:rounded-[20px]">
//                 <div className="flex h-10 items-center justify-between border-b border-slate-100 bg-white px-3 sm:h-12 sm:px-5">
//                   <div className="flex items-center gap-2">
//                     <span className="size-2 rounded-full bg-rose-400" />
//                     <span className="size-2 rounded-full bg-amber-400" />
//                     <span className="size-2 rounded-full bg-emerald-400" />
//                   </div>
//                   <span className="text-[9px] font-semibold tracking-[0.04em] text-slate-400 sm:text-[10px]">
//                     CLIENTPILOT WORKSPACE
//                   </span>
//                   <div className="size-5 rounded-md bg-slate-100 sm:size-6" />
//                 </div>

//                 <Image
//                   src="/ClientPilot.png"
//                   alt="ClientPilot dashboard preview showing the client work management interface."
//                   width={1536}
//                   height={1024}
//                   sizes="(max-width: 639px) calc(100vw - 56px), (max-width: 1023px) calc(100vw - 80px), 620px"
//                   priority
//                   className="h-auto w-full object-cover object-top"
//                 />
//               </div>

//               <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3 sm:px-3 sm:pb-2 sm:pt-4">
//                 <div className="flex min-w-0 items-center gap-2.5">
//                   <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:size-9">
//                     <BriefcaseBusiness aria-hidden="true" size={17} />
//                   </span>
//                   <div className="min-w-0">
//                     <p className="truncate text-xs font-bold text-slate-800 sm:text-sm">
//                       Your work, organized
//                     </p>
//                     <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
//                       Clients, projects and next steps
//                     </p>
//                   </div>
//                 </div>
//                 <span className="shrink-0 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700 sm:px-2.5 sm:text-[10px]">
//                   One workspace
//                 </span>
//               </div>
//             </div>

//             <div
//               aria-hidden="true"
//               className="pointer-events-none absolute -bottom-5 -left-2 hidden h-20 w-20 rounded-full border border-white/80 bg-gradient-to-br from-indigo-200/40 to-sky-200/20 blur-[1px] sm:block lg:-left-6"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section
//         id="features"
//         aria-labelledby="features-heading"
//         className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
//       >
//         <div
//           aria-hidden="true"
//           className="absolute right-12 top-20 hidden size-28 rounded-full border border-indigo-100/80 lg:block"
//         />

//         <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
//           <div className="max-w-2xl">
//             <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
//               Everything in its place
//             </p>
//             <h2
//               id="features-heading"
//               className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.13] tracking-[-0.06em] text-[#191a32]"
//             >
//               A little more clarity.
//               <br className="hidden sm:block" /> A lot less busywork.
//             </h2>
//           </div>

//           <p className="max-w-md text-sm leading-7 text-slate-600 sm:text-base sm:leading-7 md:pb-1">
//             Everything you need to keep client work moving, without making
//             managing your work another job.
//           </p>
//         </div>

//         <div className="mt-9 grid gap-4 sm:mt-12 md:grid-cols-3 md:gap-5">
//           {features.map(({ number, icon: Icon, title, description }) => (
//             <article
//               key={title}
//               className="group relative flex min-h-[225px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_3px_15px_rgba(25,30,60,0.025)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_40px_rgba(33,39,84,0.07)] sm:min-h-[245px] sm:rounded-[22px] sm:p-7"
//             >
//               <div className="flex items-start justify-between">
//                 <span className="flex size-12 items-center justify-center rounded-[15px] bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white">
//                   <Icon
//                     aria-hidden="true"
//                     size={21}
//                     strokeWidth={1.8}
//                   />
//                 </span>
//                 <span className="pt-1 text-xs font-semibold tracking-[0.1em] text-slate-300">
//                   {number}
//                 </span>
//               </div>

//               <h3 className="mt-7 text-[17px] font-bold tracking-[-0.4px] text-slate-900">
//                 {title}
//               </h3>
//               <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
//                 {description}
//               </p>

//               <span
//                 aria-hidden="true"
//                 className="pointer-events-none absolute -bottom-12 -right-10 size-32 rounded-full bg-indigo-50/0 transition-colors duration-300 group-hover:bg-indigo-50/80"
//               />
//             </article>
//           ))}
//         </div>

//         {/* Benefits */}
//         <div className="mt-12 rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/60 p-5 sm:mt-16 sm:rounded-[24px] sm:p-8 lg:p-10">
//           <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
//             <div className="max-w-md">
//               <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
//                 Built around your workflow
//               </p>
//               <h3 className="mt-3 text-2xl font-bold tracking-[-0.05em] text-[#191a32] sm:text-[28px]">
//                 Focus on the work that matters.
//               </h3>
//               <p className="mt-3 text-sm leading-6 text-slate-600">
//                 Keep the important details close, understand what needs
//                 attention, and make your daily workflow easier to manage.
//               </p>
//             </div>

//             <div className="flex flex-col gap-4 sm:min-w-[300px]">
//               {benefits.map((benefit) => (
//                 <div key={benefit} className="flex items-start gap-3">
//                   <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
//                     <Check aria-hidden="true" size={12} strokeWidth={2.5} />
//                   </span>
//                   <span className="text-sm font-medium text-slate-700">
//                     {benefit}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <Link
//               href="/register"
//               className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-indigo-200 bg-white px-4 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-600 hover:text-white lg:self-center"
//             >
//               Get started
//               <ChevronRight
//                 aria-hidden="true"
//                 size={16}
//                 className="transition-transform duration-200 group-hover:translate-x-0.5"
//               />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section
//         aria-labelledby="cta-heading"
//         className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24"
//       >
//         <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[26px] bg-[#191a32] px-6 py-12 sm:rounded-[30px] sm:px-10 sm:py-16 lg:px-16 lg:py-[76px]">
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0 overflow-hidden"
//           >
//             <div className="absolute -right-16 -top-44 size-[350px] rounded-full bg-indigo-500/25 blur-[90px] sm:size-[480px]" />
//             <div className="absolute -bottom-48 left-[20%] size-[300px] rounded-full bg-violet-500/15 blur-[90px]" />
//             <div className="absolute inset-0 bg-gradient-to-r from-[#191a32] via-[#202044]/90 to-transparent" />
//           </div>

//           <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center lg:gap-12">
//             <div className="max-w-2xl">
//               <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-indigo-200">
//                 <Sparkles aria-hidden="true" size={13} />
//                 Your next chapter starts here
//               </span>

//               <h2
//                 id="cta-heading"
//                 className="mt-5 text-[clamp(1.9rem,4.5vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.06em] text-white"
//               >
//                 Ready to make client work simpler?
//               </h2>

//               <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-7">
//                 Bring your clients, projects, and tasks together. Start with a
//                 clearer workspace and build a better way to work.
//               </p>
//             </div>

//             <Link
//               href="/register"
//               className="group inline-flex min-h-[50px] w-full shrink-0 items-center justify-center gap-2.5 rounded-xl bg-white px-5 text-sm font-bold text-indigo-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 sm:w-auto sm:px-6"
//             >
//               Create your workspace
//               <ArrowRight
//                 aria-hidden="true"
//                 size={17}
//                 className="transition-transform duration-200 group-hover:translate-x-1"
//               />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-slate-200/80 bg-white">
//         <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
//           <Link
//             href="/"
//             aria-label="ClientPilot home"
//             className="flex items-center gap-2.5 self-start"
//           >
//             <BrandMark small />
//             <span className="text-sm font-bold tracking-[-0.4px] text-slate-800">
//               ClientPilot
//             </span>
//           </Link>

//           <p className="text-xs leading-5 text-slate-500">
//             A calmer workspace for managing client work.
//           </p>

//           <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
//             <Link
//               href="/login"
//               className="transition-colors hover:text-indigo-600"
//             >
//               Sign in
//             </Link>
//             <Link
//               href="/register"
//               className="transition-colors hover:text-indigo-600"
//             >
//               Get started
//             </Link>
//           </div>
//         </div>
//       </footer>

//       {/* Lightweight animations; respect reduced-motion preferences */}
//       <style jsx global>{`
//         .hero-grid {
//           background-image:
//             linear-gradient(to right, rgba(99, 102, 241, 0.065) 1px, transparent 1px),
//             linear-gradient(to bottom, rgba(99, 102, 241, 0.065) 1px, transparent 1px);
//           background-size: 36px 36px;
//           -webkit-mask-image: linear-gradient(to bottom, black, transparent 90%);
//           mask-image: linear-gradient(to bottom, black, transparent 90%);
//         }

//         @keyframes clientpilot-fade-up {
//           from {
//             opacity: 0;
//             transform: translate3d(0, 18px, 0);
//           }
//           to {
//             opacity: 1;
//             transform: translate3d(0, 0, 0);
//           }
//         }

//         .animate-fade-up {
//           animation: clientpilot-fade-up 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
//         }

//         .animate-fade-up-delay {
//           animation: clientpilot-fade-up 850ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both;
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .animate-fade-up,
//           .animate-fade-up-delay {
//             animation: none !important;
//           }

//           .animate-fade-up *,
//           .animate-fade-up-delay * {
//             scroll-behavior: auto !important;
//             transition-duration: 0.01ms !important;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }
