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
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(480px,0.92fr)]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#171a35] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20 xl:py-14">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute -left-40 -top-32 size-[34rem] rounded-full bg-[#5969e8]/20 blur-3xl" />
          <div className="absolute -bottom-48 -right-36 size-[38rem] rounded-full bg-[#20b9a5]/15 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#ffffff_0.7px,transparent_0.7px)] [background-size:20px_20px]" />
        </div>

        <Link href="/" className="relative flex items-center gap-3">
          <BrandMark className="bg-[#5969e8]" />
          <span className="text-lg font-semibold tracking-tight">ClientPilot</span>
        </Link>

        <motion.div
          className="relative max-w-xl pb-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#b7c0ff]">
            Your independent workspace
          </p>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.12] tracking-[-0.04em] xl:text-[3.5rem]">
            Keep good work moving forward.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/65">
            Bring client details, projects, and the next steps together in one
            calm, private place.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm text-white/75">
            <span className="flex -space-x-2" aria-hidden="true">
              {["bg-[#ffc9a8]", "bg-[#b7e4d8]", "bg-[#d5ccff]"].map((color) => (
                <span
                  key={color}
                  className={`size-8 rounded-full border-2 border-[#242748] ${color}`}
                />
              ))}
            </span>
            <span>A clearer view of the work you do.</span>
          </div>
        </motion.div>

        <p className="relative text-xs text-white/45">
          Private by design. Built for your workspace.
        </p>
      </aside>

      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:px-14 xl:px-20">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <BrandMark className="bg-[#5969e8]" />
            <span className="font-semibold tracking-tight">ClientPilot</span>
          </Link>
          <p className="text-sm text-[#667085]">
            {isLogin ? "New to ClientPilot?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="font-semibold text-[#4355d9] hover:text-[#3343bc] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5969e8]"
            >
              {isLogin ? "Create account" : "Sign in"}
            </Link>
          </p>
        </div>

        <motion.div
          className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="mb-8 lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5969e8]">
              Your independent workspace
            </p>
          </div>
          {children}
        </motion.div>

        <footer className="mx-auto w-full max-w-[440px] text-center text-xs text-[#98a2b3]">
          By continuing, you agree to keep your workspace secure.
        </footer>
      </section>
    </main>
    </MotionConfig>
  );
}
