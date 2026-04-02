import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/settings';
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

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!verifyToken(getToken(request))) {
      return NextResponse.json({ error: '인증 실패. 다시 로그인해주세요.' }, { status: 401 });
    }
    const body = await request.json();
    await saveSettings(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
