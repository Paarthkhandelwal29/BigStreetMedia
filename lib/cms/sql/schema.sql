create extension if not exists "pgcrypto";

drop table if exists case_study_portfolio_media cascade;
drop table if exists case_study_portfolio_items cascade;
drop table if exists case_study_results cascade;
drop table if exists case_study_media_labels cascade;
drop table if exists case_study_execution_points cascade;
drop table if exists case_study_strategy_points cascade;
drop table if exists case_studies cascade;
drop table if exists portfolio_media cascade;
drop table if exists portfolio_items cascade;
drop table if exists portfolio_formats cascade;
drop table if exists portfolio_categories cascade;
drop table if exists inventory_media cascade;
drop table if exists inventory_items cascade;
drop table if exists brands cascade;

drop table if exists portfolio_works cascade;
drop table if exists media_inventory cascade;

create table portfolio_works (
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

create table media_inventory (
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

create index idx_portfolio_works_brand_name on portfolio_works(brand_name);
create index idx_portfolio_works_category on portfolio_works(category);
create index idx_portfolio_works_format on portfolio_works(format);
create index idx_portfolio_works_city on portfolio_works(city);
create index idx_portfolio_works_featured on portfolio_works(featured);
create index idx_portfolio_works_created_at on portfolio_works(created_at desc);

create index idx_media_inventory_city on media_inventory(city);
create index idx_media_inventory_media_type on media_inventory(media_type);
create index idx_media_inventory_featured on media_inventory(featured);
create index idx_media_inventory_created_at on media_inventory(created_at desc);
