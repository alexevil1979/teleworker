#!/bin/bash
# Проверка PostgreSQL и товаров в каталоге
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== DATABASE_URL ==="
grep '^DATABASE_URL=' .env | sed 's/:[^:@]*@/:***@/'

echo ""
echo "=== Docker Postgres ==="
docker ps --filter name=teleagent-postgres --format '{{.Names}} {{.Status}}' 2>/dev/null || echo "нет контейнера"

echo ""
echo "=== Товары в БД ==="
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.product.count().then((c) => {
  console.log('products:', c);
  return p.product.findMany({ select: { slug: true, name: true, priceRub: true } });
}).then((rows) => {
  rows.forEach((r) => console.log(' -', r.slug, r.name, r.priceRub));
  return p.\$disconnect();
}).catch((e) => { console.error(e); process.exit(1); });
"
