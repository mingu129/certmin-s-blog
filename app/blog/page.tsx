import Link from 'next/link';
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
            background: 'rgba(55, 58, 77, 0.5)',
            fontSize: '0.72em',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#c2c5dd',
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
            color: '#e4e5ed',
            marginBottom: '10px',
          }}
        >
          전체 글 목록
        </h1>
        <p style={{ color: '#a9abb2', fontSize: '0.95em' }}>
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
              <Link href={`/blog/${post.slug}`} className="post-list-title">
                {post.title}
              </Link>
              <div className="post-list-meta">{post.date}</div>
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
