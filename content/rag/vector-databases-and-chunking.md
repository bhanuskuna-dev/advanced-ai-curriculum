## Why you can't just embed whole documents

Embedding an entire 50-page PDF as one vector produces a representation so averaged-out across everything the document discusses that it's useless for finding a specific fact within it. Retrieval needs **chunks**: smaller pieces of text, each embedded separately, so a query about page 37 can match specifically against page 37's content rather than being drowned out by the other 49 pages.

## Chunk size is a real tradeoff, not a default to copy

- **Too small** (a sentence or two) and a chunk loses surrounding context — "it increased by 40%" is meaningless without the sentence before it naming what "it" is. Retrieval finds the chunk, but the model can't make sense of it in isolation.
- **Too large** (multiple pages) and you're back to the original problem: the chunk's embedding averages across too many distinct ideas, so it matches queries poorly, and even when retrieved, most of what's returned is irrelevant padding around the one relevant sentence.

Common starting points are chunks of a few hundred tokens, but the right size genuinely depends on your content's structure. Dense technical documentation with self-contained paragraphs tolerates smaller chunks well; narrative or conversational text often needs more surrounding context per chunk to stay coherent.

## Overlap

Splitting text into non-overlapping chunks risks severing a sentence or idea exactly at a chunk boundary — the fact you needed is split half in one chunk, half in the next, and neither chunk alone contains it. **Overlap** (e.g., each chunk repeats the last ~15% of the previous chunk) mitigates this at the cost of some storage and embedding redundancy. It's a cheap insurance policy against boundary-cutting for most use cases.

## Structure-aware chunking beats fixed-size chunking

Splitting purely by character or token count, blind to document structure, routinely cuts through headings, list items, or code blocks mid-way. Better: chunk along natural boundaries — markdown headings, paragraph breaks, function definitions in code — so each chunk is a coherent unit a human would also consider "one piece." Most real RAG pipelines use a hybrid: split by structural boundaries first, then further split any resulting chunk that's still too large by size, rather than applying fixed-size splitting uniformly from the start.

Regulatory guidance is a good example of why this matters: SR 11-7's model-risk-management guidance is organized into numbered sections and clauses, each a self-contained requirement. Chunking blind to that structure could easily split one clause's obligation from its own scope statement, so a retrieval for "ongoing monitoring requirements" pulls back half a requirement with no way to tell what it's missing. Chunking along the guidance's own section boundaries keeps each retrievable unit exactly as complete as the regulation itself intended it to be.

## What a vector database actually adds

Once you have thousands (or millions) of chunk embeddings, computing cosine similarity against every single one at query time (a full linear scan) becomes too slow. A vector database's job is **approximate nearest-neighbor (ANN) search**: index structures that find the top-K most similar vectors *without* comparing against every stored vector, trading a small amount of accuracy for a large speedup.

Two index families you'll see referenced constantly:

- **HNSW** (Hierarchical Navigable Small World) — builds a multi-layer graph where each vector is connected to its approximate neighbors; search hops through the graph toward the query, converging quickly. Good recall, moderate memory use, and the default choice in most modern vector databases.
- **IVF** (Inverted File Index) — clusters vectors ahead of time (e.g., via k-means), then at query time only searches within the clusters nearest to the query rather than the whole dataset. Cheaper to build and update than HNSW at very large scale, at some cost to recall.

You will not typically implement these yourself — vector databases (Pinecone, Weaviate, pgvector, Qdrant, and others) implement them for you. What matters practically is knowing that ANN search is *approximate*: it can miss a technically-closest vector in exchange for speed, and that's usually an acceptable tradeoff, but it's worth knowing it's happening rather than assuming vector search is exhaustive.

## Metadata filtering

Real retrieval queries are rarely "find anything semantically similar" — they're "find anything semantically similar, published after March, from the engineering team's docs." Storing metadata (timestamps, source, category, access permissions) alongside each chunk's vector, and filtering on it *before or alongside* the similarity search, is what makes retrieval usable in a real product rather than a demo over a single clean corpus. Access-control filtering in particular is not optional in any multi-tenant system — a vector search that can return chunks the requesting user isn't permitted to see is a security bug, not a retrieval-quality nuance.

This is precisely the problem behind streamlining adverse-action templates: when a template gets revised, the old version doesn't disappear from the corpus — it just needs an `effective_date` and `superseded` field so a retrieval for "current adverse-action language" filters to the version actually in force today, not whichever version happens to score highest on similarity alone.

## A practical starting checklist

1. Chunk along structural boundaries, not blind character counts.
2. Add ~10–15% overlap between chunks.
3. Store metadata (source, timestamp, section) alongside every chunk, not just the text.
4. Start with a managed vector database rather than hand-rolling ANN search — the algorithms above are well-understood and not where your differentiation should come from.
