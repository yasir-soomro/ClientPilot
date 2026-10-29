import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/public-shell";
import { WhyClientPilotContent } from "./why-clientpilot-content";

export const metadata: Metadata = {
  title: "Why ClientPilot",
  description:
    "See why freelancers and small agencies use ClientPilot to connect client context, projects, tasks, deadlines, and delivery progress.",
  alternates: { canonical: "/why-clientpilot" },
  openGraph: {
    title: "Why ClientPilot",
    description:
      "A clearer way to keep client requests, project work, tasks, deadlines, and delivery progress connected.",
    url: "/why-clientpilot",
  },
};

export default function WhyClientPilotPage() {
  return (
    <PublicShell>
      <WhyClientPilotContent />
    </PublicShell>
  );
}
