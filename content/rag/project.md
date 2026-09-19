## Objective

Build a small Q&A app that answers questions over a handful of your own documents — 5 to 15 real files (notes, a PDF, README files from a project, articles you've saved) — with visible citations back to the source chunks. The point isn't scale; it's building and honestly evaluating a real retrieve → augment → generate pipeline end to end.

A corpus with real stakes attached makes this project more useful: consider indexing your own resume bullet bank, PRDs, or role documentation (like the bullet bank and profile data behind your job-search tooling) and building a Q&A layer over it — "which roles involved model governance work?" or "what quantified impact did I have in credit strategy?" — so you can honestly judge whether the citations it returns are actually right, because you already know the ground truth.

## Milestones

1. **Pick a real corpus.** Not a toy example — use documents you'd actually want to ask questions about, so you can judge answer quality yourself rather than guessing.
2. **Chunk it deliberately.** Decide your chunk size and overlap, and write down *why* — what in your documents' structure drove that choice.
3. **Embed and index.** Use any embedding model and vector store (a managed vector database, or even an in-memory array with cosine similarity for a small corpus — that's a legitimate implementation, not a toy shortcut, at this scale).
4. **Build the pipeline**: retrieve top-K, construct a prompt that instructs the model to answer only from the provided sources and cite them, generate the answer.
5. **Add a "no good match" path.** Pick a similarity-score threshold, and test what happens when you ask a question genuinely outside your corpus — confirm the app says so rather than confidently answering from the model's general knowledge.
6. **Verify citations.** For at least 5 answers, manually check that the cited source chunk actually contains the claim attributed to it.

## Stretch goals

- Add re-ranking: retrieve a larger candidate set, then re-rank before selecting the final top-K, and compare answer quality before/after on a fixed set of test questions.
- Add hybrid search (keyword + vector) and find a query in your test set where it outperforms vector search alone.
- Automate the citation check from milestone 6 as a script, rather than doing it by hand.

## What "done" looks like

You have a working app, a written note on your chunking decision, and — most importantly — a small set of test questions (at least 3) that expose a real weakness in your pipeline: a question it answers wrong, answers evasively when it shouldn't, or fails to find the right chunk for. Finding and understanding a real failure mode is a more valuable outcome than a demo that only shows the happy path.

Bring your pipeline design, a couple of example Q&A exchanges (including a failure case), and your chunking rationale to the project mentor chat — it can help you diagnose whether a bad answer is a chunking problem, a retrieval problem, or a prompting problem, which is often not obvious just from looking at the wrong answer itself.
