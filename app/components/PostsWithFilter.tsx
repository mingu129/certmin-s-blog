'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  thumbnail?: string;
}

export default function PostsWithFilter({ posts }: { posts: Post[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags ?? [])));

  function toggleTag(tag: string) {
    setActiveTag((prev) => (prev === tag ? null : tag));
  }

  const anyVisible = posts.some(
    (p) => !activeTag || (p.tags ?? []).includes(activeTag)
  );

  return (
    <>
      {/* Tag filter row */}
      {allTags.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '28px',
          }}
        >
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
            </button>
          ))}
        </div>
      )}

      {/* Post list */}
      {!anyVisible ? (
        <div className="empty-state">
          <p>
            <span style={{ color: 'var(--primary-fixed)' }}>#{activeTag}</span> 태그의 글이 없습니다.
          </p>
        </div>
      ) : (
        <ul className="post-list" style={{ overflow: 'hidden' }}>
          {posts.map((post) => {
            const visible = !activeTag || (post.tags ?? []).includes(activeTag);
            return (
              <li
                key={post.slug}
                style={{
                  opacity: visible ? 1 : 0,
                  maxHeight: visible ? '200px' : '0px',
                  marginBottom: visible ? '10px' : '0px',
                  padding: visible ? undefined : '0',
                  overflow: 'hidden',
                  transition:
                    'opacity 0.25s ease, max-height 0.3s ease, margin 0.25s ease',
                  pointerEvents: visible ? 'auto' : 'none',
                }}
              >
                <div className="post-list-item" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {/* Text content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/blog/${post.slug}`} className="post-list-title">
                      {post.title}
                    </Link>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span className="post-list-meta">{post.date}</span>
                      {(post.tags ?? []).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className="hashtag-inline"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {post.thumbnail && (
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: 'var(--surface-high)',
                      }}
                    >
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        width={72}
                        height={72}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
