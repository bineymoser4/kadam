export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(fallback)) return (Array.isArray(parsed) ? parsed : fallback) as T;
    if (fallback !== null && typeof fallback === "object") {
      return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? ({ ...fallback, ...parsed } as T) : fallback;
    }
    // Primitive fallback (string, number, boolean, null) — trust the stored value as-is.
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function saveState<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode, quota) — demo still works for the session.
  }
}

export function clearKeys(keys: string[]) {
  keys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
}
