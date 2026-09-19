## The shape of a request

Every interaction with Claude — whether it's a one-off question or a multi-step agent — goes through the same endpoint: the Messages API. A request has three parts that matter:

- **`system`** — instructions that apply to the whole conversation: persona, constraints, output format. Not a message in the list; a separate top-level field.
- **`messages`** — an array of turns, each with a `role` (`user` or `assistant`) and `content`. Content can be a plain string or a list of typed blocks (text, images, tool results).
- **`model` / `max_tokens`** — which model answers, and the hard ceiling on how much it can generate in this turn.

```typescript
const message = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  system: "You are a concise technical writing assistant.",
  messages: [{ role: "user", content: "Explain a hash map in two sentences." }],
});
```

Notice there's no separate "assistant" system role and no hidden conversation state on the server. The API is stateless: every request carries the *entire* conversation history you want Claude to see. If you don't include a previous turn, Claude has no memory of it. This is the single most important mental model shift for people used to chat UIs — you, the developer, own the conversation state.

## Roles are strict alternation

Claude enforces `user`, `assistant`, `user`, `assistant`... The first message must be from `user`, and you can't send two `user` turns in a row without an `assistant` turn between them. When you're building an agent that calls tools, this matters: a tool result gets packaged as a `user` message (with a `tool_result` content block), even though logically it "came from the system." You're still alternating roles from Claude's point of view — Claude spoke (`assistant`, requesting a tool), then something responded (`user`, the tool result).

## System prompts vs. the first user turn

A common mistake is cramming everything into the system prompt: persona, instructions, *and* the actual task. Split them. The system prompt should describe **how Claude should behave across the whole conversation** — tone, constraints, safety boundaries, output format. The first user message should carry **the actual request**. This separation matters for two reasons:

1. **Caching.** System prompts marked with `cache_control: { type: "ephemeral" }` can be cached server-side, so repeated requests with the same system prompt skip reprocessing it — cheaper and faster on every follow-up turn.
2. **Injection resistance.** If user-supplied content (a document, a transaction description, a scraped web page) ends up inside the system prompt, it can be harder to reason about what's "instruction" vs. "data." Keeping instructions in `system` and data in the user turn keeps the boundary explicit.

## Streaming

For anything user-facing, don't wait for the full response — stream it:

```typescript
const stream = client.messages.stream({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a haiku about compilers." }],
});

for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
    process.stdout.write(event.delta.text);
  }
}
```

Streaming doesn't change cost or the final content — it changes *when* the client sees tokens, which is the difference between a UI that feels alive and one that feels frozen for three seconds.

## Token usage is not free intuition

Every response includes a `usage` object: `input_tokens` and `output_tokens`. Input tokens include the system prompt, every prior message you resent, and any cached-but-still-billed-differently content. This is why conversation length matters for cost even when the actual new question is short — you're re-sending the whole history every single turn. Two practical consequences:

- **Truncate long histories.** Most production chat features cap history at the last N turns (20 is a common default) as a safety valve against runaway token growth and context dilution.
- **Watch `max_tokens`.** It's not a "target," it's a hard cutoff. If Claude's response gets cut off mid-sentence, `stop_reason` will be `"max_tokens"` instead of `"end_turn"` — always check `stop_reason` before treating a response as complete, especially when parsing structured output.

## What this sets up

Everything else in this module — tool use, the agentic loop, MCP, multi-agent systems — is built on top of this same primitive: a stateless list of messages, sent fresh every time, with the model choosing what to say next. An "agent" is not a different API. It's this same loop, run repeatedly, where some of the assistant's turns are requests to call a tool instead of replies to the user.
