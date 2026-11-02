# Quiz Management

Teacher–student quiz platform with Supabase auth, timed attempts, results, and PDF export — built for education and bootcamp assessments.

## Live demo

[https://quiz-management-app.vercel.app](https://quiz-management-app.vercel.app)

## Used in production

This app powers real-world quizzes and assessments at **[VisionX Skills](https://www.visionx.pk)** (an education and training institute). Teachers create and manage quizzes; students take timed assessments in live courses — not a demo-only project.

## Key features

- Supabase email/password auth with session middleware
- Teacher dashboard: quiz list, metrics, create/edit flows
- Multiple-choice question builder (4 options + correct answer)
- Per-question / quiz timers
- Student quiz intro → timed attempt → submit → `quiz_attempts`
- Results views and PDF generation (`jspdf` / route-based PDF)
- Postgres schema + RLS policies and SQL migrations (timer, proctoring fields)
- Proctoring foundations (`warnings_count`, terminate reason) — UI still evolving

## Tech stack

| Layer | Choice |
| --- | --- |
| App | Next.js (App Router) + TypeScript |
| UI | Tailwind, Radix/shadcn-style components |
| Auth / DB | Supabase (Auth, Postgres, RLS) |
| Hosting | Vercel |

## Architecture (brief)

```
Next.js (UI + Route Handlers)
    │  @supabase/ssr middleware
    ▼
Supabase Auth + Postgres (RLS)
    migrations in supabase/migrations/
```

API routes under `app/api/quiz/...` handle attempt, submit, and PDF results.

## Getting started

### Prerequisites

- Node.js 18+
- A Supabase project (URL + anon key); apply SQL under `supabase/migrations/` and `scripts/`

### Install

```bash
git clone https://github.com/hafizabdullah1/quiz-management.git
cd quiz-management
npm install
```

### Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon (public) key |

Apply migrations (Supabase SQL editor or CLI), then:

```bash
npm run dev      # http://localhost:3000
npm run build
npm start
npm run lint
```

## Deployment

- **Vercel:** import repo; set the two `NEXT_PUBLIC_SUPABASE_*` vars; production URL already used as homepage.
- Keep RLS enabled; never expose the service role key in the browser.

## Roadmap

- [ ] Finish tab-switch / fullscreen proctoring UI
- [ ] Question bank + class roster assignment
- [ ] Rename npm package from `my-v0-project`
- [ ] Remove unused framework deps left from v0 scaffold
- [ ] Add CI, tests, MIT license, social preview image

## Author

**Hafiz Abdullah** — [GitHub](https://github.com/hafizabdullah1) · [hafizabdullah.site](https://hafizabdullah.site)
