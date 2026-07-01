# SteveOS v0.1

A minimal Mission Control dashboard for Steve: The ONE, Critical Five, portfolio health cards, CEO notes and Friday win.

## Run locally

```bash
npm install
npm run dev
```

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local` and add your Supabase URL and anon key.

v0.1 uses static starter data in the UI so you can deploy immediately. Supabase schema is included for the next sprint.

## Deploy to Vercel

Push this folder to GitHub, import the repo in Vercel, add environment variables, deploy.
