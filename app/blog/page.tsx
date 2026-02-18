import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="blog-container">
      <div style={{ marginBottom: '24px' }}>
        <span className="section-heading">전체 글 목록</span>
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

      <div style={{ marginTop: '16px' }}>
        <Link href="/" className="btn">← 홈으로</Link>
      </div>
    </main>
  );
}
