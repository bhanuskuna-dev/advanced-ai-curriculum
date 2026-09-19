## The four problems retrieval solves

Large language models are trained on a fixed snapshot of text and have a finite context window. Retrieval-augmented generation (RAG) exists because those two facts create four concrete, recurring problems:

1. **Context window limits.** You cannot paste your entire company wiki, codebase, or document archive into every prompt. Even with large context windows, doing so is slow and expensive, and relevant information gets diluted among irrelevant text. Retrieval selects the *small subset* of a large corpus that's actually relevant to the current question, and only that subset goes into the prompt.
2. **Grounding.** Ask a model a question about something it wasn't trained on — your internal API docs, a document uploaded five minutes ago, this morning's news — and it has no way to know the answer except guessing plausibly. Retrieval gives the model the actual source text to read and answer from, the same way you'd hand a colleague the relevant page instead of asking them to recall it from memory.
3. **Hallucination reduction.** A model asked to answer from provided text is far more likely to say "I don't see that in the provided documents" than one asked to answer purely from its own training — *if* the prompt actually instructs it to stick to the provided context and the retrieval step found the genuinely relevant passages. Retrieval doesn't eliminate hallucination on its own; it gives you a lever to reduce it, one you still have to pull correctly (more on this in "Advanced RAG Patterns").
4. **Freshness.** Training data has a cutoff. A knowledge base, a document store, or a database doesn't — it's updated continuously, and retrieval reads from it live. This is the difference between "what did the model learn once" and "what's true right now."

## What RAG is not

RAG is not fine-tuning, and the two solve different problems. Fine-tuning changes *how the model behaves* — its style, its default assumptions, its skill at a narrow task — by training on examples. RAG changes *what facts the model has access to at answer time*, without touching the model's weights at all. If your problem is "the model doesn't know about our internal product X," that's a retrieval problem — X's documentation should be retrievable and handed to the model as context. If your problem is "the model doesn't answer in our house style," that's closer to a prompting or fine-tuning problem. People frequently reach for fine-tuning to solve what's actually a missing-context problem, and end up with a model that's expensively retrained but still doesn't know facts that were never in its training data or its prompt.

## The three stages, at a glance

Every RAG system, however sophisticated, is a version of the same three stages, which the rest of this module covers in depth:

- **Retrieve** — given a query, find the most relevant pieces of source material from a (possibly huge) corpus. This is where embeddings and vector search come in.
- **Augment** — construct a prompt that includes the retrieved material, formatted so the model can clearly tell "this is reference material" from "this is the actual question."
- **Generate** — the model produces an answer, ideally grounded in and citing the retrieved material rather than its own unaided memory.

## A worked intuition, before the mechanics

Imagine asking a knowledgeable friend a specific question about a book they haven't read. Without the book, they'll guess from general knowledge — sometimes right, sometimes confidently wrong. Now imagine handing them the three most relevant pages of that book before they answer. They'll answer more accurately, and they'll naturally say "according to page 42..." instead of presenting a guess as fact. Retrieval is the automated version of "find the three most relevant pages" — and the quality of your RAG system lives or dies on how good that page-finding step actually is. A perfect generation step fed the wrong pages still gives a wrong (if fluent) answer. This is why the next two lessons focus entirely on retrieval quality — embeddings and chunking — before touching generation at all.

## When RAG is the wrong tool

If your corpus is small enough to fit entirely in context (a handful of documents, not a document store), just include all of it — retrieval adds complexity and potential failure points (missing relevant chunks) for no benefit when "give the model everything" is cheap and reliable. RAG earns its complexity at the point where your source material genuinely doesn't fit, or changes too fast to bake into a static prompt.
