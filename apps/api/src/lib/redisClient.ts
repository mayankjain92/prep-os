import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    // Retry up to 3 times, then pause reconnect attempts
    if (times > 3) {
      return null;
    }
    return Math.min(times * 100, 2000);
  },
  lazyConnect: true,
});

redis.on("error", (err) => {
  console.warn("[redis warn]: Redis connection issue:", err.message);
});

redis.on("connect", () => {
  console.log("[redis] connected successfully");
});
