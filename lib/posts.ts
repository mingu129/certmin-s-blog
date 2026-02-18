import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { redis } from './redis';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  content: string;
  updatedAt?: string;
}

function getFilePosts(): PostData[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((f) => f.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        return {
          slug,
          title: data.title || slug,
          date: data.date ? String(data.date).slice(0, 10) : '',
          content,
        };
      });
  } catch {
    return [];
  }
}

async function getKVPosts(): Promise<PostData[]> {
  try {
    const slugs = await redis.zrevrange('kv:posts', 0, -1);
    if (!slugs || slugs.length === 0) return [];

    const posts = await Promise.all(
      (slugs as string[]).map(async (slug) => {
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

export async function getAllPosts(): Promise<PostData[]> {
  const [filePosts, kvPosts] = await Promise.all([getFilePosts(), getKVPosts()]);
  const all = [...filePosts, ...kvPosts];
  return all.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  // 파일에서 먼저 탐색
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug,
      title: data.title || slug,
      date: data.date ? String(data.date).slice(0, 10) : '',
      content,
    };
  } catch {
    // 파일에 없으면 KV에서 탐색
    try {
      const raw = await redis.get(`kv:post:${slug}`);
      if (!raw) return null;
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return data as PostData;
    } catch {
      return null;
    }
  }
}
