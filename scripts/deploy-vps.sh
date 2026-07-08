#!/bin/bash
set -e

cd /var/www/grill-ideas

echo "=== Обновление grill-ideas ==="
git pull
ln -sf .env.production .env
set -a
source .env.production
set +a
docker compose up -d --build
docker compose ps

echo "✅ grill-ideas обновлён"
