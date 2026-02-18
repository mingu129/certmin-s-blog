import { redis } from './redis';

export interface PostData {
  slug: string;
  title: string;
  date: string;
  content: string;
  updatedAt?: string;
}

export async function getAllPosts(): Promise<PostData[]> {
  try {
    const slugs = await redis.zrevrange('kv:posts', 0, -1);
    if (!slugs || slugs.length === 0) return [];

    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const raw = await redis.get(`kv:post:${slug}`);
        if (!raw) return null;
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return data as PostData;
      })
    );

    return posts.filter(Boolean) as PostData[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  try {
    const raw = await redis.get(`kv:post:${slug}`);
    if (!raw) return null;
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return data as PostData;
  } catch {
    return null;
  }
}
