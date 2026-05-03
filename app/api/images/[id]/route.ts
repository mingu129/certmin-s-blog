import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import fs from 'fs/promises';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try filesystem first (migrated images)
    const raw = await redis.get(`kv:image:${id}`);
    if (raw) {
      const { data, mimeType } = JSON.parse(typeof raw === 'string' ? raw : JSON.stringify(raw));
      const ext = MIME_TO_EXT[mimeType] ?? 'png';
      const filePath = path.join(UPLOADS_DIR, `${id}.${ext}`);
      try {
        const buffer = await fs.readFile(filePath);
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      } catch {
        // File not on disk yet — fall back to Redis base64
        const buffer = Buffer.from(data, 'base64');
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      }
    }

    return new NextResponse('Not Found', { status: 404 });
  } catch (err) {
    console.error('[GET /api/images/[id]]', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
