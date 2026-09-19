## Why naive top-K retrieval breaks down

The basic pipeline from the previous lesson — embed the query, grab the top-K most similar chunks, hand them to the model — works well on clean, well-scoped corpora and struggles as soon as real-world messiness shows up: queries phrased very differently from the source text, questions that need information spread across chunks that aren't individually the top match for either half, and corpora large enough that "similar enough to be in the top 5" stops meaning "actually relevant." The patterns below each address a specific failure mode rather than being general-purpose upgrades — reach for the one that matches the failure you're actually seeing.

## Re-ranking

Embedding similarity is fast but approximate — it's optimized for narrowing millions of candidates down to a manageable set quickly, not for precisely ranking a small set. **Re-ranking** adds a second pass: retrieve a larger initial set (say, top 20) using cheap vector search, then run a more expensive, more accurate model (a cross-encoder, which looks at the query and each candidate *together* rather than comparing pre-computed vectors) over just those 20 to re-order them, and keep only the true top 5.

```
Query → vector search (top 20, cheap & approximate)
      → re-ranker (scores query+candidate pairs directly, expensive but precise)
      → top 5 (high precision, small enough to fit in the prompt)
```

This two-stage "retrieve broad, rank precisely" pattern is one of the highest-leverage improvements you can make to a mediocre RAG pipeline, because it fixes the actual bottleneck: vector search is good at *not missing* relevant documents when cast wide, but weaker at *precisely ordering* a candidate set — which is exactly what a cross-encoder is good at.

## Hybrid search

Embeddings and keyword search fail in complementary ways (the "What Embeddings Are Bad At" section of the earlier lesson): embeddings miss exact identifiers and precise phrase matches; keyword search misses paraphrases and synonyms. **Hybrid search** runs both in parallel — a vector search and a traditional keyword/BM25 search — and combines their results (commonly via a technique called reciprocal rank fusion, which merges two ranked lists by rewarding items that rank well in either). The result covers both failure modes: a query mentioning an exact error code *and* a conceptually related idea gets good matches for both parts.

## Query rewriting

Users don't always phrase questions in a way that embeds well against your corpus. A short, ambiguous, or conversational query ("what about the pricing thing from before?") often retrieves poorly compared to an explicit one. **Query rewriting** uses an LLM call to transform the user's raw query into one or more better-formed search queries before retrieval runs — resolving pronouns from conversation history, expanding abbreviations, or splitting a compound question into separate sub-queries that are each retrieved independently and then combined. This adds an LLM call (cost and latency) before retrieval even starts, so it's worth it specifically when you observe that retrieval quality is limited by *query phrasing* rather than corpus coverage — check this before adding the complexity.

## Citations as a hallucination check, not just a UI nicety

Asking the model to cite sources (from the previous lesson) does more than improve trust — it's a mechanism you can verify programmatically. If the model's answer cites source [2] for a specific claim, you can check that claim actually appears in chunk [2]'s text. A citation that doesn't hold up under this check is a strong, cheap signal of hallucination, and some production systems use exactly this as an automated guardrail: flag or suppress answers whose citations don't verify against the cited source text, rather than trusting the citation just because it's present.

## Diminishing returns and when to stop

Every pattern here adds latency, cost, and a new thing that can go subtly wrong. Add them in response to a specific, observed failure — not preemptively, and not all at once. A practical order of investigation when a RAG pipeline underperforms: first check chunking (is the relevant information even chunked coherently?), then check top-K and retrieval recall (is the relevant chunk *in* the candidate set at all, even if ranked low?), then consider re-ranking (is it in the set but ranked too low to make the cut?), then consider hybrid search or query rewriting (is the query itself the bottleneck?). Diagnosing which stage is actually failing — ideally with an eval set, covered in the next module — is far more valuable than reflexively adding every pattern in this lesson to a pipeline that might have a much simpler root cause.
