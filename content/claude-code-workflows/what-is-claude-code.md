## Three different products, easy to conflate

"Building with Claude" can mean three genuinely different things, and mixing them up is a common source of confusion:

- **The Claude API** — the raw `POST /v1/messages` endpoint. You write every line of the agent loop, define every tool, and host everything yourself.
- **The Claude Agent SDK** — Claude Code's harness, packaged as a library (`claude-agent-sdk` / `@anthropic-ai/claude-agent-sdk`). It gives you the full agent loop, built-in tools (file read/write/edit, bash, search), context management, hooks, and subagents — you call it from your own code and host it yourself.
- **Claude Code** — the actual CLI tool: an interactive (or headless) agentic coding assistant that runs in your terminal, IDE, or CI pipeline, built on that same harness, ready to use without writing any harness code yourself.

This module is about the third one: configuring and automating Claude Code itself, as a product you use and operate — not writing code that calls the Claude API.

## What makes Claude Code different from a raw API call

A single Claude API call answers one question with no persistent capability. Claude Code, by contrast, ships with a working agent loop already built in, plus a set of built-in tools it can use immediately in your project: reading and editing files, running shell commands, searching a codebase, fetching web content. You don't define these tools yourself — they exist by default, and what you configure is *how* Claude Code is allowed to use them, not whether the capability exists at all.

## The permission model, at a glance

Because Claude Code can read, write, and execute commands in your actual project, its permission system is the first thing to understand: every tool call Claude Code wants to make is checked against a set of rules that resolve to allow, deny, or ask-first. This is what lets you use an agentic coding tool without handing it unconditional access to your filesystem and shell — the specifics of configuring these rules are covered in the next lesson.

## Sessions and context

A Claude Code session holds its own conversation state for as long as it runs, the same statelessness-managed-for-you idea from the Context Management module, but with Claude Code additionally managing large contexts automatically (including compaction as a session grows long) so you don't have to hand-roll that management yourself the way you would calling the raw API directly.

## Where this module is headed

The next four lessons cover, in order: how Claude Code learns about your project and what it's allowed to do (CLAUDE.md and settings.json), how to intercept and automate around its actions (hooks), how to package repeatable workflows and delegate focused sub-tasks (slash commands and subagents), and how to run it outside an interactive terminal entirely (headless mode and CI). Together, these are what "Claude Code Configuration & Workflows" means as an exam domain — not writing agent code, but operating and automating an existing agentic tool well.
