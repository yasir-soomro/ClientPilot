import type { Metadata } from "next";
import { DashboardPage } from "@/components/auth/dashboard-page";

export const metadata: Metadata = {
  title: "Workspace overview",
  robots: { index: false, follow: false },
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
