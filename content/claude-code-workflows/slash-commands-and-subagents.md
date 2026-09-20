## Slash commands package a repeatable workflow as a one-word invocation

Rather than retyping the same detailed multi-paragraph instruction every time you want Claude Code to do a specific recurring task — running a project's release checklist, generating a specific kind of report, walking through a code review against your team's standards — a custom slash command lets you save that instruction once and invoke it by name. A custom command is a markdown file (project-scoped, shared with your team, or personal, kept to yourself) whose body is the instruction Claude Code runs when you type the command, with support for accepting arguments so the same saved workflow can operate on different inputs each time it's invoked.

This matters architecturally for the same reason a well-named function beats a copy-pasted block of code: a slash command is a single, maintained source of truth for a workflow. When the workflow needs to change, you update the command definition once, rather than hoping everyone remembers the current version of a long instruction they've been retyping from memory.

## Built-in commands vs. custom commands

Claude Code ships with a set of built-in commands for common operational tasks — clearing or compacting conversation history, adjusting configuration, managing permissions, reviewing connected tools. Custom commands extend this with project- or team-specific workflows that aren't generic enough to ship as built-ins but are common enough within your own work to be worth saving. The distinction that matters for configuration purposes: built-ins are always available and don't need defining; custom commands are files you create, and their scope (shared with the team vs. personal) depends on where you save them.

## Subagents: delegating a focused task to a separately-scoped agent

A subagent is a separately defined agent configuration — its own instructions, and optionally its own restricted tool access and model choice — that the main Claude Code session can delegate a specific, bounded task to. This is the same orchestrator/worker pattern from the Agentic Architecture module, applied to how you operate Claude Code itself: instead of one agent trying to hold the entire context of a large task, a focused subagent handles one well-defined piece of it and reports back a result, keeping the main session's context from being crowded out by the sub-task's own working details.

## When delegating to a subagent is the right call

The same judgment that applies to multi-agent architecture generally applies here: delegate to a subagent when a sub-task is genuinely self-contained enough to be handed off with a clear goal and a clear expected result — a focused code review of a specific area, a research task that requires reading many files but only needs to report a summary, a narrow verification step. Delegating a task that isn't actually self-contained just adds coordination overhead without the benefit that orchestrator/worker is supposed to provide.

## Restricting a subagent's tool access

Because a subagent can be configured with its own, narrower tool access than the main session has, subagents are also a practical way to apply least-privilege scoping operationally: a subagent whose entire job is reading and summarizing code has no need for write or execution access, and configuring it that way means a mistake or a misunderstanding in that sub-task literally cannot cause a write it wasn't supposed to make — the same tool-scoping discipline from the Tool Design module, applied to how you configure Claude Code's own delegation.

## Putting the two together

A slash command can itself be the trigger that kicks off a workflow involving one or more subagents — a single command invocation that internally delegates a research step to one subagent and a verification step to another, coordinated by the main session, while still being invoked by the person using it as one simple, memorable action. This is where "configuration" becomes "workflow design": the individual pieces (commands, subagents, permissions, hooks) combine into a repeatable, shareable process rather than a one-off conversation.
