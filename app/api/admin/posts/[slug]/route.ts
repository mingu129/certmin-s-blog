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

function getToken(request: Request): string {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const raw = await redis.get(`kv:post:${slug}`);
    if (!raw) return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
    const post = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!verifyToken(getToken(request))) {
      return NextResponse.json({ error: '인증 실패. 다시 로그인해주세요.' }, { status: 401 });
    }

    const { slug } = await params;
    const { title, content, tags, thumbnail } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: '제목과 내용을 입력해주세요.' }, { status: 400 });
    }

    const raw = await redis.get(`kv:post:${slug}`);
    if (!raw) return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });

    const existing = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const updated = {
      ...existing,
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date().toISOString().slice(0, 10),
      tags: Array.isArray(tags) ? tags : (existing.tags || []),
      thumbnail: thumbnail !== undefined ? thumbnail : (existing.thumbnail || null),
    };

    await redis.set(`kv:post:${slug}`, JSON.stringify(updated));
    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    return NextResponse.json({ error: `서버 오류: ${String(err)}` }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!verifyToken(getToken(request))) {
      return NextResponse.json({ error: '인증 실패. 다시 로그인해주세요.' }, { status: 401 });
    }

    const { slug } = await params;
    await redis.del(`kv:post:${slug}`);
    await redis.zrem('kv:posts', slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: `서버 오류: ${String(err)}` }, { status: 500 });
  }
}
