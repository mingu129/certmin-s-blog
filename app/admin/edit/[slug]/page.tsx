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

  async function handleSave() {
    if (!title.trim()) {
      setError('제목을 입력하세요.');
      return;
    }
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 72px)',
          gap: '10px',
          color: '#a9abb2',
          fontSize: '0.9em',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#5a7af8' }}>hourglass_empty</span>
        불러오는 중...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        minHeight: '100vh',
        padding: '0 32px',
      }}
    >
      {/* Sticky top bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(13, 14, 17, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(70, 72, 78, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 0',
          gap: '16px',
        }}
      >
        <Link
          href="/admin/write"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: '#1e2024',
            color: '#a9abb2',
            fontSize: '0.78em',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
          목록
        </Link>

        {error && (
          <span
            style={{
              color: '#f97386',
              fontSize: '0.82em',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
            {error}
          </span>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 24px',
            background: '#5a7af8',
            color: '#000',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.82em',
            fontWeight: 700,
            fontFamily: 'inherit',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 16px rgba(90,122,248,0.2)',
            transition: 'filter 0.2s',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
          {loading ? '저장 중...' : '수정 완료'}
        </button>
      </div>

      {/* Title input */}
      <div style={{ padding: '40px 0 20px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '2px solid rgba(70, 72, 78, 0.3)',
            color: '#e4e5ed',
            fontSize: '2.5em',
            fontFamily: 'inherit',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            padding: '8px 0',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { e.target.style.borderBottomColor = '#5a7af8'; }}
          onBlur={(e) => { e.target.style.borderBottomColor = 'rgba(70, 72, 78, 0.3)'; }}
        />
      </div>

      {/* Editor */}
      <div style={{ paddingBottom: '64px' }}>
        <MarkdownEditor value={content} onChange={setContent} height={680} />
      </div>
    </div>
  );
}
