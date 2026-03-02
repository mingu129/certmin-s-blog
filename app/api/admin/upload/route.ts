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

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : '';

    if (!verifyToken(token)) {
      return NextResponse.json({ error: '인증 실패. 다시 로그인해주세요.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/png';

    const id = `img-${Date.now()}`;
    await redis.set(`kv:image:${id}`, JSON.stringify({ data: base64, mimeType }));

    return NextResponse.json({ url: `/api/images/${id}` });
  } catch (err) {
    console.error('[POST /api/admin/upload]', err);
    return NextResponse.json(
      { error: `서버 오류: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
