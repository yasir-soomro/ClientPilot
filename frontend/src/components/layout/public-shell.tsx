import type { ReactNode } from "react";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fcfcff] text-slate-900 selection:bg-indigo-100 selection:text-indigo-950">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
