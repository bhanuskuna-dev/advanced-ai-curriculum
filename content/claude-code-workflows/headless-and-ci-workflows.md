## Beyond the interactive terminal

Everything covered so far assumes a human sitting at a terminal, reading Claude Code's output and responding turn by turn. Headless (non-interactive) mode drops that assumption: Claude Code runs a single prompt to completion and exits, without waiting for further human input, which is what makes it usable as a step in a script or an automated pipeline rather than only as a conversational tool.

## Why this matters architecturally

A CI pipeline, a scheduled job, or a script that needs to invoke an agentic capability as one step among several can't pause and wait for a person to respond to a prompt. Headless mode is what turns Claude Code from "a tool a person uses" into "a capability a system can call" — the same shift in framing as the difference between a human using a web app and a server calling that same functionality through an API. Once Claude Code can run headlessly, it can be wired into anything a shell script or CI job can already do: pre-commit checks, automated code review on a pull request, scheduled maintenance tasks, batch processing across many files or repositories.

## Structured output for programmatic consumption

For a headless invocation to be useful inside a script, the calling code needs to reliably parse what Claude Code produced — the same structured-output problem from the Prompt Engineering module, applied to consuming an entire session's result rather than a single API response. Machine-readable output modes exist precisely so a wrapping script can check success/failure, extract specific results, and make decisions based on structured data rather than trying to parse conversational prose.

## Permission scoping matters even more in automation

An interactive session has a human present to catch and reject an unexpected or risky action before it happens. A headless, automated invocation does not — by the time anyone looks at the log, whatever was going to happen already has. This makes the permission configuration from earlier in this module *more* load-bearing in CI contexts, not less: an automation workflow should run with an explicitly scoped, tightly reviewed permission set suited to exactly what that specific automated task needs, not the broader, more permissive configuration that's reasonable for a supervised interactive session.

## CI integration patterns

A common shape: a CI workflow triggers Claude Code headlessly in response to an event (a pull request opened, a comment mentioning it, a scheduled trigger), gives it a specific, bounded task (review this diff, fix this specific failing check, generate this specific report), and consumes its structured output to decide the workflow's next step (post a comment, fail or pass a check, open a follow-up issue). This mirrors the pipeline-vs-agent distinction from the Agentic Architecture module: the CI workflow itself is typically a fixed pipeline (trigger → invoke → parse output → act), while the invocation of Claude Code inside one of those pipeline steps can itself be agentic, working through a bounded task with its own tool use.

## The judgment call this module has been building toward

Configuring Claude Code well — CLAUDE.md, layered settings, hooks, subagents, and headless automation — is ultimately about deciding, deliberately, how much autonomy to grant in which context, and enforcing that decision mechanically rather than hoping it holds by convention. An interactive session working alongside an engineer can reasonably run with a fairly permissive, conversational setup. A headless CI job running unattended against production-adjacent infrastructure should run with the narrowest permission set that still lets it do its one specific job — the same stakes-appropriate scrutiny principle that shows up everywhere else in this curriculum, applied here to how an agentic tool itself is configured and operated.
