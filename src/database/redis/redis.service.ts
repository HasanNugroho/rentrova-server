import { redis } from './client.ts';

export class RedisService {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, stringValue);
    } else {
      await redis.set(key, stringValue);
    }
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  }

  async incr(key: string): Promise<number> {
    return await redis.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await redis.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return await redis.ttl(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return await redis.keys(pattern);
  }

  async flushAll(): Promise<void> {
    await redis.flushall();
  }
}

export const redisService = new RedisService();
