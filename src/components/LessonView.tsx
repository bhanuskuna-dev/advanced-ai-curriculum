"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, FolderKanban } from "lucide-react";
import { MarkdownContent } from "@/components/MarkdownContent";
import { useProgress } from "@/hooks/useProgress";
import clsx from "@/lib/clsx";

interface AdjacentLesson {
  slug: string;
  title: string;
}

export function LessonView({
  moduleSlug,
  lessonSlug,
  moduleTitle,
  title,
  content,
  prev,
  next,
  isLastLesson,
}: {
  moduleSlug: string;
  lessonSlug: string;
  moduleTitle: string;
  title: string;
  content: string;
  prev?: AdjacentLesson;
  next?: AdjacentLesson;
  isLastLesson: boolean;
}) {
  const { hydrated, isComplete, toggleComplete } = useProgress();
  const done = hydrated && isComplete(moduleSlug, lessonSlug);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-6">
        <Link
          href={`/modules/${moduleSlug}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {moduleTitle}
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card px-6 sm:px-8 py-8 mb-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          <button
            onClick={() => toggleComplete(moduleSlug, lessonSlug)}
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

      <div className="flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/modules/${moduleSlug}/${prev.slug}`}
            className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow px-4 py-3"
          >
            <ArrowLeft className="w-4 h-4 text-slate-300 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-slate-400">Previous</div>
              <div className="text-sm font-semibold text-slate-800 truncate">{prev.title}</div>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {isLastLesson ? (
          <Link
            href={`/modules/${moduleSlug}/project`}
            className="flex-1 flex items-center justify-end gap-2 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-right hover:bg-brand-100/60 transition-colors"
          >
            <div className="min-w-0">
              <div className="text-xs text-brand-500">Next</div>
              <div className="text-sm font-semibold text-slate-800 truncate">Hands-on project</div>
            </div>
            <FolderKanban className="w-4 h-4 text-brand-500 shrink-0" />
          </Link>
        ) : next ? (
          <Link
            href={`/modules/${moduleSlug}/${next.slug}`}
            className="flex-1 flex items-center justify-end gap-2 bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow px-4 py-3 text-right"
          >
            <div className="min-w-0">
              <div className="text-xs text-slate-400">Next</div>
              <div className="text-sm font-semibold text-slate-800 truncate">{next.title}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </main>
  );
}
