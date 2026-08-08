# reidworks.my — Portfolio

Next.js portfolio of Farid Razmi, student at IIUM Gombak, aspiring cloud &
network engineer.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file (or configure them in Vercel):

```
# Required for the admin panel to work. Must be set or admin auth fails closed.
ADMIN_PIN=your-secret-pin

# Optional: enables durable storage via Supabase Postgres.
# Without these, the site falls back to the bundled data/*.json files and
# admin edits only last for the lifetime of the server process.
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> `SUPABASE_SERVICE_ROLE_KEY` is a server-only secret. Never expose it to the
> browser — it must not be prefixed with `NEXT_PUBLIC_`. The site only uses it
> from server-side API routes.

## Setting up Supabase (durable content storage)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the contents of `supabase/schema.sql`. This
   creates a single `content` table (key → JSON payload) with row-level
   security disabled for the service role.
3. Copy the project URL and Service Role key from **Project Settings → API**
   into `.env.local` / Vercel as `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY`.
4. Seed the initial content from the bundled JSON files:

   ```bash
   npx tsx scripts/seed-supabase.ts
   ```

5. Restart `npm run dev` (or redeploy) so the store picks up the variables.

Once configured, edits made in `/admin` persist in Postgres and survive
serverless cold starts / redeploys.

## Admin

- Panel: `https://reidworks.my/admin`
- Sign in with `ADMIN_PIN`. The server issues an httpOnly signed session cookie
  (7-day expiry). `Authorization: Bearer <pin>` also works against the API.
- The `robots.txt` file disallows `/admin` from search engines.

## SEO / Deployment

- Canonical domain: `https://reidworks.my` (`app/layout.tsx`, `app/sitemap.ts`,
  `app/robots.ts`).
- After deploying to Vercel, verify the domain in Google Search Console and
  submit `https://reidworks.my/sitemap.xml`.
