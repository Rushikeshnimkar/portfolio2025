# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Next.js 15 (App Router) portfolio site for Rushikesh Nimkar. Beyond static portfolio pages, the distinguishing features are AI-driven: a RAG chatbot that answers as Rushikesh in the first person, an AI email composer, and a natural-language "theme customizer" that generates and injects JavaScript to restyle the live page.

## Commands

```bash
npm run dev      # init-vector-store + embed-theme, then next dev (port 3000)
npm run build    # same embedding steps, then next build
npm run start    # next start (production)
npm run lint     # next lint (ESLint 9, eslint-config-next)

# Run embedding scripts standalone (tsx):
npm run init-vector-store   # scripts/init-vector-store.ts — seeds the character RAG index
npm run embed-theme         # scripts/embed-theme-structure.ts — seeds the "theme" index
```

Note: `dev` and `build` **always** run both embedding scripts first (see package.json `scripts`). They require valid `PINECONE_API_KEY` and `GOOGLE_API_KEY` or they will fail before Next even starts. The first run is slow because it creates Pinecone indexes and waits ~60s for initialization. There is no test runner configured.

## Environment

All AI features depend on env vars in `.env` (see README for the full list). Critical ones:
- `OPENROUTER_API_KEY` — all chat/email/theme LLM calls go through OpenRouter (not the OpenAI SDK directly).
- `GOOGLE_API_KEY` — Google Gemini embeddings (`gemini-embedding-001`), sliced to 768 dims.
- `PINECONE_API_KEY`, `PINECONE_INDEX_NAME` — vector DB. Note there are **two** indexes: the character index (name from `PINECONE_INDEX_NAME`, fallback `rushikesh-portfolio`, namespace `character-info`) and a hardcoded `theme` index.
- `JWT_SECRET`, `JWT_EXPIRY` (default `1m`) — short-lived tokens gating the chat API.
- `ALLOWED_ORIGINS` — comma-separated CORS allowlist. **In development set this to include `http://localhost:3000`**, otherwise every API route returns 403. (The README's instruction to uncomment a `localhost:3000` line in route files is outdated — origin control is now centralized in `lib/cors.ts`.)

## Architecture

### API surface (`app/api/*/route.ts`)
Every route is an App Router handler that first calls `isAllowedOrigin()` from `lib/cors.ts` and returns 403 on mismatch. `/api/chat` additionally requires a `Bearer` JWT (minted by `/api/auth`, verified via `lib/chat/jwt.ts`). Routes: `auth`, `chat`, `theme`, `generate-email`, `send-email`, `verify-email`, `analyze-skills`.

### Chat RAG pipeline (`lib/chat/`)
The chat flow is orchestrated by `ChatWorkflow.processMessage()` in `workflow.ts`:
1. **Intent detection** (`intent-detector.ts`) — pure regex/keyword matching, no LLM. `detectQueryType()` maps the prompt to a section like `skills`, `projects`, `gitsplit_project`, `email_contact`, etc. `needsWebSearch()` flags queries needing live Tavily search.
2. **Structured card** (`response-generator.ts`) — `generateStructuredResponse(queryType)` returns hardcoded `StructuredContent` (project/skill/contact data) that the frontend renders as an interactive card. This data lives in code, not the vector store.
3. **RAG retrieval** (`lib/embeddings.ts` → `queryVectorStore`) — metadata-filtered similarity search against the `character-info` namespace, filtered by section (`getSectionFilter`); falls back to unfiltered search when results are sparse. Results are cached in an in-memory `Map` with a 30-min TTL.
4. **LLM call** — `OpenRouterChatModel` (a `ChatOpenAI` subclass whose `_generate` is overridden to `fetch` OpenRouter directly). The system prompt instructs the model to answer in first person as Rushikesh and **not** to repeat data already shown in the structured card. If `isSearchQuery`, Tavily results are spliced in as a system message before the call.

Key consequence: structured card data and the conversational text come from **different sources** (hardcoded templates vs. RAG vs. LLM). When changing what a card shows, edit `response-generator.ts`; when changing what the AI *knows*, edit the character source and re-run embeddings.

### Source of truth for "who Rushikesh is"
`components/character/character.ts` (`characterContent`) is the canonical bio text. `init-vector-store.ts` chunks it (~500 chars, sentence-aware) and embeds it into Pinecone. **Editing this file has no effect until the vector store is re-seeded** (it re-runs on `npm run dev`/`build`). `data/prompt-data.ts` holds additional prompt content.

### Theme customizer (`app/api/theme/route.ts` + `scripts/embed-theme-structure.ts`)
A natural-language → live-JS system. The embed script stores a textual description of the DOM structure (element IDs, theme-target selectors per page) in the `theme` index. At request time the route does a similarity search to find relevant page elements, asks the LLM to generate an `applyThemeChanges()` JS function, then post-processes that generated code to guarantee it declares/returns a `changes` array before sending it back to the client to execute. Treat the generated string as code that runs in the user's browser.

### Embeddings (`lib/embeddings.ts`)
`GeminiEmbeddings` extends `GoogleGenerativeAIEmbeddings` and slices vectors to 768 dims (Matryoshka). All Pinecone indexes are 768-dim, cosine, serverless (aws/us-east-1). Both `queryVectorStore` and the theme route construct a fresh Pinecone client per call.

### Frontend
Pages live in `app/<route>/` (home, about, projects, skills, experience, github, resume, contact). Reusable UI in `components/ui/` and `components/common/`; chat widget in `components/tools/ai-chat/`; the card renderers consumed by the chat pipeline are in `components/tools/ai-chat-cards/` (each `*Card.tsx` matches a `structuredContent.type`). Styling is Tailwind + Framer Motion; `lib/utils.ts` has the `cn()` helper.

## Conventions
- Path alias `@/*` → repo root (see `tsconfig.json`).
- LLM model is hardcoded as `nvidia/nemotron-3-super-120b-a12b:free` in both `workflow.ts` and `theme/route.ts`; change both if swapping models.
- API routes hand-write CORS headers per response and echo the request `origin` back — follow the existing pattern when adding routes, and always gate with `isAllowedOrigin`.
