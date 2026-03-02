import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const raw = await redis.get(`kv:image:${id}`);

    if (!raw) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const { data, mimeType } = JSON.parse(typeof raw === 'string' ? raw : JSON.stringify(raw));
    const buffer = Buffer.from(data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (err) {
    console.error('[GET /api/images/[id]]', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
