## What a hook is

A hook is a shell command Claude Code runs automatically at a specific point in a session's lifecycle. Hooks are configured in `settings.json`, matched to a named event (and, for tool-related events, a matcher pattern for which tool it applies to), and can inspect what's about to happen, allow it, block it, or run a side effect alongside it. The events you'll reach for most often: **PreToolUse** and **PostToolUse** (fire before/after a specific tool runs, matched by tool name), **Stop** (fires when Claude finishes responding), **SessionStart** (fires on startup, resume, clear, or compact), and **Notification**. A larger set of more specialized events exists beyond these (including compaction-related events and permission-related events), but this handful covers the overwhelming majority of real use cases.

The architectural significance of hooks is that they move enforcement out of the model's judgment and into code you control absolutely: a hook that blocks a dangerous command runs whether or not the model "remembers" a rule from its system prompt or CLAUDE.md, because it's not relying on the model's compliance at all — it's a deterministic check in the execution path.

## The shape of a hook's lifecycle position

Hooks fire around two broad categories of event: **tool execution** (`PreToolUse` / `PostToolUse`, matched to specific tools) and **session lifecycle** (`SessionStart`, `Stop`, and related events). A `PreToolUse` hook can inspect the specific tool and its arguments before they run and decide whether to allow, block, or modify the outcome; a `SessionStart` hook is better suited to setup work — loading project-specific context automatically when a session begins, rather than relying on the model to ask for it.

## What a hook can actually do

A pre-execution hook receives structured information about the pending action (which tool, what arguments) and can signal back a decision — typically by its exit code or a structured response — that either lets the action proceed, blocks it with an explanation the model will see, or asks for confirmation. A post-execution hook runs after an action completes and is well suited for side effects that should always happen regardless of what the model did: running a linter or formatter after a file edit, logging every command executed during a session for later audit, or triggering a test run after a change to specific files.

## Common real-world hook use cases

- **Enforcing a policy no prompt can override**: blocking any tool call that would touch a specific protected path or run a specific dangerous command pattern, regardless of what the current conversation's context says.
- **Automatic quality gates**: running a linter, type checker, or formatter automatically after every file edit, catching issues immediately rather than relying on the model to remember to run them.
- **Audit logging**: recording every tool call made during a session to a log file, independent of whether anyone reviews the conversation transcript itself.
- **Session setup**: loading environment-specific configuration or context automatically when a session starts, rather than relying on the model to ask for it or a human to paste it in.

## Why hooks matter for the exam's framing of "reliability"

A hook is the most direct mechanical answer to a theme that runs through this entire curriculum: don't rely on the model to enforce a rule it could simply fail to apply consistently. A system prompt that says "never modify files under `/prod-config`" is a request the model usually honors; a hook that blocks any write to that path is a guarantee that holds regardless of what the model decides. Where a rule is genuinely non-negotiable, a hook — not a prompt instruction — is the architecturally correct place to enforce it.

## A design principle for where to draw the hook boundary

Not every check belongs in a hook. Hooks are best reserved for rules that are cheap to check mechanically and genuinely must never be violated (a protected path, a forbidden command pattern) or side effects that should happen unconditionally (formatting, logging). Judgment calls that depend on nuanced context — whether a particular refactor is a good idea — belong in the model's reasoning, not a hook, because a hook can only apply a fixed, mechanical rule; it can't make a judgment call the way the model itself can.
