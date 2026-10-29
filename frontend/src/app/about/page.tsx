import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/public-shell";
import { AboutExperience } from "./about-experience";

export const metadata: Metadata = {
  title: "About: Clarity for client work",
  description:
    "Discover why ClientPilot exists: to help freelancers and small agencies connect client context, project work, tasks, deadlines, and delivery progress.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ClientPilot | Clarity for client work",
    description:
      "A private workspace shaped around clear, connected client-focused delivery.",
    url: "/about",
    type: "website",
    images: [{ url: "/Collaborative Office Dashboard Meeting.png", width: 1536, height: 1024, alt: "A team discussing client work around a laptop." }],
  },
};

export default function AboutPage() {
  return <PublicShell><AboutExperience /></PublicShell>;
}
