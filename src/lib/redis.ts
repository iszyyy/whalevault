import Redis from "ioredis";

let redisClient: Redis | null = null;
let redisDisabledLogged = false;

const globalForRedis = globalThis as unknown as { redis?: Redis | null };

function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient;
  }

  if (globalForRedis.redis) {
    redisClient = globalForRedis.redis;
    return redisClient;
  }

  const url = process.env.REDIS_URL;
  if (!url) {
    if (!redisDisabledLogged) {
      console.warn("[Redis] REDIS_URL not set – Redis features disabled (fail-open).");
      redisDisabledLogged = true;
    }
    return null;
  }

  const client = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 5) return null; // stop retrying after 5 attempts
      return Math.min(times * 200, 2000);
    },
    enableOfflineQueue: false,
  });

  client.on("error", (err: Error) => {
    console.error("[Redis] Connection error:", err.message);
  });

  client.on("connect", () => {
    console.log("[Redis] Connected");
  });

  redisClient = client;

  if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redisClient;
  }

  return redisClient;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    console.error("[Redis] cacheSet error:", err);
  }
}

export async function cacheDel(key: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.del(key);
  } catch (err) {
    console.error("[Redis] cacheDel error:", err);
  }
}

export async function rateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const windowKey = `rate:${key}:${Math.floor(now / (windowSeconds * 1000))}`;
  const redis = getRedisClient();

  if (!redis) {
    return { allowed: true, remaining: maxRequests, resetAt: now + windowSeconds * 1000 };
  }

  try {
    const count = await redis.incr(windowKey);
    if (count === 1) {
      await redis.expire(windowKey, windowSeconds);
    }
    const resetAt = (Math.floor(now / (windowSeconds * 1000)) + 1) * windowSeconds * 1000;
    return {
      allowed: count <= maxRequests,
      remaining: Math.max(0, maxRequests - count),
      resetAt,
    };
  } catch {
    // Fail open if Redis is unavailable
    return { allowed: true, remaining: maxRequests, resetAt: now + windowSeconds * 1000 };
  }
}
