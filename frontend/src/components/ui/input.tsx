import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-xl border border-[#dfe2ea] bg-white px-4 text-sm text-[#182230] shadow-[0_1px_2px_rgba(16,24,40,0.03)] outline-none transition placeholder:text-[#98a2b3] hover:border-[#c7cad5] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10 ${props.className ?? ""}`}
    />
  );
}
