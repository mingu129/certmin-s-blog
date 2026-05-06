import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { getPostGradient } from '@/lib/thumbnail';
import PilsungHero from './components/PilsungHero';

export const dynamic = 'force-dynamic';

const DISCHARGE_DATE = new Date('2026-12-20T00:00:00+09:00');

function daysUntilDischarge(): number {
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.ceil((DISCHARGE_DATE.getTime() - now.getTime()) / msPerDay));
}

export default async function Home() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 5);
  const daysLeft = daysUntilDischarge();

  const tagCounts = posts.reduce<Record<string, number>>((acc, p) => {
    (p.tags ?? []).forEach((tag) => { acc[tag] = (acc[tag] || 0) + 1; });
    return acc;
  }, {});
  const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <main className="blog-container" style={{ paddingTop: '40px', paddingBottom: '96px', maxWidth: '960px' }}>
      {/* Hero image */}
      <div style={{ marginBottom: '36px' }}>
        <PilsungHero />
      </div>

      {/* Title + stats */}
      <div style={{ marginBottom: '64px' }}>
        <h1
          style={{
            fontFamily: "'DungGeunMo', monospace",
            fontSize: '2.8em',
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '14px',
          }}
        >
          certmin's{' '}
          <span style={{ color: 'var(--primary)' }} className="glitch-title">PILSUNG BLOG</span>
        </h1>

        <p
          style={{
            fontSize: '1em',
            color: 'var(--text-muted)',
            letterSpacing: '-0.01em',
          }}
        >
          {daysLeft > 0 ? (
            <>
              전역까지 <strong style={{ color: 'var(--primary-fixed)' }}>{daysLeft}일</strong>
              <span style={{ margin: '0 10px', opacity: 0.4 }}>·</span>
              글 <strong style={{ color: 'var(--text)' }}>{posts.length}개</strong>
            </>
          ) : (
            <>
              전역 완료 <span style={{ margin: '0 10px', opacity: 0.4 }}>·</span>
              글 <strong style={{ color: 'var(--text)' }}>{posts.length}개</strong>
            </>
          )}
        </p>
      </div>

      {/* Recent posts */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 className="section-heading">최근 글</h2>
            <div
              style={{
                width: '40px',
                height: '3px',
                background: 'var(--primary-fixed)',
                borderRadius: '9999px',
                marginTop: '8px',
              }}
            />
          </div>
          {posts.length > 5 && (
            <Link
              href="/blog"
              style={{
                fontSize: '0.85em',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              더 보기 →
            </Link>
          )}
        </div>

        {latestPosts.length === 0 ? (
          <div className="empty-state">
            <p>아직 작성된 글이 없습니다.</p>
          </div>
        ) : (
          <ul className="post-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {latestPosts.map((post) => (
              <li key={post.slug} className="post-list-item" style={{ marginBottom: '10px' }}>
                <Link
                  href={`/blog/${post.slug}`}
                  style={{ display: 'flex', gap: '16px', alignItems: 'center', textDecoration: 'none' }}
                >
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
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span className="post-list-title" style={{ display: 'block', marginBottom: '6px' }}>
                      {post.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span className="post-list-meta">{post.date}</span>
                      {(post.tags ?? []).map((tag) => (
                        <span key={tag} className="hashtag-inline">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Tag section */}
      {tags.length > 0 && (
        <section>
          <div style={{ marginBottom: '24px' }}>
            <h2 className="section-heading">태그</h2>
            <div
              style={{
                width: '40px',
                height: '3px',
                background: 'var(--primary-fixed)',
                borderRadius: '9999px',
                marginTop: '8px',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map(([tag, count]) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="tag-pill"
                style={{ textDecoration: 'none' }}
              >
                #{tag}
                <span
                  style={{
                    marginLeft: '5px',
                    fontSize: '0.82em',
                    fontWeight: 400,
                    opacity: 0.5,
                  }}
                >
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
