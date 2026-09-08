# PS Performer Directory


Full-stack **18+ adult performer directory**: bios, tags, and **public social links only**.

**Stack:** Next.js App Router · TypeScript · Prisma · PostgreSQL · Tailwind CSS · simple admin session auth

## Content policy

This project is a **metadata and public-link directory only**.

- Do **not** add unauthorized video downloads, P2P share links, or pirate streaming hosts.
- Do **not** embed or hotlink copyrighted adult video files.
- Use **public social / official profile URLs** only. Leave blank if unsure — never invent URLs.
- Piracy-related contributions will be rejected.

- Explicitly disallowed: torrents, magnets, and pirated video hosting/streaming.

## Quick start (Docker Compose)

Requires Docker and Docker Compose.

```bash
cd PS
docker compose up --build
```

Then open:

- App: http://localhost:3000
- Age gate appears first; accept to browse
- Admin: http://localhost:3000/admin
  - Default credentials: `admin` / `changeme` (change via env)

On startup the app container runs Prisma schema sync and seeds **8** well-known Western performers.

### Services

| Service | Port | Notes |
|---------|------|--------|
| `app`   | 3000 | Next.js (standalone) |
| `db`    | 5432 | Postgres 16 |

### Environment

Copy `.env.example` for local non-Docker use. Compose injects `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SESSION_SECRET`.

**Change `ADMIN_PASSWORD` and `SESSION_SECRET` before any real deployment.**

## Local development (Postgres via Compose only)

```bash
docker compose up -d db

export DATABASE_URL="postgresql://ps:pssecret@localhost:5432/ps_directory?schema=public"
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=changeme
export SESSION_SECRET=dev-session-secret-change-me-please-32

npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

App: http://localhost:3000

## Features

- **18+ age gate** (localStorage acknowledgment)
- **Browse / search / filter** by text and tags
- **Performer detail**: bio, tags, public social links
- **Admin CRUD** behind HMAC-signed httpOnly session cookie
- **Seed data**: Angela White, Asa Akira, Riley Reid, Mia Khalifa, Lena Paul, Brandi Love, Abella Danger, Stoya

## Sample URLs (after seed)

- Home: `/`
- Search: `/?q=angela`
- Tag filter: `/?tag=feature`
- Detail: `/performers/angela-white`
- Admin: `/admin`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production build |
| `npm run db:push` | Sync Prisma schema |
| `npm run db:seed` | Seed performers |
| `npm run db:setup` | push + seed |

## License

Private / as configured by the repository owner.
