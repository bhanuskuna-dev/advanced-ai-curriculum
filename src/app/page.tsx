"use client";

import Link from "next/link";
import { ArrowRight, MessageCircleQuestion, Sparkles } from "lucide-react";
import { CURRICULUM } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";

export default function HomePage() {
  const { hydrated, percentForModule } = useProgress();

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Self-paced curriculum
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Become an advanced AI user
        </h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed">
          Three modules, each with structured lessons, an AI tutor to ask questions along the way, and a
          hands-on project you build yourself. No fluff on prompting basics — this goes straight into building
          real systems with the Claude API, retrieval, and the evals discipline that keeps them reliable.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {CURRICULUM.map((mod) => (
          <Link
            key={mod.slug}
            href={`/modules/${mod.slug}`}
            className="group bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow p-6 flex flex-col"
          >
            <h2 className="font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">{mod.title}</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">{mod.description}</p>

            <div className="mb-4">
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
              Start module
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/tutor"
        className="mt-6 flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow p-5"
      >
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
          <MessageCircleQuestion className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <div className="font-semibold text-slate-900">Ask the AI tutor anything</div>
          <div className="text-sm text-slate-500">Open-ended questions across the whole curriculum — not tied to one lesson.</div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 ml-auto" />
      </Link>
    </main>
  );
}
