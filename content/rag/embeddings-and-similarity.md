## What an embedding actually is

An embedding is a list of numbers — a vector, typically hundreds to a few thousand dimensions long — that represents the *meaning* of a piece of text. It's produced by a model trained specifically for this purpose (an embedding model), separate from the language model that generates text. The property that makes embeddings useful: **texts with similar meaning produce vectors that are close together in that high-dimensional space**, regardless of whether they share any of the same words.

```typescript
const [queryEmbedding] = await embed(["How do I cancel my subscription?"]);
const [docEmbedding] = await embed(["To end your recurring billing, go to Settings > Billing > Cancel Plan."]);
// These two vectors will be close together, despite sharing almost no words —
// because the embedding model learned that they mean similar things.
```

This is the entire reason embeddings beat plain keyword search for many retrieval tasks: keyword search finds documents that share your query's *words*; embedding search finds documents that share your query's *meaning*. "Cancel my subscription" and "end recurring billing" match on meaning, not vocabulary.

## Cosine similarity, the whole idea

To compare two embedding vectors, you need a way to measure "how close" they are. The standard choice is **cosine similarity**: the cosine of the angle between the two vectors, ranging from -1 (opposite meaning) to 1 (identical meaning), with values near 0 meaning unrelated. In practice, you almost never compute the angle directly — you compute it via the dot product of the (normalized) vectors, which is cheap:

```
cosine_similarity(a, b) = (a · b) / (|a| * |b|)
```

"Semantic search" is, mechanically, nothing more than: embed the query, embed every candidate document (ahead of time, not at query time), compute cosine similarity between the query vector and every document vector, and return the top-K highest-scoring documents. There's no deeper magic — the intelligence is entirely front-loaded into how good the embedding model is at placing similar meanings near each other.

## Embeddings are computed once, per chunk

The critical performance insight: **you embed your documents once, ahead of time**, and store the resulting vectors. At query time, you only embed the (short) query — one embedding call, not one per document. This is what makes retrieval over millions of documents fast: the expensive work (embedding a large corpus) happens offline, and query time is one cheap embedding call plus a nearest-neighbor lookup against pre-computed vectors.

## What embeddings are bad at

Embeddings capture *semantic* similarity, not factual correctness, recency, or exact-match precision. A few concrete failure modes:

- **Exact identifiers.** Product SKUs, error codes, or ticket numbers ("ERR-4471") often embed poorly — an embedding model reasons about meaning, and an alphanumeric code doesn't carry much semantic content on its own. Keyword or exact-match search is often better for these.
- **Negation and specificity.** "Cancel my subscription" and "how do I *avoid* cancelling my subscription accidentally" can embed close together despite being near-opposite intents, because they share heavy semantic overlap in topic even though the actual meaning diverges. Embeddings capture topic similarity more reliably than fine-grained logical distinctions.
- **Freshness bias.** An embedding has no notion of "this document is outdated." Two documents about the same topic, one current and one superseded, embed similarly — ranking by similarity alone won't surface the current one over the stale one; you need metadata (a timestamp) and explicit filtering or boosting for that.

This is why production retrieval systems rarely rely on embedding similarity alone — see "Advanced RAG Patterns" for hybrid approaches that combine semantic and keyword search to cover each other's blind spots.

## A sanity check worth running early

Before building anything else, take ten real queries your users would actually ask, embed them alongside twenty real documents (half genuinely relevant, half not), and manually inspect whether cosine similarity ranks the relevant ones higher. This costs almost nothing and catches a shockingly common failure: an embedding model that's a poor fit for your domain (e.g., a general-purpose model on highly technical or jargon-heavy text) before you've built an entire pipeline on top of it.
