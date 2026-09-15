import { Redis } from "ioredis";
import { env } from "../config/env.js";

const REDIS_URL = env.REDIS_URL;

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
