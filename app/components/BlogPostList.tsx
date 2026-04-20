'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
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

interface Props {
  posts: PostListItem[];
  initialTag?: string | null;
}

const viewListeners = new Set<() => void>();
function subscribeView(cb: () => void) {
  viewListeners.add(cb);
  return () => { viewListeners.delete(cb); };
}
function notifyView() {
  viewListeners.forEach((cb) => cb());
}
function readStoredView(): ViewMode {
  try {
    const saved = localStorage.getItem('blog-view');
    return saved === 'card' ? 'card' : 'list';
  } catch {
    return 'list';
  }
}
function serverView(): ViewMode {
  return 'list';
}

export default function BlogPostList({ posts, initialTag = null }: Props) {
  const view = useSyncExternalStore(subscribeView, readStoredView, serverView);
  const [activeTag, setActiveTag] = useState<string | null>(initialTag);

  function switchView(mode: ViewMode) {
    try { localStorage.setItem('blog-view', mode); } catch { /* ignore */ }
    notifyView();
  }

  function toggleTag(tag: string) {
    setActiveTag((prev) => (prev === tag ? null : tag));
  }

  const { allTags, tagCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      (p.tags ?? []).forEach((tag) => { counts[tag] = (counts[tag] || 0) + 1; });
    });
    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return { allTags: sorted, tagCounts: counts };
  }, [posts]);

  const anyVisible = posts.some(
    (p) => !activeTag || (p.tags ?? []).includes(activeTag)
  );

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
      {/* Controls row: tag filter + view toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
        suppressHydrationWarning
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1, minWidth: 0 }}>
          {allTags.length > 0 && (
            <>
              <button
                onClick={() => setActiveTag(null)}
                className={activeTag === null ? 'tag-pill tag-pill-active' : 'tag-pill'}
              >
                전체
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={activeTag === tag ? 'tag-pill tag-pill-active' : 'tag-pill'}
                >
                  #{tag}
                  <span
                    style={{
                      marginLeft: '5px',
                      fontSize: '0.82em',
                      fontWeight: 400,
                      opacity: activeTag === tag ? 0.7 : 0.5,
                    }}
                  >
                    {tagCounts[tag]}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button onClick={() => switchView('list')} style={activeStyle('list')} title="리스트 뷰">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>view_list</span>
            리스트
          </button>
          <button onClick={() => switchView('card')} style={activeStyle('card')} title="카드 뷰">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>grid_view</span>
            카드
          </button>
        </div>
      </div>

      {/* Empty filter state */}
      {!anyVisible && (
        <div className="empty-state">
          <p>
            <span style={{ color: 'var(--primary-fixed)' }}>#{activeTag}</span> 태그의 글이 없습니다.
          </p>
        </div>
      )}

      {/* List view */}
      {anyVisible && view === 'list' && (
        <ul className="post-list" style={{ overflow: 'hidden' }}>
          {posts.map((post) => {
            const visible = !activeTag || (post.tags ?? []).includes(activeTag);
            return (
              <li
                key={post.slug}
                style={{
                  opacity: visible ? 1 : 0,
                  maxHeight: visible ? '220px' : '0px',
                  marginBottom: visible ? '10px' : '0px',
                  padding: visible ? undefined : '0',
                  overflow: 'hidden',
                  transition: 'opacity 0.25s ease, max-height 0.3s ease, margin 0.25s ease',
                  pointerEvents: visible ? 'auto' : 'none',
                }}
              >
                <div className="post-list-item">
                  <ListRow post={post} onTagClick={toggleTag} />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Card view — key on activeTag forces re-mount → CSS enter animation */}
      {anyVisible && view === 'card' && (
        <div
          key={activeTag}
          className="card-grid-enter"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {posts.map((post) => {
            const visible = !activeTag || (post.tags ?? []).includes(activeTag);
            if (!visible) return null;
            return <CardItem key={post.slug} post={post} />;
          })}
        </div>
      )}
    </>
  );
}

/* ── Card view item ── */
function CardItem({ post }: { post: PostListItem }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
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

      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(post.tags ?? []).length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(post.tags ?? []).map((tag) => (
              <span key={tag} className="hashtag-inline">#{tag}</span>
            ))}
          </div>
        )}

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
function ListRow({ post, onTagClick }: { post: PostListItem; onTagClick: (tag: string) => void }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', textDecoration: 'none' }}
    >
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
            <button
              key={tag}
              onClick={(e) => { e.preventDefault(); onTagClick(tag); }}
              className="hashtag-inline"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </Link>
  );
}
