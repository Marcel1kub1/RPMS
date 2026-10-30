#!/bin/sh
set -eu

export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export PORT="${PORT:-9675}"

if [ ! -d node_modules ]; then
  echo "Dependencies are missing. Run npm install --omit=dev --no-audit --no-fund first." >&2
  exit 1
fi

exec npm run start
