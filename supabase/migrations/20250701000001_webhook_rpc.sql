-- Webhook RPC (no service role required in app)

create table if not exists public.app_config (
  key text primary key,
  value text not null
);

alter table public.app_config enable row level security;

insert into public.app_config (key, value)
values ('webhook_secret', 'grill-dev-webhook-secret')
on conflict (key) do update set value = excluded.value;

create or replace function public.confirm_yookassa_payment(
  p_yookassa_id text,
  p_webhook_secret text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
  v_secret text;
begin
  select value into v_secret from public.app_config where key = 'webhook_secret';
  if p_webhook_secret is distinct from v_secret then
    raise exception 'invalid webhook secret';
  end if;

  select * into v_payment
  from public.payments
  where yookassa_id = p_yookassa_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'payment_not_found');
  end if;

  if v_payment.status = 'succeeded' then
    return jsonb_build_object('ok', true, 'reason', 'already_succeeded');
  end if;

  update public.payments set status = 'succeeded' where id = v_payment.id;
  update public.analyses set status = 'paid_in_progress' where id = v_payment.analysis_id;

  return jsonb_build_object('ok', true, 'analysis_id', v_payment.analysis_id);
end;
$$;

revoke all on function public.confirm_yookassa_payment(text, text) from public;
grant execute on function public.confirm_yookassa_payment(text, text) to anon, authenticated, service_role;
