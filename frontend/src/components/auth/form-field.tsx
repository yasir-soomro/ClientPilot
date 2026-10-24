import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-[#344054]">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs leading-5 text-[#c4320a]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs leading-5 text-[#667085]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
