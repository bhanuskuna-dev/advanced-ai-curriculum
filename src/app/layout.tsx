import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Advanced AI Curriculum",
  description:
    "A self-paced curriculum for becoming an advanced AI user: the Claude API & Agent SDK, RAG & retrieval, and evals/safety — with structured lessons, an AI tutor, and hands-on projects.",
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
