-- Supabase schema for the portfolio content store.
-- Run this in the Supabase SQL editor once.

create table if not exists public.content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security: fully locked down. The app only talks to this table
-- through the service-role key from server-side code, so no public roles
-- need any access.
alter table public.content enable row level security;
