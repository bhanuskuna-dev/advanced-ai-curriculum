"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Github, MessageCircleQuestion, GraduationCap } from "lucide-react";
import clsx from "@/lib/clsx";
import { CURRICULUM } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";

const NAV_LABELS: Record<string, string> = {
  "agentic-architecture": "Agentic Architecture",
  "tool-design-mcp": "Tool Design",
  "claude-code-workflows": "Claude Code",
  "prompt-engineering": "Prompt Engineering",
  "context-reliability": "Context & Reliability",
};

export function Nav() {
  const pathname = usePathname();
  const { hydrated, overallPercent } = useProgress();

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <BrainCircuit className="w-5 h-5 text-brand-600" />
          <span className="font-bold text-slate-900 tracking-tight">Advanced AI Curriculum</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-none">
          {CURRICULUM.map((mod) => (
            <Link
              key={mod.slug}
              href={`/modules/${mod.slug}`}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                pathname.startsWith(`/modules/${mod.slug}`)
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {NAV_LABELS[mod.slug] ?? mod.title}
            </Link>
          ))}
          <Link
            href="/practice-exams"
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              pathname.startsWith("/practice-exams") ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            )}
          >
            <GraduationCap className="w-4 h-4" />
            Practice Exams
          </Link>
          <Link
            href="/tutor"
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              pathname === "/tutor" ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            )}
          >
            <MessageCircleQuestion className="w-4 h-4" />
            Tutor
          </Link>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {hydrated && (
            <div className="hidden sm:flex items-center gap-2" title="Overall progress">
              <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${overallPercent()}%` }} />
              </div>
              <span className="text-xs font-semibold text-slate-400 tabular-nums">{overallPercent()}%</span>
            </div>
          )}
          <a
            href="https://github.com/bhanuskuna-dev/advanced-ai-curriculum"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="View source on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
}
