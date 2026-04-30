const NAMESPACE = 'nook.';

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(NAMESPACE + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota, etc). Fail silently.
  }
}
