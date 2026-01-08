import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3A6EA5] via-[#5B9BD5] to-[#7DB9E8] flex items-center justify-center p-4 md:p-8">
      {/* Windows XP Style Window */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl md:max-w-3xl overflow-hidden border-t-4 border-l-2 border-r-2 border-b-2 border-[#0831D9]">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#0997FF] to-[#0831D9] px-2 md:px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1 md:gap-2 min-w-0">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-sm flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-600">
              📝
            </div>
            <span className="text-white font-bold text-xs md:text-sm truncate">블로그 - 상병 윤민규의 블로그</span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Link href="/">
              <button className="w-5 h-5 md:w-6 md:h-6 bg-[#2A7FFF] hover:bg-[#4A9FFF] rounded-sm text-white text-xs font-bold flex-shrink-0">
                ←
              </button>
            </Link>
            <button className="w-5 h-5 md:w-6 md:h-6 bg-[#2A7FFF] hover:bg-[#4A9FFF] rounded-sm text-white text-xs font-bold flex-shrink-0">_</button>
            <button className="w-5 h-5 md:w-6 md:h-6 bg-[#2A7FFF] hover:bg-[#4A9FFF] rounded-sm text-white text-xs font-bold flex-shrink-0">□</button>
            <button className="w-5 h-5 md:w-6 md:h-6 bg-[#D93636] hover:bg-[#F94646] rounded-sm text-white text-xs font-bold flex-shrink-0">×</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8 space-y-4 md:space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#003399]">
            블로그 포스트
          </h1>

          {/* Posts List */}
          <div className="space-y-3 md:space-y-4">
            {posts.length === 0 ? (
              <div className="bg-[#ECE9D8] border-2 border-[#003399] rounded p-3 md:p-4 shadow-inner">
                <p className="text-sm md:text-base text-gray-600">아직 작성된 글이 없습니다.</p>
              </div>
            ) : (
              posts.map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className="block"
                >
                  <div className="bg-[#ECE9D8] border-2 border-[#003399] rounded p-3 md:p-4 shadow-inner hover:bg-[#FFF8DC] transition-colors cursor-pointer">
                    <h2 className="text-lg md:text-xl font-bold text-[#003399] mb-1 md:mb-2">
                      {post.title}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-600">
                      {post.date}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Back Button */}
          <div className="flex justify-center pt-2 md:pt-4">
            <Link href="/">
              <button className="bg-gradient-to-b from-[#ECE9D8] to-[#D6D3CE] border-2 border-[#003399] px-4 md:px-8 py-2 md:py-3 rounded shadow-lg hover:from-[#FFF8DC] hover:to-[#ECE9D8] active:shadow-inner transition-all font-bold text-xs md:text-sm text-[#003399]">
                홈으로 돌아가기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
