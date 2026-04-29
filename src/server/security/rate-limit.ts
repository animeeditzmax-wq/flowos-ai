type Entry = { count: number; resetAt: number };

const memoryStore = new Map<string, Entry>();

export function checkRateLimit(key: string, max = 120, windowMs = 60_000) {
  const now = Date.now();
  const current = memoryStore.get(key);

  if (!current || current.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  if (current.count >= max) {
    return { allowed: false, remaining: 0, retryAt: current.resetAt };
  }

  current.count += 1;
  memoryStore.set(key, current);
  return { allowed: true, remaining: max - current.count };
}
