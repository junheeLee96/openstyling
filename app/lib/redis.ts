// lib/redis.ts
import { Redis } from "ioredis";

let redis: Redis;

export function getRedisClient() {
  if (redis) {
    return redis;
  }

  redis = new Redis(process.env.REDIS_URL || "");
  return redis;
}
