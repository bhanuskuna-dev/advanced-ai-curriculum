## CLAUDE.md: project memory that's actually read every session

`CLAUDE.md`, placed at your project root, is loaded automatically at the start of a Claude Code session — it's the standing context you'd otherwise have to re-explain in every conversation: how the project is structured, what commands run tests or builds, conventions the codebase follows, and anything a new contributor would need to know that isn't obvious from the code itself. Because it's loaded every session without you asking, it's the highest-leverage place to put information that would otherwise be repeated in prompt after prompt.

What belongs in it: build and test commands, code style conventions specific to this project, architectural decisions worth knowing before making changes, and known gotchas. What doesn't belong: information that changes per-task (that's a prompt, not project memory), or exhaustive documentation better served by the codebase's own docs — CLAUDE.md works best as a concise, high-signal orientation, not a dumping ground.

## Settings scope: project, local, and user

Claude Code's configuration lives in `settings.json` files at different scopes, which apply in combination:

- **Project settings** (`.claude/settings.json`) — checked into version control, shared with everyone working on the project. This is where team-wide permission rules and conventions live.
- **Local project settings** (`.claude/settings.local.json`) — not checked in (typically gitignored), for personal overrides specific to your own machine or workflow without affecting teammates.
- **User settings** (`~/.claude/settings.json`) — global defaults that apply across every project you work in, unless a project-level setting overrides them.

This layering means a team can enforce a shared baseline (project settings) while individuals still customize their own environment (local and user settings) without those personal choices leaking into what teammates see.

## What settings.json actually controls

The most architecturally significant section is **permissions** — rules that classify tool calls as allowed, denied, or requiring confirmation (`ask`), typically expressed as patterns matching a tool and its arguments (for example, allowing a specific safe command pattern while denying a broader dangerous one). Rules from every applicable scope combine, and within that combined set they resolve in a fixed order: **deny beats ask beats allow** — a broad `allow` rule can never override a more specific `deny`. This is what makes the permission system a real boundary rather than a suggestion: you're not trusting the model's judgment alone, you're enforcing a rule the tool cannot cross regardless of what it decides to try, and regardless of how permissive some other rule elsewhere happens to be.

Beyond permissions, settings also configure environment variables available to the session, which model to use by default, and — covered in depth in the next lesson — hooks that intercept specific events during a session.

## Designing a permission policy, not just reacting to prompts

The naive approach to permissions is answering each "may I run this command?" prompt as it comes up. The more deliberate approach — the one worth understanding for architecture purposes — is designing the policy in advance: which categories of action are safe enough to always allow (running the project's own test suite), which should always require confirmation (anything touching production credentials or deployment), and which should be denied outright (destructive commands with no legitimate use in this project's workflow). This is the same least-privilege instinct from tool design in the previous module, applied to an entire agentic tool's operating envelope rather than one function's schema.

## A concrete example of layered configuration

A team's checked-in project settings might allow running the test suite and linter freely, since those are safe and frequently needed. An individual engineer's local settings might additionally allow a personal script they use often, without that permission being pushed onto every other contributor. Global user settings might set a default preferred model across all of that engineer's projects, overridden only where a specific project's settings say otherwise. Understanding which scope wins in a conflict — and designing rules at the scope where they actually belong — is the practical skill this lesson is building toward.
