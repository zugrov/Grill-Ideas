-- GRILL IDEAS schema

create type analysis_status as enum (
  'draft',
  'free_in_progress',
  'awaiting_payment',
  'paid_in_progress',
  'completed'
);

create type payment_status as enum (
  'pending',
  'succeeded',
  'canceled'
);

create type message_role as enum (
  'user',
  'assistant',
  'system'
);

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status analysis_status not null default 'draft',
  current_stage integer not null default 0,
  input_data jsonb,
  payment_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  yookassa_id text not null unique,
  status payment_status not null default 'pending',
  amount integer not null default 999,
  created_at timestamptz not null default now()
);

alter table public.analyses
  add constraint analyses_payment_id_fkey
  foreign key (payment_id) references public.payments(id);

create table public.analysis_messages (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  stage integer not null,
  role message_role not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index analyses_user_id_idx on public.analyses(user_id);
create index analyses_status_idx on public.analyses(status);
create index analysis_messages_analysis_id_idx on public.analysis_messages(analysis_id);
create index payments_user_id_idx on public.payments(user_id);
create index payments_yookassa_id_idx on public.payments(yookassa_id);

create unique index one_active_analysis_per_user
  on public.analyses(user_id)
  where status != 'completed';

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger analyses_updated_at
  before update on public.analyses
  for each row execute function public.set_updated_at();

alter table public.analyses enable row level security;
alter table public.analysis_messages enable row level security;
alter table public.payments enable row level security;

create policy "Users read own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users update own analyses"
  on public.analyses for update
  using (auth.uid() = user_id);

create policy "Users read own messages"
  on public.analysis_messages for select
  using (
    exists (
      select 1 from public.analyses a
      where a.id = analysis_id and a.user_id = auth.uid()
    )
  );

create policy "Users insert own messages"
  on public.analysis_messages for insert
  with check (
    exists (
      select 1 from public.analyses a
      where a.id = analysis_id and a.user_id = auth.uid()
    )
  );

create policy "Users read own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Users insert own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

create policy "Users update own payments"
  on public.payments for update
  using (auth.uid() = user_id);
