# Frontend

React 18 SPA built with Vite. Served by nginx from a static build. Communicates with the API exclusively through `/api/*` (proxied by nginx — no direct port access from the browser).

---

## Entry points

| File | Role |
|------|------|
| `web/src/main.tsx` | Mounts the app. Wraps everything in `QueryClientProvider`, `BrowserRouter`, and `UserProvider`. |
| `web/src/App.tsx` | Auth gate + router. Shows `UserDropdown` if no user is selected, otherwise renders routes. |

---

## Routing

Two routes, defined in `App.tsx`:

| Path | Component | What it shows |
|------|-----------|---------------|
| `/` | `CalendarRoute` | Monthly calendar + current week list |
| `/workout/:date` | `WorkoutDayRoute` | Full workout for a specific date |
| `*` (catch-all) | redirect | Redirects to today's workout date |

---

## User context

**`UserProvider`** (`components/UserProvider.tsx`) stores the selected user ID in `localStorage` under `workoutTracker.userId`. It exposes a React context with:

```ts
{
  userId: string | null;
  setUser: (id: string) => void;
  clearUser: () => void;
  isLoading: boolean; // true during the initial localStorage read
}
```

**`useUser`** (`hooks/useUser.ts`) — hook to access this context anywhere in the tree.

The `api/client.ts` fetch wrapper reads from `localStorage` directly (not from context) to inject the `X-User-Id` header. This means the header is always current even if the context hasn't re-rendered yet.

---

## Data fetching

All server state is managed by TanStack Query. Query keys always include `userId` so switching users immediately invalidates and refetches all data.

| Hook | Query key | What it fetches |
|------|-----------|----------------|
| `useUsers()` | `["users"]` | List of all users |
| `useCalendar(month)` | `["calendar", userId, month]` | All days in a month with workout/status info |
| `useSession(date)` | `["session", userId, date]` | Full hydrated workout for a specific date |
| `useUpsertLog()` | mutation | `POST /api/logs` — logs a single exercise round |
| `useUpdateNotes()` | mutation | `PUT /api/sessions/:date/notes` |

Both `useCalendar` and `useSession` are disabled (`enabled: false`) when `userId` is null, preventing requests before a user is selected.

---

## Component tree

### Calendar view (`/`)

```
CalendarRoute
├── PhoneShell          — fixed-width phone-like container
├── StatusBar           — top bar with user avatar + dropdown
├── Calendar            — monthly grid
│   └── DayCell         — single day square (colored by status)
├── "This week" label
└── WeekList            — current week's workout cards
    └── DayCell (list variant)
```

### Workout day view (`/workout/:date`)

```
WorkoutDayRoute
├── PhoneShell
├── StatusBar
├── DayNav              — back/forward arrows between days
├── WorkoutHeaderCard   — workout name, focus, progress bar
├── Notes callout       — workout-level notes in a blue callout box
├── BlockAccordion      — renders each block based on its type
│   ├── BlockSuperset       — for "superset" and "straight_set" blocks
│   │   └── ExerciseRow     — exercise name, gif button, info button, inputs
│   ├── BlockConditioning   — for "conditioning_circuit" blocks
│   ├── BlockWarmup         — for "warmup" blocks
│   └── BlockBurnout        — rendered after all blocks if burnout exists
└── NotesDrawer         — slide-up drawer for session notes
```

---

## Component reference

### `PhoneShell`
Fixed-width (390px max) centered container that gives the app its phone-like appearance on desktop.

### `StatusBar`
Top bar. Shows the app name on the left, and a user avatar (initial in a circle) on the right. Tapping the avatar opens `UserDropdown`.

### `UserDropdown`
Fetches users from `/api/users` and shows a list. Selecting a user calls `setUser(id)` from `UserProvider`, which saves to localStorage and triggers a re-render that loads the main app.

### `DayNav`
Left/right chevron buttons to navigate between days. Shows the current date formatted as "Mon, May 4".

### `WorkoutHeaderCard`
Shows workout name, focus line, and a thin progress bar. Progress is calculated in `WorkoutDayRoute` by counting logged rounds vs total rounds (warmup rounds excluded).

### `BlockAccordion`
Receives the full `HydratedWorkout` and maps each block to the correct component based on `block.type`. Each block starts collapsed; clicking the header expands it with a CSS grid animation.

### `ExerciseRow`
The core logging component. Receives a `HydratedExercise` and renders:
- Exercise letter label (A, B, C...)
- "Last: X lb × Y reps" prefill hint
- Exercise name
- **Gif button** (play triangle) — opens `GifModal` if `gifId` is set
- **Info button** (italic `i`) — opens `InstructionsModal` if `instructions` are set
- Target + notes line
- Weight/reps/duration inputs (which are shown depends on `exercise.type` and `target.type`)

Input changes call `useUpsertLog` immediately — there is no submit button. Logging is fire-and-forget on every input change.

### `GifModal`
Fullscreen backdrop modal. Fetches the gif via `/api/gifs/:id` (proxied to WorkoutX). Shows a loading state while the image loads, and an error state if it fails.

### `InstructionsModal`
Same modal pattern as `GifModal`. Shows the exercise name and a numbered `<ol>` of instruction steps. Scrollable if the list is long.

### `NotesDrawer`
Slide-up panel anchored to the bottom of the screen. Textarea for session notes. Saves to the API on blur using `useUpdateNotes`.

### `BlockBurnout`
Read-only block shown at the bottom of the workout. Shows the burnout name in bold and the description in plain text. No inputs.

### `DayCell`
Used in both the calendar grid and the week list. Shows the date, workout label, and a colored status indicator. Tapping navigates to `/workout/:date`.

---

## API client

`web/src/api/client.ts` — a thin `fetch` wrapper:

```ts
export async function api<T>(path: string, init?: RequestInit): Promise<T>
```

- Reads `userId` from `localStorage` and injects `X-User-Id` header on every request
- Sets `Content-Type: application/json` when a body is present
- Throws on non-2xx responses, parsing the error JSON if available

---

## Styles

Global CSS variables are defined in `web/src/styles.css`. The app uses a dark theme by default. All components use inline styles referencing these CSS variables (e.g. `var(--color-text-primary)`). No CSS modules or styled components — inline styles with the variable system.

Tailwind is configured (`tailwind.config.ts`) but primarily used for utility classes in the Vite build process rather than extensively in components.

---

## Build

The web container builds in two stages (see `web/Dockerfile`):

1. **Build stage** — runs `npm ci` and `npm run build` (Vite), outputs to `/app/dist`
2. **Runtime stage** — copies `dist/` into nginx's html root, copies `nginx.conf`

The nginx config (`web/nginx.conf`) does two things:
- Serves the SPA with a catch-all `try_files` fallback (so React Router deep links work)
- Proxies `/api/*` to `http://api:3000` (the api container's internal hostname)
