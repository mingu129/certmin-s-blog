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
    <div className="min-h-screen bg-gradient-to-b from-[#3A6EA5] via-[#5B9BD5] to-[#7DB9E8] flex items-center justify-center p-8">
      {/* Windows XP Style Window */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden border-t-4 border-l-2 border-r-2 border-b-2 border-[#0831D9]">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#0997FF] to-[#0831D9] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center text-xs font-bold text-blue-600">
              📝
            </div>
            <span className="text-white font-bold text-sm">{post.title} - 상병 윤민규의 블로그</span>
          </div>
          <div className="flex gap-1">
            <Link href="/blog">
              <button className="w-6 h-6 bg-[#2A7FFF] hover:bg-[#4A9FFF] rounded-sm text-white text-xs font-bold">
                ←
              </button>
            </Link>
            <button className="w-6 h-6 bg-[#2A7FFF] hover:bg-[#4A9FFF] rounded-sm text-white text-xs font-bold">_</button>
            <button className="w-6 h-6 bg-[#2A7FFF] hover:bg-[#4A9FFF] rounded-sm text-white text-xs font-bold">□</button>
            <button className="w-6 h-6 bg-[#D93636] hover:bg-[#F94646] rounded-sm text-white text-xs font-bold">×</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-6">
          {/* Post Header */}
          <div className="border-b-2 border-[#003399] pb-4">
            <h1 className="text-3xl font-bold text-[#003399] mb-2">
              {post.title}
            </h1>
            <p className="text-sm text-gray-600">
              {post.date}
            </p>
          </div>

          {/* Post Content */}
          <div className="bg-[#ECE9D8] border-2 border-[#003399] rounded p-6 shadow-inner">
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-[#003399] mb-3 mt-4">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-[#003399] mb-2 mt-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-bold text-[#003399] mb-2 mt-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-gray-800 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1">
                      {children}
                    </ol>
                  ),
                  code: ({ children }) => (
                    <code className="bg-[#D6D3CE] px-2 py-1 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-[#D6D3CE] p-4 rounded overflow-x-auto mb-4">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#003399] pl-4 italic my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center pt-4">
            <Link href="/blog">
              <button className="bg-gradient-to-b from-[#ECE9D8] to-[#D6D3CE] border-2 border-[#003399] px-8 py-3 rounded shadow-lg hover:from-[#FFF8DC] hover:to-[#ECE9D8] active:shadow-inner transition-all font-bold text-[#003399]">
                목록으로 돌아가기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
