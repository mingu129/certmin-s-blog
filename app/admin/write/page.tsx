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

  useEffect(() => {
    fetch('/api/admin/posts')
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => {});
  }, []);

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
        <Link href="/admin/write/new" className="btn btn-primary">+ 새 글 쓰기</Link>
      </div>

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
