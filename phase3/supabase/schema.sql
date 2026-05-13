-- ============================================================
-- AEGIS Phase 3 – Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ── 1. Monitoring Sessions (Repositories being monitored) ────
create table if not exists public.monitoring_sessions (
  id          text primary key,
  repo_url    text not null,
  repo_name   text not null,
  branch      text not null default 'main',
  added_at    bigint not null,
  last_active bigint,
  user_id     text  -- for multi-user support later
);

-- ── 2. Attacks ───────────────────────────────────────────────
create table if not exists public.attacks (
  id               text primary key,
  session_id       text not null references public.monitoring_sessions(id) on delete cascade,
  type             text not null,
  severity         text not null,
  source_ip        text,
  target_endpoint  text,
  method           text,
  payload          text,
  timestamp        bigint not null,
  blocked          boolean default true,
  source           text default 'live'
);

create index if not exists attacks_session_id_idx on public.attacks(session_id);
create index if not exists attacks_timestamp_idx  on public.attacks(timestamp desc);

-- ── 3. Healing Actions ───────────────────────────────────────
create table if not exists public.healing_actions (
  id                  text primary key,
  session_id          text not null references public.monitoring_sessions(id) on delete cascade,
  attack_type         text not null,
  severity            text not null,
  source_ip           text,
  target_endpoint     text,
  method              text,
  payload             text,
  patch               text not null,
  waf_rule_id         text,
  block_pattern       text,
  status              text not null default 'Applied',
  applied_at          bigint not null,
  reverse_deadline    bigint not null,
  reversed_at         bigint,
  reversed_by         text,
  approved_at         bigint,
  approved_by         text,
  telegram_message_id integer,
  telegram_chat_id    text
);

create index if not exists healing_session_id_idx on public.healing_actions(session_id);
create index if not exists healing_applied_at_idx on public.healing_actions(applied_at desc);

-- ── 4. Audit Log ─────────────────────────────────────────────
create table if not exists public.audit_log (
  id          text primary key,
  session_id  text not null references public.monitoring_sessions(id) on delete cascade,
  ts          bigint not null,
  actor       text,
  actor_name  text,
  action      text,
  ref_id      text,
  ref_label   text,
  note        text
);

create index if not exists audit_session_id_idx on public.audit_log(session_id);
create index if not exists audit_ts_idx         on public.audit_log(ts desc);

-- ── 5. Enable RLS (Row Level Security) – production-ready ────
alter table public.monitoring_sessions enable row level security;
alter table public.attacks             enable row level security;
alter table public.healing_actions     enable row level security;
alter table public.audit_log           enable row level security;

-- Allow full access via service role key (used by our API routes)
create policy "service_role_all" on public.monitoring_sessions for all using (true) with check (true);
create policy "service_role_all" on public.attacks             for all using (true) with check (true);
create policy "service_role_all" on public.healing_actions     for all using (true) with check (true);
create policy "service_role_all" on public.audit_log           for all using (true) with check (true);
