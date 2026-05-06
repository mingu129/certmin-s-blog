import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug } from '@/lib/posts';
import { getPostGradient } from '@/lib/thumbnail';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import type { ReactNode } from 'react';
import TableOfContents, { type TocHeading } from '@/app/components/TableOfContents';

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*?([^*]+)\*\*?/g, '$1')
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function extractHeadings(content: string): TocHeading[] {
  const result: TocHeading[] = [];
  const idCount: Record<string, number> = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^(#{1,2})\s+(.+)$/);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].trim().replace(/`([^`]+)`/g, '$1').replace(/\*\*?([^*]+)\*\*?/g, '$1');
    let id = slugify(m[2]);
    idCount[id] = (idCount[id] ?? 0) + 1;
    if (idCount[id] > 1) id = `${id}-${idCount[id]}`;
    result.push({ level, text, id });
  }
  return result;
}

function nodeToText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (node !== null && typeof node === 'object' && 'props' in node)
    return nodeToText((node as { props: { children?: ReactNode } }).props.children);
  return '';
}

function makeHeadingId(children: ReactNode, counts: Record<string, number>): string {
  let id = slugify(nodeToText(children));
  counts[id] = (counts[id] ?? 0) + 1;
  if (counts[id] > 1) id = `${id}-${counts[id]}`;
  return id;
}

export const dynamic = 'force-dynamic';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));

  if (!post) {
    notFound();
  }

  const tags = post.tags ?? [];
  const headings = extractHeadings(post.content);

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
            background: 'var(--surface)',
            borderRadius: '0.5rem',
            padding: '24px',
            display: 'none',
          }}
        >
          <div style={{ fontSize: '0.95em', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
            목차
          </div>
          <div
            style={{
              fontSize: '0.7em',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--text-muted)',
              marginBottom: '20px',
            }}
          >
            Post Overview
          </div>
          <TableOfContents headings={headings} />

          {tags.length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-faint)' }}>
              <div
                style={{
                  fontSize: '0.65em',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
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
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
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
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="category-tag"
                  style={{ textDecoration: 'none' }}
                >
                  {tag}
                </Link>
              ))}
              {tags.length > 0 && (
                <div style={{ height: '1px', width: '32px', background: 'var(--border-ghost)' }} />
              )}
              <time id="post-top" className="post-meta">{post.date}</time>
              {post.updatedAt && (
                <>
                  <span style={{ color: 'var(--text-muted)', opacity: 0.4 }}>•</span>
                  <span className="post-meta">수정: {post.updatedAt}</span>
                </>
              )}
            </div>

            <h1 className="post-main-title">{post.title}</h1>

            {/* Thumbnail hero — 16:9, always shown */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                marginTop: '24px',
                background: post.thumbnail ? 'var(--surface-high)' : getPostGradient(post.slug),
              }}
            >
              {post.thumbnail ? (
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                  priority
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '48px', color: 'rgba(255,255,255,0.2)' }}
                  >
                    article
                  </span>
                  <span
                    style={{
                      fontSize: '0.75em',
                      color: 'rgba(255,255,255,0.2)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    certmin
                  </span>
                </div>
              )}
            </div>

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
                  background: 'var(--surface-high)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-faint)',
                }}
              >
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '18px' }}>
                  bolt
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: 'linear-gradient(to right, var(--border-ghost), transparent)',
                }}
              />
            </div>
          </header>

          {/* Content */}
          <div className="post-content">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={(() => {
                const hCounts: Record<string, number> = {};
                return {
                h1: ({ children }) => { const id = makeHeadingId(children, hCounts); return <h1 id={id} data-heading-id={id}>{children}</h1>; },
                h2: ({ children }) => { const id = makeHeadingId(children, hCounts); return <h2 id={id} data-heading-id={id}>{children}</h2>; },
                h3: ({ children }) => { const id = makeHeadingId(children, hCounts); return <h3 id={id} data-heading-id={id}>{children}</h3>; },
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
              }; })()}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Bottom tags */}
          {tags.length > 0 && (
            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
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
