import type { Metadata } from "next";
import HowItWorksContent from "@/components/pages/HowItWorksContent";
import { PublicShell } from "@/components/layout/public-shell";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Follow the ClientPilot workflow from client records to connected projects, actionable tasks, due dates, and delivery progress.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How It Works | ClientPilot",
    description:
      "See how ClientPilot keeps client context, project work, task status, due dates, and delivery progress connected.",
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
