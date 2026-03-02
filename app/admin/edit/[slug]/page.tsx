'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function AdminEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/posts/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title || '');
        setContent(data.content || '');
        setFetching(false);
      })
      .catch(() => {
        setError('글을 불러오는데 실패했습니다.');
        setFetching(false);
      });
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`/api/admin/posts/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (res.ok) {
        router.push(`/blog/${slug}`);
      } else {
        setError(data.error || '저장 실패');
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('요청 시간 초과.');
      } else {
        setError(`오류: ${err instanceof Error ? err.message : String(err)}`);
      }
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <main className="blog-container">
        <p style={{ color: 'var(--text-muted)' }}>불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="blog-container">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="section-heading">글 수정</span>
        <Link href="/admin/write" className="btn">← 목록</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            required
            style={{
              width: '100%', padding: '12px 14px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '4px', color: 'var(--text)',
              fontSize: '1.1em', fontFamily: 'inherit',
            }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
        {error && <div style={{ color: '#e06c75', fontSize: '0.85em', marginBottom: '12px' }}>{error}</div>}
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? '저장 중...' : '수정 완료'}
        </button>
      </form>
    </main>
  );
}
