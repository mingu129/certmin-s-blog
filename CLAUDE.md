# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deployment

Hosted on Oracle Cloud Ubuntu 24.04 (ARM64) at `blog.certmin.com`.

- **Process manager**: PM2 (`pm2 restart certmin-blog`)
- **Reverse proxy**: Nginx with Let's Encrypt SSL
- **Node.js**: v22 via nvm (set as default, loaded via `~/.bashrc`)

### Deploy after code changes

```bash
npm run build && pm2 restart certmin-blog
```

### Development with live reload

```bash
pm2 stop certmin-blog
npm run dev       # blog.certmin.com reflects changes on save
# when done:
npm run build && pm2 start certmin-blog
```

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Environment Variables

`.env.local` is present on the server (not committed):

```
REDIS_URL=redis://localhost:6379
ADMIN_PASSWORD=...
```

## Architecture

Personal blog built with Next.js 16 App Router. **Redis is the primary data store** for posts and settings. Images are stored on the filesystem at `public/uploads/`.

### Data Model

**Redis**
- `kv:posts` — Sorted set of all post slugs, scored by creation timestamp (used for chronological ordering)
- `kv:post:{slug}` — JSON string for each post with fields: `slug`, `title`, `date`, `content`, `updatedAt?`, `tags?`, `thumbnail?`
- `kv:settings` — JSON string for site settings: `siteSubtitle`, `profileName`, `profileDescription`, `profilePhoto`
- Post slugs are generated as `{YYYY-MM-DD}-{Date.now()}`

**Filesystem**
- `public/uploads/{id}.{ext}` — Uploaded images (served as `/uploads/{id}.{ext}`)
- `public/uploads/` is gitignored

### Authentication

Admin auth uses an HMAC-SHA256 token: `HMAC(ADMIN_PASSWORD, 'admin-session')`. This token is stored in an httpOnly cookie (`admin_token`). Token verification is done inline in each protected API route — there is no middleware.

Admin panel access is hidden: double-click the dancing baby GIF on the homepage to reach `/admin`.

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
| `POST /api/admin/upload` | Upload image to `public/uploads/` |
| `GET /api/admin/settings` | Get/save site settings |
| `GET /api/images/[id]` | Legacy image route (Redis fallback for old images) |

### Shared Utilities

- `lib/redis.ts` — Exports a single shared `redis` ioredis client instance
- `lib/posts.ts` — `getAllPosts()` and `getPostBySlug()` server-side helpers that read from Redis

### Styling

All styles are in `app/globals.css` using plain CSS with CSS custom properties (not Tailwind utility classes). Key variables: `--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`, `--link`. Font is DungGeunMo (Korean pixel font) loaded from `public/fonts/`.

### Path Alias

`@/*` maps to the repository root (e.g., `@/lib/redis` → `./lib/redis.ts`).
