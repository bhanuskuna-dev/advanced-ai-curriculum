"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle, FolderKanban, ArrowRight } from "lucide-react";
import { getModule } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";
import clsx from "@/lib/clsx";

export default function ModulePage({ params }: { params: Promise<{ moduleSlug: string }> }) {
  const { moduleSlug } = use(params);
  const mod = getModule(moduleSlug);
  const { hydrated, isComplete, percentForModule } = useProgress();

  if (!mod) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{mod.title}</h1>
        <p className="text-slate-500 leading-relaxed mb-4">{mod.description}</p>
        <div className="flex items-center gap-2">
          <div className="w-40 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${hydrated ? percentForModule(mod.slug) : 0}%` }} />
          </div>
          <span className="text-xs font-semibold text-slate-400 tabular-nums">{hydrated ? percentForModule(mod.slug) : 0}% complete</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card divide-y divide-slate-100 mb-6">
        {mod.lessons.map((lesson, i) => {
          const done = hydrated && isComplete(mod.slug, lesson.slug);
          return (
            <Link
              key={lesson.slug}
              href={`/modules/${mod.slug}/${lesson.slug}`}
              className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50/70 transition-colors"
            >
              {done ? (
                <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-slate-200 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Lesson {i + 1}</div>
                <div className={clsx("font-semibold", done ? "text-slate-500" : "text-slate-900")}>{lesson.title}</div>
                <div className="text-sm text-slate-500">{lesson.summary}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 mt-1 shrink-0" />
            </Link>
          );
        })}
      </div>

      <Link
        href={`/modules/${mod.slug}/project`}
        className="flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-2xl px-5 py-4 hover:bg-brand-100/60 transition-colors"
      >
        {hydrated && isComplete(mod.slug, "project") ? (
          <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
        ) : (
          <FolderKanban className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <div className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-0.5">Hands-on project</div>
          <div className="font-semibold text-slate-900">{mod.project.title}</div>
          <div className="text-sm text-slate-600">{mod.project.summary}</div>
        </div>
        <ArrowRight className="w-4 h-4 text-brand-400 mt-1 shrink-0" />
      </Link>
    </main>
  );
}
