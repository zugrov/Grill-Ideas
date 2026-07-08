#!/bin/bash
set -e

cd /var/www/grill-ideas

NO_CACHE=""
if [[ "${1:-}" == "--no-cache" ]]; then
  NO_CACHE="--no-cache"
fi

echo "=== Обновление Grill-Ideas ==="
git pull origin main

docker compose --env-file .env.production build $NO_CACHE
docker compose --env-file .env.production up -d --force-recreate

docker compose ps
echo "✅ Grill-Ideas обновлён успешно"
