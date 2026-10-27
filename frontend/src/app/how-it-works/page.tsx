import type { Metadata } from "next";
import HowItWorksContent from "@/components/pages/HowItWorksContent";
import { PublicShell } from "@/components/layout/public-shell";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See how ClientPilot connects client details, projects, tasks, deadlines, and delivery progress in one private workspace.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How It Works | ClientPilot",
    description:
      "From client details to completed work: explore the ClientPilot workflow for clients, projects, tasks, and progress.",
    url: "/how-it-works",
    type: "website",
    images: [
      {
        url: "/ClientPilot%20Workflow%20Demo%20copy.png",
        width: 1536,
        height: 1024,
        alt: "ClientPilot workflow: add clients, create projects, organize tasks, and track progress.",
      },
    ],
  },
};

export default function HowItWorksPage() {
  return <PublicShell><HowItWorksContent /></PublicShell>;
}
