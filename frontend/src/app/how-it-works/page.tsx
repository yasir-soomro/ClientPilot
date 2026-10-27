import type { Metadata } from "next";
import HowItWorksContent from "@/components/pages/HowItWorksContent";
import { PublicShell } from "@/components/layout/public-shell";

export const metadata: Metadata = {
  title: "How ClientPilot works",
  description: "See how ClientPilot connects clients, projects, tasks, and progress.",
  alternates: { canonical: "/how-it-works" },
  openGraph: { title: "How ClientPilot works", description: "A simple workflow for managing client delivery.", url: "/how-it-works" },
};

export default function HowItWorksPage() {
  return <PublicShell><HowItWorksContent /></PublicShell>;
}
