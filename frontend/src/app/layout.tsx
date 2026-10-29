import type { Metadata } from "next";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { AuthProvider } from "@/features/auth/session-context";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "ClientPilot | Client and project workspace",
    template: "%s | ClientPilot",
  },
  description:
    "Keep client records, projects, and delivery work organized in one private workspace built for freelancers and small agencies.",
  applicationName: "ClientPilot",
  openGraph: {
    type: "website",
    siteName: "ClientPilot",
    title: "ClientPilot | Client and project workspace",
    description:
      "Keep client records, projects, and delivery work organized in one private workspace built for freelancers and small agencies.",
  },
  twitter: {
    card: "summary",
    title: "ClientPilot | Client and project workspace",
    description:
      "A private workspace for freelancers and small agencies to organize client work.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <NavigationProgress />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
