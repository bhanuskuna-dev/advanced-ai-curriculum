## Wiring the three stages together

With chunking, embeddings, and a vector index in place (previous lessons), building the actual pipeline is mostly about the *plumbing and prompt construction* around those pieces. Here's the shape end-to-end:

```typescript
// 1. RETRIEVE
const queryEmbedding = await embed(userQuestion);
const chunks = await vectorDb.query({
  vector: queryEmbedding,
  topK: 5,
  filter: { source: "product-docs" },
});

// 2. AUGMENT
const context = chunks
  .map((c, i) => `[${i + 1}] (source: ${c.metadata.source})\n${c.text}`)
  .join("\n\n");

const prompt = `Answer the question using ONLY the numbered sources below. Cite sources by number. If the sources don't contain the answer, say so — do not guess.

Sources:
${context}

Question: ${userQuestion}`;

// 3. GENERATE
const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: prompt }],
});
```

Swap `product-docs` for `sr-11-7-guidance` and this is the same shape as a compliance assistant answering "does our current adverse-action process satisfy Reg B's notice requirements" — retrieve the relevant guidance clauses, hand them to the model with strict grounding instructions, and let it answer only from what was actually retrieved.

Three details in that prompt template matter more than they look:

- **"ONLY the numbered sources"** — an explicit instruction to stay grounded, not an assumption the model will infer it on its own.
- **Numbered citations** — makes the model's citations checkable, and makes it easy for you to build a UI that links "[1]" back to the actual source chunk.
- **"If the sources don't contain the answer, say so"** — without this, a model will often do its best to answer from general knowledge when retrieval comes up empty, which defeats the entire point of grounding.

## Choosing top-K

`topK: 5` above is a real parameter you have to tune, not a safe default. Too few chunks and you risk missing the one that actually contains the answer, especially for questions that need synthesizing information from multiple places. Too many and you dilute the prompt with irrelevant material, increase cost, and — counterintuitively — can reduce answer quality, because the model has to work harder to find the signal in the noise. Start around 3–5 for focused Q&A, and validate empirically (see the Evals module) rather than guessing once and never revisiting it.

## Handling "no good match"

Every similarity search returns *something* — even if nothing in your corpus is actually relevant, you'll get the least-bad top-K results with low similarity scores. A pipeline that blindly hands these to the model produces confident-sounding answers built on irrelevant context. Set a similarity-score threshold below which you treat retrieval as having found nothing, and have your prompt (or your application logic) handle that case explicitly — either by telling the user directly, or by falling back to a "let me search more broadly" step rather than silently degrading into ungrounded generation. In a regulatory context this isn't a nicety — a compliance assistant that confidently answers a Reg B question from loosely related guidance because nothing better was retrieved is a worse outcome than one that says plainly "I don't have guidance covering that specific case."

## Formatting retrieved content for the model

How you present retrieved chunks affects how well the model uses them. A few things that consistently help:

- **Number sources** so citations are checkable and mappable back to specific chunks.
- **Include the source/metadata inline** with each chunk (not just the raw text), so the model can distinguish "this came from the March changelog" from "this came from the general FAQ" when relevance depends on that.
- **Put retrieved context before the question**, not interleaved with instructions — mirrors the "stable content first, variable content last" pattern from prompt caching, and also just reads more clearly to the model.

## Testing your pipeline honestly

The most common way a RAG pipeline looks good in a demo and fails in production: the demo questions were chosen (consciously or not) because they matched the corpus well. Test with questions that are genuinely hard for retrieval — ones that use different vocabulary than the source documents, ones that need information synthesized from two different chunks, and ones where the honest answer is "not in the corpus." A pipeline that handles only the easy case isn't validated yet; see the Evals module for how to build this testing into a repeatable, measurable process rather than one-off spot checks.

## Where this connects to the tool-use module

Nothing about "retrieve" above requires it to be a separate pipeline stage outside an agent — it's often implemented as a tool (`search_documents`) that an agent calls, exactly like any other tool from Module 1. Framing retrieval as a tool call, rather than a hard-coded pre-processing step, lets an agent decide *whether* retrieval is even needed for a given question (a question about the conversation itself, or simple arithmetic, doesn't need a document search) and *what to search for*, which can differ from the user's literal question after the agent reasons about it.
