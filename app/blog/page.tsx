import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="blog-container" style={{ paddingTop: '80px', paddingBottom: '96px' }}>
      {/* Page header */}
      <div style={{ marginBottom: '48px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'var(--pill-bg)',
            fontSize: '0.72em',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--pill-text)',
            marginBottom: '16px',
          }}
        >
          아카이브
        </div>
        <h1
          style={{
            fontSize: '2.5em',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--text)',
            marginBottom: '10px',
          }}
        >
          전체 글 목록
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95em' }}>
          총 {posts.length}개의 글이 있습니다.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>아직 작성된 글이 없습니다.</p>
        </div>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug} className="post-list-item">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/blog/${post.slug}`} className="post-list-title">
                    {post.title}
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <span className="post-list-meta">{post.date}</span>
                    {(post.tags ?? []).map((tag) => (
                      <span key={tag} className="hashtag-inline">#{tag}</span>
                    ))}
                  </div>
                </div>
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
          ))}
        </ul>
      )}

      <div style={{ marginTop: '28px' }}>
        <Link href="/" className="btn">← 홈으로</Link>
      </div>
    </main>
  );
}
