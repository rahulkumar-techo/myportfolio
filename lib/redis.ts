import Redis from "ioredis";
import "dotenv/config";

let cached: Redis | null = null;

export function getRedisConnection() {
  if (cached) return cached;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL is not set");
  }

  cached = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
  });

  return cached;
}
