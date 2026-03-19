import Redis from 'ioredis';
import { env } from '../../config/index.ts';
import { logger } from '../../config/index.ts';

class RedisClient {
  private static instance: Redis;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD,
        db: env.REDIS_DB,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      RedisClient.instance.on('connect', () => {
        logger.info('✅ Redis connected successfully');
      });

      RedisClient.instance.on('error', (error) => {
        logger.error('❌ Redis connection error:', error);
      });

      RedisClient.instance.on('close', () => {
        logger.warn('⚠️  Redis connection closed');
      });
    }

    return RedisClient.instance;
  }

  public static async disconnect(): Promise<void> {
    if (RedisClient.instance) {
      await RedisClient.instance.quit();
    }
  }
}

export const redis = RedisClient.getInstance();
