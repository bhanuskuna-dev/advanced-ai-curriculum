## Objective

Configure a real project's Claude Code setup end to end: a CLAUDE.md, a deliberate layered permission policy, at least one hook, and a headless automation script that uses it.

## Milestones

1. **Write a CLAUDE.md** for a real project (yours, or the agent/tool project from an earlier module) covering build/test commands, conventions, and anything a new contributor would need that isn't obvious from the code.
2. **Design a permission policy in writing before configuring it**: which categories of action should always be allowed, which should always require confirmation, and which should be denied outright — and why. Then implement it across the appropriate scopes (project vs. local vs. user).
3. **Add at least one hook** that enforces something mechanically rather than relying on a prompt instruction — a quality gate after edits, a block on a specific dangerous action, or an audit log of tool calls.
4. **Create at least one custom slash command** for a workflow you'd otherwise retype repeatedly, and (optionally) a subagent scoped to a narrower, focused sub-task within that workflow.
5. **Write a headless automation script** that invokes Claude Code non-interactively for a specific, bounded task, parses its output programmatically, and takes a decision based on the result (pass/fail a check, produce a report, etc.).

## Stretch goals

- Wire your headless script into an actual CI workflow (even a simple one) so it runs automatically on a trigger, not just manually.
- Design your permission policy specifically for the headless/automated context as distinct from your interactive settings, and explain in writing why the two differ.

## What "done" looks like

You can explain, for every rule in your permission policy, hook, and headless script's scope, *why* it's set the way it is — not just that it works, but that you made a deliberate call about how much autonomy belongs where, and enforced that call mechanically rather than by convention.

Bring your CLAUDE.md, your permission policy, and your hook to the project mentor chat for a review of whether the boundaries you drew actually match the risk of what they're guarding.
