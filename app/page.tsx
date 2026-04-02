import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { getSettings } from '@/lib/settings';
import PostsWithFilter from './components/PostsWithFilter';
import ProfileSidebar from './components/ProfileSidebar';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [latestPosts, settings] = await Promise.all([
    getAllPosts().then((p) => p.slice(0, 10)),
    getSettings(),
  ]);

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

            {/* DungGeunMo only here */}
            <h1
              style={{
                fontFamily: "'DungGeunMo', monospace",
                fontSize: '2.8em',
                fontWeight: 800,
                color: '#e4e5ed',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              윤민규의{' '}
              <span style={{ color: '#b8c4ff' }}>개발 일지</span>
            </h1>

            <p
              style={{
                fontSize: '1.05em',
                color: '#a9abb2',
                lineHeight: 1.7,
                maxWidth: '560px',
              }}
            >
              {settings.siteSubtitle}
            </p>
          </div>

          {/* Section heading */}
          <div style={{ marginBottom: '24px' }}>
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

          {latestPosts.length === 0 ? (
            <div className="empty-state">
              <p>아직 작성된 글이 없습니다.</p>
            </div>
          ) : (
            <PostsWithFilter posts={latestPosts} />
          )}

          {latestPosts.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <Link href="/blog" className="btn">전체 글 보기 →</Link>
            </div>
          )}
        </div>

        {/* ── 사이드바 ── */}
        <div className="side-col">
          <ProfileSidebar
            profileName={settings.profileName}
            profileDescription={settings.profileDescription}
            profilePhoto={settings.profilePhoto}
          />
        </div>

      </div>
    </main>
  );
}
