'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPostGradient } from '@/lib/thumbnail';

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

  const tagCounts = posts.reduce<Record<string, number>>((acc, p) => {
    (p.tags ?? []).forEach((tag) => { acc[tag] = (acc[tag] || 0) + 1; });
    return acc;
  }, {});

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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
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
                  transition: 'opacity 0.25s ease, max-height 0.3s ease, margin 0.25s ease',
                  pointerEvents: visible ? 'auto' : 'none',
                }}
              >
                <div className="post-list-item">
                  <Link href={`/blog/${post.slug}`} style={{ display: 'flex', gap: '16px', alignItems: 'center', textDecoration: 'none' }}>
                    {/* Thumbnail — always shown */}
                    <div
                      style={{
                        width: '120px',
                        height: '67px',
                        borderRadius: '0.45rem',
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
                            opacity: 0.3,
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#fff' }}>article</span>
                        </div>
                      )}
                    </div>

                    {/* Text content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="post-list-title" style={{ display: 'block', marginBottom: '6px' }}>
                        {post.title}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span className="post-list-meta">{post.date}</span>
                        {(post.tags ?? []).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => { e.preventDefault(); toggleTag(tag); }}
                            className="hashtag-inline"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
