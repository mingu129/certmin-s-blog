'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPostGradient } from '@/lib/thumbnail';

type ViewMode = 'card' | 'list';

export interface PostListItem {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  thumbnail?: string;
  excerpt: string;
}

export default function BlogPostList({ posts }: { posts: PostListItem[] }) {
  const [view, setView] = useState<ViewMode>('list');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('blog-view') as ViewMode | null;
    if (saved === 'card' || saved === 'list') setView(saved);
    setMounted(true);
  }, []);

  function switchView(mode: ViewMode) {
    setView(mode);
    localStorage.setItem('blog-view', mode);
  }

  const activeStyle = (mode: ViewMode): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    background: view === mode ? 'var(--accent-soft)' : 'var(--surface-high)',
    color: view === mode ? 'var(--accent)' : 'var(--text-muted)',
    border: view === mode ? '1px solid var(--accent-ring)' : '1px solid transparent',
    borderRadius: '0.5rem',
    fontFamily: 'inherit',
    fontSize: '0.78em',
    fontWeight: view === mode ? 700 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s',
    letterSpacing: '0.05em',
  });

  return (
    <>
      {/* View toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '6px',
          marginBottom: '24px',
        }}
        suppressHydrationWarning
      >
        <button onClick={() => switchView('list')} style={activeStyle('list')} title="리스트 뷰">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>view_list</span>
          리스트
        </button>
        <button onClick={() => switchView('card')} style={activeStyle('card')} title="카드 뷰">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>grid_view</span>
          카드
        </button>
      </div>

      {/* Render the selected view — only after hydration to avoid mismatch */}
      {(!mounted || view === 'list') && (
        <ul className="post-list" style={mounted && view !== 'list' ? { display: 'none' } : undefined}>
          {posts.map((post) => (
            <li key={post.slug} className="post-list-item">
              <ListRow post={post} />
            </li>
          ))}
        </ul>
      )}
      {mounted && view === 'card' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {posts.map((post) => (
            <CardItem key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}

/* ── Card view item ── */
function CardItem({ post }: { post: PostListItem }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      {/* Thumbnail */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          background: post.thumbnail ? 'var(--surface-high)' : getPostGradient(post.slug),
        }}
      >
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.2,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#fff' }}>
              article
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Tags */}
        {(post.tags ?? []).length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(post.tags ?? []).map((tag) => (
              <span key={tag} className="hashtag-inline">#{tag}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2
          className="line-clamp-2"
          style={{
            fontSize: '1.05em',
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.4,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            className="line-clamp-2"
            style={{
              fontSize: '0.83em',
              color: 'var(--text-muted)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Date */}
        <span
          style={{
            fontSize: '0.7em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginTop: '4px',
            opacity: 0.65,
          }}
        >
          {post.date}
        </span>
      </div>
    </Link>
  );
}

/* ── List view item ── */
function ListRow({ post }: { post: PostListItem }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', textDecoration: 'none' }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: '160px',
          height: '90px',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          flexShrink: 0,
          background: post.thumbnail ? 'var(--surface-high)' : getPostGradient(post.slug),
          position: 'relative',
        }}
      >
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.28,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#fff' }}>article</span>
          </div>
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span
          className="post-list-title line-clamp-2"
          style={{ display: '-webkit-box', marginBottom: 0 }}
        >
          {post.title}
        </span>

        {post.excerpt && (
          <p
            className="line-clamp-1"
            style={{
              fontSize: '0.82em',
              color: 'var(--text-muted)',
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            {post.excerpt}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '2px' }}>
          <span className="post-list-meta">{post.date}</span>
          {(post.tags ?? []).map((tag) => (
            <span key={tag} className="hashtag-inline">#{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
