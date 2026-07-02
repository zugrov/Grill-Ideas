#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.local ]]; then
  echo "Missing .env.local — copy from .env.example"
  exit 1
fi

set -a
source .env.local
set +a

BASE="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
SUPABASE="${NEXT_PUBLIC_SUPABASE_URL}"
ANON="${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
EMAIL="grill-e2e-$(date +%s)@example.com"
PASSWORD="GrillTest123!"

echo "== 1. Register via Supabase Auth =="
SIGNUP=$(curl -sS -X POST "${SUPABASE}/auth/v1/signup" \
  -H "apikey: ${ANON}" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

ACCESS=$(echo "$SIGNUP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || true)
USER_ID=$(echo "$SIGNUP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('user',{}).get('id',''))" 2>/dev/null || true)

if [[ -z "$ACCESS" || -z "$USER_ID" ]]; then
  echo "Signup failed: $SIGNUP"
  exit 1
fi
echo "OK user=$USER_ID"

INPUT='{"name":"Test SaaS","description":"Smoke test idea","product":"Software","target":"SMB","geography":"RU","stage":"idea","mvp":"no","sales":"no","model":"subscription","check":"5000","channels":"content","team":"solo","budget":"500k","horizon":"12","constraints":"time","goal":"demand"}'

echo "== 2. Create analysis (Supabase REST) =="
ANALYSIS=$(curl -sS -X POST "${SUPABASE}/rest/v1/analyses" \
  -H "apikey: ${ANON}" \
  -H "Authorization: Bearer ${ACCESS}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{\"user_id\":\"${USER_ID}\",\"status\":\"free_in_progress\",\"current_stage\":0,\"input_data\":${INPUT}}")

ANALYSIS_ID=$(echo "$ANALYSIS" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0]['id'] if isinstance(d,list) else d.get('id',''))" 2>/dev/null || true)
if [[ -z "$ANALYSIS_ID" ]]; then
  echo "Analysis create failed: $ANALYSIS"
  exit 1
fi
echo "OK analysis=$ANALYSIS_ID"

echo "== 3. Simulate stages 0-1 done → awaiting_payment =="
curl -sS -X PATCH "${SUPABASE}/rest/v1/analyses?id=eq.${ANALYSIS_ID}" \
  -H "apikey: ${ANON}" \
  -H "Authorization: Bearer ${ACCESS}" \
  -H "Content-Type: application/json" \
  -d '{"current_stage":1,"status":"awaiting_payment"}' >/dev/null
echo "OK status=awaiting_payment"

YOOKASSA_ID="e2e-test-$(date +%s)"

echo "== 4. Create pending payment =="
PAYMENT=$(curl -sS -X POST "${SUPABASE}/rest/v1/payments" \
  -H "apikey: ${ANON}" \
  -H "Authorization: Bearer ${ACCESS}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{\"user_id\":\"${USER_ID}\",\"analysis_id\":\"${ANALYSIS_ID}\",\"yookassa_id\":\"${YOOKASSA_ID}\",\"status\":\"pending\",\"amount\":999}")

PAYMENT_ID=$(echo "$PAYMENT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0]['id'] if isinstance(d,list) else d.get('id',''))" 2>/dev/null || true)
if [[ -z "$PAYMENT_ID" ]]; then
  echo "Payment create failed: $PAYMENT"
  exit 1
fi

curl -sS -X PATCH "${SUPABASE}/rest/v1/analyses?id=eq.${ANALYSIS_ID}" \
  -H "apikey: ${ANON}" \
  -H "Authorization: Bearer ${ACCESS}" \
  -H "Content-Type: application/json" \
  -d "{\"payment_id\":\"${PAYMENT_ID}\"}" >/dev/null
echo "OK payment=$PAYMENT_ID yookassa=$YOOKASSA_ID"

echo "== 5. Webhook confirm payment =="
WEBHOOK=$(curl -sS -X POST "${BASE}/api/payment/webhook" \
  -H "Content-Type: application/json" \
  -d "{\"object\":{\"id\":\"${YOOKASSA_ID}\",\"status\":\"succeeded\"}}")
echo "$WEBHOOK"

AFTER=$(curl -sS "${SUPABASE}/rest/v1/analyses?id=eq.${ANALYSIS_ID}&select=status" \
  -H "apikey: ${ANON}" \
  -H "Authorization: Bearer ${ACCESS}")
STATUS=$(echo "$AFTER" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['status'])" 2>/dev/null || true)

if [[ "$STATUS" != "paid_in_progress" ]]; then
  echo "Expected paid_in_progress, got: $STATUS"
  exit 1
fi
echo "OK analysis status=paid_in_progress"

if [[ -n "${OPENROUTER_API_KEY:-}" ]]; then
  echo "== 6. Stream stage 2 (OpenRouter via Supabase session) =="
  TOKEN=$(curl -sS -X POST "${SUPABASE}/auth/v1/token?grant_type=password" \
    -H "apikey: ${ANON}" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || true)
  if [[ -n "$TOKEN" ]]; then
    curl -sS -N -X POST "${BASE}/api/analyze/stream" \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{\"analysisId\":\"${ANALYSIS_ID}\",\"stage\":2,\"continue\":true}" \
      | head -5 || true
    echo ""
  else
    echo "SKIP stream — could not get session token"
  fi
else
  echo "SKIP stage stream — OPENROUTER_API_KEY empty (add key to .env.local)"
fi

echo ""
echo "E2E smoke passed."
echo "Test user: $EMAIL / $PASSWORD"
