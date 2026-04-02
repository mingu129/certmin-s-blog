import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import PostsWithFilter from './components/PostsWithFilter';
import HiddenAdminTrigger from './components/HiddenAdminTrigger';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const latestPosts = (await getAllPosts()).slice(0, 10);

  return (
    <main className="blog-container" style={{ paddingTop: '80px', paddingBottom: '96px' }}>
      <div className="page-layout">

        {/* ── 메인 ── */}
        <div className="main-col">

          {/* Hero section */}
          <div style={{ marginBottom: '56px' }}>
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
                marginBottom: '20px',
              }}
            >
              블로그 아카이브
            </div>
            <h1
              style={{
                fontSize: '3em',
                fontWeight: 800,
                color: '#e4e5ed',
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                marginBottom: '16px',
              }}
            >
              윤민규의{' '}
              <span style={{ color: '#b8c4ff' }}>개발 일지</span>
            </h1>
            <p
              style={{
                fontSize: '1.1em',
                color: '#a9abb2',
                lineHeight: 1.7,
                maxWidth: '560px',
              }}
            >
              일상과 코드, 그리고 생각들을 기록합니다.
            </p>
          </div>

          {/* Section heading */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <div>
              <h2 className="section-heading">최근 글</h2>
              <div
                style={{
                  width: '40px',
                  height: '3px',
                  background: '#5a7af8',
                  borderRadius: '9999px',
                  marginTop: '8px',
                }}
              />
            </div>
          </div>

          {latestPosts.length === 0 ? (
            <div className="empty-state">
              <p>아직 작성된 글이 없습니다.</p>
            </div>
          ) : (
            <PostsWithFilter posts={latestPosts} />
          )}

          {latestPosts.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <Link href="/blog" className="btn">
                전체 글 보기 →
              </Link>
            </div>
          )}
        </div>

        {/* ── 사이드바 ── */}
        <div className="side-col">
          <div className="sidebar-block">
            <div className="sidebar-block-title">소개</div>
            <div className="sidebar-about">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--surface-high)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <span className="material-symbols-outlined" style={{ color: '#5a7af8' }}>
                  person
                </span>
              </div>
              <div style={{ fontWeight: 700, color: '#e4e5ed', marginBottom: '8px' }}>
                윤민규
              </div>
              <div style={{ fontSize: '0.88em', color: '#a9abb2', lineHeight: 1.8 }}>
                코딩과 블로그를 좋아합니다.
                <br />
                일상과 생각을 기록합니다.
              </div>
            </div>
          </div>

          <div className="sidebar-block">
            <div className="sidebar-block-title">링크</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href="/blog"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85em',
                  color: '#a9abb2',
                  textDecoration: 'none',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>article</span>
                글 목록
              </Link>
              <a
                href="https://github.com/mingu129"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85em',
                  color: '#a9abb2',
                  textDecoration: 'none',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>code</span>
                GitHub
              </a>
            </div>
          </div>
        </div>

      </div>

      <HiddenAdminTrigger />
    </main>
  );
}
