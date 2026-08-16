-- SIS Phase 1 schema. Run in the Supabase Cloud SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exam_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exam_name text not null default 'CLAT',
  exam_level text not null default 'UG',
  exam_year integer not null default 2027,
  exam_date date,
  target_score numeric(6,2),
  daily_study_minutes integer check (daily_study_minutes is null or daily_study_minutes > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, exam_name, exam_year)
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  exam_name text not null,
  code text not null unique,
  name text not null,
  display_order integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  code text not null unique,
  name text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.subjects (exam_name, code, name, display_order) values
  ('CLAT', 'english', 'English Language', 1),
  ('CLAT', 'current_affairs', 'Current Affairs & General Knowledge', 2),
  ('CLAT', 'legal', 'Legal Reasoning', 3),
  ('CLAT', 'logical', 'Logical Reasoning', 4),
  ('CLAT', 'quant', 'Quantitative Techniques', 5)
on conflict (code) do update set
  exam_name = excluded.exam_name, name = excluded.name,
  display_order = excluded.display_order, is_active = true;

insert into public.topics (subject_id, code, name, display_order)
select id, topic_code, topic_name, topic_order
from public.subjects
join (values
  ('legal', 'legal_principle_application', 'Principle Application', 1),
  ('logical', 'logical_inference', 'Inference', 1),
  ('english', 'english_reading_inference', 'Reading Inference', 1),
  ('quant', 'quant_percentages', 'Percentages', 1)
) as seed(subject_code, topic_code, topic_name, topic_order)
  on subjects.code = seed.subject_code
on conflict (code) do update set
  subject_id = excluded.subject_id, name = excluded.name,
  display_order = excluded.display_order, is_active = true;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
drop trigger if exists exam_profiles_set_updated_at on public.exam_profiles;
create trigger exam_profiles_set_updated_at before update on public.exam_profiles
  for each row execute procedure public.set_updated_at();

create index if not exists exam_profiles_user_id_idx on public.exam_profiles(user_id);
create index if not exists topics_subject_id_idx on public.topics(subject_id);
create index if not exists subjects_display_order_idx on public.subjects(display_order);
create index if not exists topics_display_order_idx on public.topics(subject_id, display_order);

alter table public.profiles enable row level security;
alter table public.exam_profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "Users can read own exam profiles" on public.exam_profiles;
create policy "Users can read own exam profiles" on public.exam_profiles for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Users can insert own exam profiles" on public.exam_profiles;
create policy "Users can insert own exam profiles" on public.exam_profiles for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "Users can update own exam profiles" on public.exam_profiles;
create policy "Users can update own exam profiles" on public.exam_profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "Users can delete own exam profiles" on public.exam_profiles;
create policy "Users can delete own exam profiles" on public.exam_profiles for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Authenticated users can read subjects" on public.subjects;
create policy "Authenticated users can read subjects" on public.subjects for select to authenticated using (true);
drop policy if exists "Authenticated users can read topics" on public.topics;
create policy "Authenticated users can read topics" on public.topics for select to authenticated using (true);

-- Explicit grants plus RLS policies make reference data read-only to app users.
revoke all on public.profiles, public.exam_profiles, public.subjects, public.topics from anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.exam_profiles to authenticated;
grant select on public.subjects, public.topics to authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;
