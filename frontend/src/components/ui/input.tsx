import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-xl border border-[#d0d5dd] bg-white px-4 text-[15px] text-[#182230] outline-none transition placeholder:text-[#98a2b3] focus:border-[#5969e8] focus:ring-4 focus:ring-[#5969e8]/10 disabled:cursor-not-allowed disabled:opacity-60 ${props.className ?? ""}`}
    />
  );
}
