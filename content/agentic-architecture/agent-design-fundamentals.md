## Pipeline, chatbot, or agent?

Three shapes get called "AI features" and they are not the same thing:

- **A single call** — one prompt in, one answer out. Classification, summarization, extraction. No memory, no tools, no multi-step behavior.
- **A pipeline** — a fixed sequence of steps, some of which may call a model, wired together by code you wrote. The order of operations is decided in advance and doesn't change based on what any step returns.
- **An agent** — the model itself decides, at each step, whether it has enough information to answer or needs to do something else first, based on what previous steps actually returned. The sequence isn't fixed in your code; it's chosen turn by turn.

The distinguishing test isn't "does it call a tool" — a pipeline can call tools in a fixed order too. The test is: **does the next action genuinely depend on information the system didn't have when it started, in a way you couldn't have scripted in advance?** If a human could correctly predict the exact sequence of steps before running it, you've built a pipeline, and that's usually the right call — it's cheaper, faster, and far easier to debug than paying a model to make a decision that was never actually in doubt.

## Why this distinction is the first thing an architect gets tested on

A recurring mistake in system design is reaching for agentic architecture by default, because "agent" is the exciting word. The actual skill being tested is judgment about when *not* to use one. A model-governance intake process that always runs the same four checks in the same order is a pipeline, even if each check calls Claude. A requirements-automation system that has to decide, based on what a discovery conversation reveals, whether a feature touches an area with an open regulatory requirement — and only then decide to look that requirement up — is genuinely agentic, because that branch can't be hard-coded in advance.

## The four questions before you build an agent

1. **Complexity** — is the task multi-step and hard to fully specify in advance? ("Turn this design doc into a shipped feature" vs. "extract the title from this PDF.")
2. **Value** — does the outcome justify the added latency and cost of a multi-turn, model-driven process over a single call?
3. **Viability** — is the model actually capable at this task, or will an agent just make confident mistakes faster?
4. **Cost of error** — can a wrong intermediate decision be caught and recovered from (a review step, a test, a rollback), or does it compound silently?

If the answer to any of these is genuinely "no," stay at a simpler tier. This isn't a hedge — it's the architectural judgment call the rest of this module assumes you can make before it teaches you how to build the agent well.

## What an agent actually is, mechanically

There is no separate "agent mode" in the API. An agent is the ordinary tool-use loop (covered in depth in the Tool Design & MCP Integration module) run for more than one iteration, where the model's own output at each step — not your code — decides whether the process continues, changes direction, or ends. Everything else — orchestration patterns, memory management, reliability — is built on top of that one primitive.

## A concrete boundary case

Consider a triage system for incoming model-governance submissions. Sorting each submission into a risk tier based on fixed criteria is a pipeline — the criteria don't change per submission. But deciding *which* follow-up documentation to request, when a submission is missing something and the right ask depends on what's already there and what the specific gap is, is agentic — the right next question genuinely depends on the specific submission in a way no fixed checklist fully captures. The same system can legitimately contain both: a pipeline for triage, an agent for follow-up. Recognizing which parts of a system need which is the actual architecture skill.
