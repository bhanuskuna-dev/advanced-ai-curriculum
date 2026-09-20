## The loop itself

An agent is the tool-use loop from the Tool Design & MCP Integration module, run for more than one turn:

```typescript
let response = await client.messages.create({ model, max_tokens: 1024, tools, messages });

while (response.stop_reason === "tool_use") {
  const toolUse = response.content.find((b) => b.type === "tool_use")!;
  const result = await runTool(toolUse.name, toolUse.input);

  messages.push({ role: "assistant", content: response.content });
  messages.push({
    role: "user",
    content: [{ type: "tool_result", tool_use_id: toolUse.id, content: JSON.stringify(result) }],
  });

  response = await client.messages.create({ model, max_tokens: 1024, tools, messages });
}
```

What makes this an *agentic* loop rather than a scripted sequence is that neither you nor the code decides what happens on iteration 3 — the model does, based on what iterations 1 and 2 actually returned.

## Stopping conditions are not optional

An unbounded loop is a production incident waiting to happen — a model that keeps finding a reason to call one more tool will keep calling tools, and you pay for every one of them. Every agent needs a hard cap and a clean way to end:

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

`tool_choice: { type: "none" }` on that final call forces text instead of another tool request — a clean way to end a loop that's run too long, rather than cutting it off mid-thought or returning nothing.

## Giving the loop room to plan

For tasks where the right tool sequence isn't obvious, it helps to let the model state its reasoning in a text block before calling a tool, rather than jumping straight to a call from a terse instruction. This isn't a special mode — it falls out of a system prompt that asks for it directly: "before calling a tool, briefly state what you're trying to find out and why this tool is the right one." It costs a little context and turns tool selection from a black box into something you can debug by reading the transcript — which matters more than it sounds like the first time a loop does something you didn't expect and you need to know why.

## A worked example: requirements automation

A real agentic loop built to turn discovery notes into a documented feature: at each step, it might pull existing context, discover the feature touches an area with an open regulatory requirement, and decide — on its own, mid-loop — to check that requirement before drafting scenarios. That branch isn't in the code; it's a consequence of the model reading its own tool results and deciding what it needs next. That's the actual signature of an agentic loop, as distinct from a pipeline that merely happens to call several tools in a fixed order.

## The smell test for "did I actually need an agent here"

If you can look at a running system and predict, in advance, the exact sequence of tool calls it will make regardless of what any of them return, you've built a pipeline with extra steps, not an agent — and that's fine, a pipeline is simpler to reason about and cheaper to run. Agentic architecture earns its complexity specifically where the next step depends on information you don't have until a previous step returns it. "Discovery → feature definition → scenario documentation" as a fixed three-stage sequence is a pipeline; deciding *within* the discovery stage which follow-up questions still need asking is the part that's genuinely agentic. Most real systems are a mix of both, and knowing which parts are which is what separates a working architecture from an over-built one.
