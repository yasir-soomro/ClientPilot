import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`cp-control h-11 w-full px-4 text-sm placeholder:text-slate-400 ${className ?? ""}`} />;
}
