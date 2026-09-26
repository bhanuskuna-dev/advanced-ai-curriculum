import { DiagramCard } from "./DiagramCard";

export function PromptCacheDiagram() {
  return (
    <DiagramCard caption="The stable prefix (system + tools) gets cached; only the varying tail costs full price on repeat requests.">
      <div className="max-w-lg mx-auto space-y-5">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Request 1 (cache write)</div>
          <div className="flex rounded-xl overflow-hidden border border-slate-200 text-xs font-mono">
            <div className="bg-brand-100 text-brand-800 px-4 py-3 flex-[3]">system + tool defs (stable)</div>
            <div className="bg-slate-100 text-slate-600 px-4 py-3 flex-1">user msg</div>
          </div>
          <div className="text-[11px] text-slate-400">full price — prefix is processed and written to cache</div>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Request 2 (cache hit)</div>
          <div className="flex rounded-xl overflow-hidden border border-slate-200 text-xs font-mono">
            <div className="bg-success-100 text-success-800 px-4 py-3 flex-[3]">system + tool defs (identical prefix)</div>
            <div className="bg-slate-100 text-slate-600 px-4 py-3 flex-1">new user msg</div>
          </div>
          <div className="text-[11px] text-success-600 font-medium">~90% cheaper on the cached portion — only the tail is new</div>
        </div>
      </div>
    </DiagramCard>
  );
}
