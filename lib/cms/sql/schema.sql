-- Big Street Media CMS schema (create-only, idempotent).
--
-- Safe to run repeatedly against a live database: every statement uses
-- "if not exists" and will NOT drop or truncate existing data. To tear the
-- schema down, run drop-all.sql explicitly (it is destructive by design).

create extension if not exists "pgcrypto";

create table if not exists portfolio_works (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  category text not null,
  format text not null,
  city text not null,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'video')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists media_inventory (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  media_type text not null,
  size text not null,
  location text not null,
  images text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_portfolio_works_brand_name on portfolio_works(brand_name);
create index if not exists idx_portfolio_works_category on portfolio_works(category);
create index if not exists idx_portfolio_works_format on portfolio_works(format);
create index if not exists idx_portfolio_works_city on portfolio_works(city);
create index if not exists idx_portfolio_works_featured on portfolio_works(featured);
create index if not exists idx_portfolio_works_created_at on portfolio_works(created_at desc);

create index if not exists idx_media_inventory_city on media_inventory(city);
create index if not exists idx_media_inventory_media_type on media_inventory(media_type);
create index if not exists idx_media_inventory_featured on media_inventory(featured);
create index if not exists idx_media_inventory_created_at on media_inventory(created_at desc);

-- Row Level Security.
-- Writes happen server-side with the service-role key, which bypasses RLS.
-- Enabling RLS with a read-only policy means that even if the public anon key
-- leaks, it can only read these (already public) marketing records — never
-- insert/update/delete.
alter table portfolio_works enable row level security;
alter table media_inventory enable row level security;

drop policy if exists "public read portfolio_works" on portfolio_works;
create policy "public read portfolio_works"
  on portfolio_works for select
  using (true);

drop policy if exists "public read media_inventory" on media_inventory;
create policy "public read media_inventory"
  on media_inventory for select
  using (true);
