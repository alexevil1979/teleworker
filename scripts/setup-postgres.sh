#!/bin/bash
# PostgreSQL для TeleAgent на VPS (Docker)
set -euo pipefail
cd "$(dirname "$0")/.."

COMPOSE_FILE="docker-compose.postgres.yml"
DB_URL="postgresql://teleagent:teleagent@127.0.0.1:5432/teleagent?schema=public"

echo "==> PostgreSQL (Docker)"
if ! command -v docker >/dev/null 2>&1; then
  echo "Установите Docker: apt install -y docker.io docker-compose-plugin"
  exit 1
fi

docker compose -f "$COMPOSE_FILE" up -d

echo "==> Ожидание готовности..."
for i in $(seq 1 30); do
  if docker compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U teleagent -d teleagent >/dev/null 2>&1; then
    echo "OK: Postgres ready"
    break
  fi
  sleep 1
  if [ "$i" -eq 30 ]; then
    echo "FAIL: Postgres не поднялся"
    docker compose -f "$COMPOSE_FILE" logs postgres
    exit 1
  fi
done

echo ""
echo "Добавьте в .env:"
echo "DATABASE_URL=${DB_URL}"
echo ""
echo "Затем:"
echo "  npm run db:push"
echo "  npm run db:seed"
echo "  pm2 restart teleagent"
