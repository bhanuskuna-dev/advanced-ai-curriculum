import { DiagramCard, ArrowMarker } from "./DiagramCard";

export function McpDiagram() {
  return (
    <DiagramCard caption="MCP standardizes the client ↔ server link. Claude never sees the protocol — only an ordinary-looking tool definition.">
      <svg viewBox="0 0 600 220" className="w-full min-w-[520px]" role="img" aria-label="Diagram of the Model Context Protocol client-server relationship">
        <defs>
          <ArrowMarker id="arrow-slate2" className="fill-slate-300" />
          <ArrowMarker id="arrow-brand2" className="fill-brand-400" />
        </defs>

        {/* Claude */}
        <rect x="30" y="15" width="150" height="45" rx="10" className="fill-brand-50 stroke-brand-200" />
        <text x="105" y="43" textAnchor="middle" className="fill-brand-700 text-[13px] font-semibold">Claude</text>

        <line x1="105" y1="60" x2="105" y2="96" className="stroke-brand-300" strokeWidth="2" markerEnd="url(#arrow-brand2)" />
        <text x="180" y="82" className="fill-brand-500 text-[10px]">sees only name + schema</text>

        {/* Client */}
        <rect x="20" y="100" width="170" height="55" rx="10" className="fill-slate-50 stroke-slate-200" />
        <text x="105" y="125" textAnchor="middle" className="fill-slate-700 text-[12px] font-semibold">Your app</text>
        <text x="105" y="142" textAnchor="middle" className="fill-slate-500 text-[11px]">(MCP client)</text>

        {/* Server */}
        <rect x="235" y="100" width="150" height="55" rx="10" className="fill-slate-50 stroke-slate-200" />
        <text x="310" y="132" textAnchor="middle" className="fill-slate-700 text-[12px] font-semibold">MCP server</text>

        {/* External system */}
        <rect x="430" y="100" width="150" height="55" rx="10" className="fill-slate-50 stroke-slate-200" />
        <text x="505" y="125" textAnchor="middle" className="fill-slate-700 text-[12px] font-semibold">External</text>
        <text x="505" y="142" textAnchor="middle" className="fill-slate-500 text-[11px]">system / API</text>

        {/* Client <-> Server */}
        <line x1="192" y1="127" x2="233" y2="127" className="stroke-slate-300" strokeWidth="2" markerEnd="url(#arrow-slate2)" />
        <line x1="233" y1="118" x2="192" y2="118" className="stroke-slate-300" strokeWidth="2" markerEnd="url(#arrow-slate2)" />
        <text x="212" y="185" textAnchor="middle" className="fill-slate-400 text-[10px]">JSON-RPC</text>

        {/* Server <-> External */}
        <line x1="387" y1="127" x2="428" y2="127" className="stroke-slate-300" strokeWidth="2" markerEnd="url(#arrow-slate2)" />
        <line x1="428" y1="118" x2="387" y2="118" className="stroke-slate-300" strokeWidth="2" markerEnd="url(#arrow-slate2)" />
        <text x="407" y="185" textAnchor="middle" className="fill-slate-400 text-[10px]">API calls</text>

        <text x="300" y="205" textAnchor="middle" className="fill-slate-300 text-[10px] italic">any compliant client can use any compliant server</text>
      </svg>
    </DiagramCard>
  );
}
