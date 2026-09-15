const store = new Map();

/**
 * Minimal in-memory TTL cache. Suitable for a single-process deployment;
 * swap for Redis if the server is ever horizontally scaled.
 */
export const getCached = (key) => {
  const entry = store.get(key);

  if (!entry) {
    return undefined;
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }

  return entry.value;
};

export const setCached = (key, value, ttlMs) => {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
};
