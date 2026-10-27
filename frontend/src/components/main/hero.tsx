


import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  LockKeyhole,
  Sparkles,
  Check,
} from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative isolate scroll-mt-24 overflow-hidden border-b border-slate-200/70 bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-32 -top-40 size-[34rem] rounded-full bg-indigo-200/35 blur-[100px]" />
        <div className="absolute -bottom-56 left-[18%] size-[32rem] rounded-full bg-sky-200/30 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.075)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12 lg:py-24 xl:gap-16">
        {/* Hero content */}
        <div className="animate-fade-up relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-3.5 py-2 text-xs font-semibold text-indigo-700 shadow-sm sm:text-sm">
            <span className="flex size-6 items-center justify-center rounded-full bg-indigo-50">
              <Sparkles aria-hidden="true" size={13} />
            </span>
            Built for freelancers and small agencies
          </div>

          <h1 className="mt-7 text-[clamp(2.8rem,6vw,5.35rem)] font-semibold leading-[0.99] tracking-[-0.065em] text-slate-950">
            Less scattered work.
            <span className="mt-2 block bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text pb-1 text-transparent">
              More clarity.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Client details, projects, and next steps — all in one calm,
            private workspace. Spend less time searching for information
            and more time delivering great work.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(79,70,229,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25"
            >
              Create your workspace
              <ArrowRight
                aria-hidden="true"
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="#features"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-white"
            >
              Explore features
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <div className="mt-6 flex items-start gap-2.5 text-sm leading-6 text-slate-500">
            <CheckCircle2
              aria-hidden="true"
              size={18}
              className="mt-0.5 shrink-0 text-emerald-600"
            />
            <p>Private to your account. Clients do not need their own login.</p>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-slate-200/80 pt-6 sm:gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-900">One place</p>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                For client context
              </p>
            </div>

            <div className="border-x border-slate-200/80 px-3 sm:px-5">
              <p className="text-sm font-semibold text-slate-900">Clear steps</p>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                For project delivery
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Private</p>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                By design
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="animate-fade-up relative mx-auto w-full max-w-[620px] lg:ml-auto lg:mr-0">
          <div
            aria-hidden="true"
            className="animate-float pointer-events-none absolute -right-6 -top-8 size-32 rounded-full bg-violet-300/35 blur-3xl sm:-right-10 sm:size-48"
          />

          <div className="relative rounded-[25px] border border-white/80 bg-white/80 p-2 shadow-[0_28px_90px_-25px_rgba(46,42,100,0.24)] ring-1 ring-slate-900/[0.045] backdrop-blur-xl sm:rounded-[30px] sm:p-3">
            <div className="flex h-10 items-center justify-between px-2 sm:h-11 sm:px-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-rose-300" />
                <span className="size-2.5 rounded-full bg-amber-300" />
                <span className="size-2.5 rounded-full bg-emerald-300" />
              </div>

              <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-400 sm:text-xs">
                <LockKeyhole aria-hidden="true" size={11} />
                Your workspace
              </div>

              <span className="w-10" aria-hidden="true" />
            </div>

            <div className="overflow-hidden rounded-[17px] border border-slate-200/80 bg-white sm:rounded-[21px]">
              <Image
                src="/ClientPilot.png"
                alt="Preview of the ClientPilot workspace dashboard."
                width={1536}
                height={1024}
                sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc(100vw - 80px), (max-width: 1279px) 48vw, 620px"
                preload
                className="h-auto w-full object-cover object-top"
              />
            </div>
          </div>

          <div
            className="animate-float absolute -bottom-6 -left-2 z-10 hidden max-w-[245px] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:flex md:-left-7"
            style={{ animationDelay: "700ms" }}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Check aria-hidden="true" size={20} strokeWidth={2.3} />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                The bigger picture, connected
              </p>
              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                Clients, projects, and tasks in one workspace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
