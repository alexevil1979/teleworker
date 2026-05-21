#!/bin/bash
# Кто слушает и кто перезапускает next на порту 3000
set -e
PORT="${1:-3000}"
echo "=== ss ==="
ss -tlnp | grep ":$PORT " || true
echo ""
echo "=== fuser ==="
fuser -v "${PORT}/tcp" 2>/dev/null || true
echo ""
for pid in $(fuser "${PORT}/tcp" 2>/dev/null); do
  echo "=== PID $pid ==="
  ps -fp "$pid" 2>/dev/null || true
  echo "cwd: $(readlink -f /proc/$pid/cwd 2>/dev/null || echo '?')"
  tr '\0' '\n' < /proc/$pid/environ 2>/dev/null | grep -E '^(PWD|PORT|PM2|NODE_|_)=|^/' || true
  ppid=$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d ' ')
  if [ -n "$ppid" ] && [ "$ppid" != "1" ]; then
    echo "--- parent $ppid ---"
    ps -fp "$ppid" 2>/dev/null || true
  fi
  echo ""
done
echo "=== pm2 (все приложения) ==="
pm2 jlist 2>/dev/null | head -c 2000 || pm2 list
