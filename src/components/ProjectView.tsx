"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, PartyPopper } from "lucide-react";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ChatPanel } from "@/components/ChatPanel";
import { useProgress } from "@/hooks/useProgress";
import { getNextModule } from "@/lib/curriculum";
import clsx from "@/lib/clsx";

export function ProjectView({
  moduleSlug,
  moduleTitle,
  title,
  content,
}: {
  moduleSlug: string;
  moduleTitle: string;
  title: string;
  content: string;
}) {
  const { hydrated, isComplete, toggleComplete } = useProgress();
  const done = hydrated && isComplete(moduleSlug, "project");
  const nextModule = getNextModule(moduleSlug);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href={`/modules/${moduleSlug}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {moduleTitle}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card px-6 sm:px-8 py-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <div className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-1">Hands-on project</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
            </div>
            <button
              onClick={() => toggleComplete(moduleSlug, "project")}
              className={clsx(
                "shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors",
                done ? "bg-success-50 text-success-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
              {done ? "Completed" : "Mark complete"}
            </button>
          </div>
          <MarkdownContent content={content} />
        </div>

        <div className="lg:sticky lg:top-20">
          <ChatPanel
            context={{ moduleSlug, isProject: true }}
            title="Project mentor"
            placeholder="Ask about your approach, get unstuck, request a code review…"
            openingMessage={`I'm here to help with the "${title}" project — share your approach, paste code for review, or ask for a hint if you're stuck.`}
          />
        </div>
      </div>

      {nextModule ? (
        <Link
          href={`/modules/${nextModule.slug}`}
          className="mt-6 flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-2xl px-5 py-4 hover:bg-brand-100/60 transition-colors"
        >
          <div className="flex-1">
            <div className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-0.5">Continue the sequence</div>
            <div className="font-semibold text-slate-900">Next: {nextModule.title}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-brand-400 shrink-0" />
        </Link>
      ) : (
        <div className="mt-6 flex items-center gap-3 bg-success-50 border border-success-100 rounded-2xl px-5 py-4">
          <PartyPopper className="w-6 h-6 text-success-600 shrink-0" />
          <div>
            <div className="font-semibold text-slate-900">That&apos;s the full sequence</div>
            <div className="text-sm text-slate-600">
              You&apos;ve worked through all 5 modules — head to{" "}
              <Link href="/practice-exams" className="text-brand-600 font-medium hover:underline">
                the practice exams
              </Link>{" "}
              to see where you actually stand.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
