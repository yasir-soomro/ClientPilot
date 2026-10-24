"use client";

import { motion } from "framer-motion";
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
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={disabled || loading ? undefined : { y: -1 }}
      whileTap={disabled || loading ? undefined : { scale: 0.99 }}
      className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4355d9] px-5 text-sm font-semibold text-white shadow-[0_5px_12px_rgba(67,85,217,0.18)] transition-colors hover:bg-[#3343bc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5969e8]/25 disabled:cursor-not-allowed disabled:opacity-65 ${className ?? ""}`}
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
  );
}
