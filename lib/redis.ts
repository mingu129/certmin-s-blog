import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  connectTimeout: 10000,
  lazyConnect: true,
  enableOfflineQueue: false,
});

export { redis };
