## An agent is not the whole system

It's easy to design an agent in isolation — tools, loop, system prompt — and forget that it has to live inside a larger system with its own constraints: who's allowed to trigger it, what data it can see, where its output goes, and what happens when it's down. Production agent architecture is about those boundaries, not the loop itself.

## Trust boundaries and privacy architecture

The clearest architectural decision in any agent-powered product is *what crosses the boundary between the client, your server, and the model provider* — and the answer should be "the minimum that's still sufficient to do the job." A pattern worth internalizing from real systems: tools execute client-side against data that's already local, and only structured, aggregated results — never the raw underlying records — get sent to a server-side model call. A financial app's agent might send `{ category: "Dining", total: 1240 }` to the model, never the individual transactions behind that number. This isn't a privacy nicety bolted on afterward; it's a design decision made before the first tool is written, because it constrains what every tool is allowed to return.

## Where agent state actually lives

An agent's "memory" within one conversation is just the messages array you resend every turn — there's no server-side session state in the API itself. Production architecture has to decide, explicitly: where does that array live between requests (a database row, a cache, client-side state), how is it scoped to a user or session, and what happens if a request fails partway through a multi-step tool sequence? An agent that's halfway through a multi-tool task when the server restarts needs a defined recovery behavior — resume, restart, or fail visibly — not an undefined one.

## Deployment shape follows risk, not convenience

Where an agent runs changes what it's allowed to do. A read-only research agent can reasonably run with broad tool access and modest oversight. An agent with write access to a production system, real money, or an external system's state needs narrower scoping and more deliberate placement — often behind an approval step, sometimes not fully autonomous at all. This mirrors the stakes-appropriate scrutiny principle from responsible-use judgment generally: the deployment architecture itself should reflect what happens when the agent is wrong, not just what it's technically capable of doing.

## Designing for graceful degradation

A production agent will eventually hit a model outage, a rate limit, or a malformed response — architecture that assumes the happy path fails the first time it doesn't get it. Two decisions worth making explicitly before launch, not after an incident:

- **What does the user see when the agent can't complete its loop?** A visible, honest failure ("I couldn't finish this — here's what I have") beats a silent partial result presented as complete.
- **Is there a non-agentic fallback for the core task?** A system whose only path to an answer runs through a multi-step agent has no degraded mode; one that can fall back to a simpler rule-based or single-call path under failure conditions can keep functioning, even if worse, when the agent can't.

## A concrete example

A credit-decisioning system serving a large card-member portfolio is not architected the same way as an internal tool that drafts scenario documentation, even if both use agentic loops under the hood. The credit system's architecture routes through governed, audited infrastructure with narrow tool permissions and mandatory human sign-off on consequential actions; the documentation tool can reasonably run with a lighter-weight HITL checkpoint and broader autonomy. Same underlying pattern — a multi-step agentic loop — architected completely differently because the cost of being wrong is completely different.
