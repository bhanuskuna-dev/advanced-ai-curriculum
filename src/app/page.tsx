"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, MessageCircleQuestion, Sparkles } from "lucide-react";
import { CURRICULUM } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";

export default function HomePage() {
  const { hydrated, percentForModule } = useProgress();

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Aligned to the Claude Certified Architect – Foundations exam
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Become an advanced AI user
        </h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed">
          Five modules in a deliberate sequence — each one builds on the skills from the last, from talking to Claude
          well, through giving it tools, to composing full agents, to operating Claude Code itself. Structured
          lessons, an AI tutor, a hands-on project per module, and 3 full-length practice exams, domain-weighted to
          match the real Claude Certified Architect exam.
        </p>
      </div>

      <div className="space-y-3">
        {CURRICULUM.map((mod, i) => (
          <Link
            key={mod.slug}
            href={`/modules/${mod.slug}`}
            className="group flex gap-4 bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow p-5 sm:p-6"
          >
            <div className="shrink-0 w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h2 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{mod.title}</h2>
                <span className="shrink-0 text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{mod.weight}% of exam</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">{mod.description}</p>

              <div className="mb-3 max-w-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{mod.lessons.length} lessons + 1 project</span>
                  <span className="tabular-nums">{hydrated ? percentForModule(mod.slug) : 0}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${hydrated ? percentForModule(mod.slug) : 0}%` }}
                  />
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                {i === 0 ? "Start here" : "Start module"}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mt-6">
        <Link
          href="/practice-exams"
          className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">Take a practice exam</div>
            <div className="text-sm text-slate-500">3 full 60-question mock exams, domain-weighted like the real thing.</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 ml-auto shrink-0" />
        </Link>

        <Link
          href="/tutor"
          className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <MessageCircleQuestion className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">Ask the AI tutor anything</div>
            <div className="text-sm text-slate-500">Open-ended questions across the whole curriculum.</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 ml-auto shrink-0" />
        </Link>
      </div>
    </main>
  );
}
