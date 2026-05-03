# Workout Tracker

A locally-hosted, mobile-first workout tracking SPA for home use. Runs on a home server, accessed from phones over LAN.

## Quick start

```bash
cp .env.example .env
# Edit .env with your preferred credentials
docker compose up -d
```

Open `http://<host-lan-ip>:8080` from your phone.

## Tech stack

- **Frontend:** React 18, Vite, React Router, TanStack Query, Tailwind CSS
- **Backend:** Fastify, Prisma, TypeScript
- **Database:** PostgreSQL 16
- **Runtime:** Node 20, nginx 1.27
