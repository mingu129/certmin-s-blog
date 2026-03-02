'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function AdminWriteNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handlePublish() {
    if (!title.trim()) {
      setError('제목을 입력하세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (res.ok) {
        router.push(`/blog/${data.slug}`);
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', padding: '0 24px' }}>
      {/* Sticky 상단 바 */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        gap: '12px',
      }}>
        <Link href="/admin/write" className="btn">← 뒤로</Link>
        {error && (
          <span style={{ color: '#e06c75', fontSize: '0.85em', flex: 1 }}>{error}</span>
        )}
        <button
          onClick={handlePublish}
          disabled={loading}
          className="btn btn-primary"
          style={{ cursor: 'pointer' }}
        >
          {loading ? '저장 중...' : '글 발행'}
        </button>
      </div>

      {/* 제목 입력 */}
      <div style={{ padding: '32px 0 16px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '2px solid var(--border)',
            color: 'var(--text)',
            fontSize: '2em',
            fontFamily: 'inherit',
            fontWeight: 'bold',
            padding: '8px 0',
            outline: 'none',
          }}
        />
      </div>

      {/* 에디터 */}
      <div style={{ paddingBottom: '48px' }}>
        <MarkdownEditor value={content} onChange={setContent} height={680} />
      </div>
    </div>
  );
}
