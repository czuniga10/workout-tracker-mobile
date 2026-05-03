# Deployment

This app is designed to run permanently on a home server and be accessed from phones on the same local network. Everything runs in Docker — no other runtime dependencies are needed on the host.

---

## Requirements

- Docker + Docker Compose (Docker Desktop or Docker Engine)
- Git
- A machine that stays on (home server, old laptop, NAS, Raspberry Pi 4+)

---

## First-time setup

```bash
git clone https://github.com/czuniga10/workout-tracker-mobile.git
cd workout-tracker-mobile
cp .env.example .env
```

Edit `.env` and fill in real values:

```env
POSTGRES_DB=workout_tracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
WORKOUTX_KEY=your_workoutx_api_key_here
```

Then start everything:

```bash
docker compose up -d
```

The app is now accessible at `http://<server-lan-ip>:8080` from any device on the same network.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_DB` | ✅ | Database name |
| `POSTGRES_USER` | ✅ | Database user |
| `POSTGRES_PASSWORD` | ✅ | Database password |
| `WORKOUTX_KEY` | ✅ | API key for WorkoutX gif fetches |

The `.env` file is gitignored. Never commit it.

---

## Finding the server's IP address

On the server machine, run:

```bash
# Linux/Mac
ip addr show | grep "inet "

# Windows
ipconfig
```

Look for the IP in the `192.168.x.x` range. That's the LAN IP your phones will use.

---

## Making the IP permanent (recommended)

By default, the server's LAN IP can change when the router renews its DHCP lease. To make it permanent, set a **DHCP reservation** in your router:

1. Find the server machine's MAC address (shown in `ip addr` output)
2. Log into your router admin panel (usually `192.168.x.1`)
3. Find the DHCP reservation or address reservation section
4. Add a reservation: tie the MAC address to a specific IP

For TP-Link Deco systems: search "TP-Link Deco DHCP reservation" for step-by-step instructions with screenshots — the exact location varies by app version.

---

## Updating the app

```bash
git pull
docker compose up -d --build
```

This rebuilds and restarts only the containers whose images changed. Database data is preserved in the `pgdata` Docker volume.

---

## Deploying config changes (new exercises, users, workouts)

Config changes (exercises, workouts, schedules, users) live in the API source code. After editing:

```bash
# Rebuild and restart only the API
docker compose up -d --build api

# Or rebuild everything
docker compose up -d --build
```

The web container only needs a rebuild if you changed frontend code.

---

## Data persistence

Workout logs and sessions are stored in a named Docker volume (`pgdata`). This volume survives container restarts and rebuilds. It is only lost if you explicitly remove it:

```bash
# This will delete all workout data — do not run unless intentional
docker compose down -v
```

To back up the database:

```bash
docker exec workout-tracker-db-1 pg_dump -U postgres workout_tracker > backup.sql
```

To restore:

```bash
docker exec -i workout-tracker-db-1 psql -U postgres workout_tracker < backup.sql
```

---

## Container overview

| Container | What restarts it | Data lost on restart? |
|-----------|----------------|-----------------------|
| `db` | `docker compose restart db` | No — data in `pgdata` volume |
| `api` | `docker compose up -d --build api` | No |
| `web` | `docker compose up -d --build web` | No |

All containers have `restart: unless-stopped`, so they come back automatically after a reboot.

---

## Checking logs

```bash
# All containers
docker compose logs -f

# Just the API
docker compose logs -f api

# Last 50 lines
docker compose logs api --tail=50
```
