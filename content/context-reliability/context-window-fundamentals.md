## The API is stateless

Every request to the Messages API carries the *entire* conversation history you want the model to see — there is no server-side memory of prior turns. If you don't include a previous message, the model has no knowledge it happened. This is the single most important mental model for anyone used to chat interfaces where history feels automatic: you, the developer, own the conversation state, and the model only ever sees exactly what's in the current request.

```typescript
const response = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  system: "You are a concise technical assistant.",
  messages: [
    { role: "user", content: "My deployment uses GCP." },
    { role: "assistant", content: "Got it — GCP-based deployment." },
    { role: "user", content: "What did I say my deployment uses?" },
  ],
});
// Only answerable because the prior turn was resent, not because the model "remembers" it.
```

## Token usage is the real cost and latency driver

Every response includes a `usage` object reporting `input_tokens` and `output_tokens`. Input tokens include the system prompt, every prior message you resend, and any tool results accumulated so far. This is why conversation length is a cost variable even when the newest question is short — you're re-sending and re-billing for the entire history on every single turn. A ten-turn conversation with growing tool-result context can spend more processing turns 8 through 10 than it spends on the actual new content in those turns.

## `max_tokens` is a hard ceiling, not a target

If a response hits `max_tokens` before finishing, `stop_reason` will be `"max_tokens"` instead of `"end_turn"` — the response is truncated mid-thought, not concluded. Always check `stop_reason` before treating a response as complete, particularly when parsing structured output: a JSON object cut off mid-field will fail to parse, and the failure mode looks like a formatting bug rather than what it actually is — an output-length problem.

## The context window is finite, and "large" doesn't mean "free to fill"

Even with large context windows, filling them isn't free: every token in context costs money and processing time, and — past a point — relevant information can get diluted among irrelevant context in a way that measurably hurts response quality, not just cost. A million-token context window changes what's *possible*, not what's *efficient*. The practical discipline is the same either way: include what the model actually needs for the current task, not everything that could conceivably be relevant.

## Practical defaults worth adopting early

- **Truncate long histories.** Most production chat features cap history at the last N turns (20 is a common default) as a safety valve against unbounded token growth.
- **Return minimal data from tools**, not full payloads — a tool returning `{ total: 1240, category: "Dining" }` costs far less accumulated context than one returning every underlying record, and that cost compounds every time it's resent on a later turn.
- **Check `stop_reason` on every response** you plan to parse or chain into another step, not just the ones that look obviously truncated.

## Where this leads

Everything about managing a long-running agent or conversation — summarization, pruning, prompt caching — is a response to these two facts: the API is stateless, so you resend everything, and every resent token has a cost. The next two lessons cover the specific techniques for keeping that cost and quality manageable as conversations and agent runs grow long.
