# Advanced AI Curriculum

A self-paced curriculum aligned to Anthropic's **Claude Certified Architect – Foundations** exam — structured lessons, an AI tutor chat, hands-on projects, and 3 full domain-weighted practice exams, covering all 5 exam domains:

1. **Agentic Architecture & Orchestration** (27%) — agent design fundamentals, the agentic loop, multi-agent orchestration, production system architecture, observability & debugging.
2. **Tool Design & MCP Integration** (18%) — the tool-use loop, designing tool schemas, MCP, integrating external systems safely.
3. **Claude Code Configuration & Workflows** (20%) — CLAUDE.md & settings.json, hooks & automation, slash commands & subagents, headless/CI workflows.
4. **Prompt Engineering & Structured Output** (20%) — prompt fundamentals, system prompts & roles, chain-of-thought, structured output & schemas, iterating on prompts.
5. **Context Management & Reliability** (15%) — context window fundamentals, managing long-running context, prompt caching & cost, reliability patterns.

Each module has 4–5 lessons plus a hands-on project brief with an embedded AI mentor chat — the app gives guidance and code review, you write and run the actual code yourself. `/practice-exams` has 3 distinct 60-question mock exams, domain-weighted to match the real exam, scored on the same 1000-point scale with a 720 pass line.

Progress (lessons/projects completed, exam scores) is tracked entirely in your browser's `localStorage` — nothing is sent to a server, and it doesn't sync across devices.

---

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The AI tutor and project-mentor chat features call `/api/chat`, which needs an Anthropic API key:

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

Without a key, everything except the chat features (lessons, progress tracking, navigation) works normally — the chat will show an error if you try to send a message.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the codebase

## Tech stack

- [Next.js 15](https://nextjs.org/) — App Router, TypeScript
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [react-markdown](https://github.com/remarkjs/react-markdown) — lesson content rendering
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) — the AI tutor & project mentor chat
- Built with [Claude](https://claude.ai/code)

## Deploying to Vercel

This repo includes `.github/workflows/deploy.yml`, which deploys to Vercel on every push to `main`. To finish wiring it up:

1. Import this repository into [Vercel](https://vercel.com/new) (or run `vercel link` locally) so a Vercel project exists for it.
2. Add `ANTHROPIC_API_KEY` as an environment variable on the Vercel project (Project Settings → Environment Variables), so the deployed `/api/chat` route works.
3. Generate a [Vercel access token](https://vercel.com/account/tokens) and add it as a GitHub Actions secret on this repo named `VERCEL_TOKEN` (Settings → Secrets and variables → Actions).
4. Push to `main` — the workflow will deploy automatically from then on.
