# GRILL IDEAS

Жёсткая валидация бизнес-идей · maxima consulting

## Стек

- Next.js 16 + Tailwind (`mc-*` palette)
- Supabase Auth + Postgres + RLS
- OpenRouter (`deepseek/deepseek-v4-flash`)
- ЮKassa (999 ₽ за этапы 2–14)
- PDF-экспорт (Puppeteer)

## Локальный запуск

1. Скопируйте `.env.example` → `.env.local` и заполните ключи
2. Миграции уже в Supabase (см. `supabase/migrations/`)
3. `npm install && npm run dev` → http://localhost:3000
4. Webhook ЮKassa локально — HTTPS-туннель:

```bash
./scripts/local-webhook-tunnel.sh   # localtunnel (или TUNNEL=ngrok)
```

В кабинете ЮKassa → HTTP-уведомления:
- URL: `https://<tunnel-host>/api/payment/webhook`
- Событие: `payment.succeeded`

На время теста оплаты: `NEXT_PUBLIC_APP_URL=https://<tunnel-host>` + перезапуск dev.

## E2E smoke

```bash
# Backend: auth → analysis → webhook
./scripts/e2e-smoke.sh

# Browser: register → form → stages 0–1 → payment gate
node scripts/e2e-browse.mjs
```

Чеклист ручного прогона:
1. `/register` → `/dashboard/analyze`
2. Форма 16 полей → стриминг этапа 0
3. «Продолжить» → этап 1
4. Экран оплаты 999 ₽ → тестовая карта ЮKassa
5. Этапы 2–3 → `/dashboard/history` → resume

## PDF

После `status=completed`:
- Кнопка «Скачать PDF» на экране завершения и в `/dashboard/history/[id]`
- API: `GET /api/analysis/{id}/pdf`

## Docker (VPS)

```bash
cp .env.example .env.production
docker compose up -d --build
```

Образ включает Chromium для PDF (`PUPPETEER_EXECUTABLE_PATH`).

## Флоу

1. Регистрация → форма идеи → этапы 0–1 бесплатно
2. Оплата 999 ₽ → этапы 2–14
3. Прогресс сохраняется · одна активная идея за раз
4. После completed — «Начать новую идею» или PDF

## Структура

- `/` — лендинг (variant C Bold Verdict)
- `/dashboard/analyze` — анализ
- `/dashboard/history` — завершённые идеи
