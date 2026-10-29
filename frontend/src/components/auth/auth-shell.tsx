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
      <main className="min-h-screen min-h-svh bg-[#f8f9fa] lg:grid lg:grid-cols-[minmax(0,1.02fr)_minmax(460px,0.98fr)]">
        <aside className="relative hidden min-h-screen min-h-svh overflow-hidden bg-[#212529] px-10 py-9 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12 2xl:px-20">
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute -left-40 -top-32 size-[34rem] rounded-full bg-[#6c757d]/35 blur-3xl" />
            <div className="absolute -bottom-48 -right-36 size-[38rem] rounded-full bg-[#495057]/35 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#ffffff_0.7px,transparent_0.7px)] [background-size:22px_22px]" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#212529]/20 to-[#16191c]/80" />
          </div>

          <Link
            href="/"
            className="group relative flex w-fit items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
          >
            <span className="transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transform-none">
              <BrandMark className="!shadow-none !ring-0" />
            </span>
            <span className="text-lg font-bold tracking-[-0.045em]">
              Client<span className="text-gray-300">Pilot</span>
            </span>
          </Link>

          <motion.div
            className="relative max-w-xl py-8"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#ced4da]">
              Your independent workspace
            </p>
            <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.055em] xl:text-6xl">
              Keep client work moving forward.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#dee2e6]">
              Bring client details, projects, and the next steps together in one
              calm, private place.
            </p>
            <ol
              className="mt-10 flex max-w-md flex-wrap items-center gap-2"
              aria-label="Client work workflow"
            >
              {["Clients", "Projects", "Tasks", "Progress"].map(
                (step, index) => (
                  <li key={step} className="inline-flex items-center gap-2">
                    <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/90">
                      {step}
                    </span>
                    {index < 3 ? (
                      <span className="text-[#adb5bd]" aria-hidden="true">
                        →
                      </span>
                    ) : null}
                  </li>
                ),
              )}
            </ol>
          </motion.div>

          <p className="relative text-xs text-[#ced4da]">
            Private by design. Built for your workspace.
          </p>
        </aside>

        <section className="flex min-h-screen min-h-svh min-w-0 flex-col bg-white px-4 py-4 sm:px-8 sm:py-6 lg:px-10 xl:px-14 2xl:px-20">
          <div className="flex min-w-0 items-center justify-between gap-3 lg:justify-end">
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25 lg:hidden"
            >
              <span className="transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transform-none">
                <BrandMark small className="!shadow-none !ring-0" />
              </span>
              <span className="text-sm font-bold tracking-[-0.045em] text-[#212529]">
                Client<span className="text-[#495057]">Pilot</span>
              </span>
            </Link>
            <p className="text-right text-xs leading-5 text-[#495057] sm:text-sm">
              {isLogin ? "New to ClientPilot?" : "Already have an account?"}{" "}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="rounded-sm font-semibold text-[#343a40] underline decoration-[#adb5bd] underline-offset-4 hover:text-[#212529] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6c757d]/25"
              >
                {isLogin ? "Create account" : "Sign in"}
              </Link>
            </p>
          </div>

          <motion.div
            className="mx-auto my-auto flex w-full min-w-0 max-w-[440px] flex-col py-8 sm:py-10 lg:py-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="mb-7 lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6c757d]">
                Your independent workspace
              </p>
            </div>
            {children}
          </motion.div>

          <footer className="mx-auto w-full max-w-[440px] text-center text-xs leading-5 text-[#6c757d]">
            By continuing, you agree to keep your workspace secure.
          </footer>
        </section>
      </main>
    </MotionConfig>
  );
}
