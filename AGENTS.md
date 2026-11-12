<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Bookish

Next.js 16 (App Router) + Drizzle (rc) + Neon Postgres university library app. No test framework, no CI — verification is lint + typecheck + build (see below).

## Verify changes (order matters)

```bash
npm run lint        # 2 pre-existing errors: components/authForm.tsx, components/imageUpload.tsx — don't fix unless asked
npx tsc --noEmit    # ignore all errors from .next/dev/types/routes.d.ts (corrupt generated file, pre-existing)
npx next build      # passes because next.config.ts sets typescript.ignoreBuildErrors: true — build success does NOT mean types are clean
```

`npm run lint` on Windows: ESLint works, but `rg` is unavailable — use the Grep tool for search.

## Database / Drizzle

- Schema: `database/schema.ts`. Migrations in `migrations/`. `drizzle.config.ts` loads `.env.local` itself.
- `npm run db:generate` → `db:migrate` → optional `npx tsx database/seed.ts`.
- **pgvector**: extension was created manually in Neon (`CREATE EXTENSION IF NOT EXISTS vector`). drizzle-kit never generates this — if a fresh DB errors on `vector`, run it manually. `sql.unsafe()` on neon-http only *echoes* SQL; the tagged template `` sql`...` `` actually executes.
- **HNSW index fragment**: `index().using("hnsw", ...)` adds its own parens — pass `` sql`${table.embedding} vector_cosine_ops` `` with **no** wrapping parens, or the SQL is invalid.
- **Vector similarity needs raw SQL**: drizzle's query builder has no `<=>` operator. Use `db.execute(sql\`...\`)` (returns `.rows`); see `lib/recommend.ts` for the patterns (profile vector via `avg(embedding)`, nearest neighbors).

## Scripts & env

- Scripts using env: call `config({ path: ".env.local" })` (dotenv) — e.g. `drizzle.config.ts`, `scripts/embed-books.ts`.
- **Gotcha**: `lib/config.ts` snapshots `process.env` at import time, before script-body `dotenv.config()` runs. Anything read late must fall back to `process.env` lazily (see `lib/embeddings.ts` reading `GEMINI_API_KEY`).
- `npm run db:embed` — backfills `book_embeddings` from `books` (idempotent, batches of 20, Gemini free tier).

## Embeddings / Gemini (lib/embeddings.ts)

- Model `gemini-embedding-001`, 768 dims, key `GEMINI_API_KEY` in `.env.local` (free tier, from aistudio.google.com).
- The `:batchEmbedContents` endpoint **ignores** `embedContentConfig.outputDimensionality` and may return 3072 dims — `fitToDimensions()` truncates to 768 before insert (cosine ops renormalize, so tail truncation is safe). 429s are retried with exponential backoff inside `geminiFetch`.
- Model runs only in local scripts — never on Vercel.

## Conventions

- `Book` is a **global** interface in `types.d.ts` — components use it without importing.
- Raw SQL rows are untyped: cast with `as unknown as Book[]`.
- Temp verification scripts: create `check-*.mts` in project root, run `npx tsx check-*.mts`, **delete after** — don't commit them.
- `DECISIONS.md` is a local, git-ignored decision log — append a dated entry (decision + why) whenever you make a non-obvious choice. Never commit it.
- Don't commit unless explicitly asked; nothing in this repo is auto-committed.
