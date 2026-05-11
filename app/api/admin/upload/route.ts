import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

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

export async function POST(request: Request) {
  try {
    if (!verifyToken(getToken(request)))
      return NextResponse.json({ error: '인증 실패. 다시 로그인해주세요.' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });

    const mimeType = file.type || 'image/png';
    const ext = MIME_TO_EXT[mimeType] ?? 'png';
    const id = `img-${Date.now()}`;
    const filename = `${id}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('[POST /api/admin/upload]', err);
    return NextResponse.json({ error: `서버 오류: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
  }
}

// Delete orphaned images (uploaded but not saved with a post)
export async function DELETE(request: Request) {
  try {
    if (!verifyToken(getToken(request)))
      return NextResponse.json({ error: '인증 실패.' }, { status: 401 });

    const { urls } = await request.json() as { urls: string[] };
    if (!Array.isArray(urls)) return NextResponse.json({ error: 'urls 배열 필요' }, { status: 400 });

    const deleted: string[] = [];
    for (const url of urls) {
      // Only delete files in /uploads/ with expected pattern (safety check)
      const match = url.match(/^\/uploads\/(img-\d+\.\w+)$/);
      if (!match) continue;
      const filepath = path.join(UPLOADS_DIR, match[1]);
      try {
        await fs.unlink(filepath);
        deleted.push(url);
      } catch {
        // File may already be gone — ignore
      }
    }
    return NextResponse.json({ deleted });
  } catch (err) {
    return NextResponse.json({ error: `서버 오류: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
  }
}
