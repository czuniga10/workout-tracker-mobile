const USER_HEADER = "X-User-Id";

function getUserId(): string | null {
  return localStorage.getItem("workoutTracker.userId");
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const userId = getUserId();
  const headers = new Headers(init?.headers);
  if (userId) headers.set(USER_HEADER, userId);
  if (init?.body) headers.set("Content-Type", "application/json");

  const res = await fetch(`/api${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}
