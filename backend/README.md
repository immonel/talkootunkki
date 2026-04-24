# Backend

Express + TypeScript API for talkootunkki.

## What It Does

- validates Telegram Web App users
- handles admin login with JWT cookie
- manages events, participants, and participations
- stores data in SQLite at `/data/talkoot.db`
- validates each event's Google Sheet access and stores one reusable Google service account credential set
- broadcasts current event and leaderboard updates through Socket.IO
- serves built frontend in production

API routes live under `src/routes/api`.

## Requirements

- Node.js 18+
- npm
- environment variables listed below

## Setup

Install dependencies:

```bash
npm install
```

Create local backend env file:

```bash
cp .env.example .env
```

Start dev server:

```bash
npm run dev
```

Backend listens on `PORT`, normally `3001`.

## Environment

Required:

- `PORT`: HTTP port
- `TG_BOT_API_TOKEN`: Telegram bot token
- `APP_SECRET_KEY`: long random secret for admin JWTs and encrypted Google credentials
- `ADMIN_USERNAME`: admin username
- `ADMIN_PASSWORD`: admin password

Optional:

- `WS_EVENT_BROADCAST_INTERVAL`: websocket broadcast interval in milliseconds, default `5000`
- `NODE_ENV=development`: enables CORS for frontend dev server at `http://localhost:3000`

Docker dev maps root `.env` value `BACKEND_PORT` into backend `PORT`.

For direct backend development, `dotenv` reads `backend/.env` because commands run from `backend/`.

Generate `APP_SECRET_KEY` with:

```bash
openssl rand -base64 32
```

Keep same `APP_SECRET_KEY` after Google credentials have been saved. Changing it invalidates old admin sessions and makes stored Google credentials unreadable.

## Scripts

```bash
npm run dev
```

Runs `src/index.ts` with nodemon in development mode.

```bash
npm run build
```

Compiles TypeScript into `build/`.

```bash
npm run prod
```

Runs compiled backend from `build/index.js` in production mode.

```bash
npm test
```

Placeholder only. It prints `"Error: no test specified"` and exits with error.

## File Map

- `src/index.ts`: starts HTTP server, Socket.IO, and DB connection
- `src/app.ts`: Express app, middleware, API router, static frontend serving
- `src/routes/api/`: API route modules
- `src/services/`: auth, database, events, Google Sheets, Telegram, sockets
- `src/models/`: Sequelize models
- `src/middleware/auth.ts`: admin route auth
- `src/types/`: shared backend types

## Data

Database is SQLite through Sequelize.

In Docker, `/data` is mounted from repo `./data`, so local data survives container restarts.

For direct local runs, make sure `/data` exists and is writable, or change storage path in `src/services/db.service.ts`.
