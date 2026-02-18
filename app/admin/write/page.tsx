'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: string;
  updatedAt?: string;
}

export default function AdminWritePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/posts')
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  async function handleDelete(slug: string, postTitle: string) {
    if (!confirm(`"${postTitle}" 을 삭제할까요?`)) return;
    const res = await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } else {
      alert('삭제 실패');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin');
  }

  return (
    <main className="blog-container">
      {/* 상단 바 */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="section-heading">관리자</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/" className="btn">← 홈</Link>
          <button onClick={handleLogout} className="btn" style={{ cursor: 'pointer' }}>로그아웃</button>
        </div>
      </div>

      {/* 새 글 쓰기 버튼 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          className={showForm ? 'btn' : 'btn btn-primary'}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? '취소' : '+ 새 글 쓰기'}
        </button>
      </div>

      {/* 글쓰기 폼 */}
      {showForm && (
        <div style={{ marginBottom: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px' }}>
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
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: '4px', color: 'var(--text)',
                  fontSize: '1.1em', fontFamily: 'inherit',
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요. 마크다운을 지원합니다."
                required
                rows={16}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: '4px', color: 'var(--text)',
                  fontSize: '0.95em', fontFamily: 'inherit',
                  resize: 'vertical', lineHeight: '1.7',
                }}
              />
            </div>
            {error && <div style={{ color: '#e06c75', fontSize: '0.85em', marginBottom: '12px' }}>{error}</div>}
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? '저장 중...' : '글 발행'}
            </button>
          </form>
        </div>
      )}

      {/* 글 목록 */}
      <div style={{ marginBottom: '12px' }}>
        <span className="section-heading">글 목록</span>
      </div>
      {posts.length === 0 ? (
        <div className="empty-state"><p>작성된 글이 없습니다.</p></div>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug} className="post-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div style={{ minWidth: 0 }}>
                <Link href={`/blog/${post.slug}`} className="post-list-title" style={{ fontSize: '1em' }}>
                  {post.title}
                </Link>
                <div className="post-list-meta">
                  {post.date}{post.updatedAt ? ` · 수정 ${post.updatedAt}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <Link href={`/admin/edit/${post.slug}`} className="btn" style={{ fontSize: '0.8em', padding: '4px 12px' }}>수정</Link>
                <button
                  onClick={() => handleDelete(post.slug, post.title)}
                  className="btn"
                  style={{ fontSize: '0.8em', padding: '4px 12px', color: '#e06c75', cursor: 'pointer' }}
                >삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
