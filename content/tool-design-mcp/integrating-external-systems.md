## Tools with side effects are a different risk category

A tool that reads and returns data is easy to reason about: worst case, it returns something wrong or nothing at all. A tool that writes — updates a record, sends a message, calls a paid API, modifies a governance classification — has a blast radius the moment the model decides to call it. Integrating an external system as a tool means designing for that blast radius explicitly, not just wiring up the API call and hoping the model uses it sensibly.

## Authentication belongs to your code, never to the model

The model should never see, request, or handle credentials for the systems its tools call. Your tool function holds the API key, the service account, the OAuth token — scoped as narrowly as the underlying system allows — and the model only ever sees the tool's structured inputs and outputs. This isn't just good practice; it closes off an entire category of prompt-injection risk, since there's no credential in the model's context for an injected instruction to try to exfiltrate.

## Rate limits are the model's problem to hit and your code's problem to handle

An agent in a loop can call a tool far more often, in far less time, than a human operator would — and an external API's rate limits don't know or care that the caller is an LLM. Two failure modes to design for explicitly: a tool call that fails with a 429 needs to come back to the model as a structured, recoverable `tool_result` (with `is_error: true` and a clear message), not an unhandled exception that crashes the loop; and for tools called frequently within a single agent run, consider batching or caching results at the tool-function level so the agent's own retry behavior doesn't multiply your external call volume.

## Idempotency matters more with agents than with humans

A human operator who's unsure whether their last "submit" click went through will usually pause and check before clicking again. An agent mid-loop, uncertain whether a tool call succeeded because of a timeout or an ambiguous result, may simply retry — and if that tool creates a record, sends a notification, or charges a payment, a retry without idempotency protection creates a duplicate. Any tool wrapping a side-effecting operation should either be naturally idempotent (an update that sets an absolute value rather than incrementing) or accept an idempotency key so a retried call is recognized as a repeat, not a new action.

## Least privilege, applied to tool scope

Design each tool's access to be no broader than the specific job it does. A `search_policy_guidance` tool should be read-only against the policy corpus; it has no business also being able to modify that corpus, even if the same underlying system technically supports both operations. If a workflow genuinely needs both read and write access to a system, that's a signal for two separate tools with two separate scopes — not one tool with broad permissions — so that a review of "what can this agent actually do" is legible from the tool list alone, without having to audit what each tool's implementation happens to allow.

## A concrete shape worth internalizing

A tool wrapping a real external system with side effects should, as a default checklist: hold its own credentials server-side, never in the model's context; validate and sanity-check inputs before calling the underlying system, not just trust the schema; handle rate limits and transient failures as structured tool errors the model can react to, not crashes; be idempotent or key-protected against retries; and be scoped to the single job its description claims, not the full permissions of whatever service account it happens to run under.
