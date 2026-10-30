#!/bin/sh
set -eu

export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export PORT="${PORT:-9675}"

if command -v pnpm >/dev/null 2>&1; then
  exec pnpm run start
fi

exec npm run start
