"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={`pr-12 ${className ?? ""}`}
      />
      <button
        type="button"
        disabled={props.disabled}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-1 inline-flex w-10 items-center justify-center rounded-lg text-[#6c757d] transition-colors hover:text-[#212529] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c757d]/40 disabled:cursor-not-allowed"
      >
        {visible ? (
          <EyeOff className="size-[18px]" aria-hidden="true" />
        ) : (
          <Eye className="size-[18px]" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
