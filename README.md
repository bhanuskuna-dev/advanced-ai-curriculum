# Advanced AI Curriculum

A self-paced curriculum for becoming an advanced AI user — structured lessons, an AI tutor chat, and hands-on projects, covering:

1. **Building with the Claude API & Agent SDK** — Messages API fundamentals, tool use, the agentic loop, MCP, multi-agent orchestration, prompt caching & cost.
2. **RAG & Retrieval** — why retrieval exists, embeddings & similarity search, vector databases & chunking, building a RAG pipeline, advanced patterns (re-ranking, hybrid search, query rewriting).
3. **Evals, Safety & Quality** — why evals matter, building a golden dataset, metrics & calibration, failure modes & mitigations, responsible use.

Each module has 5–6 lessons plus a hands-on project brief with an embedded AI mentor chat — the app gives guidance and code review, you write and run the actual code yourself.

Progress (which lessons/projects you've completed) is tracked entirely in your browser's `localStorage` — nothing is sent to a server, and it doesn't sync across devices.

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
