import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/public-shell";
import { AboutExperience } from "./about-experience";

export const metadata: Metadata = {
  title: "About ClientPilot | Clarity for client work",
  description:
    "Learn how ClientPilot helps freelancers and small-agency owners organize clients, projects, tasks, deadlines, and delivery progress in one private workspace.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ClientPilot | Clarity for client work",
    description: "A focused workspace for keeping client relationships, project delivery, and task progress clear.",
    url: "/about",
    type: "website",
    images: [{ url: "/Collaborative Office Dashboard Meeting.png", width: 1536, height: 1024, alt: "A team discussing client work around a laptop." }],
  },
};

export default function AboutPage() {
  return <PublicShell><AboutExperience /></PublicShell>;
}
