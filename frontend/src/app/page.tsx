
import type { Metadata } from "next";
import Hero from "@/components/main/hero";
import Features from "@/components/main/feathers";
import { LandingSections } from "@/components/main/landing-sections";
import { PublicShell } from "@/components/layout/public-shell";

export const metadata: Metadata = {
  title: "ClientPilot | Client work, clearly connected",
  description:
    "Keep client details, projects, tasks, and delivery progress connected in one private workspace for freelancers and small agencies.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ClientPilot | Client work, clearly connected",
    description:
      "One private workspace for client context, project plans, tasks, and delivery progress.",
    url: "/",
  },
};

export default function Home() {
  return (
    <PublicShell>
      <Hero />
      <Features />
      <LandingSections />
    </PublicShell>
  );
}
