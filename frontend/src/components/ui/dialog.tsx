"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export function Dialog({ open, title, description, onClose, children }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} className="max-h-[min(860px,calc(100vh-2rem))] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/20 sm:rounded-3xl sm:p-7">
      <div className="flex items-start justify-between gap-4"><div><h2 id={titleId} className="text-xl font-semibold tracking-tight text-[#182230]">{title}</h2>{description ? <p id={descriptionId} className="mt-1 text-sm leading-6 text-[#667085]">{description}</p> : null}</div><button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close dialog" className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#667085] transition hover:bg-[#f6f7fb] hover:text-[#182230]"><X size={18} aria-hidden="true" /></button></div>
      <div className="mt-6">{children}</div>
    </section>
  </div>;
}
