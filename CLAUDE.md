# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Environment Variables

Create `.env.local` before running:

```
REDIS_URL=redis://localhost:6379
ADMIN_PASSWORD=your-secret-password
```

## Architecture

Personal blog built with Next.js 16 App Router. **Redis is the sole data store** — there are no files, databases, or CMS beyond Redis.

### Data Model (Redis)

- `kv:posts` — Sorted set of all post slugs, scored by creation timestamp (used for chronological ordering)
- `kv:post:{slug}` — JSON string for each post with fields: `slug`, `title`, `date`, `content`, `updatedAt?`
- Post slugs are generated as `{YYYY-MM-DD}-{Date.now()}`

### Authentication

Admin auth uses an HMAC-SHA256 token: `HMAC(ADMIN_PASSWORD, 'admin-session')`. This token is stored in an httpOnly cookie (`admin_token`). Token verification is done inline in each protected API route — there is no middleware.

Admin panel access is hidden: double-click the dancing baby GIF on the homepage sidebar to reach `/admin`.

### Route Structure

| Route | Purpose |
|-------|---------|
| `/` | Home with sidebar (about, recent posts) |
| `/blog` | Post list |
| `/blog/[slug]` | Post detail (`force-dynamic`) |
| `/admin` | Login page (client component) |
| `/admin/write` | Admin dashboard — create, list, delete posts |
| `/admin/edit/[slug]` | Edit existing post |
| `POST /api/admin/login` | Set auth cookie |
| `DELETE /api/admin/login` | Clear auth cookie |
| `GET/POST /api/admin/posts` | List all / create post |
| `GET/PUT/DELETE /api/admin/posts/[slug]` | Single post CRUD |

### Shared Utilities

- `lib/redis.ts` — Exports a single shared `redis` ioredis client instance
- `lib/posts.ts` — `getAllPosts()` and `getPostBySlug()` server-side helpers that read from Redis

### Styling

All styles are in `app/globals.css` using plain CSS with CSS custom properties (not Tailwind utility classes). Key variables: `--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`, `--link`. Font is DungGeunMo (Korean pixel font) loaded from `public/fonts/`.

### Path Alias

`@/*` maps to the repository root (e.g., `@/lib/redis` → `./lib/redis.ts`).
