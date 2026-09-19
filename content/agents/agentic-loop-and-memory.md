## From one tool call to an agent

A single tool call answers one question. An **agent** is what you get when you let the tool-use loop run for many iterations, with Claude deciding at each step whether it has enough information to answer, needs another tool, or needs to ask the user something. There's no separate "agent mode" in the API — it's the same `while (stop_reason === "tool_use")` loop from the previous lesson, just run longer and with more tools available.

What makes something feel like an agent rather than a chatbot with plugins is **multi-step planning that adapts to intermediate results**. A tool-using chatbot calls one tool and reports back. An agent might call a tool, look at the result, realize it needs a different tool based on what it found, call that, and only then decide it has enough to act — without you scripting that sequence in advance.

This is the actual shape of a requirements-automation agent that turns discovery notes into fully documented feature scenarios: it might pull existing policy context, realize the feature touches an area with an open regulatory requirement, and decide on its own to check that requirement before drafting scenarios — a branch you didn't hard-code, because you couldn't have predicted which features would trigger it.

## The loop, with a stopping condition

Unbounded loops are a production hazard. Always cap iterations and give Claude an explicit way to signal it's done:

```typescript
const MAX_STEPS = 8;
let steps = 0;

while (response.stop_reason === "tool_use" && steps < MAX_STEPS) {
  // ... run tool, append tool_result, call again ...
  steps++;
}

if (steps === MAX_STEPS && response.stop_reason === "tool_use") {
  // Force a final answer instead of silently truncating
  response = await client.messages.create({ model, max_tokens: 1024, messages, tool_choice: { type: "none" } });
}
```

Setting `tool_choice: { type: "none" }` on the final call forces Claude to respond in text rather than requesting yet another tool — a clean way to end a loop that's run too long without just cutting it off mid-thought.

## Context management: the real bottleneck

Every tool result you append stays in the conversation for the rest of the session, and gets re-sent (and re-billed) on every subsequent call. A long-running agent doing many tool calls will, left unmanaged, fill its context window with stale intermediate results and slow down, get more expensive, and — past a point — actually get *less* accurate, because relevant information is buried in noise the model has to sift through.

Three practical mitigations, roughly in order of how often you need them:

1. **Summarize, don't accumulate.** Once a tool result has been used to inform a decision, you often don't need the raw payload anymore — replace it with a short summary before the next call, or drop it from the history entirely if it's fully superseded. A scenario-documentation agent working through a large feature doesn't need every prior scenario's full text in context to write the next one — a one-line summary of what's already been covered is usually enough to avoid duplication.
2. **Return the minimum useful data from tools.** This is a tool-design decision (previous lesson) that pays off here: a tool that returns `{ total: 1240, category: "Dining" }` costs far less context than one that returns every underlying transaction.
3. **Prune or compact history at length thresholds.** For long conversations, replace the oldest N turns with a short summary message once the conversation crosses a token or turn-count threshold, keeping recent context verbatim and older context compressed.

## Memory is not automatic

"Memory" across sessions (as opposed to within one conversation) doesn't exist in the API by default — a new conversation starts with zero knowledge of a previous one. If you want an agent to remember facts across sessions, you build that yourself: extract durable facts at the end of a session (or on demand), store them (a database, a file, a vector store), and inject relevant ones into the system prompt or an early user turn of the *next* session. This is a deliberate design decision, not a missing feature — an agent that silently accumulates unbounded "memory" is one whose behavior becomes unpredictable and hard to audit.

## Giving the agent room to think

For tasks that need multi-step reasoning before acting, it often helps to let Claude reason in a text block before it calls a tool, rather than jumping straight to a tool call on a terse instruction. This isn't a special mode — it falls out naturally from a system prompt that asks for it: "Before calling a tool, briefly state what you're trying to find out and why this tool is the right one." Cheap to add, and it turns tool selection from a black box into something you can debug by reading the transcript.

## A concrete smell test

If you find yourself hand-coding the *sequence* of tool calls an agent should make ("first call A, then always call B with A's result"), you've built a fixed pipeline, not an agent — which is often the right choice! Agents earn their complexity when the right next step genuinely depends on what previous steps returned. If it doesn't, a deterministic pipeline is cheaper, faster, and easier to debug than paying an LLM to make a decision that was never actually in doubt.

Applied to the requirements-lifecycle example: "discovery → feature definition → scenario documentation" is a fixed sequence — always the same three stages in the same order — so that part is legitimately a pipeline, not a decision an agent needs to make fresh each time. What made it agentic was *within* each stage: deciding which follow-up questions a discovery conversation still needed, or which edge cases a scenario document had to cover, genuinely depended on what came before and couldn't be scripted in advance.
