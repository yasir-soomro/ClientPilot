import type { ReactNode } from "react";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fcfcff] text-slate-900 selection:bg-indigo-100 selection:text-indigo-950">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
