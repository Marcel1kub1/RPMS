#!/bin/sh
set -eu

ENV_FILE="${1:-.env}"

ask() {
  prompt="$1"
  default="${2:-}"
  if [ -n "$default" ]; then
    printf '%s [%s]: ' "$prompt" "$default" >&2
  else
    printf '%s: ' "$prompt" >&2
  fi
  IFS= read -r value
  if [ -z "$value" ]; then
    value="$default"
  fi
  printf '%s' "$value"
}

ask_secret() {
  prompt="$1"
  printf '%s: ' "$prompt" >&2
  stty -echo
  IFS= read -r value
  stty echo
  printf '\n' >&2
  printf '%s' "$value"
}

printf '%s\n' 'RPMS interactive environment setup'
printf '%s\n' 'Secrets are entered locally and are not displayed.'
printf '\n'

public_url="$(ask 'Public HTTPS URL' 'https://rtmp.freesrv.com')"
session_secret="$(ask_secret 'SESSION_SECRET')"
mysql_host="$(ask 'MySQL host' '127.0.0.1')"
mysql_port="$(ask 'MySQL port' '3306')"
mysql_user="$(ask 'MySQL user')"
mysql_password="$(ask_secret 'MySQL password')"
mysql_database="$(ask 'MySQL database')"
discord_id="$(ask 'Discord application ID')"
discord_secret="$(ask_secret 'Discord application secret')"
roblox_id="$(ask 'Roblox OAuth client ID')"
roblox_secret="$(ask_secret 'Roblox OAuth client secret')"
webhook_enabled="$(ask 'Enable Discord webhook? (true/false)' 'false')"

umask 077
cat > "$ENV_FILE" <<EOF
SESSION_SECRET=$session_secret
DATABASE_URL=
MYSQL_HOST=$mysql_host
MYSQL_PORT=$mysql_port
MYSQL_USER=$mysql_user
MYSQL_PASSWORD=$mysql_password
MYSQL_DATABASE=$mysql_database
NEXTAUTH_URL=$public_url
PUBLIC_URL=$public_url
PORT=9050

DISCORD_APPLICATION_ID=$discord_id
DISCORD_SECRET=$discord_secret
DISCORD_REDIRECT_URI=$public_url/api/auth/discord/callback
ROBLOX_CLIENT_ID=$roblox_id
ROBLOX_CLIENT_SECRET=$roblox_secret
ROBLOX_REDIRECT_URI=$public_url/api/auth/roblox/callback

DISCORD_WEBHOOK_URL=
DISCORD_WEBHOOK_ENABLED=$webhook_enabled
DISCORD_WEBHOOK_USERNAME=RPMS
EOF

chmod 600 "$ENV_FILE"
printf 'Wrote protected environment file: %s\n' "$ENV_FILE"
