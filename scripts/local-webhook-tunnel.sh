#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-3000}"
METHOD="${TUNNEL:-localtunnel}"

echo "Starting HTTPS tunnel to localhost:${PORT}..."
echo "Configure YooKassa webhook: https://<tunnel-host>/api/payment/webhook"
echo "Event: payment.succeeded"
echo ""
echo "For payment return URL, set NEXT_PUBLIC_APP_URL to tunnel URL and restart npm run dev"
echo ""

if [[ "$METHOD" == "ngrok" ]]; then
  if ! command -v ngrok >/dev/null; then
    echo "ngrok not found. Install: brew install ngrok"
    echo "Then: ngrok config add-authtoken <token from dashboard.ngrok.com>"
    exit 1
  fi
  ngrok http "$PORT"
else
  npx --yes localtunnel --port "$PORT"
fi
