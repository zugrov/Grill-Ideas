#!/bin/bash
set -e

cd /var/www/grill-ideas

echo "=== Обновление grill-ideas ==="
git pull
docker compose up -d --build
docker compose ps

echo "✅ grill-ideas обновлён"
