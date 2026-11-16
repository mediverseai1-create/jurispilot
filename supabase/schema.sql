-- JurisPilot schema. Run once in the Supabase SQL editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  firm text,
  plan text not null default 'free' check (plan in ('free','pro','firm')),
  subscription_status text not null default 'none' check (subscription_status in ('none','active','cancelled','past_due')),
  plan_activated_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.matters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 200),
  client text,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  matter_id uuid references public.matters(id) on delete set null,
  title text not null,
  file_path text,
  content text not null,
  char_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  matter_id uuid references public.matters(id) on delete set null,
  title text not null default 'New conversation',
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  workflow text not null check (workflow in ('contract_review','clause_extraction','document_summary','draft_memo')),
  input_note text,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('assistant','workflow','upload')),
  created_at timestamptz not null default now()
);
create index if not exists usage_user_month on public.usage_events(user_id, created_at);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'selar',
  external_id text unique,
  email text,
  plan text,
  amount numeric,
  raw jsonb,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.matters enable row level security;
alter table public.documents enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.usage_events enable row level security;
alter table public.payment_events enable row level security; -- no policies: service role only

create policy "profile read own" on public.profiles for select using (auth.uid() = id);
create policy "profile update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Users can never change plan/billing fields themselves.
create or replace function public.protect_plan_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.role(), 'service_role') <> 'service_role' then
    new.plan := old.plan;
    new.subscription_status := old.subscription_status;
    new.plan_activated_at := old.plan_activated_at;
    new.email := old.email;
  end if;
  return new;
end $$;
drop trigger if exists protect_plan on public.profiles;
create trigger protect_plan before update on public.profiles
  for each row execute function public.protect_plan_fields();

do $$ declare t text; begin
  foreach t in array array['matters','documents','conversations','messages','workflow_runs'] loop
    execute format('create policy "%1$s select own" on public.%1$s for select using (auth.uid() = user_id)', t);
    execute format('create policy "%1$s insert own" on public.%1$s for insert with check (auth.uid() = user_id)', t);
    execute format('create policy "%1$s update own" on public.%1$s for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('create policy "%1$s delete own" on public.%1$s for delete using (auth.uid() = user_id)', t);
  end loop;
end $$;
create policy "usage select own" on public.usage_events for select using (auth.uid() = user_id);
create policy "usage insert own" on public.usage_events for insert with check (auth.uid() = user_id);

-- Private storage bucket for original uploads, one folder per user
insert into storage.buckets (id, name, public) values ('vault','vault',false) on conflict do nothing;
create policy "vault read own" on storage.objects for select using (bucket_id = 'vault' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "vault write own" on storage.objects for insert with check (bucket_id = 'vault' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "vault delete own" on storage.objects for delete using (bucket_id = 'vault' and (storage.foldername(name))[1] = auth.uid()::text);
