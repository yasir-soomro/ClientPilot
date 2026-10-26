"use client";

import { motion, MotionConfig } from "framer-motion";
import type {
  MouseEventHandler,
  ReactNode,
} from "react";

type ButtonProps = {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export function Button({
  children,
  loading = false,
  disabled,
  type = "submit",
  onClick,
  className,
}: ButtonProps) {
  return (
    <MotionConfig reducedMotion="user">
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={disabled || loading ? undefined : { y: -1 }}
      whileTap={disabled || loading ? undefined : { scale: 0.99 }}
      className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_5px_12px_rgba(79,70,229,0.18)] transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-65 ${className ?? ""}`}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
          Please wait
        </>
      ) : (
        children
      )}
    </motion.button>
    </MotionConfig>
  );
}
