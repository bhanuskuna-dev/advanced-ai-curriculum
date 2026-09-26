import { DiagramCard } from "./DiagramCard";

export function ContextPruningDiagram() {
  return (
    <DiagramCard caption="Old turns get compressed to a gist; recent turns stay verbatim — the budget goes where precision still matters.">
      <div className="max-w-lg mx-auto">
        <div className="flex items-end gap-1.5 mb-2">
          <div className="flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-4 text-center">
            <div className="text-[11px] font-mono text-slate-400">turns 1–12</div>
            <div className="text-xs text-slate-500 mt-1">1-line summary</div>
          </div>
          {["turn 13", "turn 14", "turn 15"].map((t) => (
            <div key={t} className="flex-1 bg-brand-50 border border-brand-200 rounded-lg px-3 py-4 text-center">
              <div className="text-[11px] font-mono text-brand-600">{t}</div>
              <div className="text-xs text-brand-700 mt-1">verbatim</div>
            </div>
          ))}
        </div>
        <div className="flex text-[10px] text-slate-400">
          <div className="flex-1 text-center">compressed once summarized/superseded</div>
          <div className="flex-[3] text-center">kept in full — still likely relevant</div>
        </div>
      </div>
    </DiagramCard>
  );
}
