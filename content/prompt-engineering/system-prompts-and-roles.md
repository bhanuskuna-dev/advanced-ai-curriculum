## System prompts vs. the task itself

The Messages API gives you a `system` field, separate from the `messages` array. A common mistake is cramming everything into it: persona, behavioral rules, *and* the actual task. Split them. The system prompt should describe **how the model should behave across the whole conversation** — tone, constraints, safety boundaries, output format, role. The first user message should carry **the actual request**.

```typescript
const response = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  system: "You are a concise, security-minded code reviewer. Flag correctness bugs before style issues. Never suggest disabling a security check to fix a failing build.",
  messages: [{ role: "user", content: "Review this function: ..." }],
});
```

This separation matters for two concrete reasons: **caching** (a system prompt marked `cache_control: { type: "ephemeral" }` gets reused cheaply across many requests that share it, while a system prompt that changes every call gets no caching benefit at all), and **injection resistance** (keeping instructions in `system` and untrusted content — documents, user-supplied text, tool results — in the user turn keeps the boundary between "instruction" and "data" explicit, which matters a great deal once that untrusted content might itself contain something that reads like an instruction).

## What actually belongs in a role/persona

A role isn't just a label like "You are a helpful assistant" — that sentence does almost no work. A role that actually shapes behavior specifies:

- **What the role knows and doesn't know.** "You are a credit policy assistant with access only to the retrieved policy documents provided" is a real constraint; "you are an expert" is not.
- **What the role prioritizes under tension.** "When brevity and completeness conflict, prefer completeness" tells the model how to resolve the tradeoffs it will actually face partway through a response.
- **What the role refuses to do, specifically.** Not a generic disclaimer, but a concrete boundary relevant to the task: "never suggest a workaround that bypasses a required approval step."

## Designing a persona that holds up under pressure

A persona defined only in positive, easy cases tends to drift the moment a user pushes back, asks an edge-case question, or provides adversarial input. Test a persona specifically against the cases that would break it: a user asking the assistant to violate its own stated constraints, a request phrased to sound like it's coming from an authority the assistant should defer to, a question at the exact boundary of what the role is supposed to handle. If the persona only holds up in the demo case, it isn't finished.

## Role prompting changes output style, not underlying capability

Asking a model to "respond as a senior security engineer" can shift tone, vocabulary, and what it chooses to flag as important — it does not grant new information or new reasoning ability the model didn't otherwise have. Role prompting is a framing tool, not a capability multiplier; don't rely on it to make a model correct about something it would otherwise get wrong, only to shape how it communicates what it already knows.

## Grounding rules belong in the system prompt too

If a task requires the model to answer only from provided context (a RAG pipeline, a tool result, a document) rather than filling gaps from its own training, that instruction belongs in the system prompt as a standing rule for the whole conversation, not repeated ad hoc in every user turn: "Answer only from the sources provided in each request. If they don't contain the answer, say so explicitly — do not guess." Stating this once, as a persistent behavioral rule, is both more reliable and more cache-friendly than restating it every turn.

## A short checklist for a system prompt worth shipping

1. States the role's knowledge boundaries, not just a label.
2. States what it prioritizes when instructions conflict.
3. States concrete refusals relevant to the actual task, not generic disclaimers.
4. Has been tested against at least one adversarial or edge-case input, not just the happy path.
5. Keeps the actual per-request task out of it — that belongs in the user turn.
