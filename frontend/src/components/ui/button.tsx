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
  primary: "bg-indigo-600 text-white shadow-[0_6px_16px_rgba(79,70,229,0.2)] hover:bg-indigo-700 hover:shadow-[0_9px_22px_rgba(79,70,229,0.24)] focus-visible:ring-indigo-500/25",
  secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-800 focus-visible:ring-indigo-500/20",
  ghost: "bg-transparent text-slate-600 shadow-none hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-indigo-500/20",
  danger: "bg-rose-600 text-white shadow-sm shadow-rose-600/15 hover:bg-rose-700 focus-visible:ring-rose-500/25",
} as const;

const sizes = {
  sm: "min-h-10 rounded-xl px-4 text-xs",
  md: "min-h-11 rounded-xl px-5 text-sm",
  lg: "min-h-12 rounded-xl px-5 text-sm",
} as const;

export function Button({ children, loading = false, disabled, type = "submit", onClick, className, variant = "primary", size = "lg" }: ButtonProps) {
  const inactive = disabled || loading;
  return <MotionConfig reducedMotion="user"><motion.button type={type} disabled={inactive} onClick={onClick} aria-busy={loading || undefined} whileHover={inactive ? undefined : { y: -1 }} whileTap={inactive ? undefined : { scale: 0.99 }} className={`inline-flex w-full items-center justify-center gap-2 rounded-xl font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className ?? ""}`}>{loading ? <><span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />Please wait</> : children}</motion.button></MotionConfig>;
}
