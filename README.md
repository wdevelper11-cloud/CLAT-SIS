# SIS — Student Intelligence System

CLAT-focused student intelligence prototype. Phase 1 provides the secure foundation for real student data; it intentionally contains no assessments, generated intelligence, or practice data.

## Phase 1 functionality

- Supabase Auth signup, email confirmation callback, login, and logout
- Automatic student profile creation
- Idempotent CLAT UG 2027 onboarding
- Server-protected dashboard with real profile, exam, and subject data
- Five CLAT subjects and four minimal topics
- Row Level Security for private student records and read-only reference data

## Environment setup

Copy `.env.example` to `.env.local` and fill in the values from **Supabase Dashboard → Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Only the publishable client key is used. Do not add a service-role key. In **Authentication → URL Configuration**, set the site URL to `http://localhost:3000` for local work and add `http://localhost:3000/auth/callback` as a redirect URL. Add the equivalent production callback URL when deploying.

## Database setup

1. Create or open a Supabase Cloud project.
2. Open **SQL Editor**, create a new query, and paste the complete contents of [`supabase/phase-1-schema.sql`](supabase/phase-1-schema.sql).
3. Click **Run**. The schema, triggers, indexes, RLS policies, and idempotent seeds are all contained in that file; it is safe to run again.

No local Supabase installation is required.

## Local run

```bash
npm install
npm run dev
```

Then visit `http://localhost:3000`.

## Manual Phase 1 acceptance verification

1. Confirm the app starts without TypeScript/build errors and the configured Supabase project is reachable.
2. Sign up with a full name, email, and password. If email confirmation is enabled, follow the email link, then log in.
3. In Supabase Table Editor, confirm signup created exactly one matching `profiles` row.
4. Confirm the first login reaches `/onboarding`; enter valid optional goals and start SIS.
5. Confirm exactly one CLAT UG 2027 `exam_profiles` row was created. Reopen `/onboarding` and refresh it; confirm it redirects and creates no duplicate.
6. Confirm the dashboard uses the real name and CLAT exam profile, lists the five database subjects, and shows only **No data** and **Not calculated yet**.
7. Log out and confirm `/dashboard` and `/onboarding` both redirect to `/login`.
8. Create a second account. Using its authenticated client/session, confirm it cannot select or modify the first student's `profiles` or `exam_profiles` rows.
9. As a normal authenticated user, confirm subjects and topics can be selected but cannot be inserted, updated, or deleted.
10. In Table Editor, confirm exactly five seeded CLAT subjects and the four minimal topics (Principle Application, Inference, Reading Inference, Percentages) exist.
11. Confirm no service-role key exists in application files, then run `npm run build` successfully.

Browser/Auth and live database behavior require a configured Supabase Cloud project and must be checked manually. Email confirmation behavior is controlled under **Authentication → Providers → Email**; with confirmation enabled signup shows an instruction to check email, while disabled confirmation continues directly to onboarding.
