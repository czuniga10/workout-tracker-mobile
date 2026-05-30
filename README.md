# Workout Tracker

A locally-hosted, mobile-first workout tracking SPA for home use. Runs on a home server, accessed from phones over LAN.

## Production (home server)

```bash
cp .env.example .env
# Edit .env with your preferred credentials
docker compose up -d
```

Open `http://<host-lan-ip>:8080` from your phone.

## Local development

First-time setup (installs deps, brings up Postgres, applies migrations):

```bash
cp .env.example .env
npm run setup
```

Then to run the api + web dev servers:

```bash
npm run dev
```

The `predev` hook brings the db container up and applies any pending migrations before starting, so a normal `npm run dev` is enough day-to-day.

### Schema changes

After editing `api/prisma/schema.prisma`, create a new migration:

```bash
npm --prefix api run db:migrate -- --name <descriptive_name>
```

## Tech stack

- **Frontend:** React 18, Vite, React Router, TanStack Query, Tailwind CSS
- **Backend:** Fastify, Prisma, TypeScript
- **Database:** PostgreSQL 16
- **Runtime:** Node 20, nginx 1.27
