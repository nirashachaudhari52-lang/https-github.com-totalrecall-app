# Total Recall app

Companion app and book shop for *Total Recall: One Stop Solution for All Nursing Competitive Exams* by Kiran S. M. (Patil).

Live at **totalrecallofficial.com** (moving here from Floot).

## How it runs (all free plans)

| Part | Service |
|---|---|
| Website, app screens, API (`/_api/*`) | Cloudflare Pages + Pages Functions |
| Database | Supabase Postgres (Mumbai) |
| Images the author uploads | Supabase Storage, bucket `static` |
| Sample pages, icons | Files in `public/_cdn/static/` |
| Android app | GitHub Actions build (see `android/`) |

## Folders

- `pages/` — one file per screen (`quizzes.$subjectId.tsx` → `/quizzes/:subjectId`), `*.pageLayout.tsx` wraps a page
- `components/`, `helpers/` — shared UI and logic
- `endpoints/` — API handlers, `endpoints/mock/start_POST.ts` → `POST /_api/mock/start`
- `functions/` — Cloudflare glue: routes `/_api/*` to `endpoints/`, serves `/_cdn/static/*`
- `migrations/` — database tables for Supabase

## Cloudflare Pages settings

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables (Settings → Variables and Secrets): `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, optional `RESEND_API_KEY`, `EMAIL_FROM`
- Compatibility flag `nodejs_compat` (set in `wrangler.toml`)
