import Redis from 'ioredis';

// Set SOURCE_URL to your Redis Cloud connection string before running
const SOURCE_URL = process.env.SOURCE_REDIS_URL || '';
const DEST_URL = process.env.DEST_REDIS_URL || 'redis://localhost:6379';

const src = new Redis(SOURCE_URL, { maxRetriesPerRequest: 3, connectTimeout: 15000 });
const dst = new Redis(DEST_URL, { maxRetriesPerRequest: 3, connectTimeout: 5000 });

async function migrate() {
  console.log('Connecting to source Redis...');
  await src.ping();
  console.log('Source: OK');

  await dst.ping();
  console.log('Destination: OK');

  // Scan all keys
  const keys = [];
  let cursor = '0';
  do {
    const [nextCursor, batch] = await src.scan(cursor, 'MATCH', '*', 'COUNT', 100);
    cursor = nextCursor;
    keys.push(...batch);
  } while (cursor !== '0');

  console.log(`Found ${keys.length} keys to migrate`);

  let success = 0;
  let failed = 0;

  for (const key of keys) {
    try {
      const type = await src.type(key);
      const ttl = await src.pttl(key);
      const expireMs = ttl > 0 ? ttl : 0;

      if (type === 'string') {
        const val = await src.get(key);
        await dst.set(key, val);
        if (expireMs > 0) await dst.pexpire(key, expireMs);

      } else if (type === 'zset') {
        const members = await src.zrangeWithScores(key, 0, -1);
        if (members.length > 0) {
          const args = [];
          for (const { score, value } of members) args.push(score, value);
          await dst.zadd(key, ...args);
        }
        if (expireMs > 0) await dst.pexpire(key, expireMs);

      } else if (type === 'hash') {
        const hash = await src.hgetall(key);
        if (Object.keys(hash).length > 0) await dst.hset(key, hash);
        if (expireMs > 0) await dst.pexpire(key, expireMs);

      } else if (type === 'list') {
        const items = await src.lrange(key, 0, -1);
        if (items.length > 0) await dst.rpush(key, ...items);
        if (expireMs > 0) await dst.pexpire(key, expireMs);

      } else if (type === 'set') {
        const members = await src.smembers(key);
        if (members.length > 0) await dst.sadd(key, ...members);
        if (expireMs > 0) await dst.pexpire(key, expireMs);
      }

      console.log(`  [OK] ${key} (${type})`);
      success++;
    } catch (err) {
      console.error(`  [FAIL] ${key}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nMigration complete: ${success} succeeded, ${failed} failed`);

  await src.quit();
  await dst.quit();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
