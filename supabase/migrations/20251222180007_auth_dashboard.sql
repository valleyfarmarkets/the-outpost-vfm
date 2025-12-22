-- Supabase auth + admin dashboard setup
-- Run via Supabase SQL editor or CLI. Idempotent guards are included.

-- Ensure pgcrypto for gen_random_uuid
create extension if not exists "pgcrypto";

-- Helper: check admin role from JWT app_metadata (fast, no join)
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- Timestamp trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Profiles table mirrors auth.users and stores role
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- When a new auth user is created, insert profile with default admin role only if provided
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, coalesce((new.raw_app_meta_data ->> 'role')::text, 'admin'))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Keep auth.users app_metadata in sync with profiles.role for faster RLS (claims-based)
create or replace function public.sync_role_to_app_metadata()
returns trigger as $$
declare
  current_meta jsonb;
begin
  select raw_app_meta_data into current_meta from auth.users where id = new.id;
  update auth.users
  set raw_app_meta_data = jsonb_set(coalesce(current_meta, '{}'::jsonb), '{role}', to_jsonb(new.role))
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists profiles_sync_role_to_app_metadata on public.profiles;
create trigger profiles_sync_role_to_app_metadata
after insert or update on public.profiles
for each row execute function public.sync_role_to_app_metadata();

alter table public.profiles enable row level security;
drop policy if exists "Admin manage profiles" on public.profiles;
create policy "Admin manage profiles" on public.profiles
for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

-- Live music events
create table if not exists public.live_music_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  starts_at timestamptz not null,
  description text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists live_music_events_set_updated_at on public.live_music_events;
create trigger live_music_events_set_updated_at
before update on public.live_music_events
for each row
execute function public.set_updated_at();

alter table public.live_music_events enable row level security;
drop policy if exists "Admin manage live music" on public.live_music_events;
create policy "Admin manage live music" on public.live_music_events
for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

drop policy if exists "Public can view published events" on public.live_music_events;
create policy "Public can view published events" on public.live_music_events
for select
to anon, authenticated
using (is_published = true);

-- Contact submissions
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'handled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists contact_submissions_set_updated_at on public.contact_submissions;
create trigger contact_submissions_set_updated_at
before update on public.contact_submissions
for each row
execute function public.set_updated_at();

alter table public.contact_submissions enable row level security;
drop policy if exists "Admin manage contact submissions" on public.contact_submissions;
create policy "Admin manage contact submissions" on public.contact_submissions
for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

-- Optional: admin audit log
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  table_name text not null,
  record_id text,
  diff jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_logs enable row level security;
drop policy if exists "Admin can read audit logs" on public.admin_audit_logs;
create policy "Admin can read audit logs" on public.admin_audit_logs
for select using (is_admin(auth.uid()));

-- Bookings table: enforce admin-only access if present
do $$
begin
  if exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'bookings'
  ) then
    alter table public.bookings enable row level security;
    drop policy if exists "Admin manage bookings" on public.bookings;
    create policy "Admin manage bookings" on public.bookings
    for all
    using (is_admin(auth.uid()))
    with check (is_admin(auth.uid()));
  end if;
end $$;

-- Seed first admin via Supabase Admin API (service key): supabase.auth.admin.inviteUserByEmail({ email, data: { role: 'admin' } })
