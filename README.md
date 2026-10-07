# Bookish

A university library platform for discovering, borrowing, and managing books — built with Next.js, Drizzle ORM, and Neon Postgres.

## Features

- **Book catalog** — browse latest titles, search, and view detailed book pages
- **Borrowing system** — borrow books with due dates and track your loans from a personal profile
- **Authentication** — sign up / sign in with NextAuth v5 and university ID verification
- **Admin dashboard** — create and manage books, covers, and availability
- **Media handling** — book covers and videos uploaded via ImageKit
- **Re-engagement emails** — automated welcome and inactivity workflows with Upstash Workflow + Resend
- **Rate limiting** — API protection backed by Upstash Redis

## Tech Stack

| Layer     | Choice                                        |
| --------- | --------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19             |
| Styling   | Tailwind CSS v4, shadcn/ui                    |
| Database  | PostgreSQL (Neon) via Drizzle ORM             |
| Auth      | NextAuth v5                                   |
| Media     | ImageKit                                      |
| Jobs      | Upstash Workflow, Upstash Redis               |
| Email     | Resend                                        |
| Forms     | React Hook Form, Zod                          |

## Getting Started

### Prerequisites

- Node.js 20+
- A Neon Postgres database
- ImageKit, Upstash, and Resend accounts

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
```

### Database

```bash
npm run db:generate   # generate migrations
npm run db:migrate    # apply migrations
npx tsx database/seed.ts   # seed sample books (optional)
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `npm run dev`       | Start development server      |
| `npm run build`     | Production build              |
| `npm run start`     | Start production server       |
| `npm run lint`      | Run ESLint                    |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate`  | Apply migrations            |
| `npm run db:studio`   | Open Drizzle Studio          |

## Project Structure

```
app/
├── (auth)/        # sign-in, sign-up
├── (root)/        # home, book catalog, profile
├── admin/         # admin dashboard
└── api/           # auth, imagekit, workflow routes
components/        # UI and feature components
database/          # Drizzle schema, client, seed
migrations/        # generated SQL migrations
```
