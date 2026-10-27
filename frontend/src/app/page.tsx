import type { Metadata } from "next";
import Hero from "@/components/main/hero";
import Features from "@/components/main/feathers";
import {
  AboutSection,
  HowItWorksSection,
  PublicCallToAction,
  WhyClientPilotSection,
} from "@/components/main/public-sections";
import { PublicShell } from "@/components/layout/public-shell";

export const metadata: Metadata = {
  title: "ClientPilot | A clearer way to manage client work",
  description:
    "Manage client details, projects, tasks, deadlines, and delivery progress in one private workspace built for freelancers and small agencies.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ClientPilot | A clearer way to manage client work",
    description:
      "A private workspace that connects clients, projects, and everyday delivery work.",
    url: "/",
  },
};

export default function Home() {
  return (
    <PublicShell>
      <Hero />
      <Features />
      <WhyClientPilotSection />
      <AboutSection />
      <HowItWorksSection />
      <PublicCallToAction />
    </PublicShell>
  );
}
