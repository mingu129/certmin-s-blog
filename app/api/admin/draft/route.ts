import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { redis } from '@/lib/redis';

const DRAFT_KEY = 'kv:draft';

function verifyToken(token: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const expected = crypto.createHmac('sha256', password).update('admin-session').digest('hex');
  return token === expected;
}

function getToken(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export async function GET(request: Request) {
  if (!verifyToken(getToken(request)))
    return NextResponse.json({ error: '인증 실패.' }, { status: 401 });

  const raw = await redis.get(DRAFT_KEY);
  if (!raw) return NextResponse.json({ draft: null });
  return NextResponse.json({ draft: JSON.parse(raw) });
}

export async function POST(request: Request) {
  if (!verifyToken(getToken(request)))
    return NextResponse.json({ error: '인증 실패.' }, { status: 401 });

  const body = await request.json();
  const draft = {
    title: body.title ?? '',
    content: body.content ?? '',
    tags: body.tags ?? [],
    thumbnail: body.thumbnail ?? null,
    savedAt: new Date().toISOString(),
  };
  await redis.set(DRAFT_KEY, JSON.stringify(draft));
  return NextResponse.json({ ok: true, savedAt: draft.savedAt });
}

export async function DELETE(request: Request) {
  if (!verifyToken(getToken(request)))
    return NextResponse.json({ error: '인증 실패.' }, { status: 401 });

  await redis.del(DRAFT_KEY);
  return NextResponse.json({ ok: true });
}
