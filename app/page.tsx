import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const latestPosts = (await getAllPosts()).slice(0, 5);

  return (
    <main className="blog-container">
      <div className="page-layout">

        {/* ── 메인 ── */}
        <div className="main-col">
          <div style={{ marginBottom: '24px' }}>
            <span className="section-heading">최근 글</span>
          </div>

          {latestPosts.length === 0 ? (
            <div className="empty-state">
              <p>아직 작성된 글이 없습니다.</p>
            </div>
          ) : (
            <ul className="post-list">
              {latestPosts.map((post) => (
                <li key={post.slug} className="post-list-item">
                  <Link href={`/blog/${post.slug}`} className="post-list-title">
                    {post.title}
                  </Link>
                  <div className="post-list-meta">{post.date}</div>
                </li>
              ))}
            </ul>
          )}

          {latestPosts.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <Link href="/blog" className="btn">전체 글 보기 →</Link>
            </div>
          )}
        </div>

        {/* ── 사이드바 ── */}
        <div className="side-col">

          <div className="sidebar-block">
            <div className="sidebar-block-content" style={{ textAlign: 'center' }}>
              <img
                src="/dancing-baby.gif"
                alt="dancing baby"
                style={{ maxWidth: '100%', imageRendering: 'pixelated' }}
              />
            </div>
          </div>

          <div className="sidebar-block">
            <div className="sidebar-block-title">소개</div>
            <div className="sidebar-block-content">
              <div className="sidebar-about">
                <div>이름: 윤민규</div>
                <div>취미: 코딩, 블로그</div>
              </div>
            </div>
          </div>

          <div className="sidebar-block">
            <div className="sidebar-block-content" style={{ textAlign: 'center' }}>
              <Image
                src="/pilsung.png"
                alt="pilsung"
                width={300}
                height={62}
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
