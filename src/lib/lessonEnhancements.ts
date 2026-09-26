import type { ComponentType } from "react";
import type { QuickCheckQuestion } from "@/components/QuickCheck";
import { AgenticLoopDiagram } from "@/components/diagrams/AgenticLoopDiagram";
import { ToolUseRoundTripDiagram } from "@/components/diagrams/ToolUseRoundTripDiagram";
import { McpDiagram } from "@/components/diagrams/McpDiagram";
import { PermissionPrecedenceDiagram } from "@/components/diagrams/PermissionPrecedenceDiagram";
import { PromptCacheDiagram } from "@/components/diagrams/PromptCacheDiagram";
import { StructuredOutputDiagram } from "@/components/diagrams/StructuredOutputDiagram";
import { ContextPruningDiagram } from "@/components/diagrams/ContextPruningDiagram";

export interface LessonEnhancement {
  keyTakeaways: string[];
  quickCheck: QuickCheckQuestion[];
  Diagram?: ComponentType;
}

export const LESSON_ENHANCEMENTS: Record<string, LessonEnhancement> = {
  "agentic-architecture/agent-design-fundamentals": {
    keyTakeaways: [
      "An agent's defining trait isn't tool use or step count — it's that the next action is decided by the model based on results no one could have predicted in advance.",
      "If a human could predict the exact sequence of steps beforehand, that's a pipeline, not an agent — and pipelines are cheaper and easier to debug.",
      "Before building an agent, check complexity, value, model viability, and cost of error — skip agentic architecture if any of these say no.",
    ],
    quickCheck: [
      {
        question: "A workflow always executes the same three steps in the same order, no matter what each step returns. What is this?",
        options: ["An agent", "A pipeline", "A multi-agent system", "Not a valid architecture"],
        correctIndex: 1,
        explanation: "A fixed sequence that doesn't adapt to intermediate results is a pipeline, regardless of whether a model is involved in one of its steps.",
      },
      {
        question: "Which of the following is NOT one of the four checks before building an agent?",
        options: ["Complexity", "Popularity", "Value", "Cost of error"],
        correctIndex: 1,
        explanation: "Popularity of the technique is irrelevant — the real checks are complexity, value, model viability, and cost of error.",
      },
    ],
  },
  "agentic-architecture/the-agentic-loop": {
    keyTakeaways: [
      "An agent is just the tool-use loop run for more than one turn — there's no separate “agent mode” in the API.",
      "Always cap iterations and force a final text answer (tool_choice: none) when the cap is hit, or the loop can run unbounded.",
      "Letting the model briefly state why it's calling a tool turns tool selection from a black box into something debuggable.",
    ],
    quickCheck: [
      {
        question: "What's the risk of not capping iterations in an agentic loop?",
        options: ["It reduces accuracy", "It can run indefinitely with unbounded cost", "The API rejects the request", "Tool calls become synchronous"],
        correctIndex: 1,
        explanation: "Without a cap, a loop that keeps finding reasons to call tools has no guaranteed stopping point.",
      },
      {
        question: "After hitting the iteration cap with stop_reason still tool_use, what should you do?",
        options: ["Return nothing", "Force a final call with tool_choice: none", "Restart the loop", "Increase max_tokens only"],
        correctIndex: 1,
        explanation: "Forcing tool_choice to none makes the model answer in text instead of requesting yet another tool.",
      },
    ],
    Diagram: AgenticLoopDiagram,
  },
  "agentic-architecture/multi-agent-orchestration": {
    keyTakeaways: [
      "Splitting work across agents trades per-agent simplicity for real coordination cost: more latency, more code, multiplied (not additive) expense.",
      "Orchestrator/worker keeps the orchestrator's context small by only exposing it to workers' final outputs, not their process.",
      "Debate/verification earns its extra pass specifically on high-stakes outputs prone to overconfident, unverified claims.",
    ],
    quickCheck: [
      {
        question: "In orchestrator/worker, what does the orchestrator typically see from a worker?",
        options: ["Every intermediate tool call", "Only the final output", "The worker's system prompt", "Nothing"],
        correctIndex: 1,
        explanation: "Orchestrator/worker keeps the orchestrator's own context small and focused on integration, not execution detail.",
      },
      {
        question: "When is a debate/verification pattern worth its cost?",
        options: ["For every task", "For high-stakes outputs prone to a specific costly error class", "For low-stakes chat", "Never"],
        correctIndex: 1,
        explanation: "The extra pass is justified specifically where catching overconfident or unverified claims is worth the added cost.",
      },
    ],
  },
  "agentic-architecture/production-agent-architecture": {
    keyTakeaways: [
      "Decide deliberately what data crosses the client/server trust boundary — send only aggregates, never raw sensitive records, to a server-side model call.",
      "The Messages API has no server-side memory — your application must explicitly decide where conversation state lives and how it recovers from a mid-task failure.",
      "Deployment autonomy should scale with the cost of a mistake: a read-only research agent and a production write-access agent shouldn't get the same oversight.",
    ],
    quickCheck: [
      {
        question: "Why send only a computed aggregate to a server-side model call instead of raw records?",
        options: ["Aggregates are cheaper to compute", "It minimizes what crosses a trust boundary, limiting exposure", "The API rejects large payloads", "It improves model accuracy"],
        correctIndex: 1,
        explanation: "Sending only what's sufficient for the task limits exposure even if the server-side call is logged or misused.",
      },
      {
        question: "What should a system do when its primary agentic path is completely unavailable?",
        options: ["Return nothing and let it time out", "Have a defined degraded fallback or honest failure message", "Retry indefinitely", "Silently substitute a random answer"],
        correctIndex: 1,
        explanation: "Graceful degradation means a defined fallback or a visible, honest failure — never an undefined crash.",
      },
    ],
  },
  "agentic-architecture/observability-and-debugging": {
    keyTakeaways: [
      "A wrong multi-step answer could come from any step — only the full transcript lets you localize which one actually failed.",
      "Log every tool call's arguments, every result (including errors), and the model's stated reasoning if you asked for it.",
      "A recurring, specific misstep pattern across transcripts points to a fixable tool-description or prompt issue, not random unreliability.",
    ],
    quickCheck: [
      {
        question: "Why are full transcripts the primary tool for debugging a wrong multi-step answer?",
        options: ["They reduce token cost", "The mistake could be in any step, and only the full sequence shows which one", "They are required by the API", "They speed up the loop"],
        correctIndex: 1,
        explanation: "A wrong final answer alone doesn't reveal which of several steps actually caused it.",
      },
      {
        question: "A recurring failure shows the same tool mis-selected in the same scenario. What does this indicate?",
        options: ["Random unreliability to tolerate", "An underspecified tool description — a fixable design issue", "The iteration cap is too high", "Nothing actionable"],
        correctIndex: 1,
        explanation: "A specific, repeated pattern points at a concrete, fixable cause rather than inherent model flakiness.",
      },
    ],
  },

  "tool-design-mcp/tool-use-loop": {
    keyTakeaways: [
      "Claude never executes anything — it only requests a tool call; your code decides whether and how to run it.",
      "A tool's description matters as much as its schema: it's what determines whether the model calls it correctly at all.",
      "Tool errors should come back as a structured tool_result with is_error: true, never a crash or a disguised success.",
    ],
    quickCheck: [
      {
        question: "What does Claude actually produce when it “uses” a tool?",
        options: ["Executed code", "A structured request naming the tool and arguments", "A finished result", "A new tool definition"],
        correctIndex: 1,
        explanation: "Claude only requests a tool call — your code retains full control over whether and how it actually runs.",
      },
      {
        question: "How should a failed tool call be surfaced back to the model?",
        options: ["Throw an exception", "tool_result with is_error: true", "Silently retry forever", "Drop the tool_use from history"],
        correctIndex: 1,
        explanation: "A structured error result lets the model recover — retry, ask for clarification, or fall back.",
      },
    ],
    Diagram: ToolUseRoundTripDiagram,
  },
  "tool-design-mcp/designing-tool-schemas": {
    keyTakeaways: [
      "Narrow, specific tools are easier to select correctly, secure, and test than one broad do-anything tool.",
      "required fields and enums prevent malformed calls from ever forming, rather than catching them after the fact.",
      "strict: true guarantees a tool_use input validates exactly against the schema — but says nothing about whether the values are semantically correct.",
    ],
    quickCheck: [
      {
        question: "What's the main risk of a tool with one free-text “run arbitrary query” parameter?",
        options: ["It's too slow", "It gives the model latitude for wrong or dangerous calls with no reviewable boundary", "It can't be cached", "It needs no description"],
        correctIndex: 1,
        explanation: "A broad, flexible tool trades away the reviewability that comes from a narrow, bounded set of possible calls.",
      },
      {
        question: "What does strict: true NOT guarantee?",
        options: ["Correct types", "Required fields present", "Semantically correct values", "No extra fields"],
        correctIndex: 2,
        explanation: "Strict mode guarantees structural validity, not that the values inside are factually or semantically correct.",
      },
    ],
  },
  "tool-design-mcp/mcp-model-context-protocol": {
    keyTakeaways: [
      "MCP standardizes the interface between your application and external systems — it doesn't change how Claude itself thinks about tools.",
      "Reach for an MCP server when a maintained one already exists, or when the same integration needs to be reusable across apps.",
      "Treat tool descriptions from a third-party MCP server as untrusted input — a compromised server can inject instructions through them.",
    ],
    quickCheck: [
      {
        question: "From Claude's point of view, how does an MCP tool differ from a hand-rolled one?",
        options: ["It's faster", "They look identical — a name, description, and schema", "It has no schema", "It bypasses the tool-use loop"],
        correctIndex: 1,
        explanation: "MCP changes how your application acquires tools, not how the model perceives or selects them.",
      },
      {
        question: "Why treat third-party MCP tool descriptions as untrusted?",
        options: ["They're always in another language", "A compromised server could craft a description to manipulate the model", "MCP tools have no name field", "This isn't actually necessary"],
        correctIndex: 1,
        explanation: "A malicious or compromised server can supply a description crafted as a form of prompt injection.",
      },
    ],
    Diagram: McpDiagram,
  },
  "tool-design-mcp/integrating-external-systems": {
    keyTakeaways: [
      "Tool credentials belong entirely in your code, never in the model's context — this closes off a real exfiltration risk.",
      "Side-effecting tools need idempotency protection, since an agent may retry an uncertain-success call more readily than a cautious human would.",
      "Rate-limit and timeout failures should return as structured, recoverable tool errors, not crashes.",
    ],
    quickCheck: [
      {
        question: "Why should a tool's auth credentials never be visible to the model?",
        options: ["Models can't process strings", "It removes an injection-based exfiltration risk entirely", "It violates schema format", "Credentials should be included for transparency"],
        correctIndex: 1,
        explanation: "Keeping credentials server-side means there's nothing in context for an injected instruction to try to exfiltrate.",
      },
      {
        question: "What prevents a retried side-effecting tool call from duplicating its effect?",
        options: ["Increasing max_tokens", "Idempotency protection (a key or naturally idempotent design)", "Renaming the tool", "Nothing needed"],
        correctIndex: 1,
        explanation: "Idempotency lets a retried call be recognized as a repeat rather than a new action.",
      },
    ],
  },

  "claude-code-workflows/what-is-claude-code": {
    keyTakeaways: [
      "The Claude API, the Agent SDK, and Claude Code are three different products — Claude Code is the ready-to-use CLI built on the same harness the SDK exposes as a library.",
      "Claude Code ships with built-in tools (file edit, bash, search) already available — you configure how they're used, not whether they exist.",
      "Its permission system is what lets you use an agentic tool in a real project without granting unconditional filesystem/shell access.",
    ],
    quickCheck: [
      {
        question: "What's the key difference between the Agent SDK and Claude Code?",
        options: ["They're identical", "The SDK is a library you host yourself; Claude Code is the ready-to-use CLI on the same harness", "Claude Code can't use tools", "The SDK only works with raw API calls"],
        correctIndex: 1,
        explanation: "Both share the same harness, but the SDK is consumed as a library while Claude Code is a ready-to-use product.",
      },
      {
        question: "What does Claude Code's permission system primarily provide?",
        options: ["Faster execution", "A mechanical boundary on allowed actions, independent of the model's judgment", "A visual theme", "Model selection"],
        correctIndex: 1,
        explanation: "Permission rules are a code-enforced boundary, not a request that depends on the model's compliance.",
      },
    ],
  },
  "claude-code-workflows/claude-md-and-settings": {
    keyTakeaways: [
      "CLAUDE.md is standing project context loaded automatically every session — keep it concise and high-signal, not exhaustive documentation.",
      "Settings layer at project (shared, checked in), local (personal, not checked in), and user (global) scope, so teams and individuals can coexist.",
      "Combined permission rules resolve deny → ask → allow — a broad allow can never override a more specific deny.",
    ],
    quickCheck: [
      {
        question: "Why are project settings typically checked into version control while local settings aren't?",
        options: ["Local settings are more important", "Project settings are shared team policy; local settings are personal overrides", "Git can't store JSON", "No real reason"],
        correctIndex: 1,
        explanation: "Checking in shared policy while keeping personal overrides out lets a team stay consistent while individuals still customize.",
      },
      {
        question: "A call matches both an allow rule and a more specific deny rule. What happens?",
        options: ["Allowed, since it's more general", "Denied — deny always beats allow in the combined rule set", "The user decides randomly", "This is a configuration error"],
        correctIndex: 1,
        explanation: "Rules from every scope combine and resolve deny → ask → allow, regardless of specificity or scope.",
      },
    ],
    Diagram: PermissionPrecedenceDiagram,
  },
  "claude-code-workflows/hooks-and-automation": {
    keyTakeaways: [
      "A hook enforces a rule mechanically in code, regardless of what the model decides — the right place for genuinely non-negotiable rules.",
      "PreToolUse/PostToolUse fire around a specific tool call; SessionStart/Stop fire around the session lifecycle.",
      "Reserve hooks for fixed, mechanical rules or unconditional side effects — leave nuanced judgment calls to the model.",
    ],
    quickCheck: [
      {
        question: "Why is a hook more reliable than a system-prompt instruction for a non-negotiable rule?",
        options: ["Hooks run faster", "A hook enforces deterministically regardless of the model's compliance", "Prompts are more expensive", "There's no real difference"],
        correctIndex: 1,
        explanation: "A hook is code in the execution path — it doesn't depend on the model remembering or choosing to follow an instruction.",
      },
      {
        question: "Which hook event fires when Claude finishes responding?",
        options: ["PreToolUse", "Stop", "SessionStart", "PostToolUse"],
        correctIndex: 1,
        explanation: "Stop fires when the model finishes responding — one of the small set of events covering most real use cases.",
      },
    ],
  },
  "claude-code-workflows/slash-commands-and-subagents": {
    keyTakeaways: [
      "A custom slash command turns a repeated multi-paragraph instruction into one maintained, shareable source of truth.",
      "A subagent can have its own scoped instructions, tools, and model — orchestrator/worker applied to how Claude Code delegates work.",
      "Scoping a subagent's tools to only what its job needs means a mistake in that sub-task structurally can't exceed that scope.",
    ],
    quickCheck: [
      {
        question: "What's the main benefit of a custom slash command over retyping an instruction?",
        options: ["It runs faster on the CPU", "One maintained source of truth instead of drift across retyped versions", "It's the only way to invoke Claude Code", "It disables permissions"],
        correctIndex: 1,
        explanation: "A saved command definition avoids inconsistency from everyone retyping their own version of the same workflow.",
      },
      {
        question: "Why give a code-review subagent read-only access?",
        options: ["To make it slower", "So a mistake in that task can't cause an unintended write", "Subagents can't have tool access", "It's required by default"],
        correctIndex: 1,
        explanation: "Least-privilege scoping means even a flawed sub-task execution structurally cannot exceed its granted access.",
      },
    ],
  },
  "claude-code-workflows/headless-and-ci-workflows": {
    keyTakeaways: [
      "Headless mode runs one prompt to completion non-interactively, turning Claude Code into a capability a script can call, not just a tool a person uses.",
      "Structured output modes let a wrapping script reliably parse success/failure rather than reading conversational prose.",
      "Permission scoping matters more in automation than interactively, since no human is present to catch a risky action in real time.",
    ],
    quickCheck: [
      {
        question: "What does headless mode enable that interactive mode doesn't?",
        options: ["Bigger context windows", "Invocation as a step in a script or CI pipeline with no human waiting", "Access to more tools", "Always-faster responses"],
        correctIndex: 1,
        explanation: "Headless mode is what turns Claude Code into a capability a system can call programmatically.",
      },
      {
        question: "Why does permission scoping matter more for CI automation than for a supervised session?",
        options: ["CI has no permission system", "No human is present to catch a risky action before it happens", "CI jobs are always slower", "It doesn't matter more"],
        correctIndex: 1,
        explanation: "Without a human watching in real time, the permission configuration itself has to be the safeguard.",
      },
    ],
  },

  "prompt-engineering/prompt-engineering-fundamentals": {
    keyTakeaways: [
      "The model only responds to what's actually on the page — an unstated requirement is a guess, not an inference.",
      "Concrete context and a well-chosen example usually beat clever phrasing of the same vague instruction.",
      "Positive, concrete instructions (“respond in 2-3 sentences”) are easier to satisfy exactly than negative ones (“don't be verbose”).",
    ],
    quickCheck: [
      {
        question: "Why is “review this code” an ambiguous prompt?",
        options: ["It's too short", "It doesn't specify bugs vs. style vs. explanation, so the model has to guess", "The model can't read code", "It lacks a greeting"],
        correctIndex: 1,
        explanation: "Without stating the specific task, the model has to guess among several plausible interpretations.",
      },
      {
        question: "Which is generally more reliable for getting a specific output format?",
        options: ["A long abstract description", "One or two well-chosen examples", "Repeating the instruction in all caps", "Asking twice"],
        correctIndex: 1,
        explanation: "A concrete example resolves edge-case ambiguity that abstract descriptions often miss.",
      },
    ],
  },
  "prompt-engineering/system-prompts-and-roles": {
    keyTakeaways: [
      "System prompt = persistent behavior; user turn = the actual task — mixing them hurts both caching and injection resistance.",
      "A real role specifies knowledge boundaries and priorities under conflict, not just a label like “you are an expert.”",
      "Role prompting shapes tone and framing — it doesn't grant the model new information or capability it didn't already have.",
    ],
    quickCheck: [
      {
        question: "What belongs in the system prompt vs. the user turn?",
        options: ["Everything in the system prompt", "Persistent behavior in the system prompt, the specific task in the user turn", "Everything in the user turn", "It doesn't matter"],
        correctIndex: 1,
        explanation: "Splitting persistent instructions from the per-request task is both semantically correct and cache-friendly.",
      },
      {
        question: "What does role prompting actually change?",
        options: ["The model's underlying knowledge", "Tone, vocabulary, and framing — not new capability", "Nothing measurable", "The context window size"],
        correctIndex: 1,
        explanation: "A role is a framing tool; it doesn't grant facts or reasoning ability the model wouldn't otherwise have.",
      },
    ],
  },
  "prompt-engineering/chain-of-thought-prompting": {
    keyTakeaways: [
      "Step-by-step reasoning helps on genuinely multi-step problems by giving the model a chance to catch its own errors mid-chain.",
      "Requesting reasoning on a simple single-inference task adds cost and latency with no accuracy benefit.",
      "Visible reasoning is a debugging tool, but isn't guaranteed to be perfectly faithful to how the final answer was actually reached.",
    ],
    quickCheck: [
      {
        question: "When does chain-of-thought prompting help most?",
        options: ["Simple lookups", "Genuinely multi-step reasoning tasks", "Single-word answers", "Never"],
        correctIndex: 1,
        explanation: "Chaining intermediate steps gives the model a chance to catch errors before committing to a final answer.",
      },
      {
        question: "What should you do before trusting visible reasoning to justify a decision?",
        options: ["Nothing, it's always faithful", "Spot-check that it's actually consistent with the final answer", "Ignore the reasoning entirely", "Disable thinking"],
        correctIndex: 1,
        explanation: "Stated reasoning can occasionally be inconsistent with the actual final answer, so faithfulness isn't guaranteed.",
      },
    ],
  },
  "prompt-engineering/structured-output-and-schemas": {
    keyTakeaways: [
      "Plain “respond in JSON” instructions rely on free-text compliance, which can drift under real traffic.",
      "Tool-based (strict) or native structured output pushes the format guarantee into the API contract, not the model's best effort.",
      "Schema validation guarantees shape, not truth — you still need to check the values inside are actually correct.",
    ],
    quickCheck: [
      {
        question: "Why is “just ask for JSON” insufficient for production use?",
        options: ["JSON isn't supported", "Free-text compliance can drift and break a parser", "It costs more", "It disables tools"],
        correctIndex: 1,
        explanation: "An extra sentence of preamble or a stray code fence can slip through and break a naive parser.",
      },
      {
        question: "What does a schema-validated response guarantee?",
        options: ["The values are factually correct", "The shape matches the schema", "Nothing at all", "Faster generation"],
        correctIndex: 1,
        explanation: "Structural validity is guaranteed; semantic correctness of the values still needs separate checking.",
      },
    ],
    Diagram: StructuredOutputDiagram,
  },
  "prompt-engineering/iterating-and-testing-prompts": {
    keyTakeaways: [
      "Treat a prompt like a versioned artifact: test changes against a representative set, not just the one example that motivated the change.",
      "A/B comparison on a fixed test set beats sequential “try one then the other” judgment.",
      "Diminishing returns on a broad test set is a signal to look past the prompt for the real bottleneck.",
    ],
    quickCheck: [
      {
        question: "Why is testing a prompt change only against the motivating example a mistake?",
        options: ["It takes too long", "It reveals nothing about whether the change broke something else", "The API charges extra", "Prompts can't be tested"],
        correctIndex: 1,
        explanation: "A single-example check confirms the targeted case but says nothing about unintended regressions elsewhere.",
      },
      {
        question: "What's the risk of over-iterating a prompt against a very small test set?",
        options: ["Using less context", "Overfitting to quirks that don't generalize", "API rejection", "No risk at all"],
        correctIndex: 1,
        explanation: "A prompt tuned obsessively against a narrow set can pick up quirks specific to it that don't hold up broadly.",
      },
    ],
  },

  "context-reliability/context-window-fundamentals": {
    keyTakeaways: [
      "The API is stateless — every request resends the full history the model needs to know about.",
      "max_tokens is a hard ceiling; a cut-off response shows stop_reason: max_tokens, not end_turn.",
      "Conversation length is a real cost driver even when the newest question is short, since the whole history is resent every turn.",
    ],
    quickCheck: [
      {
        question: "Why must the full conversation be resent every request?",
        options: ["For billing only", "The API is stateless and has no memory of prior turns otherwise", "It's optional", "The model caches it automatically"],
        correctIndex: 1,
        explanation: "There's no server-side memory — anything the model needs to know must be included again in the current request.",
      },
      {
        question: "What does stop_reason: max_tokens mean?",
        options: ["The model finished naturally", "The response was truncated by the length ceiling", "A refusal occurred", "A tool was called"],
        correctIndex: 1,
        explanation: "max_tokens is a hard cutoff — hitting it truncates the response mid-generation rather than concluding it.",
      },
    ],
  },
  "context-reliability/managing-long-running-context": {
    keyTakeaways: [
      "Summarize or drop tool results once they've informed a decision — they're resent and rebilled every turn otherwise.",
      "Cross-session memory isn't automatic; it's a deliberate extract-store-reinject system you build, not silent accumulation.",
      "An unmanaged long run can bury the currently-relevant information under accumulated, mostly stale history.",
    ],
    quickCheck: [
      {
        question: "Why summarize a tool result once it's done its job?",
        options: ["It's required by the API", "It's still resent and rebilled on every later turn otherwise", "It improves the model's tone", "It has no benefit"],
        correctIndex: 1,
        explanation: "Every turn re-sends the full history, so a bulky result you no longer need keeps costing you until it's trimmed.",
      },
      {
        question: "Why is cross-session memory built deliberately rather than left automatic?",
        options: ["It's technically impossible otherwise", "Unbounded automatic accumulation would make behavior hard to predict and audit", "Memory would slow down responses", "There's no real reason"],
        correctIndex: 1,
        explanation: "A deliberately scoped memory system keeps behavior legible, unlike silent, unbounded accumulation.",
      },
    ],
    Diagram: ContextPruningDiagram,
  },
  "context-reliability/prompt-caching-and-cost": {
    keyTakeaways: [
      "Cache the stable prefix (system prompt, tool defs) and put variable content after it — order matters for cache hits.",
      "A cache hit costs roughly 90% less on the cached portion; check cache_read_input_tokens to confirm it's actually happening.",
      "Route cheap classification to a fast model and reserve the expensive model for the step that genuinely needs deep reasoning.",
    ],
    quickCheck: [
      {
        question: "Why does putting variable content after the cached prefix matter?",
        options: ["It doesn't matter", "Caching matches a shared prefix, and variable content breaks that match if placed inside it", "It reduces token count", "It's a style preference"],
        correctIndex: 1,
        explanation: "Any change inside the prefix invalidates the cache for everything after it, so volatile content belongs after the cached block.",
      },
      {
        question: "A near-zero cache_read_input_tokens on repeated similar requests usually means:",
        options: ["Everything is working correctly", "A silent invalidator is breaking the prefix match", "The account is rate-limited", "Nothing significant"],
        correctIndex: 1,
        explanation: "This is the standard symptom of something unexpectedly varying inside what should be a stable, cached prefix.",
      },
    ],
    Diagram: PromptCacheDiagram,
  },
  "context-reliability/reliability-patterns": {
    keyTakeaways: [
      "Retry 429/5xx transient errors with backoff; don't retry 400-class errors, which will fail identically every time.",
      "A repair loop that sends malformed output back to the model for correction resolves many structured-output failures automatically.",
      "Never let a caught failure silently masquerade as a successful default — that removes the ability to even detect it went wrong.",
    ],
    quickCheck: [
      {
        question: "Which error types are generally worth retrying?",
        options: ["400-class only", "429 and 5xx (transient failures)", "None, ever", "All errors identically"],
        correctIndex: 1,
        explanation: "429/5xx are typically transient; a 400 reflects a malformed request that retrying won't fix.",
      },
      {
        question: "What's wrong with catching a tool error and silently returning a default success-looking value?",
        options: ["Nothing, it's good practice", "It hides a real failure so it can never be detected or debugged", "It's slower", "It violates the schema"],
        correctIndex: 1,
        explanation: "A silently swallowed failure that looks like success is worse than a visible error — it can't even be detected.",
      },
    ],
  },
};

export function getLessonEnhancement(moduleSlug: string, lessonSlug: string): LessonEnhancement | undefined {
  return LESSON_ENHANCEMENTS[`${moduleSlug}/${lessonSlug}`];
}
