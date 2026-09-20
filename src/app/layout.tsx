import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Advanced AI Curriculum",
  description:
    "A self-paced curriculum aligned to Anthropic's Claude Certified Architect – Foundations exam: agentic architecture, tool/MCP design, Claude Code workflows, prompt engineering, and context/reliability — with structured lessons, an AI tutor, hands-on projects, and 3 full practice exams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 antialiased" suppressHydrationWarning>
        <Nav />
        {children}
      </body>
    </html>
  );
}
