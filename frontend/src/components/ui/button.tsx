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
  primary: "border border-[#343a40] bg-[#343a40] text-white shadow-[0_6px_16px_rgba(52,58,64,0.2)] hover:border-[#212529] hover:bg-[#212529] hover:shadow-[0_9px_22px_rgba(33,37,41,0.24)] focus-visible:ring-[#6c757d]/30",
  secondary: "border border-[#c6cbd1] bg-white text-[#343a40] shadow-sm hover:border-[#6c757d] hover:bg-[#f3f4f5] hover:text-[#212529] focus-visible:ring-[#6c757d]/25",
  ghost: "bg-transparent text-[#495057] shadow-none hover:bg-[#f1f3f5] hover:text-[#212529] focus-visible:ring-[#6c757d]/25",
  danger: "border border-[#343a40] bg-[#343a40] text-white shadow-sm shadow-[#343a40]/15 hover:border-[#212529] hover:bg-[#212529] focus-visible:ring-[#6c757d]/30",
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
