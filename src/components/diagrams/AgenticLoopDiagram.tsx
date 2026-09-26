import { DiagramCard, ArrowMarker } from "./DiagramCard";

export function AgenticLoopDiagram() {
  return (
    <DiagramCard caption="The agentic loop: Claude keeps requesting tools until it has enough to answer, or the iteration cap forces a final reply.">
      <svg viewBox="0 0 560 250" className="w-full min-w-[480px]" role="img" aria-label="Diagram of the agentic tool-use loop">
        <defs>
          <ArrowMarker id="arrow-slate" className="fill-slate-300" />
          <ArrowMarker id="arrow-brand" className="fill-brand-400" />
        </defs>

        {/* User */}
        <rect x="10" y="85" width="100" height="50" rx="10" className="fill-slate-50 stroke-slate-200" />
        <text x="60" y="115" textAnchor="middle" className="fill-slate-600 text-[13px] font-medium">User</text>

        {/* Claude */}
        <rect x="180" y="85" width="120" height="50" rx="10" className="fill-brand-50 stroke-brand-200" />
        <text x="240" y="115" textAnchor="middle" className="fill-brand-700 text-[13px] font-semibold">Claude</text>

        {/* Tool */}
        <rect x="420" y="85" width="120" height="50" rx="10" className="fill-slate-50 stroke-slate-200" />
        <text x="480" y="110" textAnchor="middle" className="fill-slate-600 text-[13px] font-medium">Your tool</text>
        <text x="480" y="126" textAnchor="middle" className="fill-slate-400 text-[11px]">code</text>

        {/* User -> Claude */}
        <line x1="110" y1="110" x2="176" y2="110" className="stroke-slate-300" strokeWidth="2" markerEnd="url(#arrow-slate)" />

        {/* Claude -> Tool (top curve) */}
        <path d="M300,95 Q360,70 418,95" fill="none" className="stroke-brand-300" strokeWidth="2" markerEnd="url(#arrow-brand)" />
        <text x="360" y="65" textAnchor="middle" className="fill-brand-600 text-[11px] font-medium">tool_use</text>

        {/* Tool -> Claude (bottom curve) */}
        <path d="M420,125 Q360,150 302,125" fill="none" className="stroke-slate-300" strokeWidth="2" markerEnd="url(#arrow-slate)" />
        <text x="360" y="163" textAnchor="middle" className="fill-slate-500 text-[11px] font-medium">tool_result</text>

        {/* loop label */}
        <text x="360" y="190" textAnchor="middle" className="fill-slate-400 text-[11px] italic">repeats while stop_reason === &quot;tool_use&quot; (capped)</text>

        {/* Claude -> Final answer */}
        <line x1="240" y1="135" x2="240" y2="178" className="stroke-success-400" strokeWidth="2" markerEnd="url(#arrow-brand)" />
        <text x="272" y="160" className="fill-success-600 text-[11px] font-medium">end_turn</text>

        <rect x="150" y="185" width="180" height="50" rx="10" className="fill-success-50 stroke-success-200" />
        <text x="240" y="215" textAnchor="middle" className="fill-success-700 text-[13px] font-semibold">Final answer to user</text>
      </svg>
    </DiagramCard>
  );
}
