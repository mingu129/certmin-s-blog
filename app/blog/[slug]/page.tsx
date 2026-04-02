import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

export const dynamic = 'force-dynamic';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));

  if (!post) {
    notFound();
  }

  const tags = post.tags ?? [];

  return (
    <main className="blog-container" style={{ paddingTop: '80px', paddingBottom: '96px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '48px',
          alignItems: 'flex-start',
        }}
      >
        {/* Sticky sidebar */}
        <aside
          className="post-sidebar"
          style={{
            width: '220px',
            flexShrink: 0,
            position: 'sticky',
            top: '96px',
            background: '#121317',
            borderRadius: '0.5rem',
            padding: '24px',
            display: 'none',
          }}
        >
          <div style={{ fontSize: '0.95em', fontWeight: 700, color: '#b8c4ff', marginBottom: '4px' }}>
            목차
          </div>
          <div
            style={{
              fontSize: '0.7em',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#a9abb2',
              marginBottom: '20px',
            }}
          >
            Post Overview
          </div>
          <nav>
            <a className="sidebar-toc-link active" href="#post-top">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>subject</span>
              시작
            </a>
          </nav>

          {tags.length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(70,72,78,0.2)' }}>
              <div
                style={{
                  fontSize: '0.65em',
                  fontWeight: 700,
                  color: '#a9abb2',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                태그
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/?tag=${encodeURIComponent(tag)}`}
                    className="hashtag-inline"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Article */}
        <article style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <header style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}
            >
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className="category-tag"
                  style={{ textDecoration: 'none' }}
                >
                  {tag}
                </Link>
              ))}
              {tags.length > 0 && (
                <div style={{ height: '1px', width: '32px', background: 'rgba(70,72,78,0.3)' }} />
              )}
              <time id="post-top" className="post-meta">{post.date}</time>
              {post.updatedAt && (
                <>
                  <span style={{ color: '#a9abb2', opacity: 0.4 }}>•</span>
                  <span className="post-meta">수정: {post.updatedAt}</span>
                </>
              )}
            </div>

            <h1 className="post-main-title">{post.title}</h1>

            {/* Thumbnail hero */}
            {post.thumbnail && (
              <div
                style={{
                  width: '100%',
                  height: '320px',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  marginTop: '24px',
                  background: '#1e2024',
                }}
              >
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  width={1200}
                  height={320}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                  unoptimized
                  priority
                />
              </div>
            )}

            {/* Decorative separator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: '28px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#1e2024',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(70,72,78,0.2)',
                }}
              >
                <span className="material-symbols-outlined" style={{ color: '#b8c4ff', fontSize: '18px' }}>
                  bolt
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: 'linear-gradient(to right, rgba(70,72,78,0.3), transparent)',
                }}
              />
            </div>
          </header>

          {/* Content */}
          <div className="post-content">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => <h1>{children}</h1>,
                h2: ({ children }) => <h2>{children}</h2>,
                h3: ({ children }) => <h3>{children}</h3>,
                p:  ({ children }) => <p>{children}</p>,
                ul: ({ children }) => <ul>{children}</ul>,
                ol: ({ children }) => <ol>{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                code: ({ className, children, ...props }) => (
                  <code className={className} {...props}>{children}</code>
                ),
                pre: ({ children }) => <pre>{children}</pre>,
                blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                a: ({ href, children }) => <a href={href}>{children}</a>,
                hr: () => <hr />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Bottom tags */}
          {tags.length > 0 && (
            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(70,72,78,0.15)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className="hashtag-inline"
                  style={{ textDecoration: 'none' }}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Post nav */}
          <div className="post-nav">
            <Link href="/blog" className="btn">← 목록으로</Link>
            <Link href="/" className="btn">홈</Link>
          </div>
        </article>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .post-sidebar { display: block !important; }
        }
      `}</style>
    </main>
  );
}
