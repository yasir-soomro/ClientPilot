


import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  LockKeyhole,
  Users,
} from "lucide-react";
import { TypewriterText } from "@/components/main/typewriter-text";

const heroPhrases = ["connected.", "organized.", "in view."];

export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden border-b border-slate-200/70 bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 -top-48 size-[36rem] rounded-full bg-[#adb5bd]/20 blur-[110px]" />
        <div className="absolute -bottom-64 left-[15%] size-[30rem] rounded-full bg-[#dee2e6]/50 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,117,125,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,117,125,0.055)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12 lg:py-24 xl:gap-16">
        <div className="animate-fade-up relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dee2e6] bg-white/90 px-3.5 py-2 text-xs font-semibold text-[#495057] shadow-sm sm:text-sm">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#f1f3f5] text-[#343a40]">
              <Users aria-hidden="true" size={13} />
            </span>
            A focused workspace for independent work
          </div>

          <h1 className="mt-7 text-[clamp(2.7rem,6vw,5.15rem)] font-semibold leading-[1.02] tracking-[-0.065em] text-[#212529]">
            <span className="block">Client work,</span>
            <span className="block min-h-[1.08em] text-[#495057]">
              <span className="sr-only">connected.</span>
              <TypewriterText phrases={heroPhrases} />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#495057] sm:text-lg sm:leading-8">
            Keep client details, project plans, tasks, and delivery progress
            together—so the next step is easier to see and the work stays yours.
          </p>

          <div className="mt-8 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center">
            <Link
              href="/register"
              className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-[#343a40] bg-[#343a40] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(52,58,64,0.18)] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#212529] hover:bg-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/30 motion-reduce:transform-none"
            >
              Start organizing work
              <ArrowRight
                aria-hidden="true"
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </Link>

            <Link
              href="#features"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-[#dee2e6] bg-white/80 px-6 py-3.5 text-sm font-semibold text-[#343a40] shadow-sm transition-colors duration-200 hover:border-[#adb5bd] hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25"
            >
              See what connects
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <div className="mt-6 flex items-start gap-2.5 text-sm leading-6 text-[#495057]">
            <CheckCircle2
              aria-hidden="true"
              size={18}
              className="mt-0.5 shrink-0 text-[#495057]"
            />
            <p>Your workspace is private. Clients stay contacts—not account holders.</p>
          </div>

          <div className="mt-9 grid max-w-lg grid-cols-3 gap-3 border-t border-slate-200/80 pt-5 sm:mt-10 sm:gap-6 sm:pt-6">
            <div>
              <p className="text-sm font-semibold text-[#343a40]">Client context</p>
              <p className="mt-1 text-xs leading-5 text-[#6c757d] sm:text-sm">
                Details stay close
              </p>
            </div>

            <div className="border-x border-slate-200/80 px-3 sm:px-5">
              <p className="text-sm font-semibold text-[#343a40]">Clear next steps</p>
              <p className="mt-1 text-xs leading-5 text-[#6c757d] sm:text-sm">
                Tasks stay connected
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#343a40]">Visible progress</p>
              <p className="mt-1 text-xs leading-5 text-[#6c757d] sm:text-sm">
                Delivery in view
              </p>
            </div>
          </div>
        </div>

        <div className="animate-fade-up relative mx-auto w-full max-w-[620px] lg:ml-auto lg:mr-0">
          <div
            aria-hidden="true"
            className="animate-float pointer-events-none absolute -right-6 -top-8 size-32 rounded-full bg-[#adb5bd]/30 blur-3xl sm:-right-10 sm:size-48"
          />

          <div className="relative rounded-[25px] border border-white/90 bg-white/90 p-2 shadow-[0_24px_70px_-30px_rgba(33,37,41,0.3)] ring-1 ring-slate-900/[0.045] backdrop-blur-xl sm:rounded-[30px] sm:p-3">
            <div className="flex h-10 items-center justify-between px-2 sm:h-11 sm:px-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2 rounded-full bg-[#adb5bd]" />
                <span className="size-2 rounded-full bg-[#ced4da]" />
                <span className="size-2 rounded-full bg-[#dee2e6]" />
              </div>

              <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-[#6c757d] sm:text-xs">
                <LockKeyhole aria-hidden="true" size={11} />
                Your workspace
              </div>

              <span className="w-10" aria-hidden="true" />
            </div>

            <div className="overflow-hidden rounded-[17px] border border-slate-200/80 bg-white sm:rounded-[21px]">
              <Image
                src="/ClientPilot.png"
                alt="ClientPilot dashboard preview showing clients, project progress, and upcoming tasks."
                width={1536}
                height={1024}
                sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc(100vw - 80px), (max-width: 1279px) 48vw, 620px"
                preload
                className="h-auto w-full object-cover object-top"
              />
            </div>
          </div>

          <div
            className="animate-float absolute -bottom-6 -left-2 z-10 hidden max-w-[245px] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-[0_16px_40px_rgba(33,37,41,0.12)] backdrop-blur-xl sm:flex md:-left-7"
            style={{ animationDelay: "700ms" }}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f3f5] text-[#495057]">
              <CheckCircle2 aria-hidden="true" size={20} strokeWidth={2} />
            </span>
            <div>
              <p className="text-xs font-semibold text-[#343a40]">
                One view, from client to delivery
              </p>
              <p className="mt-1 text-[11px] leading-4 text-[#6c757d]">
                Client details, project plans, and next steps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
