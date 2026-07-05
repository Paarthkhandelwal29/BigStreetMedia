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

create table case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  brand_id uuid,
  brand_name text,
  industry text,
  campaign_type text,
  challenge text,
  objective text,
  duration text,
  cities text,
  brief_type text,
  featured boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published')),
  testimonial_quote text,
  testimonial_name text,
  testimonial_title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table case_study_strategy_points (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references case_studies(id) on delete cascade,
  content text not null,
  sort_order int not null default 0
);

create table case_study_execution_points (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references case_studies(id) on delete cascade,
  content text not null,
  sort_order int not null default 0
);

create table case_study_media_labels (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references case_studies(id) on delete cascade,
  label text not null,
  sort_order int not null default 0
);

create table case_study_results (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references case_studies(id) on delete cascade,
  label text not null,
  value text not null,
  sort_order int not null default 0
);

create table case_study_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references case_studies(id) on delete cascade,
  portfolio_item_id uuid not null,
  sort_order int not null default 0
);

create table case_study_portfolio_media (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references case_studies(id) on delete cascade,
  portfolio_media_id uuid not null,
  sort_order int not null default 0,
  is_featured boolean not null default false
);

create index idx_case_studies_slug on case_studies(slug);
create index idx_case_studies_status on case_studies(status);
create index idx_case_studies_featured on case_studies(featured);
create index idx_case_studies_created_at on case_studies(created_at desc);
create index idx_cs_strategy_case_id on case_study_strategy_points(case_study_id);
create index idx_cs_execution_case_id on case_study_execution_points(case_study_id);
create index idx_cs_media_labels_case_id on case_study_media_labels(case_study_id);
create index idx_cs_results_case_id on case_study_results(case_study_id);
create index idx_cs_portfolio_items_case_id on case_study_portfolio_items(case_study_id);
create index idx_cs_portfolio_media_case_id on case_study_portfolio_media(case_study_id);

create table service_format_images (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null,
  format_name text not null,
  image_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_slug, format_name)
);

create index idx_sfi_service_slug on service_format_images(service_slug);
