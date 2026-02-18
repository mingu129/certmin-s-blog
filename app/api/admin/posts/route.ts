import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import crypto from 'crypto';

function verifyToken(token: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const expected = crypto
    .createHmac('sha256', password)
    .update('admin-session')
    .digest('hex');
  return token === expected;
}

export async function GET() {
  try {
    const slugs = await redis.zrevrange('kv:posts', 0, -1);
    if (!slugs || slugs.length === 0) return NextResponse.json({ posts: [] });

    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const raw = await redis.get(`kv:post:${slug}`);
        if (!raw) return null;
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return { slug: data.slug, title: data.title, date: data.date, updatedAt: data.updatedAt };
      })
    );

    return NextResponse.json({ posts: posts.filter(Boolean) });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : '';

    if (!verifyToken(token)) {
      return NextResponse.json({ error: '인증 실패. 다시 로그인해주세요.' }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: '제목과 내용을 입력해주세요.' }, { status: 400 });
    }

    const date = new Date().toISOString().slice(0, 10);
    const safeTitle = title.trim().replace(/[^\w가-힣\s-]/g, '').replace(/\s+/g, '-');
    const slug = `${date}-${safeTitle}-${Date.now()}`;

    const post = { slug, title: title.trim(), date, content: content.trim() };

    await redis.set(`kv:post:${slug}`, JSON.stringify(post));
    await redis.zadd('kv:posts', Date.now(), slug);

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error('[POST /api/admin/posts]', err);
    return NextResponse.json(
      { error: `서버 오류: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
