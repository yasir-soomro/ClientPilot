"use client";

import { motion, MotionConfig } from "framer-motion";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary: "bg-indigo-600 text-white shadow-[0_5px_12px_rgba(79,70,229,0.18)] hover:bg-indigo-700 focus-visible:ring-indigo-500/25",
  secondary: "border border-[#dfe2ea] bg-white text-[#344054] shadow-sm hover:border-indigo-200 hover:bg-indigo-50/40 focus-visible:ring-indigo-500/20",
  ghost: "bg-transparent text-[#667085] shadow-none hover:bg-[#f6f7fb] hover:text-[#182230] focus-visible:ring-indigo-500/20",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-500/25",
} as const;

const sizes = {
  sm: "h-10 rounded-lg px-4 text-xs",
  md: "h-11 rounded-xl px-5 text-sm",
  lg: "h-12 rounded-xl px-5 text-sm",
} as const;

export function Button({ children, loading = false, disabled, type = "submit", onClick, className, variant = "primary", size = "lg" }: ButtonProps) {
  const inactive = disabled || loading;
  return <MotionConfig reducedMotion="user"><motion.button type={type} disabled={inactive} onClick={onClick} aria-busy={loading || undefined} whileHover={inactive ? undefined : { y: -1 }} whileTap={inactive ? undefined : { scale: 0.99 }} className={`inline-flex w-full items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className ?? ""}`}>{loading ? <><span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />Please wait</> : children}</motion.button></MotionConfig>;
}
