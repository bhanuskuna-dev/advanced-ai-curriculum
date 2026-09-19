## Why tools exist

Claude is very good at reasoning and language, and bad at things it has no access to: your database, the current time, a calculator that doesn't hallucinate, or an internal API. Tool use (also called "function calling") closes that gap by letting Claude *request* that your code run something, then hand the result back.

The critical thing to internalize: **Claude never executes anything.** It only ever produces a structured request — "call this tool with these arguments" — and your code decides whether, and how, to actually run it. This is what makes tool use safe to reason about: every side effect passes through code you wrote and control.

## Defining a tool

A tool definition is a name, a description, and a JSON Schema for its inputs:

```typescript
const tools: Anthropic.Messages.Tool[] = [
  {
    name: "get_weather",
    description: "Get the current weather for a city.",
    input_schema: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name, e.g. 'Austin'" },
      },
      required: ["city"],
    },
  },
];
```

The `description` field matters more than people expect. Claude decides *whether* and *when* to call a tool based on how well the description communicates its purpose and limits. A vague description ("gets data") produces unreliable tool selection; a specific one ("returns current weather only, not forecasts, for a named city") produces reliable selection.

## The round trip

1. You send a request with `tools` attached and `tool_choice: { type: "auto" }` (let Claude decide) or a forced choice.
2. If Claude wants to use a tool, the response's `stop_reason` is `"tool_use"`, and `content` contains a `tool_use` block with an `id`, the tool `name`, and parsed `input`.
3. You run the actual function in your code, then send a **new** request whose `messages` array appends an `assistant` turn (Claude's tool_use block, verbatim) followed by a `user` turn containing a `tool_result` block referencing that same `id`.
4. Claude reads the result and either replies to the user or calls another tool.

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

That `while` loop *is* the tool-use loop. Everything an "agent framework" does is a more elaborate version of this same shape.

## Parallel tool calls

Claude can request multiple tools in a single turn — `content` will contain several `tool_use` blocks. Run them concurrently where they're independent, and return **all** their results in the same follow-up `user` turn, each `tool_result` matched to its `tool_use_id`. Mismatching IDs, or returning results for only some of the requested calls, is a common source of "the agent got confused" bugs — Claude is waiting for closure on every tool_use block it emitted.

## Failure modes worth knowing up front

- **Malformed or hallucinated arguments.** Claude can emit an `input` that doesn't match your schema's intent (a made-up city name, an out-of-range number). Validate inputs in your tool function; don't trust the schema alone to guarantee sanity.
- **Tool errors need to go back to Claude, not throw.** If a tool call fails (network error, invalid state), return a `tool_result` with `is_error: true` and a description of what went wrong. This lets Claude recover — retry with different arguments, ask the user for clarification, or fall back — rather than crashing the whole loop.
- **Over-triggering.** If Claude calls a tool when it didn't need to (e.g., calling a calculator for arithmetic it could do itself), tighten the tool description to state when *not* to use it, or narrow `tool_choice`.
- **Silent data leakage.** Tool results become part of the conversation history and get billed as input tokens on every subsequent turn. Returning a 50KB JSON blob from a tool means paying for it repeatedly. Return summarized or paginated results where the full payload isn't needed.

## A design instinct to build

The best tools are narrow and named for what they do, not how they're implemented — `find_top_savings_opportunities`, not `run_sql_query`. Narrow tools are easier for Claude to select correctly, easier for you to secure (no arbitrary SQL from an LLM), and easier to test in isolation. When a task feels like it needs one giant do-anything tool, that's usually a sign to decompose it into several specific ones instead.
