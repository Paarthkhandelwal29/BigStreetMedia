create extension if not exists "pgcrypto";

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  site_code text,
  city text,
  state text,
  locality text,
  address text,
  google_maps_url text,
  media_type text,
  media_category text,
  width integer,
  height integer,
  size text,
  illumination text,
  traffic_volume text,
  media_owner text,
  industries text[] default '{}',
  tags text[] default '{}',
  cover_image_url text,
  thumbnail_url text,
  availability boolean default true,
  featured boolean default false,
  status text default 'active' check (status in ('active','inactive','draft','archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_inventory_items_city on inventory_items(city);
create index if not exists idx_inventory_items_media_type on inventory_items(media_type);
create index if not exists idx_inventory_items_featured on inventory_items(featured);
create index if not exists idx_inventory_items_tags on inventory_items using gin(tags);
create index if not exists idx_inventory_items_industries on inventory_items using gin(industries);

create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  client_name text,
  service_type text,
  location text,
  project_date date,
  description text,
  cover_image_url text,
  thumbnail_url text,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_portfolio_projects_featured on portfolio_projects(featured);

create table if not exists case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  client_name text,
  objective text,
  challenge text,
  solution text,
  execution text,
  results text,
  cover_image_url text,
  thumbnail_url text,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_case_studies_featured on case_studies(featured);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('inventory','portfolio','case_study')),
  owner_id uuid not null,
  kind text not null check (kind in ('image','video')),
  url text not null,
  imagekit_file_id text,
  width integer,
  height integer,
  file_size integer,
  caption text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_media_assets_owner_type on media_assets(owner_type);
create index if not exists idx_media_assets_owner_id on media_assets(owner_id);
