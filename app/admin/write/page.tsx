'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/blog/${data.slug}`);
    } else {
      const data = await res.json();
      setError(data.error || '저장 실패');
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin');
  }

  return (
    <main className="blog-container">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="section-heading">새 글 쓰기</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/" className="btn">← 홈</Link>
          <button onClick={handleLogout} className="btn" style={{ cursor: 'pointer' }}>
            로그아웃
          </button>
        </div>
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
              width: '100%',
              padding: '12px 14px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text)',
              fontSize: '1.1em',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요. 마크다운을 지원합니다."
            required
            rows={20}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text)',
              fontSize: '0.95em',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: '1.7',
            }}
          />
        </div>

        {error && (
          <div style={{ color: '#e06c75', fontSize: '0.85em', marginBottom: '12px' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? '저장 중...' : '글 발행'}
        </button>
      </form>
    </main>
  );
}
