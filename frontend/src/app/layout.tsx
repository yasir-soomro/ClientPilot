import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClientPilot",
  description: "Private client and project workspace",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
