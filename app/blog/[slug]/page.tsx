import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="blog-container">
      <div className="post-card">
        <div className="post-header">
          <h1 className="post-main-title">{post.title}</h1>
          <div className="post-meta">{post.date}</div>
        </div>

        <div className="post-content">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1>{children}</h1>,
              h2: ({ children }) => <h2>{children}</h2>,
              h3: ({ children }) => <h3>{children}</h3>,
              p:  ({ children }) => <p>{children}</p>,
              ul: ({ children }) => <ul>{children}</ul>,
              ol: ({ children }) => <ol>{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              code: ({ children }) => <code>{children}</code>,
              pre: ({ children }) => <pre>{children}</pre>,
              blockquote: ({ children }) => <blockquote>{children}</blockquote>,
              a: ({ href, children }) => <a href={href}>{children}</a>,
              hr: () => <hr />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>

      <div className="post-nav">
        <Link href="/blog" className="btn">← 목록으로</Link>
        <Link href="/" className="btn">홈</Link>
      </div>
    </main>
  );
}
