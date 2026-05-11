import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { redis } from '@/lib/redis';

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60;

function computeToken(password: string): string {
  return crypto
    .createHmac('sha256', password)
    .update('admin-session')
    .digest('hex');
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}

async function isBlocked(ip: string): Promise<boolean> {
  const count = await redis.get(`ratelimit:login:${ip}`);
  return count !== null && parseInt(count) >= MAX_ATTEMPTS;
}

async function recordFailure(ip: string): Promise<void> {
  const key = `ratelimit:login:${ip}`;
  const attempts = await redis.incr(key);
  if (attempts === 1) await redis.expire(key, WINDOW_SECONDS);
}

async function clearLimit(ip: string): Promise<void> {
  await redis.del(`ratelimit:login:${ip}`);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (await isBlocked(ip)) {
    return NextResponse.json(
      { error: '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.' },
      { status: 429 }
    );
  }

  const { password } = await request.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    await recordFailure(ip);
    return NextResponse.json({ error: '비밀번호가 틀렸습니다.' }, { status: 401 });
  }

  await clearLimit(ip);

  const token = computeToken(password);
  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
  return response;
}
