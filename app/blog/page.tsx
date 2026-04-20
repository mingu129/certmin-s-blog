import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import BlogPostList from '@/app/components/BlogPostList';

export const dynamic = 'force-dynamic';

function getExcerpt(content: string, maxLen = 120): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]+`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.+?)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_~>|]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > maxLen ? plain.slice(0, maxLen) + '...' : plain;
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  const postItems = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    tags: p.tags,
    thumbnail: p.thumbnail,
    excerpt: getExcerpt(p.content),
  }));

  return (
    <main className="blog-container" style={{ paddingTop: '80px', paddingBottom: '96px' }}>
      {/* Page header */}
      <div style={{ marginBottom: '40px' }}>
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
        <BlogPostList posts={postItems} />
      )}

      <div style={{ marginTop: '32px' }}>
        <Link href="/" className="btn">← 홈으로</Link>
      </div>
    </main>
  );
}
