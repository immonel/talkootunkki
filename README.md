# talkootunkki

Web app for organizing volunteer work events ("talkoot"). It has:

- public/TWA views for participants
- admin views for creating events and following participation
- Telegram Web App login validation
- Google Sheets export per event
- SQLite database stored under `./data`

## Prerequisites

Install:

- Docker
- Docker Compose

For local non-Docker development, also install Node.js 18+ and npm.

This README uses `docker-compose`. If your Docker install uses Compose v2 only, replace commands like `docker-compose up` with `docker compose up`.

## Environment

Create local env file:

```bash
cp .env.sample .env
```

Edit `.env`:

- `BACKEND_PORT`: backend port inside/outside Docker, usually `3001`
- `WS_EVENT_BROADCAST_INTERVAL`: websocket refresh interval in milliseconds
- `TG_BOT_API_TOKEN`: Telegram bot token used to validate Telegram Web App users
- `APP_SECRET_KEY`: secret for admin JWTs and encrypted Google credentials
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`: admin login credentials
- `BACKEND_URL`: dev URL used by frontend, usually `http://localhost:3001`
- `DOMAIN_NAME`: production host name used by nginx-proxy and Let's Encrypt
- `ACME_EMAIL`: Let's Encrypt notification email
- `CF_Token`, `CF_Account_ID`, `CF_Zone_ID`: Cloudflare DNS API values for DNS-01 certificates

Each event has its own Google Sheet link. Google service account credentials are entered in the event creation UI only when current stored credentials cannot access that sheet. The credentials are stored once globally as encrypted SQLite data and reused for later events.

### `APP_SECRET_KEY`

`APP_SECRET_KEY` protects two things:

- admin login cookies/JWTs
- encrypted Google service account credentials stored in SQLite

Use long random value. Do not use password or public string. Example:

```bash
openssl rand -base64 32
```

Keep same value across restarts. If this value changes, old admin sessions stop working and stored Google credentials cannot be decrypted. In that case, enter Google service account credentials again through event creation UI.

## Development With Docker

Docker dev is easiest path. It starts:

- frontend on port `3000`
- backend on port `3001`
- SQLite database file mounted from `./data/talkoot.db`

Start containers:

```bash
docker-compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

If frontend cannot reach backend, check `BACKEND_URL` in `.env`. For local browser development it should usually be:

```text
BACKEND_URL=http://localhost:3001
```

Stop:

```bash
docker-compose down
```

Data persists in `./data/talkoot.db`.

## Development Without Docker

Use this when you want faster frontend/backend iteration without rebuilding containers.

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd frontend
npm install
printf "VITE_BACKEND_URL=http://localhost:3001\n" > .env.local
npm run dev
```

Root `.env` is for Docker Compose. Direct `npm run dev` commands read env files from their own folders.

Backend direct development stores SQLite at `/data/talkoot.db`. If backend fails with SQLite open errors, create writable `/data` or use Docker dev instead.

## Production

Production uses:

- root `Dockerfile`
- `docker-compose.prod.yml`
- `nginxproxy/nginx-proxy`
- `nginxproxy/acme-companion`
- Let's Encrypt certificates through Cloudflare DNS-01 challenge

Production image builds frontend first, then backend, then backend serves built frontend files.

Before deploy:

1. Point DNS for `DOMAIN_NAME` to server.
2. Make sure `DOMAIN_NAME` exists in Cloudflare.
3. Create Cloudflare API token with these permissions:
   - `Zone > DNS > Edit`
   - `Zone > Zone > Read`
4. Fill `.env`:
   - `DOMAIN_NAME`: public host, for example `talkoot.kampusjaosto.fi`
   - `ACME_EMAIL`: email for Let's Encrypt notifications
   - `CF_Token`: Cloudflare API token
   - `CF_Account_ID`: Cloudflare account ID
   - `CF_Zone_ID`: optional when `CF_Account_ID` is set, useful for one-zone config
5. Confirm `nginx/vhost.d/talkoot.kampusjaosto.fi` matches `DOMAIN_NAME`. Rename this file if host changes.
6. Start stack:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

This starts app container, nginx-proxy, and acme-companion. Certificate creation uses `ACMESH_DNS_API_CONFIG` in `docker-compose.prod.yml`.

Check proxy and certificate logs:

```bash
docker-compose -f docker-compose.prod.yml logs -f nginx-proxy acme-companion
```

Stop production stack:

```bash
docker-compose -f docker-compose.prod.yml down
```

Certificates renew automatically. `acme-companion` checks renewals and reloads nginx-proxy after certificate changes.

## Project Layout

- `frontend/`: React + TypeScript + Vite frontend
- `backend/`: Express + TypeScript backend
- `data/`: SQLite database mount
- `nginx/vhost.d/`: nginx-proxy vhost includes
- `docker-compose.yml`: dev stack
- `docker-compose.prod.yml`: production stack

## Useful Commands

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

Backend:

```bash
cd backend
npm run dev
npm run build
npm run prod
```

There is no real test suite yet. Backend `npm test` is placeholder and exits with error.

## More Docs

- Frontend details: `frontend/README.md`
- Backend details: `backend/README.md`
