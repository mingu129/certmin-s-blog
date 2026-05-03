import Redis from 'ioredis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

const redis = new Redis('redis://localhost:6379');

async function migrate() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  // 1. Migrate image files
  const imageKeys = await redis.keys('kv:image:*');
  console.log(`Found ${imageKeys.length} images to migrate`);

  const idToFilename = {};

  for (const key of imageKeys) {
    const id = key.replace('kv:image:', '');
    const raw = await redis.get(key);
    const { data, mimeType } = JSON.parse(raw);
    const ext = MIME_TO_EXT[mimeType] ?? 'png';
    const filename = `${id}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    await fs.writeFile(filePath, Buffer.from(data, 'base64'));
    idToFilename[id] = filename;
    console.log(`  [OK] ${key} → /uploads/${filename}`);
  }

  // 2. Update post content: /api/images/{id} → /uploads/{id}.{ext}
  const postKeys = await redis.keys('kv:post:*');
  console.log(`\nUpdating ${postKeys.length} posts...`);

  for (const key of postKeys) {
    const raw = await redis.get(key);
    const post = JSON.parse(raw);
    let updated = false;

    for (const [id, filename] of Object.entries(idToFilename)) {
      const oldUrl = `/api/images/${id}`;
      const newUrl = `/uploads/${filename}`;

      if (post.content?.includes(oldUrl)) {
        post.content = post.content.replaceAll(oldUrl, newUrl);
        updated = true;
      }
      if (post.thumbnail === oldUrl) {
        post.thumbnail = newUrl;
        updated = true;
      }
    }

    if (updated) {
      await redis.set(key, JSON.stringify(post));
      console.log(`  [updated] ${key}`);
    }
  }

  // 3. Update settings profilePhoto
  const settingsRaw = await redis.get('kv:settings');
  if (settingsRaw) {
    const settings = JSON.parse(settingsRaw);
    let updated = false;
    for (const [id, filename] of Object.entries(idToFilename)) {
      const oldUrl = `/api/images/${id}`;
      const newUrl = `/uploads/${filename}`;
      if (settings.profilePhoto === oldUrl) {
        settings.profilePhoto = newUrl;
        updated = true;
      }
    }
    if (updated) {
      await redis.set('kv:settings', JSON.stringify(settings));
      console.log('  [updated] kv:settings');
    }
  }

  console.log('\nMigration complete!');
  await redis.quit();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
