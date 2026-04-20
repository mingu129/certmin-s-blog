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
    <main
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '80px',
        paddingBottom: '96px',
        padding: '80px 32px 96px',
        display: 'flex',
        flexDirection: 'row',
        gap: '48px',
        alignItems: 'flex-start',
      }}
    >
      {/* Sidebar nav */}
      <aside
        style={{
          width: '240px',
          flexShrink: 0,
          background: '#121317',
          borderRadius: '0.5rem',
          padding: '24px',
          position: 'sticky',
          top: '96px',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontSize: '0.95em',
              fontWeight: 700,
              color: '#b8c4ff',
              marginBottom: '4px',
            }}
          >
            관리 콘솔
          </div>
          <div
            style={{
              fontSize: '0.7em',
              color: '#a9abb2',
              letterSpacing: '0.05em',
            }}
          >
            Admin Dashboard
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { icon: 'dashboard', label: '개요', href: '/admin/write', active: true },
            { icon: 'article', label: '글 목록', href: '/admin/write', active: false },
            { icon: 'tune', label: '블로그 설정', href: '/admin/settings', active: false },
          ].map(({ icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 0 10px 16px',
                fontSize: '0.88em',
                color: active ? '#5a7af8' : '#a9abb2',
                fontWeight: active ? 700 : 400,
                borderLeft: active ? '2px solid #5a7af8' : '2px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
              {label}
            </Link>
          ))}

          <div style={{ height: '1px', background: 'rgba(70,72,78,0.2)', margin: '8px 0' }} />

          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 0 10px 16px',
              fontSize: '0.88em',
              color: '#a9abb2',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</span>
            홈으로
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 0 10px 16px',
              fontSize: '0.88em',
              color: '#a9abb2',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'color 0.2s',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            로그아웃
          </button>
        </nav>
      </aside>

      {/* Main canvas */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '48px' }}>

        {/* Header */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(55, 58, 77, 0.3)',
              fontSize: '0.7em',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#c2c5dd',
              alignSelf: 'flex-start',
            }}
          >
            시스템 활성
          </div>
          <h1
            style={{
              fontSize: '2.5em',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: '#e4e5ed',
            }}
          >
            관리 콘솔
          </h1>
          <p style={{ color: '#a9abb2', maxWidth: '560px', lineHeight: 1.7 }}>
            현재 아카이브에는 <strong style={{ color: '#e4e5ed' }}>{posts.length}개</strong>의 글이 있습니다.
          </p>
        </header>

        {/* Stats grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Total posts */}
          <div className="stat-card stat-card-accent">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="material-symbols-outlined" style={{ color: '#5a7af8', fontSize: '22px' }}>analytics</span>
              <span style={{ fontSize: '0.72em', color: '#a9abb2', fontWeight: 500, letterSpacing: '0.05em' }}>전체</span>
            </div>
            <div>
              <div
                style={{
                  fontSize: '2em',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: '#e4e5ed',
                }}
              >
                {posts.length}
              </div>
              <div style={{ fontSize: '0.85em', color: '#a9abb2' }}>작성된 글</div>
            </div>
          </div>

          {/* Latest post */}
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="material-symbols-outlined" style={{ color: '#c2c5dd', fontSize: '22px' }}>edit_note</span>
              <span style={{ fontSize: '0.72em', color: '#a9abb2', fontWeight: 500, letterSpacing: '0.05em' }}>최근</span>
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.88em',
                  fontWeight: 600,
                  color: '#e4e5ed',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {posts[0]?.title || '—'}
              </div>
              <div style={{ fontSize: '0.78em', color: '#a9abb2' }}>{posts[0]?.date || '글 없음'}</div>
            </div>
          </div>

          {/* New entry CTA */}
          <Link
            href="/admin/write/new"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '32px',
              borderRadius: '0.75rem',
              background: '#5a7af8',
              color: '#000',
              textDecoration: 'none',
              minHeight: '176px',
              fontWeight: 700,
              fontSize: '1.05em',
              transition: 'transform 0.15s, filter 0.15s',
              boxShadow: '0 8px 32px rgba(90,122,248,0.15)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
              (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '36px', fontVariationSettings: "'wght' 600" }}>add_circle</span>
            새 글 작성
          </Link>
        </section>

        {/* Posts table */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '1.4em',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: '#e4e5ed',
                  marginBottom: '4px',
                }}
              >
                글 목록
              </h2>
              <p style={{ fontSize: '0.82em', color: '#a9abb2' }}>최근 수정순</p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state">
              <p>작성된 글이 없습니다.</p>
            </div>
          ) : (
            <div
              style={{
                background: '#121317',
                borderRadius: '0.75rem',
                overflow: 'hidden',
              }}
            >
              {/* Table header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 32px',
                  background: 'rgba(30, 32, 36, 0.4)',
                  fontSize: '0.65em',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#a9abb2',
                }}
              >
                <div style={{ flex: 1 }}>제목 & 슬러그</div>
                <div style={{ width: '100px' }}>상태</div>
                <div style={{ width: '120px', textAlign: 'right' }}>작성일</div>
                <div style={{ width: '80px', textAlign: 'right' }}>액션</div>
              </div>

              {/* Rows */}
              {posts.map((post, i) => (
                <div
                  key={post.slug}
                  className="admin-table-row"
                  style={{
                    borderTop: i > 0 ? '1px solid rgba(70,72,78,0.1)' : 'none',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '0.5rem',
                        background: '#23262c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ color: '#a9abb2', fontSize: '18px' }}>article</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <Link
                        href={`/blog/${post.slug}`}
                        style={{
                          fontWeight: 700,
                          color: '#e4e5ed',
                          fontSize: '0.9em',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textDecoration: 'none',
                        }}
                      >
                        {post.title}
                      </Link>
                      <span
                        style={{
                          fontSize: '0.7em',
                          fontWeight: 500,
                          color: '#5a7af8',
                          background: 'rgba(30,69,195,0.15)',
                          padding: '1px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {post.slug}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div className="status-dot-published" />
                    <span style={{ fontSize: '0.78em', color: '#a9abb2', fontWeight: 500 }}>발행됨</span>
                  </div>

                  <div
                    style={{
                      width: '120px',
                      fontSize: '0.82em',
                      color: '#a9abb2',
                      textAlign: 'right',
                    }}
                  >
                    {post.date}
                  </div>

                  <div
                    style={{
                      width: '80px',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '8px',
                    }}
                  >
                    <Link
                      href={`/admin/edit/${post.slug}`}
                      title="수정"
                      style={{
                        color: '#a9abb2',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        lineHeight: 1,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug, post.title)}
                      title="삭제"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#a9abb2',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'color 0.2s',
                        lineHeight: 1,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
