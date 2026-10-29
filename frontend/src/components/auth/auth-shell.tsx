import type { ReactNode } from "react";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { BrandMark } from "@/components/ui/brand-mark";

type AuthShellProps = {
  children: ReactNode;
  mode: "login" | "register";
};

export function AuthShell({ children, mode }: AuthShellProps) {
  const isLogin = mode === "login";

  return (
    <MotionConfig reducedMotion="user">
    <main className="min-h-screen bg-[var(--cp-background)] lg:grid lg:grid-cols-[minmax(0,1.02fr)_minmax(460px,0.98fr)]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#111735] px-10 py-9 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12 2xl:px-20">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute -left-40 -top-32 size-[34rem] rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="absolute -bottom-48 -right-36 size-[38rem] rounded-full bg-sky-400/15 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.09] [background-image:radial-gradient(#ffffff_0.7px,transparent_0.7px)] [background-size:22px_22px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#121a3b]/20 to-[#111735]/80" />
        </div>

        <Link href="/" className="group relative flex w-fit items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30">
          <span className="transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transform-none">
            <BrandMark />
          </span>
          <span className="text-lg font-bold tracking-[-0.045em]">Client<span className="text-gray-300">Pilot</span></span>
        </Link>

        <motion.div
          className="relative max-w-xl pb-8"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
            Your independent workspace
          </p>
          <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.055em] xl:text-6xl">
            Keep client work moving forward.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-indigo-100/70">
            Bring client details, projects, and the next steps together in one
            calm, private place.
          </p>
          <div className="mt-10 flex max-w-md flex-wrap items-center gap-2" aria-label="Client work workflow">
            {["Clients", "Projects", "Tasks", "Progress"].map((step, index) => (
              <span key={step} className="inline-flex items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/90">{step}</span>
                {index < 3 ? <span className="text-indigo-300/70" aria-hidden="true">→</span> : null}
              </span>
            ))}
          </div>
        </motion.div>

        <p className="relative text-xs text-indigo-100/50">
          Private by design. Built for your workspace.
        </p>
      </aside>

      <section className="flex min-h-screen flex-col bg-white px-5 py-5 sm:px-9 sm:py-7 lg:px-10 xl:px-14 2xl:px-20">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 lg:hidden">
            <span className="transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transform-none"><BrandMark small /></span>
            <span className="text-sm font-bold tracking-[-0.045em] text-slate-950">Client<span className="text-gray-600">Pilot</span></span>
          </Link>
          <p className="text-xs text-slate-500 sm:text-sm">
            {isLogin ? "New to ClientPilot?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="rounded-sm font-semibold text-indigo-700 hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
            >
              {isLogin ? "Create account" : "Sign in"}
            </Link>
          </p>
        </div>

        <motion.div
          className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-10 sm:py-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="mb-8 lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Your independent workspace
            </p>
          </div>
          {children}
        </motion.div>

        <footer className="mx-auto w-full max-w-[440px] text-center text-xs leading-5 text-slate-400">
          By continuing, you agree to keep your workspace secure.
        </footer>
      </section>
    </main>
    </MotionConfig>
  );
}
