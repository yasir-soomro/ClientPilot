import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#fcfcff] text-slate-900 selection:bg-indigo-100 selection:text-indigo-950">
      <Link
        href="#main-content"
        className="cp-skip-link"
      >
        Skip to content
      </Link>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
