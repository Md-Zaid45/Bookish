<div align="center">

# 📚 Bookish

**A university library platform for discovering, borrowing, and managing books.**

Built with Next.js 16 · Drizzle ORM · Neon Postgres · pgvector

[Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Scripts](#scripts) · [Project Structure](#project-structure)

</div>

---

## Features

### For Readers
- **Book catalog** — browse the latest titles, top-rated picks, trending books, and genre-curated rows
- **Semantic recommendations** — vector-based suggestions built from your borrowing history (pgvector + Gemini embeddings), with a rating-based fallback for new users
- **Similar books** — nearest-neighbor lookups on every book detail page
- **Borrowing system** — borrow books with due dates and track your loans from a personal profile

### For Administrators
- **Admin dashboard** — manage books, covers, videos, and availability
- **Approval workflows** — review user account requests and book requests
- **User management** — view and moderate registered users

### Platform
- **Authentication** — sign up / sign in with NextAuth v5 and university ID verification
- **Media handling** — book covers and videos uploaded via ImageKit
- **Re-engagement emails** — automated welcome and inactivity workflows with Upstash Workflow + Resend
- **Rate limiting** — API protection backed by Upstash Redis

---

## Tech Stack

| Layer        | Choice                                       |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 16 (App Router), React 19            |
| Styling      | Tailwind CSS v4, shadcn/ui                   |
| Database     | PostgreSQL (Neon) via Drizzle ORM            |
| Vector search| pgvector with HNSW index, Gemini embeddings  |
| Auth         | NextAuth v5                                  |
| Media        | ImageKit                                     |
| Jobs         | Upstash Workflow, Upstash Redis              |
| Email        | Resend                                       |
| Forms        | React Hook Form, Zod                         |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Neon Postgres database (with the `pgvector` extension enabled)
- ImageKit, Upstash, and Resend accounts
- A Google AI Studio `GEMINI_API_KEY` (for embeddings)

### Installation

```bash
git clone <repo-url>
cd bookish
npm install
```

### Environment Variables

Create a `.env.local` in the project root:

```bash
DATABASE_URL=

AUTH_SECRET=
BETTER_AUTH_SECRET=

NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=

NEXT_PUBLIC_API_ENDPOINT=
NEXT_PUBLIC_PROD_API_ENDPOINT=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

QSTASH_URL=
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=

RESEND_API_KEY=

GEMINI_API_KEY=
```

### Database

```bash
# On a fresh database, create the pgvector extension first:
#   CREATE EXTENSION IF NOT EXISTS vector;

npm run db:generate    # generate migrations
npm run db:migrate     # apply migrations
npx tsx database/seed.ts   # seed sample books (optional)
npm run db:embed       # backfill book embeddings (optional)
```

> `db:embed` is idempotent — safe to re-run after adding new books.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command               | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start development server                     |
| `npm run build`       | Production build                             |
| `npm run start`       | Start production server                      |
| `npm run lint`        | Run ESLint                                   |
| `npm run db:generate` | Generate Drizzle migrations                  |
| `npm run db:migrate`  | Apply migrations                             |
| `npm run db:studio`   | Open Drizzle Studio                          |
| `npm run db:embed`    | Backfill book embeddings (Gemini, idempotent)|

---

## Project Structure

```
app/
├── (auth)/            # sign-in, sign-up
├── (root)/            # home, book catalog, book detail, profile
├── admin/             # admin dashboard (books, users, requests)
└── api/               # auth, imagekit, workflow routes
components/            # UI and feature components
│   ├── admin/         # admin tables, forms, navigation
│   └── ui/            # shared shadcn/ui primitives
database/              # Drizzle schema, client, seed
lib/
├── actions/           # server actions (auth, books)
├── recommend.ts       # vector similarity queries
├── embeddings.ts      # Gemini embedding client
└── workflow.ts        # Upstash Workflow + Resend
migrations/            # generated SQL migrations
scripts/               # embedding backfill script
```

---

## Architecture Notes

- **Vector search** lives in `lib/recommend.ts`. Similarity is computed with raw SQL (`embedding <=> ...` cosine distance) because Drizzle's query builder has no `<=>` operator. An HNSW index keeps lookups fast.
- **Embeddings** are generated by `scripts/embed-books.ts` and refreshed automatically when an admin creates a book. The model runs only in local scripts — never on Vercel.
- **Rate limiting** wraps API routes via `lib/ratelimit.ts` (Upstash Redis).

---

<div align="center">
Made with Next.js + Drizzle
</div>
