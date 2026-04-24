# Frontend

React + TypeScript + Vite app for talkootunkki.

## What It Does

- public front page
- Telegram Web App participant flow under `/twa`
- admin login and admin event tools under `/admin`
- live updates through Socket.IO
- HTTP requests through Axios

Main routes live in `src/router/index.tsx`.

## Requirements

- Node.js 18+
- npm
- backend running on configured URL

## Setup

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment

Frontend reads:

- `VITE_BACKEND_URL`: backend URL, for example `http://localhost:3001`

Docker dev passes this from root `.env` value `BACKEND_URL`.

For direct frontend development, create `frontend/.env.local`:

```bash
printf "VITE_BACKEND_URL=http://localhost:3001\n" > .env.local
```

## Scripts

```bash
npm run dev
```

Runs Vite dev server on port `3000`.

```bash
npm run build
```

Type-checks and builds production files into `dist/`.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run preview
```

Serves built frontend locally after `npm run build`.

## File Map

- `src/main.tsx`: app entrypoint
- `src/App.tsx`: Axios defaults and router
- `src/router/`: route definitions and layouts
- `src/pages/`: page-level components
- `src/components/`: shared UI pieces
- `src/utils/socket.ts`: Socket.IO client setup
- `vite.config.ts`: Vite config and aliases

## Notes For New Devs

Use root Docker setup if you want easiest full-stack start. Use direct `npm run dev` when working only on frontend.

Vite environment variable names must start with `VITE_`, otherwise browser code cannot read them.
