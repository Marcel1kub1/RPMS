# RPMS configuration guide

This guide configures RPMS for the public deployment URL:

```text
https://rtmp.freesrv.com
```

The OAuth callback URLs must match this URL exactly. OAuth providers usually reject a callback
when the scheme, hostname, path, or trailing slash differs.

## 1. Clone and install

```bash
git clone https://github.com/Marcel1kub1/RPMS.git
cd RPMS
corepack enable
pnpm install
```

If the host does not allow a build step, set the panel startup command to
`if [ ! -x node_modules/.bin/next ]; then npm install --omit=dev --no-audit --no-fund --maxsockets=1; fi; sh start.sh`.
Do not use a generic Node template that launches `/home/container/src/index.js`; RPMS has no
`src/index.js` entrypoint.

Use the clone-and-start mode:

```bash
sh setup-env.sh
sh start.sh
```

Set the hosting panel port to `9675`. The server binds to `0.0.0.0`, so the host can proxy
`rtmp.freesrv.com` to port `9675`.

## 2. Configure the public URL

Use these values in `.env`:

```env
NEXTAUTH_URL=https://rtmp.freesrv.com
PUBLIC_URL=https://rtmp.freesrv.com
PORT=9675
```

Set the DNS record for `rtmp.freesrv.com` according to your host's instructions. Your host must
terminate HTTPS and reverse-proxy the subdomain to the RPMS process on port `9675`.

## 3. MySQL configuration

RPMS uses MySQL 8 through Prisma. Set these values in the private environment configuration:

```env
MYSQL_HOST=your-mysql-host
MYSQL_PORT=3306
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE=your-mysql-database
DATABASE_URL=
```

The application reads `MYSQL_*` first. Do not commit `.env`, passwords, connection strings, or
database exports. Create the database and grant the user access before starting RPMS.

## 4. Discord OAuth2

### Create the Discord application

1. Open the [Discord Developer Portal](https://discord.com/developers/applications).
2. Select **New Application**.
3. Give it a name such as `RPMS`.
4. Open **OAuth2**.
5. Add this exact redirect URI:

   ```text
   https://rtmp.freesrv.com/api/auth/discord/callback
   ```

6. Copy the **Application ID**.
7. Reset/copy the **Client Secret**. Treat it like a password.

RPMS uses the authorization-code flow and requests the `identify` scope. It uses the returned
Discord user identity to link or authenticate the account; it does not need a bot token for
OAuth login.

Set:

```env
DISCORD_APPLICATION_ID=your_application_id
DISCORD_SECRET=your_client_secret
DISCORD_REDIRECT_URI=https://rtmp.freesrv.com/api/auth/discord/callback
```

The start endpoint is `/api/auth/discord/start`. The callback is
`/api/auth/discord/callback`.

### Discord OAuth troubleshooting

- `redirect_uri_mismatch`: the Developer Portal URI and `.env` URL are not identical.
- `OAuth configuration error`: `DISCORD_APPLICATION_ID` or `DISCORD_SECRET` is missing.
- `not_linked`: link Discord from an already authenticated RPMS/Roblox account first.
- Never put `DISCORD_SECRET` in client-side code or a public repository.

Official reference: [Discord OAuth2 documentation](https://discord.com/developers/docs/topics/oauth2).

## 5. Roblox OAuth2

### Register the Roblox application

1. Open the [Roblox Creator Hub OAuth2 registration guide](https://create.roblox.com/docs/cloud/auth/oauth2-registration).
2. Create an OAuth application.
3. Set this exact redirect URI:

   ```text
   https://rtmp.freesrv.com/api/auth/roblox/callback
   ```

4. Enable the scopes required by RPMS:
   - `openid`
   - `profile`
5. Copy the Roblox client ID.
6. Copy the client secret and keep it private.

Set:

```env
ROBLOX_CLIENT_ID=your_roblox_client_id
ROBLOX_CLIENT_SECRET=your_roblox_client_secret
ROBLOX_REDIRECT_URI=https://rtmp.freesrv.com/api/auth/roblox/callback
```

RPMS starts Roblox login at `/api/auth/roblox/start` and handles the callback at
`/api/auth/roblox/callback`. The callback exchanges the one-time authorization code and reads
the Roblox OpenID Connect profile.

### Roblox OAuth troubleshooting

- `redirect_uri_mismatch`: check the exact HTTPS URL and path in Roblox OAuth settings.
- `invalid_client`: check the client ID and secret; regenerate the secret if it was exposed.
- `invalid_scope`: ensure `openid` and `profile` are enabled for the application.
- Login works but group data is missing: Roblox OAuth identity and Roblox group/Open Cloud
  permissions are separate; configure the required group integration/API credentials as well.

Official reference: [Roblox OAuth2 app registration](https://create.roblox.com/docs/cloud/auth/oauth2-registration).

## 6. Run the interactive environment setup

The repository includes a local-only setup helper:

```bash
sh setup-env.sh
```

It asks for the database and OAuth values, hides secret input, generates the callback URLs, and
writes `.env` with file mode `600`. It does not send values anywhere. Review the generated file
locally without copying it into chat:

```bash
ls -l .env
```

## 7. Discord webhook integration

To enable operational notifications:

1. In Discord, open the destination channel.
2. Open **Edit Channel → Integrations → Webhooks**.
3. Create or copy a webhook.
4. Set these values privately:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_ENABLED=true
DISCORD_WEBHOOK_USERNAME=RPMS
```

RPMS can send session starts/ends, staff shifts, chat log summaries, moderation events, and
delivery errors. Webhook URLs are credentials: anyone with the URL can post to the channel.
Rotate the webhook immediately if it is exposed.

## 8. Start and verify

For a source-only host:

```bash
sh start.sh
```

For a normal production build:

```bash
pnpm run build
pnpm run start
```

Verify:

1. Open `https://rtmp.freesrv.com`.
2. Test Roblox login.
3. Test Discord login/linking.
4. Join a Roblox server and confirm a `staff` or `non_staff` session appears.
5. Leave the server and confirm the session closes.
6. If enabled, confirm the expected Discord webhook event arrives.
7. Check the host logs for configuration or database errors.

## 9. Security checklist

- Use a unique random `SESSION_SECRET`.
- Rotate any credential pasted into chat, tickets, logs, or screenshots.
- Keep `.env` out of Git.
- Use HTTPS for the public URL and OAuth callbacks.
- Restrict MySQL access to the application host where possible.
- Use a least-privilege MySQL user.
- Rotate Discord and Roblox secrets periodically.
- Replace the legal page templates with operator-specific, legally reviewed text.
- Configure backups and test restoring the MySQL database.
