import { Sparkles } from "lucide-react";

export function KeyTakeaways({ points }: { points: string[] }) {
  return (
    <div className="bg-brand-50 border border-brand-100 rounded-2xl px-5 py-4 mb-6">
      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wide mb-2.5">
        <Sparkles className="w-3.5 h-3.5" />
        In 30 seconds
      </div>
      <ul className="space-y-1.5">
        {points.map((p, i) => (
          <li key={i} className="text-sm text-slate-700 leading-relaxed flex gap-2">
            <span className="text-brand-400 font-bold shrink-0">→</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
